import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

export const ProgramNameSection: React.FC<SectionProps> = ({ control, errors, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      1. Zadanie realizowane w ramach (nazwa interwencji)
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="programName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nazwa programu"
            size="small"
            fullWidth
            error={!!errors.programName}
            helperText={errors.programName?.message}
            disabled={isLoading}
          />
        )}
      />
    </Stack>
  </Box>
);

ProgramNameSection.displayName = "ProgramNameSection";
