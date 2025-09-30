"use client";

import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, memo } from "react";

interface ProtectedPageProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  loadingMessage?: string;
}

/**
 * ProtectedPage component that ensures user authentication before rendering children.
 * Redirects unauthenticated users to login page and shows loading state during auth check.
 */
const ProtectedPage = memo<ProtectedPageProps>(
  ({ children, redirectTo = "/login", fallback = null, loadingMessage = "Ładuje się strona, poczekaj..." }) => {
    const auth = useUser();
    const router = useRouter();

    const handleRedirect = useCallback(() => {
      router.push(redirectTo);
    }, [router, redirectTo]);

    useEffect(() => {
      if (!auth.loading && !auth.user) {
        handleRedirect();
      }
    }, [auth.loading, auth.user, handleRedirect]);

    // Show loading state while authentication is being checked
    if (auth.loading) {
      return (
        <LoadingSpinner
          fullScreen
          message={loadingMessage}
          size={48}
          color="primary"
          sx={{
            background: "linear-gradient(135deg, #d400a6ff 0%, #da0000ff 100%)",
          }}
        />
      );
    }

    // Show fallback or nothing if user is not authenticated
    if (!auth.user) {
      return fallback;
    }

    // Render protected content for authenticated users
    return <>{children}</>;
  }
);

ProtectedPage.displayName = "ProtectedPage";

export default ProtectedPage;
