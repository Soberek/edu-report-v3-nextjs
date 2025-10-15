import { useState, useCallback } from "react";

export interface NotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export interface UseNotificationReturn {
  notification: NotificationState;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  close: () => void;
}

/**
 * Custom hook for managing notification/snackbar state
 * Provides methods to show different types of notifications and close them
 * 
 * @example
 * const { notification, showSuccess, showError, close } = useNotification();
 * 
 * // Show success notification
 * showSuccess("Operation completed successfully!");
 * 
 * // Show error notification
 * showError("Something went wrong");
 * 
 * // Use with NotificationSnackbar component
 * <NotificationSnackbar notification={notification} onClose={close} />
 */
export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSuccess = useCallback((message: string) => {
    setNotification({
      open: true,
      message,
      severity: "success",
    });
  }, []);

  const showError = useCallback((message: string) => {
    setNotification({
      open: true,
      message,
      severity: "error",
    });
  }, []);

  const showInfo = useCallback((message: string) => {
    setNotification({
      open: true,
      message,
      severity: "info",
    });
  }, []);

  const showWarning = useCallback((message: string) => {
    setNotification({
      open: true,
      message,
      severity: "warning",
    });
  }, []);

  const close = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    close,
  };
};
