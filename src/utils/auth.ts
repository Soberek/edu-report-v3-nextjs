import admin from "@/firebase/admin";
import { NextResponse } from "next/server";

/**
 * Verify Firebase ID token from Authorization header
 */
export async function verifyAuthToken(request: Request): Promise<admin.auth.DecodedIdToken | null> {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth(request: Request): Promise<{ user: admin.auth.DecodedIdToken } | NextResponse> {
  const user = await verifyAuthToken(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized - Invalid or missing token" }, { status: 401 });
  }

  return { user };
}

/**
 * Get user role from Firestore
 */
async function getUserRoleFromFirestore(uid: string): Promise<string> {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      console.warn(`User document not found in Firestore for uid: ${uid}`);
      return "user"; // default role
    }

    const userData = userDoc.data();
    const role = userData?.role || "user";
    console.log(`✅ Role fetched from Firestore for uid ${uid}: ${role}`);
    return role;
  } catch (error) {
    console.error("❌ Error fetching user role from Firestore:", error);
    return "user";
  }
}

/**
 * Middleware to check if user has required role
 * Fetches role from Firestore if not in custom claims
 */
export async function requireRole(
  request: Request,
  requiredRole: string | string[]
): Promise<{ user: admin.auth.DecodedIdToken } | NextResponse> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Debug log: print decoded token claims
  console.log("🔍 Decoded token claims:", user);

  // Try to get role from custom claims first
  let userRole = user.role as string | undefined;

  // If not in claims, fetch from Firestore
  if (!userRole) {
    console.log("⚠️ Role not in token claims, fetching from Firestore for uid:", user.uid);
    userRole = await getUserRoleFromFirestore(user.uid);
  } else {
    console.log("✅ Role found in token claims:", userRole);
  }

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!userRole || !allowedRoles.includes(userRole)) {
    console.warn("❌ Forbidden: userRole is", userRole, "allowedRoles are", allowedRoles);
    return NextResponse.json(
      {
        error: "Forbidden - Insufficient permissions",
        userRole,
        allowedRoles,
      },
      { status: 403 }
    );
  }

  console.log(`✅ Access granted for user ${user.uid} with role ${userRole}`);
  return { user };
}

/**
 * Get user from request (without requiring authentication)
 */
export async function getUser(request: Request): Promise<admin.auth.DecodedIdToken | null> {
  return await verifyAuthToken(request);
}
