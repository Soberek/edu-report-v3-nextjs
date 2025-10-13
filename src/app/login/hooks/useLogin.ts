import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuthForm } from "@/features/auth";
import { LOGIN_CONSTANTS } from "../constants";
import type { LoginFormData } from "../utils";

/**
 * Custom hook for handling user login using shared auth form logic
 */
export const useLogin = () => {
  const authFunction = async (data: LoginFormData) => {
    return await signInWithEmailAndPassword(auth, data.email, data.password);
  };

  return useAuthForm(
    authFunction,
    LOGIN_CONSTANTS.ROUTES.HOME,
    "Login error"
  );
};
