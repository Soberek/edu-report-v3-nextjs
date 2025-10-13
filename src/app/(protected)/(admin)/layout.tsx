"use client";

import { RoleProtected } from "@/features/auth";
import { UserRole } from "@/types/user";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout - protects all routes under (admin) folder
 * Only users with ADMIN role can access these routes
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleProtected 
      requiredRole={UserRole.ADMIN} 
      redirectTo="/"
      loadingMessage="Sprawdzanie uprawnień administratora..."
    >
      {children}
    </RoleProtected>
  );
}
