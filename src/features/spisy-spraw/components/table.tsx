import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import type { CaseRecord } from "@/types";
import { DataTable, defaultActions, LoadingSpinner, EmptyState, DateCell } from "@/components/shared";
import { Box, Typography, Paper } from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";

interface ActCaseRecordsTableProps {
  caseRecords: CaseRecord[];
  deleteCaseRecord: (caseId: string) => void;
  editCaseRecord: (caseRecord: CaseRecord) => void;
  loading?: boolean;
}

const createColumns = (): GridColDef[] => [
  { field: "code", headerName: "Kod", flex: 0.8, minWidth: 100 },
  { field: "referenceNumber", headerName: "Numer referencyjny", flex: 1.5, minWidth: 200 },
  { field: "title", headerName: "Tytuł", flex: 2, minWidth: 250 },
  {
    field: "date",
    headerName: "Data",
    flex: 0.8,
    minWidth: 120,
    renderCell: (params) => <DateCell date={params.value} format="short" />,
  },
  {
    field: "startDate",
    headerName: "Data rozpoczęcia",
    flex: 0.8,
    minWidth: 120,
    renderCell: (params) => <DateCell date={params.value} format="short" />,
  },
  {
    field: "endDate",
    headerName: "Data zakończenia",
    flex: 0.8,
    minWidth: 120,
    renderCell: (params) => <DateCell date={params.value} format="short" />,
  },
  { field: "sender", headerName: "Nadawca", flex: 1, minWidth: 150 },
  { field: "comments", headerName: "Uwagi", flex: 1.2, minWidth: 150 },
];

export const ActCaseRecordsTable: React.FC<ActCaseRecordsTableProps> = ({
  caseRecords,
  deleteCaseRecord,
  editCaseRecord,
  loading = false,
}) => {
  const columns = createColumns();

  const actions = [
    defaultActions.edit((id: string) => {
      const caseRecord = caseRecords.find((record) => record.id === id);
      if (caseRecord) {
        editCaseRecord(caseRecord);
      }
    }),
    defaultActions.delete(deleteCaseRecord),
  ];

  if (loading) {
    return <LoadingSpinner size={48} message="Ładowanie danych..." sx={{ minHeight: 200 }} />;
  }

  if (caseRecords.length === 0) {
    return <EmptyState title="Brak danych" description="Nie znaleziono żadnych akt spraw" />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
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
            flexWrap: "wrap",
            wordBreak: "break-word",
            whiteSpace: "normal",
            lineHeight: 1.3,
          }}
        >
          <DescriptionIcon sx={{ color: "#1976d2", flexShrink: 0 }} />
          <Box component="span" sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
            Akta sprawy ({caseRecords.length})
          </Box>
        </Typography>
      </Box>

      <Box sx={{ p: 2, background: "transparent" }}>
        <DataTable
          data={caseRecords as unknown as Record<string, unknown>[]}
          columns={columns}
          actions={actions}
          loading={loading}
          height={600}
          pageSizeOptions={[5, 10, 25, 50]}
          getRowId={(row) => row.id as string}
          sortingModel={[{ field: "date", sort: "desc" }]}
          sx={{
            background: "white",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        />
      </Box>
    </Paper>
  );
};
