import dayjs from "dayjs";
import { formatDateForInput } from "@/utils/shared/dayjsUtils";

import { type TaskType } from "@/constants/tasks";

import type { Program } from "@/types";
import { Box, Button, Modal, Typography, Chip, IconButton, Paper } from "@mui/material";

import { Delete as DeleteIcon, DoneAll, Close, Edit } from "@mui/icons-material";
import { DateField } from "@mui/x-date-pickers/DateField";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

type Props = {
  task: ScheduledTaskType;
  program: Program | undefined;
  taskType: TaskType | undefined;
  updateTask: (id: string, updates: Partial<ScheduledTaskType>) => void;
  deleteTask: (id: string) => void;
  onEdit?: (task: ScheduledTaskType) => void;
};

export const Task: React.FC<Props> = ({
  task,
  // program,
  taskType,
  updateTask,
  deleteTask,
  onEdit,
}) => {
  const [openStatusChange, setOpenStatusChange] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isCompleted = task.status === "completed";

  const getTaskTypeEmoji = (taskType: TaskType["label"] | undefined) => {
    if (!taskType) return "📝";

    const emojiMap: { [key: string]: string } = {
      prelekcja: "🎤",
      warsztaty: "🛠️",
      szkolenie: "📚",
      wykład: "👨‍🏫",
      "stoisko informacyjne-edukacyjne": "🏢",
      konkurs: "🏆",
      "list intencyjny": "✉️",
      "publikacja media": "📰",
      dystrybucja: "📦",
      sprawozdanie: "📝",
      wizytacja: "👀",
      instruktaż: "🧑‍🔧",
    };

    return emojiMap[taskType] || "📝";
  };

  const handleToggleStatus = (date?: string) => {
    if (task.status === "pending") {
      if (!date) return;
      const today = dayjs(date);
      if (!today.isValid()) {
        alert("Nieprawidłowa data. Użyj formatu YYYY-MM-DD.");
        return;
      }
      updateTask(task.id, {
        taskTypeId: task.taskTypeId,
        programId: task.programId,
        dueDate: task.dueDate,
        description: task.description,
        completedDate: today.format("YYYY-MM-DD"),
        status: "completed",
      });
    }
    if (task.status === "completed") {
      updateTask(task.id, {
        taskTypeId: task.taskTypeId,
        programId: task.programId,
        dueDate: task.dueDate,
        description: task.description,
        completedDate: "",
        status: "pending",
      });
    }
  };

  const openModal = () => setOpenStatusChange(true);
  const closeModal = () => setOpenStatusChange(false);

  const { control, handleSubmit } = useForm<{ completedDate: string }>({
    defaultValues: {
      completedDate: dayjs(task.dueDate).format("YYYY-MM-DD"),
    },
  });

  const handleDeleteConfirm = () => {
    deleteTask(task.id);
    setConfirmOpen(false);
  };

  return (
    <>
      {/* Modal */}
      <Modal open={openStatusChange} onClose={closeModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: 500,
            p: 3,
            borderRadius: 3,
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" component="h2" fontWeight={600}>
              Zmień status zadania
            </Typography>
            <IconButton onClick={closeModal} size="small">
              <Close />
            </IconButton>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit((data) => {
              handleToggleStatus(data.completedDate);
              closeModal();
            })}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Controller
              name="completedDate"
              control={control}
              render={({ field }) => (
                <DateField
                  label="Data ukończenia"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? formatDateForInput(newValue) : "");
                  }}
                  format="DD-MM-YYYY"
                  fullWidth
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={closeModal}>
                Anuluj
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(45deg, #388700ff 30%, #14c947ff 90%)",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Potwierdź
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Potwierdź usunięcie"
        message={`Czy na pewno chcesz usunąć zadanie "${taskType?.label || ""}"? Tej operacji nie można cofnąć.`}
        type="delete"
      />

      {/* Ultra Compact Task Card */}
      <Paper
        elevation={isCompleted ? 1 : 2}
        sx={{
          p: 1,
          mb: 0.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: isCompleted ? "success.main" : "grey.300",
          backgroundColor: isCompleted ? "success.50" : "background.paper",
          opacity: isCompleted ? 0.85 : 1,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: isCompleted ? "success.dark" : "primary.main",
            boxShadow: 2,
            transform: "translateY(-1px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Ultra Compact Status Indicator */}
          <Box
            sx={{
              width: 16,
              height: 16,
              border: "2px solid",
              borderColor: isCompleted ? "success.main" : "grey.300",
              borderRadius: "50%",
              backgroundColor: isCompleted ? "success.main" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isCompleted && <Typography sx={{ fontSize: "8px", color: "white" }}>✓</Typography>}
          </Box>

          {/* Task Type Emoji */}
          <Typography sx={{ fontSize: "14px" }}>{getTaskTypeEmoji(taskType?.label)}</Typography>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                textDecoration: isCompleted ? "line-through" : "none",
                color: isCompleted ? "text.secondary" : "text.primary",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.8rem",
              }}
            >
              {taskType?.label} - {task.description || "Brak opisu"}
            </Typography>
          </Box>

          {/* Ultra Compact Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isCompleted && (
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{
                  color: "text.secondary",
                  fontSize: "9px",
                  textDecoration: "underline",
                }}
              >
                {dayjs(task.completedDate).format("DD.MM")}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "9px" }}>
              {dayjs(task.dueDate).format("DD.MM")}
            </Typography>

            <Chip
              label={task.status === "completed" ? "✓" : "⏳"}
              size="small"
              color={task.status === "completed" ? "success" : "warning"}
              sx={{ height: 16, fontSize: "8px", minWidth: 20 }}
            />
          </Box>

          {/* Ultra Compact Action Buttons */}
          <Box sx={{ display: "flex", gap: 0.25 }}>
            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                sx={{
                  width: 20,
                  height: 20,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  color: "white",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <Edit sx={{ fontSize: 12 }} />
              </IconButton>
            )}

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              sx={{
                width: 20,
                height: 20,
                background: "linear-gradient(45deg, #388700ff 30%, #14c947ff 90%)",
                color: "white",
                "&:hover": { opacity: 0.8 },
              }}
            >
              <DoneAll sx={{ fontSize: 12 }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              sx={{
                width: 20,
                height: 20,
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                color: "white",
                "&:hover": { opacity: 0.8 },
              }}
            >
              <DeleteIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </>
  );
};
