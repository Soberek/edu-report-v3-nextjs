import { useAuthRedirect as useSharedAuthRedirect } from "@/features/auth";
import { REGISTER_CONSTANTS } from "../constants";

/**
 * Registration-specific auth redirect hook that uses shared implementation
 */
export const useAuthRedirect = (redirectTo?: string) => {
  return useSharedAuthRedirect(redirectTo, REGISTER_CONSTANTS.ROUTES.HOME);
};
