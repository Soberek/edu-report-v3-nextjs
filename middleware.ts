import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import rateLimiter from "./src/lib/rate-limit";

/**
 * Middleware for global rate limiting on API routes
 * 
 * This middleware runs before all API routes and applies a global rate limit.
 * Individual routes can have additional, more restrictive limits.
 */
export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Get identifier (IP address)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
    
    // Global rate limit: 100 requests per minute per IP
    const result = rateLimiter.check(`global:${ip}`, 100, 60000);
    
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Global rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.reset.toISOString(),
            "Retry-After": Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    // Add rate limit headers to the response
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toISOString());
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
  ],
};
