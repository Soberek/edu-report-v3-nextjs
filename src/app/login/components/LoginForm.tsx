import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, CircularProgress, Box } from "@mui/material";
import { loginFormSchema } from "../utils";
import { LOGIN_CONSTANTS } from "../constants";
import type { LoginFormData } from "../types";

interface LoginFormProps {
  readonly onSubmit: (data: LoginFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly disabled?: boolean;
}

/**
 * Reusable login form component
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, disabled = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: LoginFormData) => {
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
        type={LOGIN_CONSTANTS.FIELDS.EMAIL.TYPE}
        label={LOGIN_CONSTANTS.FIELDS.EMAIL.LABEL}
        variant="outlined"
        fullWidth
        disabled={isFormDisabled}
        {...register("email")}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        autoComplete={LOGIN_CONSTANTS.FIELDS.EMAIL.AUTOCOMPLETE}
      />

      <TextField
        type={LOGIN_CONSTANTS.FIELDS.PASSWORD.TYPE}
        label={LOGIN_CONSTANTS.FIELDS.PASSWORD.LABEL}
        variant="outlined"
        fullWidth
        disabled={isFormDisabled}
        {...register("password")}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        autoComplete={LOGIN_CONSTANTS.FIELDS.PASSWORD.AUTOCOMPLETE}
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
          py: LOGIN_CONSTANTS.STYLES.BUTTON_PADDING_Y,
          borderRadius: 2,
        }}
      >
        {isFormDisabled ? LOGIN_CONSTANTS.TEXT.SUBMIT_LOADING : LOGIN_CONSTANTS.TEXT.SUBMIT_BUTTON}
      </Button>
    </Box>
  );
};
