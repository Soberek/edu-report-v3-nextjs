"use client";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
  Fade,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { School, Group, Person, CalendarToday, Save, Add } from "@mui/icons-material";
import { usePrograms } from "@/hooks/useProgram";
import { useForm, Controller } from "react-hook-form";
import type { Contact, Program, School as SchoolType } from "@/types";
import { schoolYears } from "@/constants";
import { useMemo, useState } from "react";

import { SchoolProgramParticipationTable } from "./components/table";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";

import {
  schoolProgramParticipationDTOSchema,
  schoolProgramParticipationSchema,
  SchoolProgramParticipation,
  SchoolProgramParticipationDTO,
} from "@/models/SchoolProgramParticipation";

export default function SchoolsProgramParticipation() {
  const userContext = useUser();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const { data: schools, loading: schoolsLoading } = useFirebaseData<SchoolType>("schools", userContext.user?.uid);
  const { data: contacts, loading: contactsLoading } = useFirebaseData<Contact>("contacts", userContext.user?.uid);
  const { programs, loading: programsLoading } = usePrograms();

  const {
    data: schoolProgramParticipation,
    loading: schoolProgramParticipationLoading,
    createItem: createSchoolProgramParticipation,
    error: schoolProgramParticipationError,
  } = useFirebaseData<SchoolProgramParticipation>("school-program-participation", userContext.user?.uid);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SchoolProgramParticipationDTO>({
    defaultValues: {
      schoolId: "",
      programId: "",
      coordinatorId: "",
      schoolYear: "2025/2026",
      previousCoordinatorId: "",
      studentCount: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: SchoolProgramParticipationDTO) => {
    try {
      const parsed = schoolProgramParticipationDTOSchema.safeParse(data);

      if (!parsed.success) {
        setSnackbar({
          open: true,
          type: "error",
          message: "Błąd walidacji danych. Sprawdź wszystkie pola.",
        });
        return;
      }

      await createSchoolProgramParticipation({ ...parsed.data });

      setSnackbar({
        open: true,
        type: "success",
        message: "Uczestnictwo szkoły w programie zostało dodane pomyślnie.",
      });

      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Wystąpił błąd podczas zapisywania danych.",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const schoolsMap: Record<string, SchoolType> = useMemo(() => Object.fromEntries(schools.map((s) => [s.id, s])), [schools]);

  const contactsMap: Record<string, Contact> = useMemo(() => Object.fromEntries(contacts.map((c) => [c.id, c])), [contacts]);

  const programsMap: Record<string, Program> = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);

  const isLoading = schoolsLoading || contactsLoading || programsLoading;

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Ładowanie danych...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Szkoły w Programie
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Zarządzaj uczestnictwem szkół w programach edukacyjnych
        </Typography>
      </Box>

      {/* Error Alert */}
      {schoolProgramParticipationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Błąd podczas ładowania danych: {schoolProgramParticipationError}
        </Alert>
      )}

      {/* Form Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            p: 3,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Add sx={{ color: "#1976d2" }} />
            Dodaj nowe uczestnictwo
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Fade in timeout={300}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
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
                {/* School Selection */}
                <Box>
                  <Controller
                    name="schoolId"
                    control={control}
                    rules={{ required: "Szkoła jest wymagana." }}
                    render={({ field }) => (
                      <Autocomplete
                        options={schools}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={field.value ? schoolsMap[field.value] : null}
                        onChange={(_, value) => field.onChange(value?.id)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Szkoła"
                            helperText={errors.schoolId?.message}
                            error={!!errors.schoolId}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <School sx={{ color: "#666", mr: 1 }} />,
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
                    )}
                  />
                </Box>
                {/* Program Selection */}
                <Box>
                  <Controller
                    name="programId"
                    control={control}
                    rules={{ required: "Program jest wymagany." }}
                    render={({ field }) => (
                      <Autocomplete
                        value={field.value ? programsMap[field.value] : null}
                        onChange={(_, value) => field.onChange(value?.id)}
                        options={programs}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Program Uczestnictwa"
                            error={!!errors.programId}
                            helperText={errors.programId?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Group sx={{ color: "#666", mr: 1 }} />,
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                background: "white",
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.code || "Brak kodu"} - {option.name}
                          </li>
                        )}
                      />
                    )}
                  />
                </Box>
                {/* Coordinator Selection */}
                <Box>
                  <Controller
                    name="coordinatorId"
                    control={control}
                    rules={{ required: "Koordynator jest wymagany." }}
                    render={({ field }) => (
                      <Autocomplete
                        value={field.value ? contactsMap[field.value] : null}
                        onChange={(_, value) => field.onChange(value?.id)}
                        options={contacts}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.firstName} {option.lastName}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Koordynator"
                            error={!!errors.coordinatorId}
                            helperText={errors.coordinatorId?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Person sx={{ color: "#666", mr: 1 }} />,
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
                    )}
                  />
                </Box>
                {/* School Year Selection */}
                <Box>
                  <Controller
                    name="schoolYear"
                    control={control}
                    rules={{ required: "Rok szkolny jest wymagany." }}
                    render={({ field }) => (
                      <Autocomplete
                        value={field.value || null}
                        onChange={(_, value) => field.onChange(value)}
                        getOptionLabel={(option) => `${option}`}
                        options={schoolYears}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Rok szkolny"
                            error={!!errors.schoolYear}
                            helperText={errors.schoolYear?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <CalendarToday sx={{ color: "#666", mr: 1 }} />,
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
                    )}
                  />
                </Box>

                {/* Student Count */}
                <Box>
                  <Controller
                    name="studentCount"
                    control={control}
                    rules={{ required: "Liczba uczniów jest wymagana.", min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Liczba uczniów"
                        type="number"
                        error={!!errors.studentCount}
                        helperText={errors.studentCount?.message}
                        InputProps={{
                          startAdornment: <Group sx={{ color: "#666", mr: 1 }} />,
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
                {/* Notes */}
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Controller
                    name="notes"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Notatki"
                        multiline
                        minRows={4}
                        error={!!errors.notes}
                        helperText={errors.notes?.message}
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

                {/* Previous Coordinator */}
                <Box>
                  <Controller
                    name="previousCoordinatorId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        value={field.value ? contactsMap[field.value] : null}
                        onChange={(_, value) => field.onChange(value?.id)}
                        options={contacts}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.firstName} {option.lastName}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Poprzedni Koordynator (opcjonalne)"
                            error={!!errors.previousCoordinatorId}
                            helperText={errors.previousCoordinatorId?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <Person sx={{ color: "#666", mr: 1 }} />,
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
                <Button
                  type="submit"
                  disabled={schoolProgramParticipationLoading || !isDirty}
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
                  {schoolProgramParticipationLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Zapisywanie...
                    </>
                  ) : (
                    "Zapisz uczestnictwo"
                  )}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Paper>

      {/* Table Section */}
      <SchoolProgramParticipationTable
        participations={schoolProgramParticipation || []}
        schoolsMap={schoolsMap}
        contactsMap={contactsMap}
        programsMap={programsMap}
        errorMessage={schoolProgramParticipationError}
        loading={schoolProgramParticipationLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
