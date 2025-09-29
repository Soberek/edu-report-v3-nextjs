import React from "react";
import { Box, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PrimaryButton } from "@/components/shared";
import { PAGE_CONSTANTS, BUTTON_LABELS } from "../constants";

interface EmptyStateProps {
  hasTasks: boolean;
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasTasks, onAddTask }) => {
  const title = hasTasks ? PAGE_CONSTANTS.EMPTY_STATE.NO_FILTERED_TASKS : PAGE_CONSTANTS.EMPTY_STATE.NO_TASKS;
  const description = hasTasks ? PAGE_CONSTANTS.EMPTY_STATE.NO_FILTERED_DESCRIPTION : PAGE_CONSTANTS.EMPTY_STATE.NO_TASKS_DESCRIPTION;

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        color: "text.secondary",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" mb={3}>
        {description}
      </Typography>
      <PrimaryButton startIcon={<Add />} onClick={onAddTask}>
        {BUTTON_LABELS.ADD_TASK}
      </PrimaryButton>
    </Box>
  );
};
