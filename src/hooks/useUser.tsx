// Hook do łatwego użycia kontekstu w innych komponentach
"use client";
import { createContext, useContext } from "react";
import type { UserContextType } from "@/types/user";
import { UserRole } from "@/types/user";

export const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  hasRole: () => false,
});

export function useUser() {
  return useContext(UserContext);
}

// Helper hook to check if user is admin
export function useIsAdmin(): boolean {
  const { isAdmin } = useUser();
  return isAdmin;
}

// Helper hook to check specific role
export function useHasRole(role: UserRole): boolean {
  const { hasRole } = useUser();
  return hasRole(role);
}
