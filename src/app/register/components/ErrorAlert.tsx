import React from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";

interface ErrorAlertProps {
  readonly error: string | null;
  readonly onClose?: () => void;
  readonly title?: string;
}

/**
 * Reusable error alert component with proper accessibility
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onClose,
  title = "Błąd",
}) => {
  return (
    <Collapse in={Boolean(error)} timeout={300}>
      <Alert 
        severity="error" 
        onClose={onClose}
        sx={{ mb: 2 }}
        role="alert"
        aria-live="assertive"
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {error}
      </Alert>
    </Collapse>
  );
};
