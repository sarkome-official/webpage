import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit.js';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

// Helper to decrypt the oauth_state cookie
function decryptOAuthState(encryptedValue: string, authSecret: string): { codeVerifier: string; state: string; nonce: string } | null {
    try {
        const [ivB64, authTagB64, encryptedB64] = encryptedValue.split(':');
        if (!ivB64 || !authTagB64 || !encryptedB64) {
            return null;
        }

        const key = Buffer.from(authSecret.slice(0, 32), 'utf-8');
        const iv = Buffer.from(ivB64, 'base64');
        const authTag = Buffer.from(authTagB64, 'base64');
        const encrypted = Buffer.from(encryptedB64, 'base64');

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, undefined, 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    } catch {
        return null;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Security: Only allow GET requests (OAuth callback)
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting: 20 callback attempts per minute per IP (slightly higher than login)
    const clientIP = getClientIP(req.headers as Record<string, string | string[] | undefined>);
    const rateLimitResult = await checkRateLimit(clientIP, 'auth:callback');

    if (!rateLimitResult.success) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    try {
        const { code, state, error: oauthError } = req.query;

        // Handle OAuth errors from Google
        if (oauthError) {
            console.warn('OAuth error from Google:', oauthError);
            return res.redirect(302, '/?error=oauth_denied');
        }

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'Missing authorization code' });
        }

        // Parse stored OAuth state from cookie
        const oauthStateCookie = req.cookies.oauth_state;
        if (!oauthStateCookie) {
            return res.status(400).json({ error: 'Session expired. Please try again.' });
        }

        const authSecret = process.env.AUTH_SECRET;
        if (!authSecret || authSecret.length < 32) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Decrypt the oauth state
        const oauthState = decryptOAuthState(decodeURIComponent(oauthStateCookie), authSecret);
        if (!oauthState) {
            return res.status(400).json({ error: 'Invalid session. Please try again.' });
        }

        const { codeVerifier, state: storedState } = oauthState;

        // Validate state parameter (CSRF protection)
        if (state !== storedState) {
            return res.status(400).json({ error: 'Security validation failed. Please try again.' });
        }

        // Exchange authorization code for tokens
        const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                code: code,
                code_verifier: codeVerifier,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/google`,
            }),
        });

        if (!tokenResponse.ok) {
            // Don't log the actual error content in production
            console.error('Token exchange failed');
            return res.status(400).json({ error: 'Authentication failed. Please try again.' });
        }

        const tokens = await tokenResponse.json();

        // Fetch user info
        const userResponse = await fetch(GOOGLE_USERINFO_URL, {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        if (!userResponse.ok) {
            return res.status(400).json({ error: 'Failed to retrieve user information.' });
        }

        const userInfo = await userResponse.json();

        // SECURITY: Verify email is verified by Google
        if (!userInfo.email_verified) {
            return res.status(403).json({ error: 'Email not verified. Please verify your email with Google first.' });
        }

        // Create session JWT
        const secret = new TextEncoder().encode(authSecret);
        const sessionToken = await new SignJWT({
            sub: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            email_verified: userInfo.email_verified,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .setIssuer('sarkome')
            .setAudience('sarkome-web')
            .sign(secret);

        // Clear OAuth state cookie and set session cookie
        const isProd = process.env.NODE_ENV === 'production';
        const secureFlag = isProd ? 'Secure;' : '';

        res.setHeader('Set-Cookie', [
            `oauth_state=; HttpOnly; ${secureFlag} SameSite=Lax; Path=/; Max-Age=0`,
            `session=${sessionToken}; HttpOnly; ${secureFlag} SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
        ]);

        // Redirect to platform
        res.redirect(302, '/platform');
    } catch (error) {
        // Generic error - don't expose internal details
        console.error('OAuth callback error');
        res.redirect(302, '/?error=auth_failed');
    }
}
