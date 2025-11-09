import React from "react";
import { Box, FormControlLabel, Checkbox, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Attachments section - Attachment selection checkboxes
 * Section 8: "Załączniki"
 * Allows users to select required attachments:
 * - Lista obecności (F/PT/PZ/01/02)
 * - Rozdzielnik materiałów (F/PT/PZ/01/01)
 */
export const AttachmentsSection: React.FC<SectionProps> = ({ control, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      📎 Załączniki
    </Typography>
    <Stack spacing={1}>
      <Controller
        name="attendanceList"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} disabled={isLoading} />}
            label="Lista obecności (zał. F/PT/PZ/01/02)"
          />
        )}
      />
      <Controller
        name="rozdzielnik"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} disabled={isLoading} />}
            label="Rozdzielnik materiałów (zał. F/PT/PZ/01/01)"
          />
        )}
      />
    </Stack>
  </Box>
);

AttachmentsSection.displayName = "AttachmentsSection";
