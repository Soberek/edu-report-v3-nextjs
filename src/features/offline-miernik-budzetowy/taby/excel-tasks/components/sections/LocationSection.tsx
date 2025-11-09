import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Location section - Institution address field
 * Section 3: "Miejsce wykonania zadania (nazwa i adres instytucji)"
 */
export const LocationSection: React.FC<SectionProps> = ({ control, errors, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      3. Miejsce wykonania zadania (nazwa i adres instytucji)
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Lokalizacja"
            size="small"
            fullWidth
            multiline
            rows={2}
            error={!!errors.address}
            helperText={errors.address?.message}
            disabled={isLoading}
          />
        )}
      />
    </Stack>
  </Box>
);

LocationSection.displayName = "LocationSection";
