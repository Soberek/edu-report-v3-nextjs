import React, { useRef } from "react";
import { Box, Button, Typography, Alert, useTheme } from "@mui/material";
import { CloudUpload, Refresh } from "@mui/icons-material";

interface FileUploaderProps {
  fileName: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = React.memo(
  ({ fileName, onFileUpload, onReset, isLoading, isProcessing, error }) => {
    const theme = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleReset = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onReset();
    };

    const handleFileClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onFileUpload(event);
      // Allow selecting the same file again after upload or reset
      event.target.value = "";
    };

    return (
      <Box sx={{ mb: 4 }}>
        {/* File Upload Section */}
        <Box
          sx={{
            border: `2px dashed ${theme.palette.primary.main}40`,
            borderRadius: 3,
            padding: 4,
            textAlign: "center",
            backgroundColor: `${theme.palette.primary.main}05`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}10`,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
            {fileName ? `Wczytano: ${fileName}` : "Wybierz plik Excel"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Obsługiwane formaty: .xlsx (maks. 10MB)
          </Typography>
          <Button
            variant="contained"
            onClick={handleFileClick}
            disabled={isLoading || isProcessing}
            startIcon={<CloudUpload />}
            sx={{ mr: 2 }}
          >
            {isLoading ? "⏳ Wczytywanie..." : "Wybierz plik"}
          </Button>
          <input
            ref={fileInputRef}
            id="excel-file-input"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            aria-label="Wybierz plik Excel do wczytania"
          />{" "}
          {fileName && (
            <Button variant="outlined" onClick={handleReset} disabled={isLoading || isProcessing} startIcon={<Refresh />}>
              Resetuj
            </Button>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={handleReset} startIcon={<Refresh />}>
                  Resetuj
                </Button>
              }
              aria-live="assertive"
              aria-atomic="true"
              role="alert"
            >
              {error}
            </Alert>
          </Box>
        )}
      </Box>
    );
  }
);

FileUploader.displayName = "FileUploader";
