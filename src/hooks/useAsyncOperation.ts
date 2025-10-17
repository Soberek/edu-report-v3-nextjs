import { useState, useCallback } from "react";

/**
 * State object for async operations
 */
export interface AsyncOperationState {
  /** Whether the operation is currently running */
  loading: boolean;
  /** Error message if operation failed */
  error: string | null;
  /** Whether the last operation succeeded */
  success: boolean;
}

/**
 * Options for async operation hooks
 */
export interface AsyncOperationOptions {
  /** Callback fired when operation succeeds */
  onSuccess?: (data?: unknown) => void;
  /** Callback fired when operation fails */
  onError?: (error: Error) => void;
  /** Callback fired after operation completes (success or failure) */
  onFinally?: () => void;
}

/**
 * Manage async operations with loading, error, and success states
 * Automatically tracks operation status and provides callbacks
 * @param options Optional callbacks (onSuccess, onError, onFinally)
 * @returns Object with loading/error/success state, execute and reset methods
 * @example
 * const { loading, error, success, execute, reset } = useAsyncOperation({
 *   onSuccess: (data) => console.log("Done:", data),
 *   onError: (error) => console.error("Failed:", error),
 * });
 *
 * const handleSubmit = async () => {
 *   await execute(() => apiCall(formData));
 * };
 */
export const useAsyncOperation = (options: AsyncOperationOptions = {}) => {
  const [state, setState] = useState<AsyncOperationState>({
    loading: false,
    error: null,
    success: false,
  });

  /**
   * Execute an async operation and track its state
   * @param operation Async function to execute
   * @returns Promise resolving to the operation result
   * @throws Rethrows any error from the operation
   */
  const execute = useCallback(
    async (operation: () => Promise<unknown>) => {
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

  /**
   * Reset operation state to initial state
   */
  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};