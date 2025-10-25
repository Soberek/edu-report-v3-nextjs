"use client";

import React, { useEffect } from "react";
import { initializeGlobalErrorHandlers } from "@/utils/globalErrorHandler";

interface GlobalErrorProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that initializes global error handlers on app startup
 * Must be placed high in the component tree to catch all errors
 */
export const GlobalErrorProvider: React.FC<GlobalErrorProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize global error handlers
    initializeGlobalErrorHandlers();

    // Optional: Log app startup
    console.log('🚀 Edu-Report v3 Application Started');
  }, []);

  return <>{children}</>;
};
