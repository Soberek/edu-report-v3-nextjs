import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Date section - Task completion date field
 * Section 4: "Termin wykonania zadania"
 * Format: DD.MM.YYYY
 */
export const DateSection: React.FC<SectionProps> = ({ control, errors, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      4. Termin wykonania zadania
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="dateInput"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Data (DD.MM.YYYY)"
            placeholder="np. 08.11.2024"
            size="small"
            fullWidth
            error={!!errors.dateInput}
            helperText={errors.dateInput?.message || "Format: DD.MM.YYYY"}
            disabled={isLoading}
          />
        )}
      />
    </Stack>
  </Box>
);

DateSection.displayName = "DateSection";
