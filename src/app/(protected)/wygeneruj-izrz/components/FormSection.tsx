import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import type { FormSectionProps } from "../types";

export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children, 
  required = false 
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 1.5,
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          elevation: 2,
          borderColor: "#1976d2",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.95rem",
        }}
      >
        {title}
        {required && (
          <Typography
            component="span"
            sx={{
              color: "error.main",
              fontSize: "1rem",
              ml: 0.5,
            }}
          >
            *
          </Typography>
        )}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {children}
      </Box>
    </Paper>
  );
};
