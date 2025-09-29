import React from "react";
import { Card, CardContent, CardActions, Typography, Box, Chip, Button, Collapse, IconButton } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess, CalendarToday, Person, Group } from "@mui/icons-material";
import type { TaskCardProps } from "../types";
import { formatTaskDate } from "../utils";
import { STYLE_CONSTANTS, BUTTON_LABELS } from "../constants";

export const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpansion, onEdit, onDelete }) => {
  const taskDate = formatTaskDate(task.date);
  const activityCount = task.activities.length;

  const renderTaskSummary = () => (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <CalendarToday sx={{ fontSize: "1rem", color: STYLE_CONSTANTS.COLORS.PRIMARY }} />
        <Typography variant="body2" color="text.secondary">
          {taskDate}
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {task.referenceNumber} - {task.programName}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Chip
          label={`${activityCount} aktywności`}
          size="small"
          sx={{
            backgroundColor: STYLE_CONSTANTS.GRADIENTS.SUCCESS,
            color: "#2e7d32",
            fontWeight: "bold",
          }}
        />
        {task.activities.length > 0 && <Chip label={task.activities[0].type} size="small" variant="outlined" color="primary" />}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {task.title.length > 150 ? `${task.title.substring(0, 150)}...` : task.title}
      </Typography>
    </Box>
  );

  const renderTaskDetails = () => (
    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
      <Box sx={{ pt: 2, borderTop: "1px solid #e0e0e0" }}>
        <Typography variant="h6" gutterBottom>
          Szczegóły zadania
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Numer zadania
            </Typography>
            <Typography variant="body2">{task.taskNumber || "Brak"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Numer referencyjny
            </Typography>
            <Typography variant="body2">{task.referenceNumber || "Brak"}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Aktywności
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {task.activities.map((activity, index) => (
              <Chip key={index} label={activity.type} size="small" variant="outlined" sx={{ mb: 1 }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Collapse>
  );

  return (
    <Card
      sx={{
        mb: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        {renderTaskSummary()}
        {renderTaskDetails()}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <IconButton
          onClick={onToggleExpansion}
          size="small"
          sx={{
            color: STYLE_CONSTANTS.COLORS.PRIMARY,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.1)",
            },
          }}
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>

        <Box>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{
              mr: 1,
              color: STYLE_CONSTANTS.COLORS.PRIMARY,
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            {BUTTON_LABELS.EDIT}
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={onDelete}
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.1)",
              },
            }}
          >
            {BUTTON_LABELS.DELETE}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};
