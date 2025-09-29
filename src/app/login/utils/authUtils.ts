// Re-export all shared auth utilities
export {
  getAuthErrorMessage,
  parseAuthError,
  isRetryableError,
  requiresUserAction,
  logErrorInDevelopment,
} from "@/components/auth";
