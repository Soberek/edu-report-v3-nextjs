"use client";
import React from "react";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Stack, Alert } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { EditDialog, FormField, PrimaryButton, SecondaryButton } from "@/components/shared";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { formatDateForInput } from "@/utils/shared/dayjsUtils";
import { createEducationalTaskSchema, type CreateEducationalTaskFormData } from "../schemas/educationalTaskSchemas";
import { EducationalTask } from "@/types";
import { ActivityForm } from "./ActivityForm";
import { TaskNumberField } from "./TaskNumberField";
import { usePrograms } from "@/hooks/useProgram";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import { schoolTypes } from "@/constants";
import { suggestNextTaskNumber } from "../utils/taskNumberUtils";

interface EducationalTaskFormProps {
  mode: "create" | "edit";
  task?: EducationalTask | null;
  tasks?: EducationalTask[]; // For number validation
  onClose: () => void;
  onSave: (data: CreateEducationalTaskFormData) => Promise<void>;
  loading?: boolean;
}

export const EducationalTaskForm: React.FC<EducationalTaskFormProps> = ({ mode, task, tasks = [], onClose, onSave, loading = false }) => {
  const { user } = useUser();
  const { programs } = usePrograms();
  const { data: schools } = useFirebaseData<{ id: string; name: string; address: string; city: string; type: string[] }>(
    "schools",
    user?.uid
  );

  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string>("");

  // Calculate default task number for new tasks
  const defaultTaskNumber = React.useMemo(() => {
    if (task?.taskNumber) {
      return task.taskNumber; // For edit mode, use existing task number
    }
    // For create mode, suggest next available number for current year
    if (tasks?.length) {
      return suggestNextTaskNumber(tasks, new Date().getFullYear());
    }
    return "1/2025"; // Fallback default
  }, [task?.taskNumber, tasks]);

  const form = useForm({
    resolver: zodResolver(createEducationalTaskSchema),
    defaultValues: {
      title: task?.title || "",
      programName: task?.programName || "",
      date: task?.date || "",
      schoolId: task?.schoolId || "",
      taskNumber: defaultTaskNumber,
      referenceNumber: task?.referenceNumber || "",
      referenceId: task?.referenceId || "",
      activities: task?.activities || [
        {
          type: "presentation",
          title: "",
          description: "",
          actionCount: 1,
          audienceGroups: task
            ? []
            : [
                {
                  id: `group-${Date.now()}`,
                  name: "Grupa I",
                  type: "dorośli" as const,
                  count: 30,
                },
              ],
        },
      ],
    },
  });

  const handleFormSubmit = async (data: any) => {
    console.log("📋 Form submitted with data:", data);

    // Check for validation errors
    const formErrors = form.formState.errors;
    if (Object.keys(formErrors).length > 0) {
      console.error("❌ Form validation errors:", formErrors);
      // Don't submit if there are validation errors
      return;
    }

    try {
      await onSave(data as CreateEducationalTaskFormData);
      console.log("✅ Form saved successfully");
      form.reset();
    } catch (error) {
      console.error("❌ Form submission error:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isEdit = mode === "edit";
  const submitLoading = loading || form.formState.isSubmitting;

  return (
    <EditDialog
      open={true}
      onClose={handleClose}
      title={isEdit ? "Edytuj zadanie edukacyjne" : "Dodaj nowe zadanie edukacyjne"}
      maxWidth="lg"
      fullWidth
    >
      <FormProvider {...form}>
        <Box component="form" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Informacje podstawowe
              </Typography>
              <Stack spacing={2}>
                <FormField
                  name="title"
                  control={form.control}
                  label="Tytuł zadania"
                  placeholder="Wprowadź tytuł zadania edukacyjnego"
                  required
                  fullWidth
                />

                <FormField
                  name="programName"
                  control={form.control}
                  label="Nazwa programu"
                  type="select"
                  required
                  fullWidth
                  options={programs.map((program) => ({
                    value: program.name,
                    label: program.name,
                  }))}
                />

                <Controller
                  name="date"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? formatDateForInput(date) : "");
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                      localeText={{
                        previousMonth: "Poprzedni miesiąc",
                        nextMonth: "Następny miesiąc",
                        cancelButtonLabel: "Anuluj",
                        okButtonLabel: "OK",
                        todayButtonLabel: "Dzisiaj",
                      }}
                    />
                  )}
                />

                <TaskNumberField
                  control={form.control}
                  name="taskNumber"
                  tasks={tasks}
                  editTaskId={mode === "edit" ? task?.id : undefined}
                  label="Numer zadania"
                  helperText="Unikalny numer zadania w formacie: liczba/rok (np. 45/2025)"
                  required
                />

                <FormField
                  name="referenceNumber"
                  control={form.control}
                  label="Numer referencyjny dokumentu"
                  placeholder="np. OZiPZ.966.5.2.2025"
                  helperText="Formalny numer referencyjny dokumentu"
                  fullWidth
                  required
                />

                <FormField
                  name="referenceId"
                  control={form.control}
                  label="ID sprawy (opcjonalne)"
                  placeholder="Wprowadź ID powiązanej sprawy"
                  fullWidth
                />
              </Stack>
            </Box>

            {/* School Selection */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Wybór szkoły
              </Typography>
              <Stack spacing={2}>
                <Controller
                  name="schoolId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={schools || []}
                      getOptionLabel={(option) => `${option.name} - ${option.address}, ${option.city} (${option.type.join(", ")})`}
                      value={schools?.find((school) => school.id === field.value) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.id || "");
                        setSelectedSchoolId(newValue?.id || "");
                      }}
                      renderInput={(params) => <TextField {...params} label="Szkoła" placeholder="Wybierz szkołę" required />}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  )}
                />
              </Stack>
            </Box>

            {/* Activities */}
            <Box>
              <ActivityForm />

              {/* Display form validation errors */}
              {form.formState.errors.activities && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Błędy w aktywnościach:
                  </Typography>
                  {form.formState.errors.activities.map((activityError: any, index: number) => (
                    <Box key={index} sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Aktywność {index + 1}:</strong> {activityError.message}
                      </Typography>
                    </Box>
                  ))}
                </Alert>
              )}
            </Box>

            {/* Form Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <SecondaryButton onClick={handleClose} disabled={submitLoading}>
                Anuluj
              </SecondaryButton>
              <PrimaryButton type="submit" loading={submitLoading} startIcon={isEdit ? <Edit /> : <Add />}>
                {isEdit ? "Zaktualizuj zadanie" : "Dodaj zadanie"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </Box>
      </FormProvider>
    </EditDialog>
  );
};
