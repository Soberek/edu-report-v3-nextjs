"use client";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  CardContent,
} from "@mui/material";
import { useRaportDocumentGenerator } from "./hooks/useRaportDocumentGenerator";

import type { School } from "@/types";
import { useUser } from "@/hooks/useUser";

import { useFirebaseData } from "@/hooks/useFirebaseData";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import { useForm, Controller } from "react-hook-form";
import { OPISY_ZADAN } from "@/constants/opisy-zadan";
type Templates = "izrz.docx" | "lista_obecnosci.docx";

type FormValues = {
  caseNumber: string;
  reportNumber: string;
  programName: string;
  taskType: string;
  address: string;
  dateInput: string;
  viewerCount: number;
  viewerCountDescription: string;
  taskDescription: string;
  additionalInfo: string;
  attendanceList: boolean;
  rozdzielnik: boolean;
  templateFile: File | null;
};

const DEFAULT_OPIS_LICZBY_WIDZOW = `Grupa I: \n Szkoła Podstawowa (klasy 1-3): ... osób \n Opiekunowie: \n Szkola Podstawowa (klasy 4-8): ... osób \n Grupa II: \n Szkoła Ponadpodstawowa (klasy 1-3): ... osób \n Dorosli (studenci, nauczyciele, inni dorośli): ... osób \n`;

const defaultValues: FormValues = {
  caseNumber: "",
  reportNumber: "",
  programName: "",
  taskType: "",
  address: "",
  dateInput: "",
  viewerCount: 0,
  viewerCountDescription: DEFAULT_OPIS_LICZBY_WIDZOW,
  taskDescription: "",
  additionalInfo: "",
  attendanceList: false,
  rozdzielnik: false,
  templateFile: null,
};

