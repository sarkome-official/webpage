import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client for rate limiting
// Falls back to a no-op limiter if credentials are not configured
let ratelimit: Ratelimit | null = null;

function initRateLimiter(): Ratelimit | null {
    if (ratelimit) return ratelimit;

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
        console.warn('[RateLimit] Upstash credentials not configured. Rate limiting disabled.');
        return null;
    }

    try {
        const redis = new Redis({
            url: redisUrl,
            token: redisToken,
        });

        ratelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute per IP
            analytics: true,
            prefix: 'sarkome:ratelimit',
        });

        return ratelimit;
    } catch (error) {
        console.error('[RateLimit] Failed to initialize:', error);
        return null;
    }
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Check if a request should be rate limited based on IP address.
 * Returns { success: true } if the request is allowed.
 * Returns { success: false } if the request should be blocked.
 * 
 * @param identifier - Usually the client IP address
 * @param endpoint - Optional endpoint name for more granular limiting
 */
export async function checkRateLimit(
    identifier: string,
    endpoint: string = 'default'
): Promise<RateLimitResult> {
    const limiter = initRateLimiter();

    // If rate limiter is not configured, allow all requests
    if (!limiter) {
        return {
            success: true,
            limit: -1,
            remaining: -1,
            reset: 0,
        };
    }

    try {
        const key = `${endpoint}:${identifier}`;
        const result = await limiter.limit(key);

        return {
            success: result.success,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
        };
    } catch (error) {
        console.error('[RateLimit] Error checking rate limit:', error);
        // On error, allow the request (fail open)
        return {
            success: true,
            limit: -1,
            remaining: -1,
            reset: 0,
        };
    }
}

/**
 * Extract client IP from Vercel request headers.
 * Vercel automatically provides the real client IP.
 */
export function getClientIP(headers: Record<string, string | string[] | undefined>): string {
    // Vercel provides the real IP in x-forwarded-for
    const forwarded = headers['x-forwarded-for'];
    if (forwarded) {
        const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
        return ip.trim();
    }

    // Fallback to x-real-ip
    const realIp = headers['x-real-ip'];
    if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Default fallback
    return 'unknown';
}
