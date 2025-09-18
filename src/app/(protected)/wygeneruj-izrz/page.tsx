"use client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
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
import { usePrograms } from "@/hooks/useProgram";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";

type Templates = "izrz.docx" | "lista_obecnosci.docx";

const IzrzForm = () => {
  const { formData, isSubmitting, submitMessage, handleChange, handleFileChange, handleSubmit } = useRaportDocumentGenerator();

  const userContext = useUser();

  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
    // updateItem: updateSchool,
    deleteItem: deleteSchool,
  } = useFirebaseData<School>("schools", userContext.user?.uid);

  const choosePredefinedTemplate = (templateName: Templates) => {
    if (templateName !== "izrz.docx" && templateName !== "lista_obecnosci.docx") {
      console.error("Invalid template name");
      return;
    }
    console.log(`Chosen template: ${templateName}`);

    // read the file then handleFileChange
    fetch(`/generate-templates/${templateName}`)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], templateName, { type: blob.type });
        handleFileChange({ target: { name: "templateFile", files: [file] } } as any);
      })
      .catch((error) => {
        console.error("Error fetching template:", error);
      });
  };
  return (
    <>
      {/* Success/Error Messages */}
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

      {/* Main Form */}
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
          {/* Error Messages */}

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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={1} sx={{ maxWidth: 600, margin: "0 auto" }}>
              {/* Numer sprawy i raportu */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <TextField
                  label="💯 Numer sprawy"
                  name="caseNumber"
                  placeholder="np. OZiPZ.966.1.1.2025"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <TextField
                  label="📄 Numer raportu"
                  name="reportNumber"
                  placeholder="np. 45/2025"
                  value={formData.reportNumber}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Program */}
              <Grid size={12}>
                <Autocomplete
                  options={programs?.length ? programs.map((program) => (program.name ? program.name : "")) : []}
                  loadingText="Ładowanie programów..."
                  value={formData.programName}
                  onChange={(_, value) => handleChange({ target: { name: "programName", value: value || "" } } as any)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="📚 Program (auto-uzupełnianie)"
                      name="programName"
                      placeholder="Wyszukaj i wybierz program lub wpisz ręcznie"
                      fullWidth
                      required
                      variant="outlined"
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
              </Grid>

              {/* Rodzaj zadania */}
              <Grid size={12}>
                <Autocomplete
                  options={TASK_TYPES ? Object.values(TASK_TYPES).map((type) => type.label) : []}
                  loadingText="Ładowanie rodzajów zadań..."
                  value={formData.taskType}
                  onChange={(_, value) => handleChange({ target: { name: "taskType", value: value || "" } } as any)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="🎯 Rodzaj zadania"
                      name="taskType"
                      placeholder="np. Prelekcja"
                      fullWidth
                      required
                      variant="outlined"
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
              </Grid>

              {/* Placówka */}
              <Grid size={12}>
                <Autocomplete
                  options={
                    schools?.length
                      ? schools.map((school) => `${school.name}, ${school.address}, ${school.postalCode} ${school.municipality}`)
                      : []
                  }
                  loading={schoolsLoading}
                  loadingText="Ładowanie placówek..."
                  value={formData.address}
                  onChange={(_, value) => handleChange({ target: { name: "address", value: value || "" } } as any)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="🏫 Placówka (auto-uzupełnianie)"
                      name="address"
                      placeholder="Wyszukaj i wybierz placówkę lub wpisz ręcznie"
                      fullWidth
                      required
                      variant="outlined"
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
              </Grid>

              {/* Data i liczba widzów */}
              <Grid size={6} sx={{ pr: 1 }}>
                <TextField
                  label="📅 Data"
                  type="date"
                  name="dateInput"
                  value={formData.dateInput}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="👥 Liczba widzów"
                  type="number"
                  name="viewerCount"
                  value={formData.viewerCount}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Opis liczby widzów */}
              <Grid size={12}>
                <TextField
                  label="📝 Opis liczby widzów"
                  name="viewerCountDescription"
                  placeholder="Wprowadź opis liczby widzów"
                  value={formData.viewerCountDescription}
                  onChange={handleChange}
                  required
                  multiline
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Opis zadania */}
              <Grid size={12}>
                <TextField
                  label="📋 Opis zadania"
                  name="taskDescription"
                  placeholder="Wprowadź szczegółowy opis zadania"
                  value={formData.taskDescription}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Dodatkowe informacje */}
              <Grid size={12}>
                <TextField
                  label="ℹ️ Dodatkowe informacje"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Wprowadź dodatkowe informacje"
                  required
                  fullWidth
                  multiline
                  minRows={2}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Checkboxy */}
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                  gap: 2,
                  textAlign: "left",
                }}
              >
                <Paper>
                  <Typography variant="h6" sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}>
                    Załączniki
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.attendanceList}
                        name="attendanceList"
                        color="primary"
                        onChange={(e) => handleChange({ target: { name: "attendanceList", value: e.target.checked } } as any)}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        📋 Załącz listę obecności do raportu
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rozdzielnik}
                        name="rozdzielnik"
                        color="primary"
                        onChange={(e) => handleChange({ target: { name: "rozdzielnik", value: e.target.checked } } as any)}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        📄 Dodaj rozdzielnik do raportu
                      </Typography>
                    }
                  />
                </Paper>
              </Grid>

              {/* Upload pliku */}
              <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
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
                    <Button
                      variant="contained"
                      component="label"
                      color={formData.templateFile ? "success" : "primary"}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        color: "white",
                      }}
                    >
                      {formData.templateFile ? "📄 Zmień plik szablonu" : "📤 Wybierz plik szablonu"}
                      <input type="file" name="templateFile" hidden onChange={handleFileChange} required={!formData.templateFile} />
                    </Button>
                    {/* Albo wybierz plik szablonu */}
                    {/* Template 1: Izrz */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Button variant="outlined" color="primary" onClick={() => choosePredefinedTemplate("izrz.docx")}>
                        Szablon IZRZ
                      </Button>
                      {/* Template 2: Lista obecności */}
                      <Button variant="outlined" color="primary" onClick={() => choosePredefinedTemplate("lista_obecnosci.docx")}>
                        Szablon listy obecności
                      </Button>
                    </Box>
                  </Stack>
                  {formData.templateFile && (
                    <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                      ✅ {formData.templateFile.name}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Submit Button */}
              <Grid size={12}>
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
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Paper>
    </>
  );
};

export default IzrzForm;
