import { NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { requireRole } from "@/utils/auth";

/**
 * GET /api/users - List all users
 * Requires admin role
 */
export async function GET(request: Request) {
  // Check if the requesting user is an admin
  const authResult = await requireRole(request, "admin");

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const userList = await admin.auth().listUsers();
    const db = admin.firestore();

    // Enrich users with data from Firestore (role, etc.)
    const enrichedUsers = await Promise.all(
      userList.users.map(async (user) => {
        const userDoc = await db.collection("users").doc(user.uid).get();
        const userData = userDoc.data();

        return {
          ...user.toJSON(),
          role: userData?.role || user.customClaims?.role || "user",
          customClaims: {
            ...user.customClaims,
            role: userData?.role || user.customClaims?.role || "user",
          },
        };
      })
    );

    return NextResponse.json({ users: enrichedUsers }, { status: 200 });
  } catch (error) {
    console.error("Failed to list users:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}

/**
 * POST /api/users - Create a new user
 * Requires admin role
 */
export async function POST(request: Request) {
  // Check if the requesting user is an admin
  const authResult = await requireRole(request, "admin");

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { email, password, displayName, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Set custom claims for role-based access control
    if (role) {
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    }

    return NextResponse.json(
      {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create user" }, { status: 500 });
  }
}
