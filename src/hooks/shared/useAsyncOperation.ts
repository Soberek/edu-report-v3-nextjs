import { useState, useCallback } from "react";

export interface AsyncOperationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AsyncOperationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export const useAsyncOperation = (options: AsyncOperationOptions = {}) => {
  const [state, setState] = useState<AsyncOperationState>({
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (operation: () => Promise<any>) => {
      setState({ loading: true, error: null, success: false });

      try {
        const result = await operation();
        setState({ loading: false, error: null, success: true });
        options.onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd";
        setState({ loading: false, error: errorMessage, success: false });
        options.onError?.(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      } finally {
        options.onFinally?.();
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
