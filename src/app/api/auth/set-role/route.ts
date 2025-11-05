import { NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { requireRole } from "@/utils/auth";

/**
 * POST /api/auth/set-role - Set custom role claim for a user
 * Only accessible by admin users
 */
export async function POST(request: Request) {
  // Check if the requesting user is an admin
  const authResult = await requireRole(request, "admin");

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { uid, role } = await request.json();

    if (!uid || !role) {
      return NextResponse.json({ error: "UID and role are required" }, { status: 400 });
    }

    // Get current user claims
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};

    // Set new custom claims in Firebase Auth
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      role,
    });

    // Also update role in Firestore
    const db = admin.firestore();
    await db
      .collection("users")
      .doc(uid)
      .update({
        role,
        updatedAt: new Date().toISOString(),
      })
      .catch(async (error) => {
        // If document doesn't exist, create it
        if (error.code === "not-found") {
          await db.collection("users").doc(uid).set({
            uid,
            email: user.email,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          throw error;
        }
      });

    return NextResponse.json(
      {
        message: "Role set successfully",
        uid,
        role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to set role:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to set role" }, { status: 500 });
  }
}
