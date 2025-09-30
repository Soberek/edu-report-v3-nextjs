"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useLogin, useAuthRedirect } from "./hooks";
import { LoginForm, ErrorAlert, RegisterPrompt } from "./components";
import { LOGIN_CONSTANTS } from "./constants";
import type { LoginPageProps } from "./types";
import type { LoginFormData } from "./utils";

/**
 * Login page component
 * Handles user authentication with proper error handling and redirects
 */
export default function LoginPage({ redirectTo }: LoginPageProps = {}): React.ReactNode {
  const { submit, isLoading, error, clearError } = useLogin();
  const { shouldRedirect } = useAuthRedirect(redirectTo);

  // Don't render anything if user is already authenticated
  if (shouldRedirect) {
    return null;
  }

  const handleSubmit = async (data: LoginFormData): Promise<void> => {
    await submit(data);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: LOGIN_CONSTANTS.STYLES.BACKGROUND_GRADIENT,
        px: 2, // Add horizontal padding for mobile
      }}
    >
      <Paper
        elevation={LOGIN_CONSTANTS.STYLES.PAPER_ELEVATION}
        sx={{
          p: { xs: 3, sm: 4 }, // Responsive padding
          borderRadius: LOGIN_CONSTANTS.STYLES.BORDER_RADIUS,
          minWidth: LOGIN_CONSTANTS.STYLES.MIN_WIDTH,
          maxWidth: LOGIN_CONSTANTS.STYLES.MAX_WIDTH,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary" textAlign="center" gutterBottom>
          {LOGIN_CONSTANTS.TEXT.TITLE}
        </Typography>

        <ErrorAlert error={error} onClose={clearError} />

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

        <RegisterPrompt />
      </Paper>
    </Box>
  );
}
