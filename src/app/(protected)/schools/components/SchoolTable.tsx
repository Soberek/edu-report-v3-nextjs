import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { Edit, Delete, School } from "@mui/icons-material";
import type { SchoolTableProps } from "../types";

export const SchoolTable: React.FC<SchoolTableProps> = ({
  schools,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nazwa",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: theme.palette.primary.main,
              fontSize: "0.8rem",
            }}
          >
            <School sx={{ fontSize: "1rem" }} />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "city",
      headerName: "Miasto",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "address",
      headerName: "Adres",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "postalCode",
      headerName: "Kod pocztowy",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "municipality",
      headerName: "Gmina",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Typ",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value && Array.isArray(params.value) ? (
            params.value.map((type: string, index: number) => (
              <Chip
                key={index}
                label={type}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  backgroundColor: theme.palette.secondary.main,
                  color: "white",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
              Brak danych
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Akcje",
      sortable: false,
      filterable: false,
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Edit sx={{ fontSize: "1rem" }} />}
            onClick={() => onEdit(params.row)}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1,
              py: 0.5,
              minWidth: "auto",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
              },
            }}
          >
            Edytuj
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Delete sx={{ fontSize: "1rem" }} />}
            onClick={() => onDelete(params.row.id)}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1,
              py: 0.5,
              minWidth: "auto",
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.main,
                color: "white",
              },
            }}
          >
            Usuń
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={schools}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
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
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      />
    </Box>
  );
};
