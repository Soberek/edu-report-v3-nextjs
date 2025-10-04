"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";

/**
 * Hook to interact with Firebase Admin API endpoints
 */
export function useFirebaseAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get authorization token for API requests
   */
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

  /**
   * Make authenticated API request
   */
  const apiRequest = async <T,>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
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

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * List all users (admin only)
   */
  const listUsers = async () => {
    return apiRequest<{ users: any[] }>("/api/users");
  };

  /**
   * Get a specific user
   */
  const getUser = async (uid: string) => {
    return apiRequest<{ user: any }>(`/api/users/${uid}`);
  };

  /**
   * Create a new user (admin only)
   */
  const createUser = async (userData: {
    email: string;
    password: string;
    displayName?: string;
    role?: string;
  }) => {
    return apiRequest<{ user: any }>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  };

  /**
   * Update a user
   */
  const updateUser = async (uid: string, updates: any) => {
    return apiRequest<{ user: any }>(`/api/users/${uid}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  };

  /**
   * Delete a user (admin only)
   */
  const deleteUser = async (uid: string) => {
    return apiRequest<{ message: string }>(`/api/users/${uid}`, {
      method: "DELETE",
    });
  };

  /**
   * Verify current token
   */
  const verifyToken = async () => {
    return apiRequest<{ valid: boolean; user: any }>("/api/auth/verify", {
      method: "POST",
    });
  };

  /**
   * Set role for a user (admin only)
   */
  const setRole = async (uid: string, role: string) => {
    return apiRequest<{ message: string; uid: string; role: string }>(
      "/api/auth/set-role",
      {
        method: "POST",
        body: JSON.stringify({ uid, role }),
      }
    );
  };

  return {
    loading,
    error,
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    verifyToken,
    setRole,
  };
}
