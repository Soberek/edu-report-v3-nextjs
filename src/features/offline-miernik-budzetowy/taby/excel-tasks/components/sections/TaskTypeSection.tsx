import React from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { SectionProps } from "../../types";

/**
 * Task type section - Form/Action field
 * Section 2: "Forma zadania"
 */
export const TaskTypeSection: React.FC<SectionProps> = ({ control, errors, isLoading }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
      2. Forma zadania
    </Typography>
    <Stack spacing={2}>
      <Controller
        name="taskType"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Działanie"
            size="small"
            fullWidth
            error={!!errors.taskType}
            helperText={errors.taskType?.message}
            disabled={isLoading}
          />
        )}
      />
    </Stack>
  </Box>
);

TaskTypeSection.displayName = "TaskTypeSection";
