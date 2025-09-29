import React from "react";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { Box, IconButton, useTheme } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

// Polish localization for DataGrid
const polishLocalization = {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          // Pagination
          paginationPlaceholderLabel: "Ilość wierszy",
          paginationLabelRowsPerPage: "Wiersze na stronie:",
          
          // Filter panel
          filterPanelAddFilter: "Dodaj filtr",
          filterPanelDeleteIconLabel: "Usuń",
          filterPanelOperators: "Operatory",
          filterPanelOperatorAnd: "I",
          filterPanelOperatorOr: "Lub",
          filterPanelColumns: "Kolumny",
          filterPanelInputLabel: "Wartość",
          filterPanelInputPlaceholder: "Wartość filtru",
          
          // Column menu
          columnMenuLabel: "Menu kolumny",
          columnMenuShowColumns: "Pokaż kolumny",
          columnMenuFilter: "Filtruj",
          columnMenuHideColumn: "Ukryj",
          columnMenuUnsort: "Anuluj sortowanie",
          columnMenuSortAsc: "Sortuj rosnąco",
          columnMenuSortDesc: "Sortuj malejąco",
          
          // Columns panel
          columnsPanelTextFieldLabel: "Znajdź kolumnę",
          columnsPanelTextFieldPlaceholder: "Tytuł kolumny",
          columnsPanelDragIconLabel: "Przeciągnij kolumnę",
          columnsPanelShowAllButton: "Pokaż wszystkie",
          columnsPanelHideAllButton: "Ukryj wszystkie",
          
          // Status bars
          footerRowSelected: (count: number) =>
            count !== 1
              ? `${count.toLocaleString()} wierszy zaznaczonych`
              : `${count.toLocaleString()} wiersz zaznaczony`,
          footerTotalRows: "Łączna liczba wierszy:",
          
          // Density
          toolbarDensity: "Gęstość",
          toolbarDensityLabel: "Gęstość",
          toolbarDensityCompact: "Kompaktowa",
          toolbarDensityStandard: "Standardowa",
          toolbarDensityComfortable: "Komfortowa",
          
          // Column selectors
          toolbarColumns: "Kolumny",
          toolbarColumnsLabel: "Wybierz kolumnę",
          
          // Fields
          columnFieldsPlaceholderColumn: "Kolumna",
          switchColumnMoveLeft: (label: string) => `Przenieś ${label} w lewo`,
          switchColumnMoveRight: (label: string) => `Przenieś ${label} w prawo`,
          
          // Row groups
          rowGroupingHeaderName: "Grupowanie",
          groupedColumnHeaderName: "Grupa",
          groupedColumnSortDescendingTooltip: (field: string) => `Sortuj ${field} malejąco`,
          groupedColumnSortAscendingTooltip: (field: string) => `Sortuj ${field} rosnąco`,
          groupedColumnUnsortTooltip: (field: string) => `Anuluj sortowanie ${field}`,
          
          // Aggregation
          cellMore: "Więcej tekstu",
          noRowsLabel: "Brak danych",
          errorOverlayDefaultLabel: "Wystąpił błąd.",
          noResultsOverlayLabel: "Brak wyników wyszukiwania.",
          loadingOverlayLabelLabel: "Ładowanie danych...",
          
          // Boolean filter
          booleanFilterTrueLabel: "tak",
          booleanFilterFalseLabel: "nie",
          booleanFilterEmptyLabel: "puste",
          
          // Date picker
          datePickerTableLoadingLabel: "Ładowanie...",
          datePickerTableEmptyLabel: "Brak dat",
          
          // Actions
          actionsCellMoreLabel: "więcej",
        },
      },
    },
  },
};

export interface DataTableAction {
  type: "edit" | "delete" | "view";
  icon: React.ReactNode;
  onClick: (id: string) => void;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  tooltip?: string;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: GridColDef[];
  loading?: boolean;
  height?: number;
  pageSizeOptions?: number[];
  actions?: DataTableAction[];
  onRowClick?: (params: GridRowParams) => void;
  getRowId?: (row: T) => string;
  sx?: object;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  height = 400,
  pageSizeOptions = [10, 25, 50],
  actions = [],
  onRowClick,
  getRowId,
  sx = {},
}: DataTableProps<T>) => {
  const theme = useTheme();

  const actionColumns: GridColDef[] = actions.map((action, index) => ({
    field: `action_${index}`,
    headerName: "",
    width: 60,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: { row: T }) => (
      <IconButton
        size="small"
        color={action.color || "primary"}
        onClick={(e) => {
          e.stopPropagation();
          action.onClick(getRowId ? getRowId(params.row) : params.row.id);
        }}
        title={action.tooltip}
      >
        {action.icon}
      </IconButton>
    ),
  }));

  const allColumns = [...columns, ...actionColumns];

  return (
    <Box sx={{ height, width: "100%", ...sx }}>
      <DataGrid
        rows={data}
        columns={allColumns}
        loading={loading}
        pageSizeOptions={pageSizeOptions}
        localeText={polishLocalization.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        onRowClick={onRowClick}
        getRowId={getRowId}
        sx={{
          "& .MuiDataGrid-cell": {
            borderRight: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.grey[50],
            fontWeight: "bold",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "& .MuiDataGrid-footerContainer": {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
          "& .MuiDataGrid-toolbarContainer": {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
          "& .MuiTablePagination-root": {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        }}
        // Enable Polish-friendly features
        density="standard"
        disableColumnResize={false}
        disableColumnMenu={false}
        disableRowSelectionOnClick={true}
        // Accessibility improvements for Polish users
        aria-label="Tabela danych"
      />
    </Box>
  );
};

// Default action configurations with Polish localization
export const defaultActions = {
  edit: (onEdit: (id: string) => void): DataTableAction => ({
    type: "edit",
    icon: <Edit fontSize="small" />,
    onClick: onEdit,
    color: "primary",
    tooltip: "Edytuj wpis",
  }),
  delete: (onDelete: (id: string) => void): DataTableAction => ({
    type: "delete",
    icon: <Delete fontSize="small" />,
    onClick: onDelete,
    color: "error",
    tooltip: "Usuń wpis",
  }),
  view: (onView: (id: string) => void): DataTableAction => ({
    type: "view",
    icon: <Visibility fontSize="small" />,
    onClick: onView,
    color: "info",
    tooltip: "Zobacz szczegóły",
  }),
};

// Polish localization utilities for DataTable
export const polishDataTableLabels = {
  noData: "Brak danych do wyświetlenia",
  loading: "Ładowanie danych...",
  error: "Wystąpił błąd podczas ładowania danych",
  paginationInfo: (from: number, to: number, total: number) => 
    `${from}-${to} z ${total}`,
  itemsPerPage: "Pozycji na stronie:",
  search: "Szukaj...",
  clearFilters: "Wyczyść filtry",
  export: "Eksportuj",
  refresh: "Odśwież",
};
