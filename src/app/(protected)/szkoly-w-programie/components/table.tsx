import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Contact, Program, School, SchoolProgramParticipation } from "@/types";
import { Box } from "@mui/material";
// import type { SchoolProgramParticipation } from "../types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "schoolName", headerName: "School Name", width: 400 },
  { field: "programName", headerName: "Program Name", width: 150 },
  { field: "coordinatorName", headerName: "Coordinator Name", width: 150 },
  { field: "schoolYear", headerName: "School Year", width: 120 },
  {
    field: "studentCount",
    headerName: "Student Count",
    type: "number",
    width: 120,
  },
  { field: "createdAt", headerName: "Created At", width: 180 },
  { field: "notes", headerName: "Notes", width: 200 },
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
    return <div>Error: {errorMessage}</div>;
  }

  const mappedParticipations =
    participations?.reduce((acc, curr) => {
      const { id, schoolId, programId, coordinatorId } = curr;

      console.log(curr);
      acc[id] = {
        schoolName: schoolsMap[schoolId].name,
        programName: programsMap[programId].name,
        coordinatorName: `${contactsMap[coordinatorId].firstName} ${contactsMap[coordinatorId].lastName}`,
        ...curr,
      };

      return acc;
    }, {} as Record<string, { schoolName: string; programName: string; coordinatorName: string }>) || {};

  return (
    <Box sx={{ height: 400, width: "100%", my: 2, px: 4 }}>
      <DataGrid
        rows={Object.values(mappedParticipations)}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
