import { NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { requireAuth, requireRole } from "@/utils/auth";

interface RouteParams {
  params: Promise<{ uid: string }>;
}

/**
 * GET /api/users/[uid] - Get a specific user by UID
 * Users can view their own profile, admins can view any profile
 */
export async function GET(request: Request, { params }: RouteParams) {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { uid } = await params;
    const { user: requestingUser } = authResult;

    // Check if user is accessing their own profile or is an admin
    if (requestingUser.uid !== uid && requestingUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - You can only view your own profile" }, { status: 403 });
    }

    const userRecord = await admin.auth().getUser(uid);
    return NextResponse.json({ user: userRecord.toJSON() }, { status: 200 });
  } catch (error) {
    console.error("Failed to get user:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to get user" }, { status: 500 });
  }
}

/**
 * PATCH /api/users/[uid] - Update a specific user
 * Users can update their own profile (limited fields), admins can update any profile
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { uid } = await params;
    const { user: requestingUser } = authResult;
    const updates = await request.json();

    // Check if user is updating their own profile or is an admin
    const isOwnProfile = requestingUser.uid === uid;
    const isAdmin = requestingUser.role === "admin";

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "Forbidden - You can only update your own profile" }, { status: 403 });
    }

    // Non-admin users can only update limited fields
    if (!isAdmin) {
      const allowedFields = ["displayName", "photoURL"];
      const hasRestrictedFields = Object.keys(updates).some((key) => !allowedFields.includes(key));

      if (hasRestrictedFields) {
        return NextResponse.json({ error: "Forbidden - You can only update displayName and photoURL" }, { status: 403 });
      }
    }

    // Update user in Firebase Auth
    const userRecord = await admin.auth().updateUser(uid, updates);

    // Update custom claims if role is provided (admin only)
    if (updates.role !== undefined && isAdmin) {
      const currentClaims = userRecord.customClaims || {};
      await admin.auth().setCustomUserClaims(uid, {
        ...currentClaims,
        role: updates.role,
      });
    }

    return NextResponse.json({ user: userRecord.toJSON() }, { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update user" }, { status: 500 });
  }
}

/**
 * DELETE /api/users/[uid] - Delete a specific user
 * Only admins can delete users
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const authResult = await requireRole(request, "admin");

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { uid } = await params;
    await admin.auth().deleteUser(uid);
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete user" }, { status: 500 });
  }
}
