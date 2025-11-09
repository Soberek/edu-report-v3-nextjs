import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Scope section - Task description and participation scope
 * Section 6: "Zakres uczestnictwa (czynności wykonane w trakcie realizacji zadania)"
 * Features auto-expanding textarea with minRows={3}
 */
export const ScopeSection: React.FC<SectionProps> = ({ control, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      6. Zakres uczestnictwa (czynności wykonane w trakcie realizacji zadania)
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="taskDescription"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Opis zadania" size="small" fullWidth multiline minRows={3} disabled={isLoading} />
        )}
      />
    </Stack>
  </Box>
);

ScopeSection.displayName = "ScopeSection";
