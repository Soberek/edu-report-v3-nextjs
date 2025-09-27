import { useCallback } from "react";

export interface ErrorHandler {
  handleError: (error: Error | string, context?: string) => void;
  clearError: () => void;
}

export const useErrorHandler = (): ErrorHandler => {
  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorMessage = typeof error === "string" ? error : error.message;
    const fullContext = context ? `${context}: ${errorMessage}` : errorMessage;

    console.error("ErrorHandler:", fullContext);

    // In a real app, you might want to send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === "production") {
      // Send to error reporting service
      // errorReportingService.captureException(error, { context });
    }
  }, []);

  const clearError = useCallback(() => {
    // Clear any error state if needed
  }, []);

  return { handleError, clearError };
};
