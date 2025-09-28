import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Fade,
  Paper,
  Autocomplete,
} from "@mui/material";
import { Close, School, Group, Person, CalendarToday, Save, Edit } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import type { Contact, Program, School as SchoolType } from "@/types";
import { SchoolProgramParticipation, schoolProgramParticipationSchema } from "@/models/SchoolProgramParticipation";
import { schoolYears } from "@/constants";
import { z } from "zod";

// Form data type that matches the form structure
type FormData = z.infer<typeof schoolProgramParticipationSchema.partial().pick({
  schoolId: true,
  programId: true,
  coordinatorId: true,
  schoolYear: true,
  previousCoordinatorId: true,
  studentCount: true,
  notes: true,
})>;

interface EditDialogProps {
  open: boolean;
  participation: SchoolProgramParticipation | null;
  schools: SchoolType[];
  contacts: Contact[];
  programs: Program[];
  onClose: () => void;
  onSave: (id: string, data: Partial<SchoolProgramParticipation>) => void;
  loading: boolean;
}

export default function EditDialog({ open, participation, schools, contacts, programs, onClose, onSave, loading }: EditDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
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

  React.useEffect(() => {
    if (participation) {
      reset({
        schoolId: participation.schoolId,
        programId: participation.programId,
        coordinatorId: participation.coordinatorId,
        schoolYear: participation.schoolYear,
        previousCoordinatorId: participation.previousCoordinatorId || "",
        studentCount: participation.studentCount,
        notes: participation.notes || "",
      });
    }
  }, [participation, reset]);

  const onSubmit = (data: FormData) => {
    if (participation) {
      onSave(participation.id, data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!participation) return null;

  const schoolsMap = Object.fromEntries(schools.map((s) => [s.id, s]));
  const contactsMap = Object.fromEntries(contacts.map((c) => [c.id, c]));
  const programsMap = Object.fromEntries(programs.map((p) => [p.id, p]));

  const school = schoolsMap[participation.schoolId];
  const coordinator = contactsMap[participation.coordinatorId];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: getRandomColor(school?.name || "School"),
              fontWeight: "bold",
              fontSize: "1.2rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {getInitials(school?.name || "School")}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
              Edytuj uczestnictwo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {school?.name} - {programsMap[participation.programId]?.name}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "#666",
            "&:hover": {
              background: "rgba(0,0,0,0.04)",
              color: "#1976d2",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, background: "transparent" }}>
        <Fade in timeout={300}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mt: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                                borderRadius: 3,
                                background: "rgba(255,255,255,0.8)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: "rgba(255,255,255,0.9)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                                "&.Mui-focused": {
                                  background: "white",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
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
                                borderRadius: 3,
                                background: "rgba(255,255,255,0.8)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: "rgba(255,255,255,0.9)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                                "&.Mui-focused": {
                                  background: "white",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                              },
                            }}
                          />
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
                                borderRadius: 3,
                                background: "rgba(255,255,255,0.8)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: "rgba(255,255,255,0.9)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                                "&.Mui-focused": {
                                  background: "white",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
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
                                borderRadius: 3,
                                background: "rgba(255,255,255,0.8)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: "rgba(255,255,255,0.9)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                                "&.Mui-focused": {
                                  background: "white",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
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
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.8)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255,255,255,0.9)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1976d2",
                                borderWidth: 2,
                              },
                            },
                            "&.Mui-focused": {
                              background: "white",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1976d2",
                                borderWidth: 2,
                              },
                            },
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
                                borderRadius: 3,
                                background: "rgba(255,255,255,0.8)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: "rgba(255,255,255,0.9)",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                                "&.Mui-focused": {
                                  background: "white",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2,
                                  },
                                },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Box>

                {/* Notes */}
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Notatki"
                        multiline
                        minRows={3}
                        error={!!errors.notes}
                        helperText={errors.notes?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.8)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255,255,255,0.9)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1976d2",
                                borderWidth: 2,
                              },
                            },
                            "&.Mui-focused": {
                              background: "white",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1976d2",
                                borderWidth: 2,
                              },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              background: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Anuluj
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading || !isDirty}
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
          {loading ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
