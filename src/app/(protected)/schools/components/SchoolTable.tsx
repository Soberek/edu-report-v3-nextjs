import React from "react";
import { Box, Typography, Chip, Avatar, useTheme } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { School } from "@mui/icons-material";
import { DataTable, defaultActions, LoadingSpinner } from "@/components/shared";
import type { SchoolTableProps } from "../types";

export const SchoolTable: React.FC<SchoolTableProps> = ({ schools, onEdit, onDelete, loading = false }) => {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nazwa",
      flex: 1.5,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            height: "100%",
            minHeight: 52,
          }}
        >
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
          <Typography variant="body2" sx={{ fontWeight: 600, wordWrap: "break-word", whiteSpace: "normal" }}>
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
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 52,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem", textAlign: "center", wordWrap: "break-word", whiteSpace: "normal" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "city",
      headerName: "Miasto",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 52,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem", textAlign: "center", wordWrap: "break-word", whiteSpace: "normal" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "address",
      headerName: "Adres",
      flex: 1.2,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 52,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem", textAlign: "center", wordWrap: "break-word", whiteSpace: "normal" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "postalCode",
      headerName: "Kod pocztowy",
      flex: 0.8,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 52,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem", textAlign: "center", wordWrap: "break-word", whiteSpace: "normal" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "municipality",
      headerName: "Gmina",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 52,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem", textAlign: "center", wordWrap: "break-word", whiteSpace: "normal" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "type",
      headerName: "Typ",
      flex: 1.2,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: 52,
          }}
        >
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
            <Typography
              variant="body2"
              sx={{ fontSize: "0.85rem", color: "text.secondary", textAlign: "center", wordWrap: "break-word", whiteSpace: "normal" }}
            >
              Brak danych
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  const actions = [
    defaultActions.edit((id: string) => {
      const school = schools.find((s) => s.id === id);
      if (school) onEdit(school);
    }),
    defaultActions.delete(onDelete),
  ];

  if (loading) {
    return <LoadingSpinner message="Ładowanie szkół..." />;
  }

  return (
    <DataTable
      data={schools}
      columns={columns}
      actions={actions}
      loading={loading}
      height={600}
      getRowId={(row) => row.id}
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
  );
};
