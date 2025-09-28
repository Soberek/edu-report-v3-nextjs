import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Contact, Program, School } from "@/types";
import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import { Box, Typography, Paper, Alert, CircularProgress, Chip, Avatar, Stack, Divider, IconButton, Tooltip } from "@mui/material";
import { School as SchoolIcon, Group, Person, CalendarToday, Notes, Edit, Delete, Visibility } from "@mui/icons-material";
import EditDialog from "./edit-dialog";
import { useState } from "react";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
};

const getRandomColor = (name: string) => {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const createColumns = (
  handleEdit: (participation: SchoolProgramParticipation) => void,
  handleDelete: (id: string) => void
): GridColDef[] => [
  {
    field: "schoolName",
    headerName: "Szkoła",
    width: 200,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            background: getRandomColor(params.value),
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        >
          {getInitials(params.value)}
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "programName",
    headerName: "Program",
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color="primary"
        variant="filled"
        size="small"
        sx={{
          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
          color: "white",
          fontWeight: "bold",
          fontSize: "0.75rem",
          height: 24,
        }}
      />
    ),
  },
  {
    field: "coordinatorName",
    headerName: "Koordynator",
    width: 180,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            background: getRandomColor(params.value),
            fontWeight: "bold",
            fontSize: "0.7rem",
          }}
        >
          {getInitials(params.value)}
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: "500" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "schoolYear",
    headerName: "Rok",
    width: 100,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1.5,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "1px solid #e0e0e0",
        }}
      >
        <CalendarToday sx={{ color: "#1976d2", fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "studentCount",
    headerName: "Uczniowie",
    type: "number",
    width: 100,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1.5,
          background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
          border: "1px solid #4caf50",
        }}
      >
        <Group sx={{ color: "#4caf50", fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "notes",
    headerName: "Notatki",
    width: 150,
    renderCell: (params) => (
      <Tooltip title={params.value || "Brak notatek"} arrow>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 1.5,
            background: params.value ? "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" : "rgba(0,0,0,0.04)",
            border: params.value ? "1px solid #ff9800" : "1px solid #e0e0e0",
            cursor: "pointer",
          }}
        >
          <Notes sx={{ color: params.value ? "#ff9800" : "#999", fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 80,
              color: params.value ? "#e65100" : "#999",
            }}
          >
            {params.value || "Brak"}
          </Typography>
        </Box>
      </Tooltip>
    ),
  },
  {
    field: "createdAt",
    headerName: "Data",
    width: 100,
    renderCell: (params) => (
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "500" }}>
        {new Date(params.value).toLocaleDateString("pl-PL", { day: '2-digit', month: '2-digit' })}
      </Typography>
    ),
  },
  {
    field: "actions",
    headerName: "Akcje",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Edytuj" arrow>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{
              color: "#ff9800",
              "&:hover": {
                background: "rgba(255, 152, 0, 0.1)",
              },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Usuń" arrow>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            sx={{
              color: "#f44336",
              "&:hover": {
                background: "rgba(244, 67, 54, 0.1)",
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

type Props = {
  schoolsMap: Record<string, School>;
  contactsMap: Record<string, Contact>;
  programsMap: Record<string, Program>;
  participations: SchoolProgramParticipation[];
  errorMessage: string | null;
  loading: boolean;
  schools: School[];
  contacts: Contact[];
  programs: Program[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
};
export const SchoolProgramParticipationTable = ({ 
  schoolsMap, 
  contactsMap, 
  programsMap, 
  participations, 
  errorMessage, 
  loading,
  schools,
  contacts,
  programs,
  onUpdate,
  onDelete
}: Props) => {
  const [editingParticipation, setEditingParticipation] = useState<SchoolProgramParticipation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditParticipation = (participation: SchoolProgramParticipation) => {
    setEditingParticipation(participation);
    setEditDialogOpen(true);
  };

  const handleSaveParticipation = (id: string, data: any) => {
    onUpdate(id, data);
    setEditDialogOpen(false);
    setEditingParticipation(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingParticipation(null);
  };

  const handleDeleteParticipation = (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć to uczestnictwo?")) {
      onDelete(id);
    }
  };
  if (errorMessage) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Błąd podczas ładowania danych: {errorMessage}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Ładowanie danych...
        </Typography>
      </Box>
    );
  }

  const mappedParticipations =
    participations?.reduce((acc, curr) => {
      const { id, schoolId, programId, coordinatorId } = curr;

      const school = schoolsMap[schoolId];
      const program = programsMap[programId];
      const coordinator = contactsMap[coordinatorId];

      if (school && program && coordinator) {
        acc[id] = {
          schoolName: school.name,
          programName: program.name,
          coordinatorName: `${coordinator.firstName} ${coordinator.lastName}`,
          ...curr,
        };
      }

      return acc;
    }, {} as Record<string, { schoolName: string; programName: string; coordinatorName: string }>) || {};

  const rows = Object.values(mappedParticipations);
  const columns = createColumns(handleEditParticipation, handleDeleteParticipation);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
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
            }}
          >
            <SchoolIcon sx={{ color: "#1976d2" }} />
            Lista uczestnictwa ({rows.length})
          </Typography>
        </Box>

        <Box sx={{ p: 2, background: "transparent" }}>
          {rows.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 3,
                background: "rgba(255,255,255,0.8)",
                borderRadius: 3,
              }}
            >
              <SchoolIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Brak danych
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dodaj pierwsze uczestnictwo szkoły w programie
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                background: "white",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(224, 224, 224, 0.3)",
                  padding: "4px 8px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderBottom: "none",
                  borderRadius: "12px 12px 0 0",
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    borderRight: "1px solid rgba(255,255,255,0.2)",
                    "&:last-child": {
                      borderRight: "none",
                    },
                  },
                },
                "& .MuiDataGrid-row": {
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  },
                  "&:nth-of-type(even)": {
                    background: "rgba(0,0,0,0.02)",
                  },
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
                    },
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  borderTop: "1px solid #e0e0e0",
                  borderRadius: "0 0 12px 12px",
                },
                "& .MuiDataGrid-toolbarContainer": {
                  background: "rgba(255,255,255,0.9)",
                  padding: "8px",
                  borderBottom: "1px solid #e0e0e0",
                },
                "& .MuiDataGrid-checkboxInput": {
                  color: "#667eea",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        participation={editingParticipation}
        schools={schools}
        contacts={contacts}
        programs={programs}
        onClose={handleCloseEditDialog}
        onSave={handleSaveParticipation}
        loading={loading}
      />
    </>
  );
};
