import { NextResponse, NextRequest } from "next/server";
import { verifyAuthToken } from "@/utils/auth";
import { checkRateLimit } from "@/lib/api/rate-limit-helpers";

/**
 * POST /api/auth/verify - Verify a Firebase ID token
 * Rate limited to 10 requests per 15 minutes per IP
 */
export async function POST(request: Request) {
  // Apply rate limiting for auth operations
  const rateLimitResult = checkRateLimit(request as NextRequest, "AUTH");
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const user = await verifyAuthToken(request);

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    return NextResponse.json(
      {
        valid: true,
        user: {
          uid: user.uid,
          email: user.email,
          role: user.role,
          emailVerified: user.email_verified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Token verification failed" }, { status: 500 });
  }
}
