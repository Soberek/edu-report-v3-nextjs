"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Stack, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// import { Add, Delete } from "@mui/icons-material";
import { EditDialog, PrimaryButton, SecondaryButton } from "@/components/shared";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { formatDateForInput } from "@/utils/shared/dayjsUtils";
import { z } from "zod";
import { EducationalTask, AudienceGroup } from "@/types";
import { usePrograms } from "@/hooks/useProgram";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";

// Simplified schema
const simplifiedTaskSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  programName: z.string().min(1, "Program jest wymagany"),
  date: z.string().min(1, "Data jest wymagana"),
  schoolId: z.string().min(1, "Szkoła jest wymagana"),
  taskNumber: z.string().min(1, "Numer zadania jest wymagany"),
  referenceNumber: z.string().min(1, "Numer referencyjny jest wymagany"),
  // Simplified activity - single activity with basic fields
  activityType: z.string().min(1, "Typ aktywności jest wymagany"),
  activityTitle: z.string().min(1, "Tytuł aktywności jest wymagany"),
  activityDescription: z.string().min(1, "Opis aktywności jest wymagany"),
  audienceCount: z.coerce.number().min(1, "Liczba odbiorców musi być większa od 0"),
  // Optional fields
  materials: z.string().optional(),
  mediaLink: z.string().optional(),
});

type SimplifiedTaskData = z.infer<typeof simplifiedTaskSchema>;

interface SimplifiedEducationalTaskFormProps {
  mode: "create" | "edit";
  task?: EducationalTask | null;
  onClose: () => void;
  onSave: (data: SimplifiedTaskData) => Promise<void>;
  loading?: boolean;
}

const ACTIVITY_TYPES = [
  { value: "prelekcja", label: "Prelekcja" },
  { value: "warsztaty", label: "Warsztaty" },
  { value: "dystrybucja", label: "Dystrybucja materiałów" },
  { value: "publikacja", label: "Publikacja w mediach" },
  { value: "stoisko", label: "Stoisko informacyjne" },
];

