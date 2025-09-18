import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box, MenuItem, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import type { School } from "@/types";
import { useState } from "react";
import { schoolTypes } from "@/constants";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";

export const Schools = () => {
  const userContext = useUser();

  const {
    data: schools,
    loading: loadingSchools,
    error: errorMessage,
    createItem: createSchool,
    // updateItem: updateSchool,
    deleteItem: deleteSchool,
  } = useFirebaseData<School>("schools", userContext.user?.uid);

  const { control, handleSubmit } = useForm<Omit<School, "id" | "createdAt" | "updatedAt">>();

  const onSubmit = async (data: Omit<School, "id" | "createdAt" | "updatedAt">) => {
    await createSchool(data);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nazwa", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Adres", flex: 1 },
    { field: "city", headerName: "Miasto", flex: 1 },
    { field: "postalCode", headerName: "Kod pocztowy", flex: 1 },
    { field: "municipality", headerName: "Gmina", flex: 1 },
    {
      field: "type",
      headerName: "Typ",
      flex: 1,
      valueGetter: (params: School["type"]) => {
        if (params && Array.isArray(params)) {
          return params.join(", ");
        }
      },
    },
    {
      field: "actions",
      headerName: "Akcje",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteSchool(params.row.id)}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 1,
            }}
          >
            Usuń
          </Button>
        </Box>
      ),
      flex: 0.7,
    },
  ];

  const [openForm, setOpenForm] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpenForm((prev) => !prev)} sx={{ my: 2, mx: 2, textTransform: "none", px: 4 }}>
        Dodaj szkołę
      </Button>
      {openForm && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: "0 auto" }}>
          <h2>Dodaj szkołę</h2>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Nazwa jest wymagana" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Nazwa"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            rules={{ required: "Adres jest wymagany" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Adres"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            rules={{ required: "Miasto jest wymagane" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Miasto"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="postalCode"
            control={control}
            rules={{ required: "Kod pocztowy jest wymagany" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Kod pocztowy"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="municipality"
            control={control}
            rules={{ required: "Gmina jest wymagana" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Gmina"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              />
            )}
          />

          <FormGroup>
            {Object.entries(schoolTypes).map(([key, label]) => {
              return <FormControlLabel key={key} control={<Checkbox />} label={`${label}`} />;
            })}
          </FormGroup>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Typ szkoły jest wymagany" }}
            render={({ field, fieldState }) => (
              <TextField
                select
                label="Typ szkoły"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              >
                {Object.entries(schoolTypes).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email jest wymagany",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Nieprawidłowy adres email",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              />
            )}
          />
          <Button type="submit" disabled={loadingSchools} fullWidth sx={{ mt: 2 }}>
            Dodaj szkołę
          </Button>
          {errorMessage && (
            <Typography color="error" style={{ marginTop: 16 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      )}

      {/* Lista szkół */}
      <Box sx={{ mt: 4, px: 2 }}>
        <Typography variant="h6" gutterBottom>
          Szkoły
        </Typography>
        {loadingSchools ? (
          <Typography>Ładowanie...</Typography>
        ) : errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={schools}
              columns={columns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};
