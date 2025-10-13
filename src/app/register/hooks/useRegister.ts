import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuthForm } from "@/features/auth";
import { REGISTER_CONSTANTS } from "../constants";
import type { RegisterFormData } from "../utils";

/**
 * Custom hook for handling user registration using shared auth form logic
 */
export const useRegister = () => {
  const authFunction = async (data: RegisterFormData) => {
    return await createUserWithEmailAndPassword(auth, data.email, data.password);
  };

  return useAuthForm(
    authFunction,
    REGISTER_CONSTANTS.ROUTES.LOGIN,
    "Registration error"
  );
};
