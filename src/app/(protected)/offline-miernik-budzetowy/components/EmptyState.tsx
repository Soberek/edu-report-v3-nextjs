import React from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  readonly show: boolean;
}

/**
 * Empty state component displayed when no data is loaded
 * Provides clear guidance on next steps for users
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        color: "text.secondary",
      }}
      data-testid="empty-state"
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Rozpocznij od wczytania pliku Excel
      </Typography>
      <Typography variant="body1">Wybierz plik z danymi programów edukacyjnych, aby rozpocząć analizę</Typography>
    </Box>
  );
};
