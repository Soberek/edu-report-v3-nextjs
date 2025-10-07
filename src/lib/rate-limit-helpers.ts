import { NextRequest, NextResponse } from "next/server";
import rateLimiter, { RateLimitPresets } from "./rate-limit";

/**
 * Get identifier from request (IP address or user ID from headers)
 */
export function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  // Use the first available IP
  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  
  // You can also use user ID if available from auth
  const userId = request.headers.get("x-user-id");
  
  return userId || ip;
}

/**
 * Apply rate limiting to a request
 * Returns NextResponse with 429 status if rate limit exceeded
 */
export function checkRateLimit(
  request: NextRequest,
  preset: keyof typeof RateLimitPresets = "STANDARD"
): { success: boolean; response?: NextResponse } {
  const identifier = getIdentifier(request);
  const { limit, windowMs } = RateLimitPresets[preset];
  
  const result = rateLimiter.check(identifier, limit, windowMs);
  
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.reset.toISOString(),
            "Retry-After": Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }
  
  return { success: true };
}

/**
 * Middleware wrapper for rate limiting
 * Use this to wrap your API route handlers
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  preset: keyof typeof RateLimitPresets = "STANDARD"
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rateLimitResult = checkRateLimit(request, preset);
    
    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response;
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    const identifier = getIdentifier(request);
    const { limit, windowMs } = RateLimitPresets[preset];
    const result = rateLimiter.check(identifier, limit, windowMs);
    
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toISOString());
    
    return response;
  };
}

/**
 * Higher-order function for POST route handlers
 */
export function withRateLimitPOST(
  handler: (request: Request) => Promise<NextResponse>,
  preset: keyof typeof RateLimitPresets = "STANDARD"
) {
  return async (request: Request): Promise<NextResponse> => {
    const nextRequest = request as NextRequest;
    const rateLimitResult = checkRateLimit(nextRequest, preset);
    
    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response;
    }
    
    const response = await handler(request);
    
    // Add rate limit headers
    const identifier = getIdentifier(nextRequest);
    const { limit, windowMs } = RateLimitPresets[preset];
    const result = rateLimiter.check(identifier, limit, windowMs);
    
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", Math.max(0, result.remaining - 1).toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toISOString());
    
    return response;
  };
}
