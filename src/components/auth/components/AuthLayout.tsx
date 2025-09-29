import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { SHARED_AUTH_CONSTANTS } from "../constants";
import type { AuthLayoutProps } from "../types";

/**
 * Shared layout component for authentication pages
 * Provides consistent styling and responsive behavior
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  backgroundGradient = SHARED_AUTH_CONSTANTS.STYLES.BACKGROUND_GRADIENT,
  paperElevation = SHARED_AUTH_CONSTANTS.STYLES.PAPER_ELEVATION,
  borderRadius = SHARED_AUTH_CONSTANTS.STYLES.BORDER_RADIUS,
  minWidth = SHARED_AUTH_CONSTANTS.STYLES.MIN_WIDTH,
  maxWidth = SHARED_AUTH_CONSTANTS.STYLES.MAX_WIDTH,
  children,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: backgroundGradient,
        px: 2, // Add horizontal padding for mobile
      }}
    >
      <Paper
        elevation={paperElevation}
        sx={{
          p: { xs: 3, sm: 4 }, // Responsive padding
          borderRadius,
          minWidth,
          maxWidth,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: SHARED_AUTH_CONSTANTS.STYLES.COMPONENT_GAP,
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight={700} 
          color="primary" 
          textAlign="center" 
          gutterBottom
        >
          {title}
        </Typography>
        
        {children}
      </Paper>
    </Box>
  );
};
