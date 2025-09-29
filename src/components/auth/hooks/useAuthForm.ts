import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage, logErrorInDevelopment } from "../utils";
import type { BaseAuthFormData, UseAuthFormResult } from "../types";

/**
 * Generic authentication form hook
 * Can be used for both login and registration
 */
export const useAuthForm = <T extends BaseAuthFormData>(
  authFunction: (data: T) => Promise<any>,
  successRedirect: string,
  errorContext: string
): UseAuthFormResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const submit = useCallback(async (data: T): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authFunction(data);
      
      if (result?.user || result) {
        router.push(successRedirect);
      }
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
      setError(errorMessage);
      logErrorInDevelopment(error, errorContext);
    } finally {
      setIsLoading(false);
    }
  }, [authFunction, successRedirect, errorContext, router]);

  return {
    submit,
    isLoading,
    error,
    clearError,
  };
};
