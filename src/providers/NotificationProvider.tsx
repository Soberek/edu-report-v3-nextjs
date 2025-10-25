"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { NotificationSnackbar } from "@/components/shared/NotificationSnackbar";
import { useNotification, type UseNotificationReturn } from "@/hooks/useNotification";

/**
 * Global notification context for app-wide toast notifications
 * Provides notification state and methods throughout the application
 */
const NotificationContext = createContext<UseNotificationReturn | null>(null);

/**
 * Hook to use global notifications from anywhere in the app
 */
export const useGlobalNotification = (): UseNotificationReturn => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useGlobalNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Global notification provider that manages app-wide toast notifications
 * Integrates with React Query for automatic error handling
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notification = useNotification();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
      <NotificationSnackbar
        notification={notification.notification}
        onClose={notification.close}
        autoHideDuration={5000} // 5 seconds
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </NotificationContext.Provider>
  );
};
