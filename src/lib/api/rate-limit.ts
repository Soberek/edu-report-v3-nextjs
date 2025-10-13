/**
 * In-memory rate limiter for API routes
 *
 * This is a simple implementation that stores rate limit data in memory.
 * For production with multiple instances, consider using Redis/Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const entries = Array.from(this.store.entries());
      for (const [key, entry] of entries) {
        if (entry.resetTime < now) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (e.g., IP address, user ID, API key)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with success status and remaining attempts
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: Date;
  } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // If no entry exists or the window has expired, create a new one
    if (!entry || entry.resetTime < now) {
      const resetTime = now + windowMs;
      this.store.set(identifier, { count: 1, resetTime });
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: new Date(resetTime),
      };
    }

    // Check if limit is exceeded
    if (entry.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(entry.resetTime),
      };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);

    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      reset: new Date(entry.resetTime),
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Cleanup method for graceful shutdown
   */
  cleanup(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

/**
 * Rate limit presets for different types of endpoints
 */
export const RateLimitPresets = {
  // Very strict - for expensive operations
  STRICT: { limit: 5, windowMs: 60000 }, // 5 requests per minute

  // Standard - for regular API endpoints
  STANDARD: { limit: 30, windowMs: 60000 }, // 30 requests per minute

  // Relaxed - for read-only operations
  RELAXED: { limit: 100, windowMs: 60000 }, // 100 requests per minute

  // AI/ML operations - very expensive
  AI_OPERATIONS: { limit: 10, windowMs: 60000 }, // 10 requests per minute

  // Authentication endpoints
  AUTH: { limit: 10, windowMs: 900000 }, // 10 requests per 15 minutes
} as const;
