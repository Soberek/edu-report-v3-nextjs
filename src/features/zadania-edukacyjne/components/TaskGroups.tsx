import React from "react";
import { Box, Typography, Chip } from "@mui/material";
// import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { TaskCard } from "./TaskCard";
import type { TaskGroupProps } from "../types";
import { getMonthName, getTaskCountText } from "../utils";
import { STYLE_CONSTANTS, PAGE_CONSTANTS } from "../constants";

export const TaskGroups: React.FC<TaskGroupProps> = ({ group, expandedTasks, onToggleExpansion, onEdit, onDelete }) => {
  const monthName = getMonthName(group.month - 1);
  // const taskCountText = getTaskCountText(group.tasks.length);

  return (
    <Box sx={{ mb: STYLE_CONSTANTS.SPACING.LARGE }}>
      {/* Month/Year Header */}
      <Box
        sx={{
          p: STYLE_CONSTANTS.SPACING.MEDIUM,
          mb: STYLE_CONSTANTS.SPACING.SMALL,
          backgroundColor: STYLE_CONSTANTS.COLORS.HEADER_BACKGROUND,
          color: "white",
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {monthName} {group.year}
        </Typography>
        <Chip
          label={`${group.tasks.length} ${PAGE_CONSTANTS.GROUP_HEADER.TASKS_COUNT}`}
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>

      {/* Tasks */}
      <Box>
        {group.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isExpanded={expandedTasks.has(task.id)}
            onToggleExpansion={() => onToggleExpansion(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </Box>
    </Box>
  );
};
