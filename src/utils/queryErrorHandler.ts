import { useGlobalNotification } from "@/providers/NotificationProvider";

interface QueryError {
  message?: string;
  code?: string;
}

/**
 * Utility hook for handling query errors with global notifications
 * Shows toast notifications for query failures
 */
export const useQueryErrorHandler = () => {
  const { showError } = useGlobalNotification();

  const handleQueryError = (error: unknown, context?: string) => {
    console.error(`Query error${context ? ` (${context})` : ""}:`, error);

    // Extract meaningful error message
    let message = "Wystąpił błąd podczas ładowania danych";

    const queryError = error as QueryError;

    if (queryError?.message) {
      message = queryError.message;
    } else if (queryError?.code) {
      // Firebase error codes
      switch (queryError.code) {
        case "permission-denied":
          message = "Brak uprawnień do wyświetlenia tych danych";
          break;
        case "unavailable":
          message = "Usługa tymczasowo niedostępna. Spróbuj ponownie później";
          break;
        case "not-found":
          message = "Nie znaleziono żądanych danych";
          break;
        default:
          message = `Błąd systemu: ${queryError.code}`;
      }
    } else if (typeof error === "string") {
      message = error;
    }

    const fullMessage = context ? `${context}: ${message}` : message;
    showError(fullMessage);
  };

  return { handleQueryError };
};

/**
 * Utility function to create error-aware query options
 * Can be used with useQuery to automatically handle errors
 */
export const createQueryOptions = (context?: string) => ({
  onError: (error: unknown) => {
    // This will be handled by the global error handler when we implement it
    console.error(`Query failed${context ? ` (${context})` : ""}:`, error);
  },
});

/**
 * Utility function to create mutation options with error handling
 */
export const createMutationOptions = (context?: string) => ({
  onError: (error: unknown) => {
    console.error(`Mutation failed${context ? ` (${context})` : ""}:`, error);
    // Mutations are already handled globally in QueryClientProvider
  },
  onSuccess: (data: unknown) => {
    console.log(`Mutation succeeded${context ? ` (${context})` : ""}:`, data);
  },
});

