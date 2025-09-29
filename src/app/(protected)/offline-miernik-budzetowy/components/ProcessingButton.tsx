import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

interface ProcessingButtonProps {
  readonly onProcess: () => void;
  readonly canProcess: boolean;
  readonly isProcessing: boolean;
  readonly show: boolean;
}

/**
 * Manual data processing button component
 * Provides clear visual feedback during processing state
 */
export const ProcessingButton: React.FC<ProcessingButtonProps> = ({ onProcess, canProcess, isProcessing, show }) => {
  if (!show) {
    return null;
  }

  const getButtonText = () => {
    return isProcessing ? "Przetwarzanie..." : "Przetwórz dane";
  };

  const getButtonIcon = () => {
    return isProcessing ? <CircularProgress size={20} /> : <PlayArrow />;
  };

  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Button
        variant="contained"
        size="large"
        onClick={onProcess}
        disabled={!canProcess}
        startIcon={getButtonIcon()}
        sx={{ px: 4, py: 2 }}
        data-testid="process-data-button"
      >
        {getButtonText()}
      </Button>
    </Box>
  );
};
