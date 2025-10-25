import { useGlobalNotification } from "@/providers/NotificationProvider";

/**
 * Utility hook for handling query errors with global notifications
 * Shows toast notifications for query failures
 */
export const useQueryErrorHandler = () => {
  const { showError } = useGlobalNotification();

  const handleQueryError = (error: any, context?: string) => {
    console.error(`Query error${context ? ` (${context})` : ""}:`, error);

    // Extract meaningful error message
    let message = "Wystąpił błąd podczas ładowania danych";

    if (error?.message) {
      message = error.message;
    } else if (error?.code) {
      // Firebase error codes
      switch (error.code) {
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
          message = `Błąd systemu: ${error.code}`;
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
  onError: (error: any) => {
    // This will be handled by the global error handler when we implement it
    console.error(`Query failed${context ? ` (${context})` : ""}:`, error);
  },
});

/**
 * Utility function to create mutation options with error handling
 */
export const createMutationOptions = (context?: string) => ({
  onError: (error: any) => {
    console.error(`Mutation failed${context ? ` (${context})` : ""}:`, error);
    // Mutations are already handled globally in QueryClientProvider
  },
  onSuccess: (data: any) => {
    console.log(`Mutation succeeded${context ? ` (${context})` : ""}:`, data);
  },
});
