import React, { useRef, useState } from "react";
import { Box, Button, Typography, Alert, useTheme, TextField } from "@mui/material";
import { CloudUpload, FileDownload, Refresh } from "@mui/icons-material";

interface FileUploaderProps {
  fileName: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: (customFileName?: string) => Promise<boolean>;
  onExportToTemplate: (customFileName?: string) => Promise<boolean>;
  onExportToCumulativeTemplate: (customFileName?: string) => Promise<boolean>;
  onReset: () => void;
  isLoading: boolean;
  isProcessing: boolean;
  canExport: boolean;
  error: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = React.memo(
  ({ fileName, onFileUpload, onExport, onExportToTemplate, onExportToCumulativeTemplate, onReset, isLoading, isProcessing, canExport, error }) => {
    const theme = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentMonthWithCapitalFirstLetter = new Date().toLocaleString('pl-PL', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleString('pl-PL', { month: 'long' }).slice(1);
    
    // State for custom filenames
    const [excelFileName, setExcelFileName] = useState("Bez szablonu miernik");
    const [monthlyTemplateFileName, setMonthlyTemplateFileName] = useState(`Załacznik nr 1 - OZIPZ 2025 ${currentMonthWithCapitalFirstLetter}`);
    const [cumulativeTemplateFileName, setCumulativeTemplateFileName] = useState("Załacznik nr 2 - OZIPZ 2025 Narastajacy");

    const handleFileSelect = () => {
      fileInputRef.current?.click();
    };

    const handleReset = () => {
      // Clear the file input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onReset();
    };

    const handleExport = async () => {
      const success = await onExport(excelFileName);
      if (success) {
        // Could show success message here
        console.log("Export successful");
      } else {
        // Could show error message here
        console.error("Export failed");
      }
    };

    const handleExportToTemplate = async () => {
      const success = await onExportToTemplate(monthlyTemplateFileName);
      if (success) {
        console.log("Export to template successful");
      } else {
        console.error("Export to template failed");
      }
    };

    const handleExportToCumulativeTemplate = async () => {
      const success = await onExportToCumulativeTemplate(cumulativeTemplateFileName);
      if (success) {
        console.log("Export to cumulative template successful");
      } else {
        console.error("Export to cumulative template failed");
      }
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

          <input ref={fileInputRef} type="file" accept=".xlsx" onChange={onFileUpload} style={{ display: "none" }} />

          <Button
            variant="contained"
            onClick={handleFileSelect}
            disabled={isLoading || isProcessing}
            startIcon={<CloudUpload />}
            sx={{ mr: 2 }}
          >
            {isLoading ? "Wczytywanie..." : "Wybierz plik"}
          </Button>

          {fileName && (
            <Button variant="outlined" onClick={handleReset} disabled={isLoading || isProcessing} startIcon={<Refresh />}>
              Resetuj
            </Button>
          )}
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Export Section */}
        {canExport && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
              Eksportuj dane
            </Typography>

            {/* Single row layout for md+ screens */}
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 4 },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: { xs: "stretch", md: "center" },
              width: "100%",
              flexWrap: { xs: "nowrap", md: "wrap" }
            }}>
              {/* Excel Export */}
              <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 1,
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: { xs: "stretch", md: "center" },
                flex: { xs: "none", md: 1 },
                minWidth: { xs: "100%", md: "250px" }
              }}>
                <TextField
                  label="Nazwa pliku Excel"
                  value={excelFileName}
                  onChange={(e) => setExcelFileName(e.target.value)}
                  disabled={isProcessing}
                  size="small"
                  variant="outlined"
                  sx={{
                    flex: { xs: "none", md: 1 },
                    '& .MuiInputBase-root': { height: '36px' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                  }}
   
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleExport}
                  disabled={isProcessing}
                  startIcon={<FileDownload />}
                  sx={{
                    height: "36px",
                    minWidth: { xs: "100%", md: "120px" },
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 3px 8px ${theme.palette.success.main}30`,
                    },
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap"
                  }}
                >
                  Excel
                </Button>
              </Box>

              {/* Monthly Template Export */}
              <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 1,
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: { xs: "stretch", md: "center" },
                flex: { xs: "none", md: 1 },
                minWidth: { xs: "100%", md: "250px" }
              }}>
                <TextField
                  label="Nazwa szablonu miesięcznego"
                  value={monthlyTemplateFileName}
                  onChange={(e) => setMonthlyTemplateFileName(e.target.value)}
                  disabled={isProcessing}
                  size="small"
                  variant="outlined"
                  sx={{
                    flex: { xs: "none", md: 1 },
                    '& .MuiInputBase-root': { height: '36px' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                  }}

                  FormHelperTextProps={{ sx: { fontSize: '0.7rem', mt: 0.25 } }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportToTemplate}
                  disabled={isProcessing}
                  startIcon={<FileDownload />}
                  sx={{
                    height: "36px",
                    minWidth: { xs: "100%", md: "120px" },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 3px 8px ${theme.palette.primary.main}30`,
                    },
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap"
                  }}
                >
                  Miesięczny
                </Button>
              </Box>

              {/* Cumulative Template Export */}
              <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 1,
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: { xs: "stretch", md: "center" },
                flex: { xs: "none", md: 1 },
                minWidth: { xs: "100%", md: "250px" }
              }}>
                <TextField
                  label="Nazwa szablonu narastającego"
                  value={cumulativeTemplateFileName}
                  onChange={(e) => setCumulativeTemplateFileName(e.target.value)}
                  disabled={isProcessing}
                  size="small"
                  variant="outlined"
                  sx={{
                    flex: { xs: "none", md: 1 },
                    '& .MuiInputBase-root': { height: '36px' },
                    '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                  }}

                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleExportToCumulativeTemplate}
                  disabled={isProcessing}
                  startIcon={<FileDownload />}
                  sx={{
                    height: "36px",
                    minWidth: { xs: "100%", md: "120px" },
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 3px 8px ${theme.palette.secondary.main}30`,
                    },
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap"
                  }}
                >
                  Narastający
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

FileUploader.displayName = "FileUploader";
