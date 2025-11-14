import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

export const IdentifiersSection: React.FC<SectionProps> = ({ control, errors, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "text.secondary", fontSize: "0.85rem" }}>
      ℹ️ Identyfikatory dokumentu
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="reportNumber"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Numer IZRZ"
            size="small"
            fullWidth
            error={!!errors.reportNumber}
            helperText={errors.reportNumber?.message}
            disabled={isLoading}
          />
        )}
      />
      <Controller
        name="caseNumber"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Znak sprawy"
            size="small"
            fullWidth
            error={!!errors.caseNumber}
            helperText={errors.caseNumber?.message}
            disabled={isLoading}
          />
        )}
      />
    </Stack>
  </Box>
);

IdentifiersSection.displayName = "IdentifiersSection";
