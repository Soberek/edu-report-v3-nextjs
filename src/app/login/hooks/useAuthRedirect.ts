import { useAuthRedirect as useSharedAuthRedirect } from "@/components/auth";
import { LOGIN_CONSTANTS } from "../constants";

/**
 * Login-specific auth redirect hook that uses shared implementation
 */
export const useAuthRedirect = (redirectTo?: string) => {
  return useSharedAuthRedirect(redirectTo, LOGIN_CONSTANTS.ROUTES.HOME);
};
