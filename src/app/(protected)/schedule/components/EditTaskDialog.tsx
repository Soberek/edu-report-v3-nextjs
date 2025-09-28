import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  InputAdornment,
  Fade,
} from "@mui/material";
import {
  Edit,
  Assignment,
  School,
  CalendarToday,
  Description,
  Save,
  Cancel,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import type { ScheduledTaskType } from "@/models/ScheduledTaskSchema";
import type { Program } from "@/types";
import { TASK_TYPES } from "@/constants/tasks";

const editTaskSchema = z.object({
  taskTypeId: z.string().min(1, "Wybierz typ zadania"),
  programId: z.string().min(1, "Wybierz program"),
  dueDate: z.string().min(1, "Wybierz termin wykonania"),
  description: z.string().min(1, "Opis jest wymagany"),
  status: z.enum(["pending", "completed"]),
});

type EditTaskFormData = z.infer<typeof editTaskSchema>;

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: ScheduledTaskType | null;
  programs: Program[];
  onSave: (id: string, updates: Partial<ScheduledTaskType>) => void;
}

export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  open,
  onClose,
  task,
  programs,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      taskTypeId: "",
      programId: "",
      dueDate: "",
      description: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        taskTypeId: task.taskTypeId,
        programId: task.programId,
        dueDate: dayjs(task.dueDate).format("YYYY-MM-DD"),
        description: task.description || "",
        status: task.status,
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: EditTaskFormData) => {
    if (!task) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<ScheduledTaskType> = {
        taskTypeId: data.taskTypeId,
        programId: data.programId,
        dueDate: new Date(data.dueDate).toISOString(),
        description: data.description,
        status: data.status,
        updatedAt: new Date().toISOString(),
      };

      onSave(task.id, updates);
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
          py: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Edit />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edytuj zadanie
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Fade in timeout={300}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 0,
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 3,
              }}
            >
              {/* Task Type */}
              <FormControl fullWidth error={!!errors.taskTypeId}>
                <InputLabel>Typ zadania</InputLabel>
                <Controller
                  name="taskTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Typ zadania"
                      startAdornment={
                        <InputAdornment position="start">
                          <Assignment sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        background: "white",
                      }}
                    >
                      {Object.values(TASK_TYPES).map((taskType) => (
                        <MenuItem key={taskType.id} value={taskType.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: "1.2rem" }}>{taskType.emoji}</Typography>
                            <Typography>{taskType.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.taskTypeId && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.taskTypeId.message}
                  </Typography>
                )}
              </FormControl>

              {/* Program */}
              <FormControl fullWidth error={!!errors.programId}>
                <InputLabel>Program</InputLabel>
                <Controller
                  name="programId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Program"
                      startAdornment={
                        <InputAdornment position="start">
                          <School sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        background: "white",
                      }}
                    >
                      {programs.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {program.code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {program.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.programId && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.programId.message}
                  </Typography>
                )}
              </FormControl>

              {/* Due Date */}
              <FormControl fullWidth error={!!errors.dueDate}>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Termin wykonania"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          background: "white",
                        },
                      }}
                    />
                  )}
                />
                {errors.dueDate && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.dueDate.message}
                  </Typography>
                )}
              </FormControl>

              {/* Status */}
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Status"
                      sx={{
                        borderRadius: 2,
                        background: "white",
                      }}
                    >
                      <MenuItem value="pending">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ color: "#ff9800" }}>⏳</Typography>
                          <Typography>Oczekujące</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="completed">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ color: "#4caf50" }}>✅</Typography>
                          <Typography>Ukończone</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  )}
                />
                {errors.status && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.status.message}
                  </Typography>
                )}
              </FormControl>

              {/* Description */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <FormControl fullWidth error={!!errors.description}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Opis zadania"
                        multiline
                        rows={4}
                        placeholder="Opisz szczegóły zadania..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                              <Description sx={{ color: "#1976d2" }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: 2,
                            background: "white",
                          },
                        }}
                      />
                    )}
                  />
                  {errors.description && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.description.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          startIcon={<Cancel />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            background: "rgba(0,0,0,0.1)",
            "&:hover": { background: "rgba(0,0,0,0.2)" },
          }}
        >
          Anuluj
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
          startIcon={<Save />}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
            },
          }}
        >
          {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
