import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { getAuthErrorMessage } from "../utils";
import { REGISTER_CONSTANTS } from "../constants";
import type { RegisterFormData, UseRegisterResult } from "../types";

/**
 * Custom hook for handling user registration
 */
export const useRegister = (): UseRegisterResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      if (userCredential.user) {
        // Successful registration - redirect to login
        router.push(REGISTER_CONSTANTS.ROUTES.LOGIN);
      }
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    register,
    isLoading,
    error,
    clearError,
  };
};
