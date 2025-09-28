import React from "react";
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
import { Box, IconButton, useTheme } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

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
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.grey[50],
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      />
    </Box>
  );
};

// Default action configurations
export const defaultActions = {
  edit: (onEdit: (id: string) => void): DataTableAction => ({
    type: "edit",
    icon: <Edit fontSize="small" />,
    onClick: onEdit,
    color: "primary",
    tooltip: "Edytuj",
  }),
  delete: (onDelete: (id: string) => void): DataTableAction => ({
    type: "delete",
    icon: <Delete fontSize="small" />,
    onClick: onDelete,
    color: "error",
    tooltip: "Usuń",
  }),
  view: (onView: (id: string) => void): DataTableAction => ({
    type: "view",
    icon: <Visibility fontSize="small" />,
    onClick: onView,
    color: "info",
    tooltip: "Zobacz",
  }),
};
