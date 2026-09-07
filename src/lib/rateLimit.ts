import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number; // Duration of window in milliseconds
  max: number;      // Maximum requests allowed in the window
}

/**
 * In-memory sliding window rate limiter.
 * Automatically cleans up stale entries to prevent memory accumulation.
 */
class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private lastCleanup = Date.now();
  private cleanupIntervalMs = 60000; // Cleanup every 60 seconds

  constructor(private config: RateLimitConfig) {}

  public check(key: string): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();

    // Periodic garbage collection of expired records
    if (now - this.lastCleanup > this.cleanupIntervalMs) {
      this.cleanup(now);
    }

    const record = this.store.get(key);

    if (!record || now > record.resetAt) {
      // First request or window has expired
      const resetAt = now + this.config.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return {
        success: true,
        limit: this.config.max,
        remaining: this.config.max - 1,
        reset: Math.ceil(resetAt / 1000),
      };
    }

    if (record.count >= this.config.max) {
      // Limit exceeded
      return {
        success: false,
        limit: this.config.max,
        remaining: 0,
        reset: Math.ceil(record.resetAt / 1000),
      };
    }

    // Increment count
    record.count += 1;
    return {
      success: true,
      limit: this.config.max,
      remaining: this.config.max - record.count,
      reset: Math.ceil(record.resetAt / 1000),
    };
  }

  private cleanup(now: number) {
    this.lastCleanup = now;
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Extracts the true client IP address from standard reverse-proxy headers.
 */
export function getClientIp(request: Request | NextRequest): string {
  const headers = request.headers;

  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  // Standard X-Forwarded-For (take the first, client IP)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    if (ips.length > 0 && ips[0].trim()) {
      return ips[0].trim();
    }
  }

  // Nginx / Vercel / Cloud proxies
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const trueClientIp = headers.get('true-client-ip');
  if (trueClientIp) return trueClientIp.trim();

  return '127.0.0.1';
}

// 1. Strict OTP rate limiter: 5 requests per 10 minutes per IP
export const otpIpLimiter = new InMemoryRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

// 2. Strict OTP recipient limiter: 3 requests per 10 minutes per email address
export const otpEmailLimiter = new InMemoryRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
});

// 3. Auth & OAuth endpoints limiter: 25 requests per 5 minutes per IP
export const authRateLimiter = new InMemoryRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 25,
});

// 4. API DoS limiter: 60 requests per 1 minute per IP
export const apiDosLimiter = new InMemoryRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
});

// 5. General website page request limiter: 150 requests per 1 minute per IP
export const globalPageLimiter = new InMemoryRateLimiter({
  windowMs: 60 * 1000,
  max: 150,
});
