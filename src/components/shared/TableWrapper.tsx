import React from "react";
import {
  Paper,
  Box,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { DataTable, LoadingSpinner, EmptyState } from "./";

export interface TableWrapperProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: any[];
  columns: any[];
  actions?: any[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  height?: number;
  pageSizeOptions?: number[];
  getRowId?: (row: any) => string;
  sortingModel?: any[];
  sx?: object;
  showHeader?: boolean;
  headerSx?: object;
}

/**
 * Generic table wrapper component
 * Provides consistent styling and behavior for data tables
 */
export const TableWrapper: React.FC<TableWrapperProps> = ({
  title,
  subtitle,
  icon,
  data,
  columns,
  actions = [],
  loading = false,
  emptyTitle = "Brak danych",
  emptyDescription = "Nie znaleziono żadnych elementów do wyświetlenia.",
  onEmptyAction,
  emptyActionLabel = "Dodaj nowy element",
  height = 600,
  pageSizeOptions = [5, 10, 25, 50],
  getRowId,
  sortingModel,
  sx = {},
  showHeader = true,
  headerSx = {},
}) => {
  const theme = useTheme();

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <Box
        sx={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          p: 2,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          ...headerSx,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            wordBreak: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.3,
          }}
        >
          {icon}
          <Box component="span" sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
            {title} ({data.length})
          </Box>
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <LoadingSpinner size={48} message="Ładowanie danych..." />
        </Box>
      );
    }

    if (data.length === 0) {
      return (
        <Box sx={{ p: 2 }}>
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={onEmptyAction ? {
              label: emptyActionLabel,
              onClick: onEmptyAction,
            } : undefined}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2, background: "transparent" }}>
        <DataTable
          data={data as Record<string, unknown>[]}
          columns={columns}
          actions={actions}
          loading={loading}
          height={height}
          pageSizeOptions={pageSizeOptions}
          getRowId={getRowId}
          sortingModel={sortingModel}
          sx={{
            background: "white",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: 2,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[50],
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
                fontSize: "0.9rem",
              },
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "1.4",
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        overflow: "hidden",
        ...sx,
      }}
    >
      {renderHeader()}
      {renderContent()}
    </Paper>
  );
};

// Specialized table wrappers
export const CaseRecordsTable: React.FC<{
  title: string;
  data: any[];
  columns: any[];
  actions: any[];
  loading?: boolean;
  onAdd?: () => void;
}> = ({ title, data, columns, actions, loading, onAdd }) => (
  <TableWrapper
    title={title}
    data={data}
    columns={columns}
    actions={actions}
    loading={loading}
    emptyTitle="Brak danych"
    emptyDescription="Nie znaleziono żadnych akt spraw"
    onEmptyAction={onAdd}
    emptyActionLabel="Dodaj nowy akt"
  />
);

export const ProgramTable: React.FC<{
  title: string;
  data: any[];
  columns: any[];
  actions: any[];
  loading?: boolean;
  onAdd?: () => void;
}> = ({ title, data, columns, actions, loading, onAdd }) => (
  <TableWrapper
    title={title}
    data={data}
    columns={columns}
    actions={actions}
    loading={loading}
    emptyTitle="Brak programów"
    emptyDescription="Nie znaleziono żadnych programów edukacyjnych"
    onEmptyAction={onAdd}
    emptyActionLabel="Dodaj nowy program"
  />
);

export const SchoolTable: React.FC<{
  title: string;
  data: any[];
  columns: any[];
  actions: any[];
  loading?: boolean;
  onAdd?: () => void;
}> = ({ title, data, columns, actions, loading, onAdd }) => (
  <TableWrapper
    title={title}
    data={data}
    columns={columns}
    actions={actions}
    loading={loading}
    emptyTitle="Brak szkół"
    emptyDescription="Nie znaleziono żadnych szkół"
    onEmptyAction={onAdd}
    emptyActionLabel="Dodaj nową szkołę"
  />
);
