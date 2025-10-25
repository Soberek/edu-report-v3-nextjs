import { useQuery, useQueries, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useGlobalNotification } from "@/providers/NotificationProvider";

interface QueryErrorObject {
  message?: string;
  code?: string;
}

/**
 * Enhanced useQuery hook that automatically shows error notifications
 * Wraps the standard useQuery with global error handling
 * Note: TanStack Query v5+ doesn't support onError in UseQueryOptions
 * We use useEffect to handle errors instead
 */
export function useQueryWithNotifications<TData = unknown, TError = unknown, TQueryKey extends readonly unknown[] = readonly unknown[]>(
  options: UseQueryOptions<TData, TError, TData, TQueryKey>,
  context?: string
): UseQueryResult<TData, TError> {
  const { showError } = useGlobalNotification();

  const query = useQuery(options);

  // Handle errors using useEffect since onError is not supported in v5
  useEffect(() => {
    if (query.error) {
      console.error(`Query error${context ? ` (${context})` : ""}:`, query.error);

      let message = "Wystąpił błąd podczas ładowania danych";

      if (query.error && typeof query.error === "object") {
        const err = query.error as QueryErrorObject;
        if (err.message) {
          message = err.message;
        } else if (err.code) {
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
      } else if (typeof query.error === "string") {
        message = query.error;
      }

      const fullMessage = context ? `${context}: ${message}` : message;
      showError(fullMessage);
    }
  }, [query.error, context, showError]);

  return query;
}

/**
 * Enhanced useQueries hook that automatically shows error notifications
 * Uses TanStack Query's useQueries hook instead of manually calling useQuery in a loop
 */
export function useQueriesWithNotifications<T extends readonly unknown[]>(
  queries: readonly [...{ [K in keyof T]: UseQueryOptions<T[K], unknown, T[K], readonly unknown[]> }],
  context?: string
) {
  const { showError } = useGlobalNotification();
  
  // Use proper useQueries hook instead of calling useQuery in a loop
  const results = useQueries({ queries: queries as UseQueryOptions<unknown, unknown, unknown, readonly unknown[]>[] });

  // Handle errors in all queries
  useEffect(() => {
    results.forEach((result, index) => {
      if (result.error) {
        console.error(`Query ${index} error${context ? ` (${context})` : ""}:`, result.error);

        let message = "Wystąpił błąd podczas ładowania danych";

        if (result.error && typeof result.error === "object") {
          const err = result.error as QueryErrorObject;
          if (err.message) {
            message = err.message;
          } else if (err.code) {
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
      }
    });
  }, [results, context, showError]);

  return results as UseQueryResult<T[number]>[];
}
