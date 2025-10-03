"use client";

import React, { useRef, useState } from "react";
import { Box, Typography, Button, Paper, Alert, LinearProgress, Chip, IconButton, TextField, Divider } from "@mui/material";
import {
  CloudUpload,
  Delete,
  DeleteSweep,
  Calculate,
  Download,
  CheckCircle,
  Error as ErrorIcon,
  HourglassEmpty,
} from "@mui/icons-material";
import { useHealthInspectionAggregator } from "../hooks/useHealthInspectionAggregator";
import { MAX_FILES } from "../types";
import AggregatedDataTable from "./AggregatedDataTable";
import ExcelPasteButton from "./ExcelPasteButton";

const HealthInspectionAggregator: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [month, setMonth] = useState("sierpień 2025");

  const { files, isProcessing, aggregatedData, globalError, handleFilesUpload, removeFile, clearAll, aggregateData, exportData } =
    useHealthInspectionAggregator();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesUpload(e.target.files);
    // Reset input value to allow re-uploading the same file
    e.target.value = "";
  };

  const handleExport = async () => {
    await exportData(month);
  };

  const successfulFilesCount = files.filter((f) => f.status === "success").length;
  const canAggregate = successfulFilesCount > 0 && !isProcessing;
  const canExport = aggregatedData !== null && !isProcessing;

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 4, mb: 3, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Agregacja Danych - Ochrona Zdrowia
        </Typography>
        <Typography variant="h6">
          Wgraj do {MAX_FILES} plików Excel z danymi kontroli obiektów. Program automatycznie zsumuje dane i wygeneruje raport zbiorczy.
        </Typography>
      </Paper>

      {/* Global Error */}
      {globalError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => {}}>
          {globalError}
        </Alert>
      )}

      {/* File Upload Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          1. Wgraj Pliki Excel
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Wybierz pliki Excel (.xlsx, .xls) z danymi kontroli. Maksymalnie {MAX_FILES} plików.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleFileSelect}
            disabled={files.length >= MAX_FILES || isProcessing}
            size="large"
          >
            Wybierz Pliki
          </Button>

          {files.length > 0 && (
            <Button variant="outlined" color="error" startIcon={<DeleteSweep />} onClick={clearAll} disabled={isProcessing} size="large">
              Usuń Wszystkie ({files.length})
            </Button>
          )}

          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" multiple onChange={handleFileChange} style={{ display: "none" }} />
        </Box>

        {/* Files List */}
        {files.length > 0 && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Wgrane pliki: {files.length} / {MAX_FILES}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
              {files.map((file, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: file.status === "error" ? "error.lighter" : file.status === "success" ? "success.lighter" : "grey.50",
                  }}
                >
                  {/* Status Icon */}
                  {file.status === "success" && <CheckCircle color="success" />}
                  {file.status === "error" && <ErrorIcon color="error" />}
                  {file.status === "processing" && <HourglassEmpty color="primary" />}
                  {file.status === "pending" && <HourglassEmpty color="disabled" />}

                  {/* File Name */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {file.fileName}
                    </Typography>
                    {file.error && (
                      <Typography variant="caption" color="error">
                        {file.error}
                      </Typography>
                    )}
                    {file.status === "success" && (
                      <Typography variant="caption" color="text.secondary">
                        {file.data.length} wierszy danych
                      </Typography>
                    )}
                  </Box>

                  {/* Status Chip */}
                  <Chip
                    label={
                      file.status === "success"
                        ? "Gotowy"
                        : file.status === "error"
                        ? "Błąd"
                        : file.status === "processing"
                        ? "Przetwarzanie..."
                        : "Oczekuje"
                    }
                    color={file.status === "success" ? "success" : file.status === "error" ? "error" : "default"}
                    size="small"
                  />

                  {/* Remove Button */}
                  <IconButton onClick={() => removeFile(index)} disabled={isProcessing} size="small" color="error">
                    <Delete />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Aggregation Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          2. Agreguj Dane
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Zsumuj dane ze wszystkich poprawnie przetworzonych plików.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Calculate />}
          onClick={aggregateData}
          disabled={!canAggregate}
          size="large"
          fullWidth
          sx={{ maxWidth: 400 }}
        >
          Agreguj Dane ({successfulFilesCount} {successfulFilesCount === 1 ? "plik" : "pliki"})
        </Button>

        {isProcessing && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {/* Results Section */}
      {aggregatedData && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            3. Wyniki Agregacji
          </Typography>

          <AggregatedDataTable data={aggregatedData} />

          <Divider sx={{ my: 3 }} />

          {/* Export Section - Step 4 */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              4. Eksportuj Raport
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Wgraj szablon pliku Excel i wyeksportuj raport z danymi agregacji. Możesz ustawić tytuł oraz miesiąc.
            </Typography>
            <ExcelPasteButton aggregatedData={aggregatedData} />
          </Box>
        </Paper>
      )}

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 3, bgcolor: "info.lighter" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ℹ️ Instrukcja
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          <li>
            <Typography variant="body2">Wgraj od 1 do {MAX_FILES} plików Excel z danymi kontroli obiektów</Typography>
          </li>
          <li>
            <Typography variant="body2">Każdy plik powinien zawierać dane w standardowym formacie (jak na przykładzie)</Typography>
          </li>
          <li>
            <Typography variant="body2">Kliknij &quot;Agreguj Dane&quot; aby zsumować wartości ze wszystkich plików</Typography>
          </li>
          <li>
            <Typography variant="body2">Podaj miesiąc i kliknij &quot;Pobierz Raport Excel&quot; aby zapisać wynik</Typography>
          </li>
          <li>
            <Typography variant="body2">Program automatycznie pominie wiersze &quot;RAZEM&quot; z oryginalnych plików</Typography>
          </li>
        </Box>
      </Paper>
    </Box>
  );
};

export default HealthInspectionAggregator;
