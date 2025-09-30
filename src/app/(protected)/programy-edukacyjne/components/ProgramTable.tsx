import React from "react";
import { Box, Typography, Chip, Avatar, useTheme } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { School } from "@mui/icons-material";
import { DataTable, defaultActions, LoadingSpinner } from "@/components/shared";
import { Program } from "../types";
import { getProgramTypeLabel, getProgramTypeColor } from "../utils/programUtils";

interface ProgramTableProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ProgramTable: React.FC<ProgramTableProps> = ({ programs, onEdit, onDelete, loading = false }) => {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Kod programu",
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
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "0.85rem",
              textAlign: "center",
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Nazwa programu",
      flex: 2,
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
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              wordWrap: "break-word",
              whiteSpace: "normal",
              textAlign: "center",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "programType",
      headerName: "Typ programu",
      flex: 1,
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
          <Chip
            label={getProgramTypeLabel(params.value)}
            color={getProgramTypeColor(params.value)}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          />
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Opis",
      flex: 2,
      minWidth: 250,
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
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              textAlign: "center",
              wordWrap: "break-word",
              whiteSpace: "normal",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
  ];

  const actions = [
    defaultActions.edit((id: string) => {
      const program = programs.find((p) => p.id === id);
      if (program) onEdit(program);
    }),
    defaultActions.delete(onDelete),
  ];

  if (loading) {
    return <LoadingSpinner message="Ładowanie programów..." />;
  }

  return (
    <DataTable
      data={programs as unknown as Record<string, unknown>[]}
      columns={columns}
      actions={actions}
      loading={loading}
      height={600}
      getRowId={(row) => row.id as string}
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
