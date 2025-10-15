import React from "react";
import { Paper, Box, Typography, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { DataTable, LoadingSpinner, EmptyState } from "./";
import type { DataTableAction } from "./DataTable";

export interface TableWrapperProps<T extends Record<string, unknown>> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: T[];
  columns: GridColDef<T>[];
  actions?: DataTableAction[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  height?: number;
  pageSizeOptions?: number[];
  getRowId?: (row: T) => string;
  sortingModel?: GridSortModel;
  sx?: SxProps<Theme>;
  showHeader?: boolean;
  headerSx?: SxProps<Theme>;
}

/**
 * Generic table wrapper component
 * Provides consistent styling and behavior for data tables
 */
export const TableWrapper = <T extends Record<string, unknown>>({
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
  sx,
  showHeader = true,
  headerSx,
}: TableWrapperProps<T>) => {
  const theme = useTheme();
  const mergeSx = (...styles: Array<SxProps<Theme> | undefined>): SxProps<Theme> =>
    styles.filter(Boolean) as SxProps<Theme>;

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <Box
        sx={mergeSx(
          {
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          },
          headerSx
        )}
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
          data={data}
          columns={columns}
          actions={actions}
          loading={loading}
          height={height}
          pageSizeOptions={pageSizeOptions}
          getRowId={getRowId}
          sortingModel={sortingModel}
          sx={mergeSx({
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
          })}
        />
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={mergeSx(
        {
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        },
        sx
      )}
    >
      {renderHeader()}
      {renderContent()}
    </Paper>
  );
};

// Specialized table wrappers
type SpecializedTableProps<T extends Record<string, unknown>> = {
  title: string;
  data: T[];
  columns: GridColDef<T>[];
  actions: DataTableAction[];
  loading?: boolean;
  onAdd?: () => void;
};

export const CaseRecordsTable = <T extends Record<string, unknown>>({
  title,
  data,
  columns,
  actions,
  loading,
  onAdd,
}: SpecializedTableProps<T>) => (
  <TableWrapper<T>
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

export const ProgramTable = <T extends Record<string, unknown>>({
  title,
  data,
  columns,
  actions,
  loading,
  onAdd,
}: SpecializedTableProps<T>) => (
  <TableWrapper<T>
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

export const SchoolTable = <T extends Record<string, unknown>>({
  title,
  data,
  columns,
  actions,
  loading,
  onAdd,
}: SpecializedTableProps<T>) => (
  <TableWrapper<T>
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
