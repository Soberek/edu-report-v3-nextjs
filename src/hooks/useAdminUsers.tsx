"use client";

import { useState, useCallback } from "react";
import { getAuth } from "firebase/auth";

export interface AdminUser {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
  customClaims?: Record<string, unknown>;
  role?: string;
}

/**
 * Hook for admin user management operations using Firebase Admin SDK
 */
export function useAdminUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      return await user.getIdToken();
    } catch (err) {
      console.error("Failed to get auth token:", err);
      return null;
    }
  };

  const apiRequest = useCallback(async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }

    return await response.json();
  }, []);

  /**
   * List all users
   */
  const listUsers = useCallback(async (): Promise<AdminUser[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest<{ users: AdminUser[] }>("/api/users");
      return data.users.map(transformUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to list users";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  /**
   * Get a specific user
   */
  const getUser = useCallback(
    async (uid: string): Promise<AdminUser> => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiRequest<{ user: AdminUser }>(`/api/users/${uid}`);
        return transformUser(data.user);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to get user";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (userData: { email: string; password: string; displayName?: string; role?: string }): Promise<AdminUser> => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiRequest<{ user: AdminUser }>("/api/users", {
          method: "POST",
          body: JSON.stringify(userData),
        });
        return transformUser(data.user);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create user";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Update a user
   */
  const updateUser = useCallback(
    async (
      uid: string,
      updates: {
        displayName?: string;
        photoURL?: string;
        email?: string;
        emailVerified?: boolean;
        disabled?: boolean;
        role?: string;
      }
    ): Promise<AdminUser> => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiRequest<{ user: AdminUser }>(`/api/users/${uid}`, {
          method: "PATCH",
          body: JSON.stringify(updates),
        });
        return transformUser(data.user);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update user";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Delete a user
   */
  const deleteUser = useCallback(
    async (uid: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await apiRequest<{ message: string }>(`/api/users/${uid}`, {
          method: "DELETE",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Set role for a user
   */
  const setRole = useCallback(
    async (uid: string, role: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await apiRequest<{ message: string }>("/api/auth/set-role", {
          method: "POST",
          body: JSON.stringify({ uid, role }),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to set role";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Generate a secure random password
   */
  const generatePassword = useCallback(
    async (length: number = 12): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiRequest<{ password: string }>("/api/admin/users/generate-password", {
          method: "POST",
          body: JSON.stringify({ length }),
        });
        return data.password;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to generate password";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Reset user password
   */
  const resetPassword = useCallback(
    async (uid: string, newPassword: string): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiRequest<{ newPassword: string }>("/api/admin/users/reset-password", {
          method: "POST",
          body: JSON.stringify({ uid, newPassword }),
        });
        return data.newPassword;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to reset password";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  return {
    loading,
    error,
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    setRole,
    generatePassword,
    resetPassword,
  };
}

/**
 * Transform Firebase Admin user object to AdminUser interface
 */
type RawAdminUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  disabled?: boolean;
  metadata?: {
    creationTime?: string | null;
    lastSignInTime?: string | null;
  } | null;
  customClaims?: (Record<string, unknown> & { role?: unknown }) | null;
};

function transformUser(user: RawAdminUser): AdminUser {
  const customClaims = user.customClaims ?? undefined;
  const role =
    typeof customClaims === "object" && customClaims !== undefined && "role" in customClaims && typeof customClaims.role === "string"
      ? customClaims.role
      : "user";

  return {
    uid: user.uid,
    email: user.email ?? undefined,
    displayName: user.displayName ?? undefined,
    photoURL: user.photoURL ?? undefined,
    emailVerified: user.emailVerified || false,
    disabled: user.disabled || false,
    metadata: {
      creationTime: user.metadata?.creationTime ?? undefined,
      lastSignInTime: user.metadata?.lastSignInTime ?? undefined,
    },
    customClaims,
    role,
  };
}
