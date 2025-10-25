/**
 * Centralized error logging utility for the application
 * Handles logging, categorization, and reporting of all application errors
 */

export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  error?: Error;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  userId?: string;
  stack?: string;
}

export interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100; // Keep last 100 errors in memory

  /**
   * Log an error with context information
   */
  logError(error: Error | string, context?: ErrorContext): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    const logEntry: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorObj.message,
      error: errorObj,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: context?.userId,
      stack: errorObj.stack,
    };

    // Add to in-memory logs
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console logging for development
    console.error('🚨 Application Error:', {
      message: logEntry.message,
      context: logEntry.context,
      stack: logEntry.stack,
      timestamp: logEntry.timestamp,
    });

    // In production, you could send to error monitoring service
    // this.reportToMonitoring(logEntry);
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: ErrorContext): void {
    const logEntry: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: context?.userId,
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    console.warn('⚠️ Application Warning:', {
      message: logEntry.message,
      context: logEntry.context,
      timestamp: logEntry.timestamp,
    });
  }

  /**
   * Get recent error logs
   */
  getRecentLogs(limit = 50): ErrorLog[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Report error to monitoring service (implement as needed)
   * Example: Sentry, LogRocket, etc.
   */
  private reportToMonitoring(logEntry: ErrorLog): void {
    // Example implementation:
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(logEntry.error, {
    //     tags: {
    //       component: logEntry.context?.component,
    //       action: logEntry.context?.action,
    //     },
    //     user: logEntry.userId ? { id: logEntry.userId } : undefined,
    //     extra: logEntry.context?.metadata,
    //   });
    // }

    console.log('📊 Error reported to monitoring service:', logEntry);
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

/**
 * Utility function to create error context
 */
export const createErrorContext = (
  component?: string,
  action?: string,
  metadata?: Record<string, any>,
  userId?: string
): ErrorContext => ({
  component,
  action,
  metadata,
  userId,
});

/**
 * Utility function to log errors with user context
 */
export const logError = (error: Error | string, context?: ErrorContext) => {
  errorLogger.logError(error, context);
};

/**
 * Utility function to log warnings
 */
export const logWarning = (message: string, context?: ErrorContext) => {
  errorLogger.logWarning(message, context);
};
