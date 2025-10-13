import React from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";
import { SHARED_AUTH_CONSTANTS } from "../constants";
import type { ErrorAlertProps } from "../types";

/**
 * Shared error alert component with proper accessibility
 * Used across all authentication forms
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onClose,
  title = SHARED_AUTH_CONSTANTS.TEXT.DEFAULT_ERROR_TITLE,
}) => {
  return (
    <Collapse in={Boolean(error)} timeout={SHARED_AUTH_CONSTANTS.ANIMATIONS.ERROR_COLLAPSE_TIMEOUT}>
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
