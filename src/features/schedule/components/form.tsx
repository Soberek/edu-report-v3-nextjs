import React from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  InputAdornment,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Assignment, School, CalendarToday, Description, Save, Edit, Cancel } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { formatDateForInput } from "@/utils/dayjsUtils";
import dayjs from "dayjs";
import { useTaskForm } from "../hooks/useTaskForm";
import type { TaskFormProps } from "../types";
import type { CreateTaskFormData, EditTaskFormData } from "../schemas/taskSchemas";

interface Props extends TaskFormProps {
  createTask?: (itemData: CreateTaskFormData) => Promise<void>;
}

export default function TaskForm({ mode, task, onClose, onSave, userId, createTask, loading = false }: Props): React.ReactElement {
  const { control, handleSubmit, formState, isFormValid } = useTaskForm({
    mode,
    task,
    userId,
    onSubmit: async (data) => {
      if (mode === "edit" && task) {
        onSave(task.id, data as Partial<EditTaskFormData>);
      } else if (mode === "create" && createTask) {
        await createTask(data as CreateTaskFormData);
      }
    },
  });

  const isEditMode = mode === "edit";
  const isOpen = isEditMode ? !!task : true;

  const formContent = (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
            }}
          >
            {/* Task Type */}
            <Box>
              <Controller
                name="taskTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Typ zadania</InputLabel>
                    <Select
                      {...field}
                      label="Typ zadania"
                      startAdornment={
                        <InputAdornment position="start">
                          <Assignment sx={{ color: "#666" }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        background: "white",
                      }}
                    >
                      {Object.entries(TASK_TYPES).map(([key, value]) => (
                        <MenuItem key={key} value={value.id}>
                          {value.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Program */}
            <Box>
              <Controller
                name="programId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Program</InputLabel>
                    <Select
                      {...field}
                      label="Program"
                      startAdornment={
                        <InputAdornment position="start">
                          <School sx={{ color: "#666" }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        background: "white",
                      }}
                    >
                      {programs.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.code} {program.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Due Date */}
            <Box>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateField
                    label="Data zaplanowana"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? formatDateForInput(newValue) : "");
                    }}
                    format="DD-MM-YYYY"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: "#666" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "white",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Completed Date */}
            <Box>
              <Controller
                name="completedDate"
                control={control}
                render={({ field }) => (
                  <DateField
                    label="Data wykonania (opcjonalne)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? formatDateForInput(newValue) : "");
                    }}
                    format="DD-MM-YYYY"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: "#666" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "white",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Description */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Opis zadania"
                    multiline
                    rows={3}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                          <Description sx={{ color: "#666" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "white",
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Submit Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
              pt: 3,
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {isEditMode ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={onClose}
                  disabled={loading}
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
                  type="submit"
                  disabled={loading || !isFormValid}
                  variant="contained"
                  startIcon={<Save />}
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
                  {loading ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
              </Box>
            ) : (
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                variant="contained"
                startIcon={<Save />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "rgba(0,0,0,0.12)",
                    color: "rgba(0,0,0,0.26)",
                  },
                }}
              >
                {loading ? "Zapisywanie..." : "Zaplanuj zadanie"}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Fade>
  );

  if (isEditMode) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
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
        <DialogContent sx={{ p: 0 }}>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return formContent;
}
