import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | undefined;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({ 
  icon, 
  label, 
  value, 
  color = "primary" 
}) => {
  const theme = useTheme();
  
  const getColorValue = () => {
    switch (color) {
      case "secondary":
        return theme.palette.secondary;
      case "success":
        return theme.palette.success;
      case "warning":
        return theme.palette.warning;
      case "error":
        return theme.palette.error;
      default:
        return theme.palette.primary;
    }
  };
  
  const colorValue = getColorValue();
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 3,
        backgroundColor: `${colorValue.main}15`,
        borderRadius: 2,
        border: `1px solid ${colorValue.main}30`,
        minWidth: 250,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: `${colorValue.main}25`,
          transform: "translateY(-2px)",
          boxShadow: `0 4px 12px ${colorValue.main}30`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          backgroundColor: colorValue.main,
          borderRadius: "50%",
          fontSize: "1.5rem",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.75rem",
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: "bold",
            color: colorValue.main,
            lineHeight: 1.2,
          }}
        >
          {value ?? 0}
        </Typography>
      </Box>
    </Box>
  );
});

StatsCard.displayName = "StatsCard";
