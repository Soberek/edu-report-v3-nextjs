import React from "react";
import { Card, CardContent, Typography, Box, Chip, Button, Collapse, Avatar, Divider } from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess, CalendarToday, School, Assignment } from "@mui/icons-material";
import type { TaskCardProps } from "../types";
import { formatTaskDate, getMaterialsSummary, getMaterialsDetailsList, getTotalDistributedCount, getActivityTypeLabel } from "../utils";
import { STYLE_CONSTANTS } from "../constants";
import { useSchoolsMap } from "../hooks/useSchoolsMap";

export const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpansion, onEdit, onDelete }) => {
  const taskDate = formatTaskDate(task.date);
  const activityCount = task.activities.length;
  const { getSchoolName, getSchoolInfo } = useSchoolsMap();

  // Materials data
  const materialsDetails = getMaterialsDetailsList(task.activities);
  const totalMaterialsCount = getTotalDistributedCount(task.activities);

  const renderTaskSummary = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.75 }}>
      {/* Number/Avatar */}
      <Avatar
        sx={{
          bgcolor: STYLE_CONSTANTS.COLORS.PRIMARY,
          width: 36,
          height: 36,
          fontSize: "0.9rem",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        {task.taskNumber?.split("/")[0] || "?"}
      </Avatar>

      {/* Title and main info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: STYLE_CONSTANTS.COLORS.PRIMARY, minWidth: "fit-content" }}>
            {task.referenceNumber}
          </Typography>

          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ flexGrow: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {task.title}
          </Typography>

          {task.activities.length > 0 && (
            <Chip
              label={getActivityTypeLabel(task.activities[0].type)}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.65rem", height: 20, flexShrink: 0 }}
            />
          )}

          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "medium", minWidth: "fit-content", flexShrink: 0 }}>
            {task.programName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
            <School sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "medium" }}>
              {getSchoolName(task.schoolId)}
            </Typography>
          </Box>

          <Chip
            label={taskDate}
            size="small"
            icon={<CalendarToday sx={{ fontSize: "0.7rem" }} />}
            sx={{ fontSize: "0.7rem", height: 22, flexShrink: 0 }}
          />

          {totalMaterialsCount > 0 && (
            <Chip
              label={`📦 ${totalMaterialsCount}`}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 22,
                color: "success.main",
                borderColor: "success.main",
                backgroundColor: "success.50",
                flexShrink: 0,
              }}
            />
          )}

          <Chip
            label={`${activityCount}`}
            size="small"
            icon={<Assignment sx={{ fontSize: "0.7rem" }} />}
            sx={{
              backgroundColor: STYLE_CONSTANTS.GRADIENTS.SUCCESS,
              color: "#2e7d32",
              fontWeight: "bold",
              fontSize: "0.7rem",
              height: 22,
              flexShrink: 0,
            }}
          />
        </Box>
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
              {getSchoolInfo(task.schoolId)}
            </Typography>
          </Box>
        </Box>

        {/* Materials Section */}
        {materialsDetails.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: "bold" }}>
              📦 Dystrybuowane materiały ({materialsDetails.length})
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(280px, 1fr))" }, gap: 2 }}>
              {materialsDetails.map((material, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #e8f5e8",
                    borderRadius: 2,
                    bgcolor: "success.50",
                    borderLeft: "4px solid",
                    borderLeftColor: "success.main",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "success.dark" }}>
                      {material.name}
                    </Typography>
                    <Chip label={`${material.count} szt.`} size="small" color="success" sx={{ fontSize: "0.7rem", fontWeight: "bold" }} />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    Typ: {material.type}
                  </Typography>

                  {material.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
                      {material.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

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
        mb: STYLE_CONSTANTS.SPACING.SMALL,
        borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderColor: STYLE_CONSTANTS.COLORS.PRIMARY + "40",
        },
      }}
    >
      <CardContent sx={{ p: 1.5, pb: isExpanded ? 1.5 : 1.5, "&:last-child": { pb: isExpanded ? 1.5 : 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>{renderTaskSummary()}</Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
            <Button
              onClick={onToggleExpansion}
              size="small"
              variant="text"
              sx={{
                minWidth: "auto",
                p: 0.5,
                color: "text.secondary",
                "&:hover": {
                  color: STYLE_CONSTANTS.COLORS.PRIMARY,
                  backgroundColor: STYLE_CONSTANTS.COLORS.PRIMARY + "08",
                },
              }}
            >
              {isExpanded ? <ExpandLess sx={{ fontSize: "1.2rem" }} /> : <ExpandMore sx={{ fontSize: "1.2rem" }} />}
            </Button>

            <Button
              size="small"
              variant="text"
              startIcon={<Edit sx={{ fontSize: "0.9rem" }} />}
              onClick={onEdit}
              sx={{
                minWidth: "auto",
                p: 0.5,
                color: STYLE_CONSTANTS.COLORS.PRIMARY,
                fontSize: "0.75rem",
              }}
            >
              Edytuj
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<Delete sx={{ fontSize: "0.9rem" }} />}
              onClick={onDelete}
              sx={{
                minWidth: "auto",
                p: 0.5,
                color: "error.main",
                fontSize: "0.75rem",
              }}
            >
              Usuń
            </Button>
          </Box>
        </Box>

        {renderTaskDetails()}
      </CardContent>
    </Card>
  );
};
