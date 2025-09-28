import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Contact, Program, School, SchoolProgramParticipation } from "@/types";
import { 
  Box, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress,
  Chip
} from "@mui/material";
import { 
  School as SchoolIcon, 
  Group, 
  Person, 
  CalendarToday,
  Notes
} from "@mui/icons-material";

const columns: GridColDef[] = [
  { 
    field: "schoolName", 
    headerName: "Szkoła", 
    width: 300,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon sx={{ color: '#1976d2', fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: "programName", 
    headerName: "Program", 
    width: 200,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        color="primary" 
        variant="outlined" 
        size="small"
        icon={<Group />}
      />
    )
  },
  { 
    field: "coordinatorName", 
    headerName: "Koordynator", 
    width: 200,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person sx={{ color: '#666', fontSize: 20 }} />
        <Typography variant="body2">
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: "schoolYear", 
    headerName: "Rok szkolny", 
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarToday sx={{ color: '#666', fontSize: 20 }} />
        <Typography variant="body2">
          {params.value}
        </Typography>
      </Box>
    )
  },
  {
    field: "studentCount",
    headerName: "Liczba uczniów",
    type: "number",
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Group sx={{ color: '#666', fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: "notes", 
    headerName: "Notatki", 
    width: 250,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Notes sx={{ color: '#666', fontSize: 20 }} />
        <Typography variant="body2" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 200
        }}>
          {params.value || 'Brak notatek'}
        </Typography>
      </Box>
    )
  },
  { 
    field: "createdAt", 
    headerName: "Data utworzenia", 
    width: 180,
    renderCell: (params) => (
      <Typography variant="caption" color="text.secondary">
        {new Date(params.value).toLocaleDateString('pl-PL')}
      </Typography>
    )
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 200,
        flexDirection: 'column',
        gap: 2
      }}>
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        p: 3,
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SchoolIcon sx={{ color: '#1976d2' }} />
          Lista uczestnictwa ({rows.length})
        </Typography>
      </Box>

      <Box sx={{ p: 3, background: 'transparent' }}>
        {rows.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            background: 'rgba(255,255,255,0.8)',
            borderRadius: 3
          }}>
            <SchoolIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
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
              background: 'white',
              borderRadius: 3,
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
              },
              '& .MuiDataGrid-columnHeaders': {
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderBottom: '2px solid #e0e0e0',
              },
              '& .MuiDataGrid-row:hover': {
                background: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          />
        )}
      </Box>
    </Paper>
  );
};
