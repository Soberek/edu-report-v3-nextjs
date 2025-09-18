import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import type { Contact } from "@/types";
import { Box, Button, Typography } from "@mui/material";

interface Props {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  handleContactDelete: (id: string) => void;
}

export default function ContactList({ contacts, loading, error, handleContactDelete }: Props) {
  const columns: GridColDef[] = [
    // hidden id
    { field: "id", headerName: "ID", flex: 1, hideable: true },
    { field: "firstName", headerName: "Imię", flex: 1 },
    { field: "lastName", headerName: "Nazwisko", flex: 1 },
    { field: "phone", headerName: "Telefon", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Akcje",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleContactDelete(params.row.id)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: 2,
          }}
        >
          Usuń
        </Button>
      ),
      flex: 0.7,
    },
  ];

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h6" gutterBottom>
        Kontakty
      </Typography>
      {loading ? (
        <Typography>Ładowanie...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={contacts}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={
              {
                //   pagination: { paginationModel: { pageSize: 100 } },
              }
            }
          />
        </Box>
      )}
    </Box>
  );
}
