import React, { useRef } from "react";
import { Box, Button, Typography, Alert, useTheme } from "@mui/material";
import { CloudUpload, FileDownload, Refresh } from "@mui/icons-material";

interface FileUploaderProps {
  fileName: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => Promise<boolean>;
  onReset: () => void;
  isLoading: boolean;
  isProcessing: boolean;
  canExport: boolean;
  error: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = React.memo(({
  fileName,
  onFileUpload,
  onExport,
  onReset,
  isLoading,
  isProcessing,
  canExport,
  error,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleExport = async () => {
    const success = await onExport();
    if (success) {
      // Could show success message here
      console.log("Export successful");
    } else {
      // Could show error message here
      console.error("Export failed");
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
          Obsługiwane formaty: .xlsx, .xls (maks. 10MB)
        </Typography>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          style={{ display: "none" }}
        />
        
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
          <Button
            variant="outlined"
            onClick={onReset}
            disabled={isLoading || isProcessing}
            startIcon={<Refresh />}
          >
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
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            disabled={isProcessing}
            startIcon={<FileDownload />}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${theme.palette.success.main}40`,
              },
            }}
          >
            Eksportuj do Excel
          </Button>
        </Box>
      )}
    </Box>
  );
});

FileUploader.displayName = "FileUploader";
