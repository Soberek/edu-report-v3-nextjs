import React from "react";
import { Snackbar, Alert } from "@mui/material";
import type { NotificationState } from "@/hooks/useNotification";

interface NotificationSnackbarProps {
  notification: NotificationState;
  onClose: () => void;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

/**
 * Reusable notification snackbar component with Alert
 * Use with the useNotification hook for state management
 * 
 * @example
 * const { notification, showSuccess, close } = useNotification();
 * 
 * return (
 *   <>
 *     <Button onClick={() => showSuccess("Saved!")}>Save</Button>
 *     <NotificationSnackbar notification={notification} onClose={close} />
 *   </>
 * );
 */
export const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  notification,
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={notification.severity} sx={{ width: "100%" }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};
