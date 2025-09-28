import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Add, Refresh, SearchOff } from "@mui/icons-material";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  sx?: object;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, sx = {} }) => {
  const theme = useTheme();

  const defaultIcon = <SearchOff sx={{ fontSize: 64, color: "text.secondary" }} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        p: 4,
        textAlign: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          mb: 3,
          opacity: 0.6,
        }}
      >
        {icon || defaultIcon}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 400,
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant="contained"
          startIcon={action.icon || <Add />}
          onClick={action.onClick}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

// Common empty state variants
export const NoDataEmptyState: React.FC<{
  title?: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  sx?: object;
}> = ({
  title = "Brak danych",
  description = "Nie znaleziono żadnych elementów do wyświetlenia.",
  onAdd,
  addLabel = "Dodaj nowy element",
  sx = {},
}) => (
  <EmptyState
    title={title}
    description={description}
    icon={<SearchOff sx={{ fontSize: 64, color: "text.secondary" }} />}
    action={onAdd ? { label: addLabel, onClick: onAdd, icon: <Add /> } : undefined}
    sx={sx}
  />
);

export const ErrorEmptyState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  sx?: object;
}> = ({
  title = "Wystąpił błąd",
  description = "Nie udało się załadować danych. Spróbuj ponownie.",
  onRetry,
  retryLabel = "Spróbuj ponownie",
  sx = {},
}) => (
  <EmptyState
    title={title}
    description={description}
    icon={<Refresh sx={{ fontSize: 64, color: "error.main" }} />}
    action={onRetry ? { label: retryLabel, onClick: onRetry, icon: <Refresh /> } : undefined}
    sx={sx}
  />
);
