import { useEffect } from "react";
import { errorLogger, createErrorContext } from "./errorLogger";

/**
 * Global error handlers for catching uncaught JavaScript errors and unhandled promise rejections
 */

/**
 * Initialize global error handlers
 * Call this once at app startup
 */
export const initializeGlobalErrorHandlers = () => {
  // Handle uncaught JavaScript errors
  window.addEventListener('error', (event) => {
    const { message, filename, lineno, colno, error } = event;

    errorLogger.logError(error || new Error(message), createErrorContext(
      'GlobalErrorHandler',
      'uncaughtError',
      {
        filename,
        lineno,
        colno,
        source: 'window.onerror',
      }
    ));

    // Don't prevent default browser error handling
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const { reason } = event;

    const error = reason instanceof Error
      ? reason
      : new Error(`Unhandled promise rejection: ${String(reason)}`);

    errorLogger.logError(error, createErrorContext(
      'GlobalErrorHandler',
      'unhandledRejection',
      {
        reason: String(reason),
        source: 'window.onunhandledrejection',
      }
    ));

    // Don't prevent default browser error handling
  });

  // Handle React error boundaries (if needed)
  // This is already handled by the GlobalErrorBoundary component

  console.log('🛡️ Global error handlers initialized');
};

/**
 * Utility to safely execute async functions with error handling
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  context?: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    errorLogger.logError(
      error instanceof Error ? error : new Error(String(error)),
      createErrorContext('safeAsync', 'asyncExecution', { context })
    );
    return fallback;
  }
};

/**
 * Utility to safely execute sync functions with error handling
 */
export const safeSync = <T>(
  fn: () => T,
  context?: string,
  fallback?: T
): T | undefined => {
  try {
    return fn();
  } catch (error) {
    errorLogger.logError(
      error instanceof Error ? error : new Error(String(error)),
      createErrorContext('safeSync', 'syncExecution', { context })
    );
    return fallback;
  }
};

/**
 * Wrapper for event handlers with automatic error handling
 */
export const withErrorHandler = <T extends unknown[], R>(
  fn: (...args: T) => R | Promise<R>,
  context?: string
) => {
  return (...args: T): R | Promise<R> | undefined => {
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error: unknown) => {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          errorLogger.logError(errorObj, createErrorContext('withErrorHandler', 'asyncEventHandler', { context }));
          return undefined as unknown as R;
        }) as Promise<R>;
      }

      return result;
    } catch (error) {
      errorLogger.logError(
        error instanceof Error ? error : new Error(String(error)),
        createErrorContext('withErrorHandler', 'syncEventHandler', { context })
      );
      return undefined;
    }
  };
};

/**
 * React hook for safe effect execution
 */
export const useSafeEffect = (
  effect: React.EffectCallback,
  deps?: React.DependencyList,
  context?: string
) => {
  useEffect(() => {
    try {
      const cleanup = effect();

      // Handle cleanup function
      if (typeof cleanup === 'function') {
        return () => {
          try {
            cleanup();
          } catch (error) {
            errorLogger.logError(
              error instanceof Error ? error : new Error(String(error)),
              createErrorContext('useSafeEffect', 'cleanup', { context })
            );
          }
        };
      }

      return cleanup;
    } catch (error) {
      errorLogger.logError(
        error instanceof Error ? error : new Error(String(error)),
        createErrorContext('useSafeEffect', 'effect', { context })
      );
    }
  }, deps);
};

/**
 * Get recent error logs for debugging
 */
export const getRecentErrorLogs = (limit = 10) => {
  return errorLogger.getRecentLogs(limit);
};

/**
 * Clear error logs
 */
export const clearErrorLogs = () => {
  errorLogger.clearLogs();
};
