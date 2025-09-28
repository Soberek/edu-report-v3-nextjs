import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

export interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
  color?: "primary" | "secondary" | "inherit";
  sx?: object;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = "Ładowanie...",
  fullScreen = false,
  color = "primary",
  sx = {},
}) => {
  const theme = useTheme();

  const containerSx = fullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
        zIndex: theme.zIndex.modal,
        ...sx,
      }
    : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        ...sx,
      };

  return (
    <Box sx={containerSx}>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Skeleton loading component for content
export const SkeletonLoader: React.FC<{
  lines?: number;
  height?: number;
  width?: string | number;
  sx?: object;
}> = ({ lines = 3, height = 20, width = "100%", sx = {} }) => {
  return (
    <Box sx={{ width, ...sx }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Box
          key={index}
          sx={{
            height,
            backgroundColor: "grey.200",
            borderRadius: 1,
            mb: 1,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.5 },
              "100%": { opacity: 1 },
            },
            width: index === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </Box>
  );
};
