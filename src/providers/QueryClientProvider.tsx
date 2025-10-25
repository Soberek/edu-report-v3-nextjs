"use client";

import React from "react";
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { useGlobalNotification } from "./NotificationProvider";

/**
 * Component that handles global error notifications for React Query
 * Must be inside NotificationProvider to access global notifications
 */
function QueryErrorHandler({ children }: { children: React.ReactNode }) {
  const { showError } = useGlobalNotification();

  // Create QueryClient with error handling - must be in component to access hooks
  const [queryClient] = React.useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // Retry failed requests up to 3 times with exponential backoff
          retry: (failureCount, error: any) => {
            // Don't retry on 4xx errors (client errors)
            if (error?.status >= 400 && error?.status < 500) {
              return false;
            }
            // Retry up to 3 times for other errors
            return failureCount < 3;
          },
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

          // Data is fresh for 5 minutes, then considered stale
          staleTime: 5 * 60 * 1000, // 5 minutes

          // Cache unused data for 10 minutes before garbage collection
          gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

          // Refetch on window focus to ensure data freshness
          refetchOnWindowFocus: true,

          // Don't refetch on reconnect by default (let staleTime handle it)
          refetchOnReconnect: false,

          // Don't refetch on mount (use cache if available)
          refetchOnMount: false,
        },
        mutations: {
          // Retry mutations once on failure
          retry: 1,
          retryDelay: 1000,

          // Global mutation error handler
          onError: (error: any) => {
            console.error("Mutation error:", error);
            const message = error?.message || "Wystąpił błąd podczas zapisywania danych";
            showError(`Błąd zapisu: ${message}`);
          },
        },
      },
    })
  );

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}

/**
 * Enhanced QueryClientProvider with global error handling and notifications
 * Integrates with NotificationProvider for toast notifications on query failures
 */
export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <QueryErrorHandler>{children}</QueryErrorHandler>;
}
