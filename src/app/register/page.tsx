"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useRegister, useAuthRedirect } from "./hooks";
import { RegisterForm, ErrorAlert, LoginPrompt } from "./components";
import { REGISTER_CONSTANTS } from "./constants";
import type { RegisterPageProps, RegisterFormData } from "./types";

/**
 * Registration page component
 * Handles user registration with proper error handling and redirects
 */
export default function RegisterPage({ redirectTo }: RegisterPageProps = {}): React.ReactNode {
  const { submit, isLoading, error, clearError } = useRegister();
  const { shouldRedirect } = useAuthRedirect(redirectTo);

  // Don't render anything if user is already authenticated
  if (shouldRedirect) {
    return null;
  }

  const handleSubmit = async (data: RegisterFormData): Promise<void> => {
    await submit(data);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: REGISTER_CONSTANTS.STYLES.BACKGROUND_GRADIENT,
        px: 2, // Add horizontal padding for mobile
      }}
    >
      <Paper
        elevation={REGISTER_CONSTANTS.STYLES.PAPER_ELEVATION}
        sx={{
          p: { xs: 3, sm: 4 }, // Responsive padding
          borderRadius: REGISTER_CONSTANTS.STYLES.BORDER_RADIUS,
          minWidth: REGISTER_CONSTANTS.STYLES.MIN_WIDTH,
          maxWidth: 400, // Max width for better UX on large screens
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" align="center" fontWeight={700} color="primary" gutterBottom>
          {REGISTER_CONSTANTS.TEXT.TITLE}
        </Typography>

        <ErrorAlert error={error} onClose={clearError} />

        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

        <LoginPrompt />
      </Paper>
    </Box>
  );
}