export default function IzrzForm() {
  const { isSubmitting, submitMessage, handleSubmit: handleRaportSubmit } = useRaportDocumentGenerator();
  const userContext = useUser();

  const { data: schools, loading: schoolsLoading, error: schoolsError } = useFirebaseData<School>("schools", userContext.user?.uid);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  // Watch templateFile for color change
  const templateFile = watch("templateFile");

  // Predefined template handler
  const choosePredefinedTemplate = (templateName: Templates) => {
    if (templateName !== "izrz.docx" && templateName !== "lista_obecnosci.docx") {
      console.error("Invalid template name");
      return;
    }
    fetch(`/generate-templates/${templateName}`)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], templateName, { type: blob.type });
        setValue("templateFile", file, { shouldValidate: true });
      })
      .catch((error) => {
        console.error("Error fetching template:", error);
      });
  };

  // Submit handler
  // Use handleRaportSubmit directly as the callback for handleSubmit

  return (
    <>
      {submitMessage.text && (
        <Paper
          elevation={3}
          sx={{
            bgcolor: submitMessage.type === "success" ? "#d1fae5" : "#fee2e2",
            color: submitMessage.type === "success" ? "#065f46" : "#991b1b",
            border: "2px solid",
            borderColor: submitMessage.type === "success" ? "#65d6b5" : "#f87171",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {submitMessage.text}
        </Paper>
      )}

      <Paper
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: "text.secondary",
              fontWeight: 500,
              textAlign: "left",
              fontSize: "1.1rem",
            }}
          >
            Wypełnij poniższy formularz, aby wygenerować raport IZRZ. Upewnij się, że wszystkie pola są poprawnie wypełnione.
          </Typography>

          <form
            onSubmit={handleSubmit(handleRaportSubmit)}
            style={{ width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: "16px" }}
            noValidate
          >
            <Controller
              name="caseNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="💯 Numer sprawy"
                  placeholder="np. OZiPZ.966.1.1.2025"
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors.caseNumber}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="reportNumber"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="📄 Numer raportu"
                  placeholder="np. 45/2025"
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors.reportNumber}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Program */}
            <Controller
              name="programName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  options={programs?.length ? programs.map((program) => (program.name ? program.name : "")) : []}
                  loadingText="Ładowanie programów..."
                  value={field.value}
                  onChange={(_, value) => field.onChange(value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="📚 Program (auto-uzupełnianie)"
                      required
                      variant="outlined"
                      error={!!errors.programName}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                  freeSolo
                  fullWidth
                />
              )}
            />

            {/* Rodzaj zadania */}
            <Controller
              name="taskType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  options={TASK_TYPES ? Object.values(TASK_TYPES).map((type) => type.label) : []}
                  loadingText="Ładowanie rodzajów zadań..."
                  value={field.value}
                  onChange={(_, value) => field.onChange(value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="🎯 Rodzaj zadania"
                      required
                      variant="outlined"
                      error={!!errors.taskType}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                  freeSolo
                  fullWidth
                />
              )}
            />

            {/* Placówka */}
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  options={
                    schools?.length
                      ? schools.map((school) => `${school.name}, ${school.address}, ${school.postalCode} ${school.municipality}`)
                      : []
                  }
                  loading={schoolsLoading}
                  loadingText="Ładowanie placówek..."
                  value={field.value}
                  onChange={(_, value) => field.onChange(value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="🏫 Placówka (auto-uzupełnianie)"
                      required
                      variant="outlined"
                      error={!!errors.address}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                  freeSolo
                  fullWidth
                />
              )}
            />

            {/* Data i liczba widzów */}

            <Controller
              name="dateInput"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="📅 Data"
                  type="date"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={!!errors.dateInput}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="viewerCount"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="👥 Liczba widzów"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors.viewerCount}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Opis liczby widzów */}

            <Controller
              name="viewerCountDescription"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="📝 Opis liczby widzów"
                  placeholder="Wprowadź opis liczby widzów"
                  required
                  multiline
                  fullWidth
                  variant="outlined"
                  error={!!errors.viewerCountDescription}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Opis zadania */}
            <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
              <Typography sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}>Opisy zadań</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {Object.entries(OPISY_ZADAN).map(([title, item]) => (
                  <Button key={title} onClick={() => setValue("taskDescription", item.opis)}>
                    {item.icon} {title}
                  </Button>
                ))}
              </Box>
            </Box>
            <Controller
              name="taskDescription"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="📋 Opis zadania"
                  placeholder="Wprowadź szczegółowy opis zadania"
                  required
                  fullWidth
                  multiline
                  minRows={5}
                  variant="outlined"
                  error={!!errors.taskDescription}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Dodatkowe informacje */}

            <Controller
              name="additionalInfo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ℹ️ Dodatkowe informacje"
                  placeholder="Wprowadź dodatkowe informacje"
                  required
                  fullWidth
                  multiline
                  minRows={2}
                  variant="outlined"
                  error={!!errors.additionalInfo}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {/* Checkboxy */}

            <Paper>
              <Typography variant="h6" sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}>
                Załączniki
              </Typography>
              <Controller
                name="attendanceList"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} color="primary" onChange={(e) => field.onChange(e.target.checked)} />}
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        📋 Załącz listę obecności do raportu
                      </Typography>
                    }
                  />
                )}
              />
              <Controller
                name="rozdzielnik"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} color="primary" onChange={(e) => field.onChange(e.target.checked)} />}
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        📄 Dodaj rozdzielnik do raportu
                      </Typography>
                    }
                  />
                )}
              />
            </Paper>

            {/* Upload pliku */}

            <Paper
              elevation={2}
              sx={{
                p: 3,
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}>
                Szablon dokumentu
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Controller
                  name="templateFile"
                  control={control}
                  rules={{ required: !templateFile }}
                  render={({ field }) => (
                    <Button
                      variant="contained"
                      component="label"
                      color={templateFile ? "success" : "primary"}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        color: "white",
                      }}
                    >
                      {templateFile ? "📄 Zmień plik szablonu" : "📤 Wybierz plik szablonu"}
                      <input
                        type="file"
                        name="templateFile"
                        hidden
                        required={!templateFile}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          field.onChange(file);
                        }}
                      />
                    </Button>
                  )}
                />
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" color="primary" onClick={() => choosePredefinedTemplate("izrz.docx")}>
                    Szablon IZRZ
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => choosePredefinedTemplate("lista_obecnosci.docx")}>
                    Szablon listy obecności
                  </Button>
                </Box>
              </Stack>
              {templateFile && (
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                  ✅ {templateFile.name}
                </Typography>
              )}
            </Paper>

            {/* Submit Button */}

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : "🚀"}
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  px: 8,
                  py: 2,
                  borderRadius: 4,
                  boxShadow: 4,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #1e88e5 0%, #43cea2 100%)",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {isSubmitting ? "Przetwarzanie..." : "Generuj raport"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Paper>
    </>
  );
}
