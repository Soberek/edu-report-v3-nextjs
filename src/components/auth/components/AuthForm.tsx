import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, CircularProgress, Box } from "@mui/material";
import { SHARED_AUTH_CONSTANTS } from "../constants";
import type { BaseAuthFormData, AuthFormProps } from "../types";

/**
 * Generic authentication form component
 * Can be configured for login, registration, or other auth forms
 */
export const AuthForm = <T extends BaseAuthFormData>({
  onSubmit,
  isLoading,
  disabled = false,
  schema,
  constants,
  submitButtonText,
  loadingText,
}: AuthFormProps<T>): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const handleFormSubmit = async (data: T) => {
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
        gap: SHARED_AUTH_CONSTANTS.STYLES.FORM_GAP,
      }}
    >
      <TextField
        type={SHARED_AUTH_CONSTANTS.FIELDS.EMAIL.TYPE}
        label={SHARED_AUTH_CONSTANTS.FIELDS.EMAIL.LABEL}
        variant="outlined"
        fullWidth
        disabled={isFormDisabled}
        {...register("email")}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        autoComplete={SHARED_AUTH_CONSTANTS.FIELDS.EMAIL.AUTOCOMPLETE}
      />

      <TextField
        type={SHARED_AUTH_CONSTANTS.FIELDS.PASSWORD.TYPE}
        label={SHARED_AUTH_CONSTANTS.FIELDS.PASSWORD.LABEL}
        variant="outlined"
        fullWidth
        disabled={isFormDisabled}
        {...register("password")}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        autoComplete={constants?.FIELDS?.PASSWORD?.AUTOCOMPLETE || "current-password"}
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
          py: SHARED_AUTH_CONSTANTS.STYLES.BUTTON_PADDING_Y,
          borderRadius: 2,
        }}
      >
        {isFormDisabled ? loadingText : submitButtonText}
      </Button>
    </Box>
  );
};
