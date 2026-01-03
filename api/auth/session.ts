import type { VercelRequest, VercelResponse } from '@vercel/node';
import { jwtVerify } from 'jose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Security: Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sessionCookie = req.cookies.session;

        if (!sessionCookie) {
            return res.status(401).json({ user: null });
        }

        const authSecret = process.env.AUTH_SECRET;
        if (!authSecret || authSecret.length < 32) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const secret = new TextEncoder().encode(authSecret);

        // Verify JWT with issuer and audience validation
        const { payload } = await jwtVerify(sessionCookie, secret, {
            issuer: 'sarkome',
            audience: 'sarkome-web',
        });

        return res.status(200).json({
            user: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
            },
        });
    } catch {
        // Token invalid, expired, or tampered - don't expose details
        return res.status(401).json({ user: null });
    }
}
