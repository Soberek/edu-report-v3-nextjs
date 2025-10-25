"use client";

import React, { Component, ReactNode } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { errorLogger, createErrorContext } from "@/utils/errorLogger";
import { useGlobalNotification } from "@/providers/NotificationProvider";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showNotification?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Global Error Boundary that catches React component errors
 * Provides fallback UI and logs errors centrally
 */
class GlobalErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log the error
    errorLogger.logError(error, createErrorContext(
      'GlobalErrorBoundary',
      'componentDidCatch',
      {
        errorInfo,
        componentStack: errorInfo.componentStack,
      }
    ));

    // Show notification if enabled
    if (this.props.showNotification !== false) {
      // Note: We can't use hooks in class components, so we'll rely on console logging
      // The notification would need to be handled differently or this could be converted to a functional component
      console.error('React Error Boundary caught an error:', error.message);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: 3,
            backgroundColor: "background.default",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" color="error" gutterBottom>
              🚨 Wystąpił błąd aplikacji
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Przepraszamy za utrudnienia. Wystąpił nieoczekiwany błąd w aplikacji.
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Szczegóły błędu:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontSize: "0.75rem" }}>
                {this.state.error?.message}
              </Typography>
            </Alert>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="contained" onClick={this.handleReset}>
                Spróbuj ponownie
              </Button>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Odśwież stronę
              </Button>
            </Box>

            <Typography variant="caption" sx={{ mt: 2, display: "block", color: "text.secondary" }}>
              Jeśli problem będzie się powtarzał, skontaktuj się z administratorem systemu.
            </Typography>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for the class-based error boundary
 * This allows us to use hooks while maintaining the error boundary functionality
 */
export const GlobalErrorBoundary: React.FC<Props> = ({ children, fallback, showNotification = true }) => {
  const { showError } = useGlobalNotification();

  // Create a wrapper that can show notifications
  const ErrorBoundaryWithNotifications = () => (
    <GlobalErrorBoundaryClass
      fallback={fallback}
      showNotification={showNotification}
    >
      {children}
    </GlobalErrorBoundaryClass>
  );

  return <ErrorBoundaryWithNotifications />;
};

/**
 * Hook to manually trigger error boundary (for testing or edge cases)
 */
export const useErrorBoundary = () => {
  const handleError = React.useCallback((error: Error, context?: string) => {
    errorLogger.logError(error, createErrorContext('useErrorBoundary', 'manual', { context }));

    // This will trigger the nearest error boundary
    throw error;
  }, []);

  return { triggerError: handleError };
};
