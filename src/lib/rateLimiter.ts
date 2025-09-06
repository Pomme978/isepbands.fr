import { rateLimit } from 'express-rate-limit';
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (use Redis in production)
class MemoryStore {
  private hits: Map<string, { count: number; resetTime: number }> = new Map();

  async increment(key: string): Promise<{ totalHits: number; timeToReset: number | undefined }> {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const resetTime = now + windowMs;

    const existing = this.hits.get(key);
    
    if (!existing || now > existing.resetTime) {
      // New window or expired
      this.hits.set(key, { count: 1, resetTime });
      return { totalHits: 1, timeToReset: windowMs };
    }

    // Increment existing
    existing.count++;
    this.hits.set(key, existing);
    
    return { 
      totalHits: existing.count, 
      timeToReset: existing.resetTime - now 
    };
  }

  async decrement(key: string): Promise<void> {
    const existing = this.hits.get(key);
    if (existing && existing.count > 0) {
      existing.count--;
      this.hits.set(key, existing);
    }
  }

  async resetKey(key: string): Promise<void> {
    this.hits.delete(key);
  }
}

const store = new MemoryStore();

// Auth rate limiter - stricter limits
export const createAuthLimiter = (max: number = 5, windowMs: number = 15 * 60 * 1000) => {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               req.headers.get('cf-connecting-ip') || 
               'unknown';

    const key = `auth:${ip}`;
    const { totalHits, timeToReset } = await store.increment(key);

    if (totalHits > max) {
      return NextResponse.json(
        { 
          error: 'Too many authentication attempts',
          message: `Maximum ${max} attempts allowed per ${windowMs / 60000} minutes`,
          retryAfter: Math.ceil((timeToReset || 0) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((timeToReset || 0) / 1000).toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': Math.max(0, max - totalHits).toString(),
            'X-RateLimit-Reset': new Date(Date.now() + (timeToReset || 0)).toISOString()
          }
        }
      );
    }

    return null; // No rate limit hit
  };
};

// General API rate limiter
export const createApiLimiter = (max: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';

    const key = `api:${ip}`;
    const { totalHits, timeToReset } = await store.increment(key);

    if (totalHits > max) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((timeToReset || 0) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((timeToReset || 0) / 1000).toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': Math.max(0, max - totalHits).toString()
          }
        }
      );
    }

    return null;
  };
};

// Password reset limiter - very strict
export const passwordResetLimiter = createAuthLimiter(3, 60 * 60 * 1000); // 3 per hour
export const loginLimiter = createAuthLimiter(10, 15 * 60 * 1000); // 10 per 15min
export const registerLimiter = createAuthLimiter(5, 60 * 60 * 1000); // 5 per hour