import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { UserRole, type UserData } from "@/types/user";

const USERS_COLLECTION = "users";

/**
 * Get user data from Firestore
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

/**
 * Create a new user document in Firestore
 */
export async function createUserData(
  uid: string,
  email: string,
  role: UserRole = UserRole.USER,
  displayName?: string
): Promise<void> {
  try {
    const userData: UserData = {
      uid,
      email,
      role,
      displayName: displayName || email.split("@")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, USERS_COLLECTION, uid), userData);
  } catch (error) {
    console.error("Error creating user data:", error);
    throw error;
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      role,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

/**
 * Check if user has admin role
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  const userData = await getUserData(uid);
  return userData?.role === UserRole.ADMIN;
}

/**
 * Update user display name
 */
export async function updateUserDisplayName(uid: string, displayName: string): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      displayName,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
}