export const SimplifiedEducationalTaskForm: React.FC<SimplifiedEducationalTaskFormProps> = ({
  mode,
  task,
  onClose,
  onSave,
  loading = false,
}) => {
  const { user } = useUser();
  const { programs } = usePrograms();
  const { data: schools } = useFirebaseData<{ id: string; name: string; address: string; city: string; type: string[] }>(
    "schools",
    user?.uid
  );

  const form = useForm({
    resolver: zodResolver(simplifiedTaskSchema),
    defaultValues: {
      title: task?.title || "",
      programName: task?.programName || "",
      date: task?.date || "",
      schoolId: task?.schoolId || "",
      taskNumber: task?.taskNumber || "1/2025",
      referenceNumber: task?.referenceNumber || "",
      activityType: task?.activities?.[0]?.type || "prelekcja",
      activityTitle: task?.activities?.[0]?.title || "",
      activityDescription: task?.activities?.[0]?.description || "",
      audienceCount: (() => {
        const activity = task?.activities?.[0];
        if (activity && "audienceGroups" in activity) {
          return activity.audienceGroups?.reduce((sum: number, group: AudienceGroup) => sum + group.count, 0) || 0;
        }
        return 0;
      })(),
      materials: (() => {
        const activity = task?.activities?.[0];
        if (activity && "materials" in activity) {
          return activity.materials?.[0]?.name || "";
        }
        return "";
      })(),
      mediaLink: (() => {
        const activity = task?.activities?.[0];
        if (activity && "media" in activity) {
          return activity.media?.link || "";
        }
        return "";
      })(),
    },
  });

  const handleFormSubmit = async (data: SimplifiedTaskData) => {
    try {
      await onSave(data);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
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
      maxWidth="md"
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
                <TextField
                  {...form.register("title")}
                  label="Tytuł zadania"
                  placeholder="Wprowadź tytuł zadania edukacyjnego"
                  required
                  fullWidth
                  error={!!form.formState.errors.title}
                  helperText={form.formState.errors.title?.message}
                />

                <FormControl fullWidth error={!!form.formState.errors.programName}>
                  <InputLabel required>Nazwa programu</InputLabel>
                  <Select {...form.register("programName")} label="Nazwa programu">
                    {programs.map((program) => (
                      <MenuItem key={program.id} value={program.name}>
                        {program.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {form.formState.errors.programName && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {form.formState.errors.programName.message}
                    </Typography>
                  )}
                </FormControl>

                <DatePicker
                  label="Data"
                  value={form.watch("date") ? dayjs(form.watch("date")) : null}
                  onChange={(date) => {
                    form.setValue("date", date ? formatDateForInput(date) : "");
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!form.formState.errors.date,
                      helperText: form.formState.errors.date?.message,
                    },
                  }}
                />

                <TextField
                  {...form.register("taskNumber")}
                  label="Numer zadania"
                  placeholder="np. 1/2025"
                  required
                  fullWidth
                  error={!!form.formState.errors.taskNumber}
                  helperText={form.formState.errors.taskNumber?.message}
                />

                <TextField
                  {...form.register("referenceNumber")}
                  label="Numer referencyjny"
                  placeholder="np. OZiPZ.966.5.2.2025"
                  required
                  fullWidth
                  error={!!form.formState.errors.referenceNumber}
                  helperText={form.formState.errors.referenceNumber?.message}
                />

                <FormControl fullWidth error={!!form.formState.errors.schoolId}>
                  <InputLabel required>Szkoła</InputLabel>
                  <Select {...form.register("schoolId")} label="Szkoła">
                    {schools?.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name} - {school.address}, {school.city}
                      </MenuItem>
                    ))}
                  </Select>
                  {form.formState.errors.schoolId && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {form.formState.errors.schoolId.message}
                    </Typography>
                  )}
                </FormControl>
              </Stack>
            </Box>

            {/* Activity Information */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Informacje o aktywności
              </Typography>
              <Stack spacing={2}>
                <FormControl fullWidth error={!!form.formState.errors.activityType}>
                  <InputLabel required>Typ aktywności</InputLabel>
                  <Select {...form.register("activityType")} label="Typ aktywności">
                    {ACTIVITY_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {form.formState.errors.activityType && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {form.formState.errors.activityType.message}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  {...form.register("activityTitle")}
                  label="Tytuł aktywności"
                  required
                  fullWidth
                  error={!!form.formState.errors.activityTitle}
                  helperText={form.formState.errors.activityTitle?.message}
                />

                <TextField
                  {...form.register("activityDescription")}
                  label="Opis aktywności"
                  multiline
                  rows={3}
                  required
                  fullWidth
                  error={!!form.formState.errors.activityDescription}
                  helperText={form.formState.errors.activityDescription?.message}
                />

                <TextField
                  {...form.register("audienceCount")}
                  label="Liczba odbiorców"
                  type="number"
                  required
                  fullWidth
                  error={!!form.formState.errors.audienceCount}
                  helperText={form.formState.errors.audienceCount?.message}
                />

                {/* Conditional fields based on activity type */}
                {form.watch("activityType") === "dystrybucja" && (
                  <TextField
                    {...form.register("materials")}
                    label="Materiały do dystrybucji"
                    placeholder="Opisz materiały które zostały rozdane"
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}

                {form.watch("activityType") === "publikacja" && (
                  <TextField {...form.register("mediaLink")} label="Link do publikacji" placeholder="https://..." fullWidth />
                )}
              </Stack>
            </Box>

            {/* Display form validation errors */}
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert severity="error">
                <Typography variant="subtitle2" fontWeight="bold">
                  Błędy w formularzu:
                </Typography>
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <Typography key={field} variant="body2" sx={{ mt: 1 }}>
                    <strong>{field}:</strong> {error?.message}
                  </Typography>
                ))}
              </Alert>
            )}

            {/* Form Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <SecondaryButton onClick={handleClose} disabled={submitLoading}>
                Anuluj
              </SecondaryButton>
              <PrimaryButton type="submit" loading={submitLoading}>
                {isEdit ? "Zaktualizuj zadanie" : "Dodaj zadanie"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </Box>
      </FormProvider>
    </EditDialog>
  );
};
