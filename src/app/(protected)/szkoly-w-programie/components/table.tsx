import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Contact, Program, School } from "@/types";
import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import { 
  Box, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress, 
  Chip,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  School as SchoolIcon, 
  Group, 
  Person, 
  CalendarToday, 
  Notes,
  Edit,
  Delete,
  Visibility
} from "@mui/icons-material";

const getInitials = (name: string) => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
};

const getRandomColor = (name: string) => {
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const columns: GridColDef[] = [
  {
    field: "schoolName",
    headerName: "Szkoła",
    width: 280,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: getRandomColor(params.value),
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {getInitials(params.value)}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Szkoła
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    field: "programName",
    headerName: "Program",
    width: 200,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        color="primary" 
        variant="filled" 
        size="small" 
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          }
        }}
      />
    ),
  },
  {
    field: "coordinatorName",
    headerName: "Koordynator",
    width: 220,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            background: getRandomColor(params.value),
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}
        >
          {getInitials(params.value)}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "500" }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Koordynator
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    field: "schoolYear",
    headerName: "Rok szkolny",
    width: 160,
    renderCell: (params) => (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1,
        p: 1,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #e0e0e0'
      }}>
        <CalendarToday sx={{ color: "#1976d2", fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "studentCount",
    headerName: "Liczba uczniów",
    type: "number",
    width: 160,
    renderCell: (params) => (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1,
        p: 1,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        border: '1px solid #4caf50'
      }}>
        <Group sx={{ color: "#4caf50", fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "notes",
    headerName: "Notatki",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || "Brak notatek"} arrow>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          p: 1,
          borderRadius: 2,
          background: params.value ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' : 'rgba(0,0,0,0.04)',
          border: params.value ? '1px solid #ff9800' : '1px solid #e0e0e0',
          cursor: 'pointer'
        }}>
          <Notes sx={{ color: params.value ? "#ff9800" : "#999", fontSize: 20 }} />
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 120,
              color: params.value ? "#e65100" : "#999"
            }}
          >
            {params.value || "Brak notatek"}
          </Typography>
        </Box>
      </Tooltip>
    ),
  },
  {
    field: "createdAt",
    headerName: "Data utworzenia",
    width: 160,
    renderCell: (params) => (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1,
        p: 1,
        borderRadius: 2,
        background: 'rgba(0,0,0,0.02)',
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "500" }}>
          {new Date(params.value).toLocaleDateString("pl-PL")}
        </Typography>
      </Box>
    ),
  },
  {
    field: "actions",
    headerName: "Akcje",
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Zobacz szczegóły" arrow>
          <IconButton
            size="small"
            sx={{
              color: "#1976d2",
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edytuj" arrow>
          <IconButton
            size="small"
            sx={{
              color: "#ff9800",
              '&:hover': {
                background: 'rgba(255, 152, 0, 0.1)',
              }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Usuń" arrow>
          <IconButton
            size="small"
            sx={{
              color: "#f44336",
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.1)',
              }
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
};
export const SchoolProgramParticipationTable = ({ schoolsMap, contactsMap, programsMap, participations, errorMessage, loading }: Props) => {
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

  return (
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
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography
          variant="h5"
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

      <Box sx={{ p: 3, background: "transparent" }}>
        {rows.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
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
                padding: "8px 16px",
              },
              "& .MuiDataGrid-columnHeaders": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderBottom: "none",
                borderRadius: "12px 12px 0 0",
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
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
                padding: "16px",
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
  );
};
