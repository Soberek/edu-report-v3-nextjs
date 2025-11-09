import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Notes section - Additional information and remarks
 * Section 7: "Uwagi, dodatkowe informacje"
 */
export const NotesSection: React.FC<SectionProps> = ({ control, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      7. Uwagi, dodatkowe informacje
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="additionalInfo"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Dodatkowe informacje" size="small" fullWidth multiline rows={2} disabled={isLoading} />
        )}
      />
    </Stack>
  </Box>
);

NotesSection.displayName = "NotesSection";
