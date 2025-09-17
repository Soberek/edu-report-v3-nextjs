import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import type { ProgramsData } from "./processExcelData";

interface TableRow {
  id: string;
  programType: string;
  programName: string;
  actionName: string;
  actionNumber: number;
  people: number;
}

const columns: GridColDef[] = [
  {
    field: "programType",
    headerName: "Typ Programu",
    flex: 1,
    align: "center",
    headerAlign: "center",

    renderCell: (params) => (
      <Typography variant="body2" fontWeight="bold">
        {params.value}
      </Typography>
    ),
  },
  {
    field: "programName",
    headerName: "Program",
    flex: 1,
    align: "center",
    headerAlign: "center",

    renderCell: (params) => (
      <Typography variant="body2" fontWeight="medium">
        {params.value}
      </Typography>
    ),
  },
  {
    field: "actionName",
    headerName: "Działanie",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "actionNumber",
    headerName: "👩‍🏫 Liczba działań",
    width: 150,
    type: "number",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "people",
    headerName: "👨‍👩‍👧‍👦 Liczba odbiorców",
    width: 180,
    type: "number",
    align: "center",
    headerAlign: "center",
  },
];

export default function ExcelTable(data: ProgramsData) {
  const rows: TableRow[] = [];

  Object.entries(data).forEach(([programType, programNames]) => {
    Object.entries(programNames).forEach(([programName, actionNames]) => {
      Object.entries(actionNames).forEach(([actionName, counter]) => {
        rows.push({
          id: `${programType}-${programName}-${actionName}`,
          programType,
          programName,
          actionName,
          actionNumber: counter.actionNumber,
          people: counter.people,
        });
      });
    });
  });

  return (
    <Box sx={{ height: 2000, mx: 2, my: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0 },
          },
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            borderRight: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "grey.100",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
}
