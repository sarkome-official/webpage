import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { checkRateLimit, getClientIP } from '../lib/rate-limit';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Security: Only allow GET requests for login initiation
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting: 10 login attempts per minute per IP
    const clientIP = getClientIP(req.headers as Record<string, string | string[] | undefined>);
    const rateLimitResult = await checkRateLimit(clientIP, 'auth:login');

    if (!rateLimitResult.success) {
        res.setHeader('X-RateLimit-Limit', rateLimitResult.limit.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toString());
        res.setHeader('Retry-After', Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString());
        return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    // Add rate limit headers for successful requests too
    if (rateLimitResult.limit > 0) {
        res.setHeader('X-RateLimit-Limit', rateLimitResult.limit.toString());
        res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        res.setHeader('X-RateLimit-Reset', rateLimitResult.reset.toString());
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/api/auth/callback/google`;

    if (!clientId) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate PKCE code verifier and challenge
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');

    // Generate state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');

    // Generate nonce for replay attack protection
    const nonce = crypto.randomBytes(16).toString('hex');

    // Encrypt sensitive data before storing in cookie
    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret || authSecret.length < 32) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const key = Buffer.from(authSecret.slice(0, 32), 'utf-8');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const plaintext = JSON.stringify({ codeVerifier, state, nonce });
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');

    // Format: iv:authTag:encryptedData (all base64)
    const cookieValue = `${iv.toString('base64')}:${authTag}:${encrypted}`;

    // Set secure cookie
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? 'Secure;' : '';

    res.setHeader('Set-Cookie', [
        `oauth_state=${encodeURIComponent(cookieValue)}; HttpOnly; ${secureFlag} SameSite=Lax; Path=/; Max-Age=600`
    ]);

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline',
        prompt: 'consent',
    });

    res.redirect(302, `${GOOGLE_AUTH_URL}?${params.toString()}`);
}
