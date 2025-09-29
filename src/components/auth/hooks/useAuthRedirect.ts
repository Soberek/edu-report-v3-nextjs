import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { SHARED_AUTH_CONSTANTS } from "../constants";
import type { UseAuthRedirectResult } from "../types";

/**
 * Shared custom hook for handling authentication-based redirects
 * Works for both login and register pages
 */
export const useAuthRedirect = (
  redirectTo?: string,
  defaultRedirect: string = SHARED_AUTH_CONSTANTS.ROUTES.HOME
): UseAuthRedirectResult => {
  const { user } = useUser();
  const router = useRouter();
  
  const shouldRedirect = Boolean(user?.uid);
  const redirectPath = redirectTo || defaultRedirect;

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectPath);
    }
  }, [shouldRedirect, redirectPath, router]);

  return {
    shouldRedirect,
    redirectPath,
  };
};
