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
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        backgroundColor: "#fafafa",
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {title}
        {required && (
          <Typography
            component="span"
            sx={{
              color: "error.main",
              fontSize: "1.2rem",
            }}
          >
            *
          </Typography>
        )}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};
