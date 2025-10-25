import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useGlobalNotification } from "@/providers/NotificationProvider";

/**
 * Enhanced useQuery hook that automatically shows error notifications
 * Wraps the standard useQuery with global error handling
 */
export function useQueryWithNotifications<TData = unknown, TError = unknown, TQueryKey extends readonly unknown[] = readonly unknown[]>(
  options: UseQueryOptions<TData, TError, TData, TQueryKey>,
  context?: string
): UseQueryResult<TData, TError> {
  const { showError } = useGlobalNotification();
  const queryClient = useQueryClient();

  const query = useQuery({
    ...options,
    onError: (error: TError) => {
      // Call original onError if provided
      options.onError?.(error);

      // Show global error notification
      console.error(`Query error${context ? ` (${context})` : ""}:`, error);

      let message = "Wystąpił błąd podczas ładowania danych";

      if (error && typeof error === "object") {
        const err = error as any;
        if (err.message) {
          message = err.message;
        } else if (err.code) {
          // Handle Firebase error codes
          switch (err.code) {
            case "permission-denied":
              message = "Brak uprawnień do wyświetlenia tych danych";
              break;
            case "unavailable":
              message = "Usługa tymczasowo niedostępna. Spróbuj ponownie później";
              break;
            case "not-found":
              message = "Nie znaleziono żądanych danych";
              break;
            case "deadline-exceeded":
              message = "Przekroczono limit czasu. Spróbuj ponownie";
              break;
            default:
              message = `Błąd systemu: ${err.code}`;
          }
        }
      } else if (typeof error === "string") {
        message = error;
      }

      const fullMessage = context ? `${context}: ${message}` : message;
      showError(fullMessage);
    },
  });

  // Show loading notification for long-running queries (optional)
  useEffect(() => {
    if (query.isLoading && query.fetchStatus === "fetching") {
      // Could show a loading notification here if needed
      // For now, just log for debugging
      console.debug(`Loading ${context || "data"}...`);
    }
  }, [query.isLoading, query.fetchStatus, context]);

  return query;
}

/**
 * Enhanced useQueries hook that automatically shows error notifications
 * Wraps the standard useQueries with global error handling
 */
export function useQueriesWithNotifications<T extends readonly unknown[]>(
  queries: readonly [...{ [K in keyof T]: UseQueryOptions<T[K], unknown, T[K], readonly unknown[]> }],
  context?: string
) {
  const { showError } = useGlobalNotification();

  const results = queries.map((query, index) =>
    useQuery({
      ...query,
      onError: (error: unknown) => {
        // Call original onError if provided
        query.onError?.(error);

        // Show global error notification
        console.error(`Query ${index} error${context ? ` (${context})` : ""}:`, error);

        let message = "Wystąpił błąd podczas ładowania danych";

        if (error && typeof error === "object") {
          const err = error as any;
          if (err.message) {
            message = err.message;
          } else if (err.code) {
            // Handle common error codes
            switch (err.code) {
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
                message = `Błąd systemu: ${err.code}`;
            }
          }
        }

        const fullMessage = context ? `${context}: ${message}` : message;
        showError(fullMessage);
      },
    })
  );

  return results;
}
