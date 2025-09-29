import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, CircularProgress, Box } from "@mui/material";
import { registerFormSchema } from "../utils";
import { REGISTER_CONSTANTS } from "../constants";
import type { RegisterFormData } from "../types";

interface RegisterFormProps {
  readonly onSubmit: (data: RegisterFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly disabled?: boolean;
}

/**
 * Reusable registration form component
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, disabled = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    clearErrors();
    await onSubmit(data);
  };

  const isFormDisabled = isLoading || isSubmitting || disabled;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        type={REGISTER_CONSTANTS.FIELDS.EMAIL.TYPE}
        label={REGISTER_CONSTANTS.FIELDS.EMAIL.LABEL}
        variant="outlined"
        fullWidth
        disabled={isFormDisabled}
        {...register("email")}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        autoComplete="email"
      />

      <TextField
        type={REGISTER_CONSTANTS.FIELDS.PASSWORD.TYPE}
        label={REGISTER_CONSTANTS.FIELDS.PASSWORD.LABEL}
        variant="outlined"
        fullWidth
        disabled={isFormDisabled}
        {...register("password")}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isFormDisabled}
        fullWidth
        startIcon={isFormDisabled ? <CircularProgress size={20} /> : null}
        sx={{
          fontWeight: 600,
          fontSize: "1rem",
          py: 1.5,
          borderRadius: 2,
        }}
      >
        {isFormDisabled ? REGISTER_CONSTANTS.TEXT.SUBMIT_LOADING : REGISTER_CONSTANTS.TEXT.SUBMIT_BUTTON}
      </Button>
    </Box>
  );
};
