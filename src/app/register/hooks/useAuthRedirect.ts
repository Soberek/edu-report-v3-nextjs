import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { REGISTER_CONSTANTS } from "../constants";
import type { UseAuthRedirectResult } from "../types";

/**
 * Custom hook for handling authentication-based redirects
 */
export const useAuthRedirect = (redirectTo?: string): UseAuthRedirectResult => {
  const { user } = useUser();
  const router = useRouter();
  
  const shouldRedirect = Boolean(user?.uid);
  const redirectPath = redirectTo || REGISTER_CONSTANTS.ROUTES.HOME;

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
