import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Participants section - Target group and participant count
 * Section 5: "Grupa docelowa i liczba osób objętych zadaniem"
 */
export const ParticipantsSection: React.FC<SectionProps> = ({ control, errors, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      5. Grupa docelowa i liczba osób objętych zadaniem
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="viewerCount"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            label="Liczba osób"
            size="small"
            fullWidth
            inputProps={{ min: 0 }}
            error={!!errors.viewerCount}
            helperText={errors.viewerCount?.message}
            disabled={isLoading}
            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
          />
        )}
      />
      <Controller
        name="viewerCountDescription"
        control={control}
        render={({ field }) => <TextField {...field} label="Opis grupy" size="small" fullWidth multiline rows={2} disabled={isLoading} />}
      />
    </Stack>
  </Box>
);

ParticipantsSection.displayName = "ParticipantsSection";
