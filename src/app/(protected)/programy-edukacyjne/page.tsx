"use client";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import type { Program } from "@/types";
import { PROGRAM_TYPE } from "@/constants/programs";
import { usePrograms } from "@/hooks/useProgram";

export default function Programs() {
  const { programs, loading, errorMessage, handleProgramSubmit, handleProgramDelete } = usePrograms();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Program, "id">>({
    defaultValues: {
      code: "",
      name: "",
      programType: PROGRAM_TYPE.PROGRAMOWY,
      description: "",
    },
  });

  const onSubmit = async (data: Omit<Program, "id">) => {
    console.log(data);
    await handleProgramSubmit(data);
    reset();
  };

  const columns: GridColDef[] = [
    { field: "code", headerName: "Numer referencyjny", flex: 1 },
    { field: "name", headerName: "Nazwa", flex: 2 },
    {
      field: "programType",
      headerName: "Typ programu",
      flex: 1,
      valueGetter: (params: string) => {
        return params;
      },
    },
    // { field: "description", headerName: "Opis", flex: 2 },
    {
      field: "actions",
      headerName: "Akcje",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleProgramDelete(params.row.id)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            px: 2,
            color: "white",
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#bc0009ff",
            },
          }}
        >
          Usuń
        </Button>
      ),
      flex: 1,
    },
  ];

  const [openForm, setOpenForm] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        pb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button onClick={() => setOpenForm((prev) => !prev)} sx={{ my: 2, mx: "auto" }}>
        Dodaj program
      </Button>
      {openForm && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: "0 auto" }}>
          <h2>Dodaj program</h2>
          <Controller
            name="code"
            control={control}
            rules={{ required: "Kod jest wymagany" }}
            render={({ field }) => (
              <TextField
                label="Kod"
                fullWidth
                required
                {...field}
                error={!!errors.code}
                helperText={errors.code?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={{ required: "Nazwa jest wymagana" }}
            render={({ field }) => (
              <TextField
                label="Nazwa"
                fullWidth
                required
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
              />
            )}
          />
          <Controller
            name="programType"
            control={control}
            rules={{ required: "Typ programu jest wymagany" }}
            render={({ field }) => (
              <TextField
                select
                label="Typ programu"
                fullWidth
                required
                {...field}
                error={!!errors.programType}
                helperText={errors.programType?.message}
                margin="normal"
              >
                <MenuItem value={PROGRAM_TYPE.PROGRAMOWY}>{PROGRAM_TYPE.PROGRAMOWY}</MenuItem>
                <MenuItem value={PROGRAM_TYPE.NIEPROGRAMOWY}>{PROGRAM_TYPE.NIEPROGRAMOWY}</MenuItem>
              </TextField>
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: "Opis jest wymagany" }}
            render={({ field }) => (
              <TextField
                label="Opis"
                fullWidth
                required
                multiline
                minRows={2}
                {...field}
                error={!!errors.description}
                helperText={errors.description?.message}
                margin="normal"
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading || isSubmitting} fullWidth sx={{ mt: 2 }}>
            Dodaj program
          </Button>
          {errorMessage && (
            <Typography color="error" style={{ marginTop: 16 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ mt: 4, px: 2, width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Programy
        </Typography>
        {loading ? (
          <Typography>Ładowanie...</Typography>
        ) : errorMessage ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <DataGrid
            rows={programs}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 50 } },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
