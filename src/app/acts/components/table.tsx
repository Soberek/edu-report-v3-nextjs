import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { CaseRecord } from "@/types";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

interface Props {
  caseRecords: CaseRecord[];
  deleteCaseRecord: (caseId: string) => void;
  loading?: boolean;
}

const baseColumns: GridColDef[] = [
  { field: "code", headerName: "Code", flex: 1 },
  { field: "referenceNumber", headerName: "Reference Number", flex: 1 },
  { field: "title", headerName: "Title", flex: 1 },
  { field: "comments", headerName: "Comments", flex: 1 },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "notes", headerName: "Notes", flex: 1 },
  { field: "startDate", headerName: "Start Date", flex: 1 },
  { field: "endDate", headerName: "End Date", flex: 1 },
  { field: "sender", headerName: "Sender", flex: 1 },
  {
    field: "edit",
    headerName: "Edytuj",
    flex: 0.5,
    sortable: false,
    filterable: false,
    renderCell: () => (
      <IconButton
        sx={{
          background: "linear-gradient(to right, green, lightgreen)",
          color: "white",
          maxWidth: "100%",
          height: "auto",
          aspectRatio: "1",
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    ),
  },
  // The delete column will be added dynamically in the component
];

export const ActCaseRecordsTable = React.memo<Props>(({ caseRecords, deleteCaseRecord, loading }: Props) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 1200,
        width: "100%",
        mx: "auto",
        px: 2,
        my: 2,
      }}
    >
      <DataGrid
        rows={caseRecords}
        columns={[
          ...baseColumns,
          {
            field: "delete",
            headerName: "Usuń",
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: { row: CaseRecord }) => (
              <IconButton
                sx={{
                  background: "linear-gradient(to right, red, lightcoral)",
                  color: "white",
                  maxWidth: "100%",
                  height: "auto",
                  aspectRatio: "1",
                }}
                onClick={() => deleteCaseRecord(params.row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ),
          },
        ]}
        getRowId={(row) => row.id}
      />
    </Box>
  );
});
