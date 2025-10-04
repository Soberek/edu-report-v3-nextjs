import { NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { requireRole } from "@/utils/auth";

/**
 * POST /api/admin/users/reset-password - Reset user password (Admin only)
 */
export async function POST(request: Request) {
  const authResult = await requireRole(request, "admin");
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { uid, newPassword } = await request.json();

    if (!uid || !newPassword) {
      return NextResponse.json(
        { error: "UID and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Update user password
    await admin.auth().updateUser(uid, {
      password: newPassword,
    });

    return NextResponse.json(
      {
        message: "Password reset successfully",
        uid,
        // Return the password so admin can share it with user
        newPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to reset password:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reset password" },
      { status: 500 }
    );
  }
}
