import React from "react";
import { Card, CardContent, CardActions, Typography, Box, Chip, Button, Collapse, IconButton, Avatar, Divider } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess, CalendarToday, School, Assignment, Tag } from "@mui/icons-material";
import type { TaskCardProps } from "../types";
import { formatTaskDate } from "../utils";
import { STYLE_CONSTANTS, BUTTON_LABELS } from "../constants";

export const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpansion, onEdit, onDelete }) => {
  const taskDate = formatTaskDate(task.date);
  const activityCount = task.activities.length;

  const renderTaskSummary = () => (
    <Box>
      {/* Header with Avatar and Quick Info */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: STYLE_CONSTANTS.COLORS.PRIMARY,
            width: 48,
            height: 48,
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          {task.taskNumber?.split("/")[0] || "?"}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: STYLE_CONSTANTS.COLORS.PRIMARY }}>
              {task.referenceNumber}
            </Typography>
            <Chip
              label={taskDate}
              size="small"
              icon={<CalendarToday sx={{ fontSize: "0.8rem" }} />}
              sx={{ fontSize: "0.75rem", height: 20 }}
            />
          </Box>

          <Typography variant="body1" fontWeight="medium" sx={{ mb: 1, lineHeight: 1.3 }}>
            {task.title.length > 80 ? `${task.title.substring(0, 80)}...` : task.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <School sx={{ fontSize: "1rem", color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "medium" }}>
              {task.programName}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Stats Row */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
        <Chip
          icon={<Assignment sx={{ fontSize: "0.8rem" }} />}
          label={`${activityCount} ${activityCount === 1 ? "aktywność" : "aktywności"}`}
          size="small"
          sx={{
            backgroundColor: STYLE_CONSTANTS.GRADIENTS.SUCCESS,
            color: "#2e7d32",
            fontWeight: "bold",
            fontSize: "0.75rem",
          }}
        />

        {task.activities.length > 0 && (
          <Chip
            icon={<Tag sx={{ fontSize: "0.8rem" }} />}
            label={task.activities[0].type}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontSize: "0.75rem" }}
          />
        )}

        {task.taskNumber && (
          <Chip label={`Nr: ${task.taskNumber}`} size="small" variant="outlined" sx={{ fontSize: "0.75rem", color: "text.secondary" }} />
        )}
      </Box>
    </Box>
  );

  const renderTaskDetails = () => (
    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ pb: 1 }}>
        {/* Full Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: "bold" }}>
            Pełny opis zadania
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6, color: "text.primary" }}>
            {task.title}
          </Typography>
        </Box>

        {/* Detailed Info Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mb: 3 }}>
          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: "bold" }}>
              📋 Informacje podstawowe
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Numer zadania:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {task.taskNumber || "Brak"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Nr referencyjny:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {task.referenceNumber || "Brak"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Data utworzenia:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {taskDate}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: "bold" }}>
              🎯 Program edukacyjny
            </Typography>
            <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
              {task.programName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.schoolId ? `Szkoła ID: ${task.schoolId}` : "Nie przypisano szkoły"}
            </Typography>
          </Box>
        </Box>

        {/* Activities Section */}
        {task.activities.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: "bold" }}>
              📚 Aktywności ({task.activities.length})
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(250px, 1fr))" }, gap: 2 }}>
              {task.activities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderColor: STYLE_CONSTANTS.COLORS.PRIMARY,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Chip label={activity.type} size="small" color="primary" sx={{ fontSize: "0.7rem", height: 20 }} />
                  </Box>

                  {activity.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
                      {activity.description.length > 100 ? `${activity.description.substring(0, 100)}...` : activity.description}
                    </Typography>
                  )}

                  {activity.title && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", fontWeight: "medium" }}>
                      {activity.title}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Collapse>
  );

  return (
    <Card
      sx={{
        mb: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
          borderColor: STYLE_CONSTANTS.COLORS.PRIMARY + "40",
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {renderTaskSummary()}
        {renderTaskDetails()}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 1 }}>
        <Button
          onClick={onToggleExpansion}
          size="small"
          variant="outlined"
          startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "medium",
            fontSize: "0.8rem",
            minWidth: "auto",
            px: 2,
            borderColor: "divider",
            color: "text.secondary",
            "&:hover": {
              borderColor: STYLE_CONSTANTS.COLORS.PRIMARY,
              backgroundColor: STYLE_CONSTANTS.COLORS.PRIMARY + "08",
              color: STYLE_CONSTANTS.COLORS.PRIMARY,
            },
          }}
        >
          {isExpanded ? "Zwiń" : "Rozwiń"}
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Edit sx={{ fontSize: "1rem" }} />}
            onClick={onEdit}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "medium",
              fontSize: "0.8rem",
              minWidth: "auto",
              px: 2,
              borderColor: STYLE_CONSTANTS.COLORS.PRIMARY,
              color: STYLE_CONSTANTS.COLORS.PRIMARY,
              "&:hover": {
                backgroundColor: STYLE_CONSTANTS.COLORS.PRIMARY,
                color: "white",
                transform: "scale(1.02)",
              },
            }}
          >
            {BUTTON_LABELS.EDIT}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Delete sx={{ fontSize: "1rem" }} />}
            onClick={onDelete}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "medium",
              fontSize: "0.8rem",
              minWidth: "auto",
              px: 2,
              borderColor: "error.main",
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
                transform: "scale(1.02)",
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
