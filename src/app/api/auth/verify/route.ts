import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/utils/auth";

/**
 * POST /api/auth/verify - Verify a Firebase ID token
 */
export async function POST(request: Request) {
  try {
    const user = await verifyAuthToken(request);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
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
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 500 }
    );
  }
}
