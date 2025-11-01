/**
 * useWithNotification - Reusable hook for async operations with notifications
 * 
 * Eliminates DRY violation of repeated try-catch + notification pattern
 * 
 * Usage:
 * const executeWithNotification = useWithNotification();
 * 
 * executeWithNotification(
 *   async () => { await createItem(data); },
 *   "Success message",
 *   "Error message"
 * );
 */

import { useCallback } from "react";
import { useNotification } from "@/hooks";
import { getErrorMessage } from "@/hooks/utils/error-handler.utils";

/**
 * Hook providing notification-wrapped async operation executor
 * Handles success/error notifications and error re-throwing
 */
export function useWithNotification() {
  const { showSuccess, showError } = useNotification();

  /**
   * Execute async operation with automatic success/error notifications
   * @param operation - Async function to execute
   * @param successMessage - Message to show on success
   * @param errorMessage - Default message to show on error
   * @returns Promise that resolves to operation result
   * @throws Re-throws caught error after notification
   */
  const executeWithNotification = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      successMessage: string,
      errorMessage: string
    ): Promise<T> => {
      try {
        const result = await operation();
        showSuccess(successMessage);
        return result;
      } catch (error) {
        const errorMsg = getErrorMessage(error, errorMessage);
        showError(errorMsg);
        throw error;
      }
    },
    [showSuccess, showError]
  );

  return executeWithNotification;
}

/**
 * Configuration type for notification messages
 */
export type NotificationConfig = {
  readonly successMessage: string;
  readonly errorMessage: string;
};
