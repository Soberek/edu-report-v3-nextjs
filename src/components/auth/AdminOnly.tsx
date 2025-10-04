"use client";

import { useIsAdmin } from "@/hooks/useUser";
import { Alert, AlertTitle, Box } from "@mui/material";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AdminOnly component - only renders children if user is admin
 * Shows a fallback message if user is not admin
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback }) => {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return (
      fallback || (
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">
            <AlertTitle>Brak dostępu</AlertTitle>
            Ta funkcja jest dostępna tylko dla administratorów.
          </Alert>
        </Box>
      )
    );
  }

  return <>{children}</>;
};
