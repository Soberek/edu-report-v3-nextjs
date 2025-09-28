import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 64,
                color: "error.main",
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom color="error">
              Wystąpił błąd
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub skontaktuj się z administratorem.
            </Typography>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
                <Typography variant="body2" component="pre">
                  {this.state.error.message}
                </Typography>
              </Alert>
            )}
            <Button variant="contained" startIcon={<Refresh />} onClick={this.handleReset} sx={{ mt: 2 }}>
              Spróbuj ponownie
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Simple error display component
export const ErrorDisplay: React.FC<{
  error: string | Error;
  onRetry?: () => void;
  retryText?: string;
  sx?: object;
}> = ({ error, onRetry, retryText = "Spróbuj ponownie", sx = {} }) => {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <Box sx={{ p: 2, ...sx }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              {retryText}
            </Button>
          )
        }
      >
        <Typography variant="body2">{errorMessage}</Typography>
      </Alert>
    </Box>
  );
};
