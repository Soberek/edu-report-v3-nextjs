import { 
  Box, 
  Button, 
  MenuItem, 
  Select, 
  TextField, 
  FormControl, 
  InputLabel, 
  Grid,
  Paper,
  Typography,
  InputAdornment,
  Fade
} from "@mui/material";
import { 
  Assignment, 
  School, 
  CalendarToday, 
  Description, 
  Save,
  Add
} from "@mui/icons-material";
import type React from "react";
import { Controller } from "react-hook-form";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import type { ScheduledTaskDTOType } from "@/models/ScheduledTaskSchema";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";
import { useTaskForm } from "./useTaskForm";

type Props = {
  userId: string | undefined;
  createTask: (itemData: ScheduledTaskDTOType) => void;
  refetch: () => Promise<void>;
  loading: boolean;
};

export default function TaskForm({ userId, createTask, refetch, loading }: Props): React.ReactElement {
  const { control, handleSubmit, onSubmit } = useTaskForm({
    userId,
    createTask,
    refetch,
  });

  return (
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
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Grid container spacing={3}>
            {/* Task Type */}
            <Grid item xs={12} md={6}>
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
            </Grid>

            {/* Program */}
            <Grid item xs={12} md={6}>
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
            </Grid>

            {/* Due Date */}
            <Grid item xs={12} md={6}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateField
                    label="Data zaplanowana"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
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
            </Grid>

            {/* Completed Date */}
            <Grid item xs={12} md={6}>
              <Controller
                name="completedDate"
                control={control}
                render={({ field }) => (
                  <DateField
                    label="Data wykonania (opcjonalne)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
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
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
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
            </Grid>
          </Grid>

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
            <Button
              type="submit"
              disabled={loading}
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
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}
