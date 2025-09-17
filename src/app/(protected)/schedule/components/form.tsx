import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        my: 2,
        mx: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Controller
        name="taskTypeId"
        control={control}
        render={({ field }) => (
          <Select {...field} label="Typ zadania">
            {Object.entries(TASK_TYPES).map(([key, value]) => (
              <MenuItem key={key} value={value.id}>
                {value.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="programId"
        control={control}
        render={({ field }) => (
          <Select {...field} label="Program">
            {programs.map((program) => (
              <MenuItem key={program.id} value={program.id}>
                {program.code} {program.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />

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
          />
        )}
      />

      <Controller
        name="completedDate"
        control={control}
        render={({ field }) => (
          <DateField
            label="Data wykonania"
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => {
              field.onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
            }}
            format="DD-MM-YYYY"
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => <TextField {...field} label="Opis zadania" multiline rows={3} />}
      />
      <Button type="submit" disabled={loading}>
        Zaplanuj zadanie
      </Button>
    </Box>
  );
}
