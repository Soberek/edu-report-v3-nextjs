"use client";

import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/types/user";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect, memo } from "react";

interface RoleProtectedProps {
  children: React.ReactNode;
  requiredRole: UserRole | UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  loadingMessage?: string;
}

/**
 * RoleProtected component that checks user role before rendering children.
 * Redirects users without required role.
 */
export const RoleProtected = memo<RoleProtectedProps>(
  ({ 
    children, 
    requiredRole, 
    redirectTo = "/", 
    fallback = null, 
    loadingMessage = "Sprawdzanie uprawnień..." 
  }) => {
    const { user, userData, loading } = useUser();
    const router = useRouter();

    const hasRequiredRole = (): boolean => {
      if (!userData) return false;
      
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(userData.role);
      }
      
      return userData.role === requiredRole;
    };

    useEffect(() => {
      if (!loading && (!user || !hasRequiredRole())) {
        router.push(redirectTo);
      }
    }, [loading, user, userData]);

    // Show loading state while checking authentication and role
    if (loading) {
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

    // Show fallback or nothing if user doesn't have required role
    if (!user || !hasRequiredRole()) {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  }
);

RoleProtected.displayName = "RoleProtected";
