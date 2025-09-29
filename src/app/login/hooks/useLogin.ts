import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { getAuthErrorMessage, logErrorInDevelopment } from "../utils";
import { LOGIN_CONSTANTS } from "../constants";
import type { LoginFormData, UseLoginResult } from "../types";

/**
 * Custom hook for handling user login
 */
export const useLogin = (): UseLoginResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Successful login - redirect to home
      router.push(LOGIN_CONSTANTS.ROUTES.HOME);
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
      setError(errorMessage);
      logErrorInDevelopment(error, "Login error");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};
