/**
 * Debug logger for development mode
 * Only logs when in development (works in both client and server contexts)
 */

// Check development mode - works in both browser and Node.js
const isDevelopment =
  typeof window !== "undefined"
    ? true // Always log in browser for debugging
    : process.env.NODE_ENV === "development"; // Check env in server context

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface DebugLogOptions {
  level?: LogLevel;
  context?: string;
  data?: unknown;
}

/**
 * Internal logger that respects development mode
 */
function logMessage(message: string, options: DebugLogOptions = {}) {
  if (!isDevelopment) return;

  const { level = "log", context = "BudgetMeter", data } = options;
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}] 📊 ${context}`;

  const logFn = console[level] as (message: string, ...args: unknown[]) => void;

  if (data !== undefined) {
    logFn(`${prefix} ${message}`, data);
  } else {
    logFn(`${prefix} ${message}`);
  }
}

export const debugLogger = {
  /**
   * Log general information
   */
  info: (message: string, data?: unknown, context?: string) => {
    logMessage(message, { level: "info", context: context || "BudgetMeter", data });
  },

  /**
   * Log debug messages
   */
  debug: (message: string, data?: unknown, context?: string) => {
    logMessage(message, { level: "debug", context: context || "BudgetMeter", data });
  },

  /**
   * Log warnings
   */
  warn: (message: string, data?: unknown, context?: string) => {
    logMessage(message, { level: "warn", context: context || "BudgetMeter", data });
  },

  /**
   * Log errors
   */
  error: (message: string, error?: unknown, context?: string) => {
    logMessage(message, { level: "error", context: context || "BudgetMeter", data: error });
  },

  /**
   * Log with custom prefix
   */
  custom: (message: string, prefix: string, data?: unknown) => {
    if (!isDevelopment) return;
    const timestamp = new Date().toLocaleTimeString();
    const fullPrefix = `[${timestamp}] ${prefix}`;
    if (data !== undefined) {
      console.log(`${fullPrefix} ${message}`, data);
    } else {
      console.log(`${fullPrefix} ${message}`);
    }
  },

  /**
   * Log file upload progress
   */
  fileUpload: (fileName: string, status: "start" | "success" | "error", details?: unknown) => {
    const messages: Record<string, string> = {
      start: `📁 Reading file: ${fileName}`,
      success: `✅ File loaded successfully: ${fileName}`,
      error: `❌ File loading failed: ${fileName}`,
    };
    logMessage(messages[status], { level: "info", context: "FileUpload", data: details });
  },

  /**
   * Log Excel parsing
   */
  excelParsing: (step: string, details?: unknown) => {
    const emoji: Record<string, string> = {
      headers: "📋",
      rows: "📊",
      validation: "✓",
      complete: "✅",
      error: "❌",
    };
    logMessage(`${emoji[step] || "→"} Excel parsing: ${step}`, { level: "debug", context: "ExcelParsing", data: details });
  },

  /**
   * Log data processing
   */
  dataProcessing: (step: string, details?: unknown) => {
    const emoji: Record<string, string> = {
      start: "▶️",
      filtering: "🔍",
      aggregating: "📦",
      calculating: "🧮",
      complete: "✅",
      error: "❌",
    };
    logMessage(`${emoji[step] || "→"} Data processing: ${step}`, { level: "debug", context: "DataProcessing", data: details });
  },

  /**
   * Log performance metrics
   */
  performance: (operation: string, duration: number) => {
    logMessage(`⏱️ ${operation}: ${duration}ms`, { level: "info", context: "Performance" });
  },

  /**
   * Check if debug mode is enabled
   */
  isEnabled: () => isDevelopment,
};

export default debugLogger;
