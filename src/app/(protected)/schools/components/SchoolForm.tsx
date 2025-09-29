import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import { TextField, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useSchoolForm } from "../hooks/useSchoolForm";
import { EditDialog } from "@/components/shared/EditDialog";
import type { SchoolFormProps } from "../types";
// import type { CreateSchoolFormData, EditSchoolFormData } from "../schemas/schoolSchemas";

export const SchoolForm: React.FC<SchoolFormProps> = ({ mode, school, onClose, onSave, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    handleTypeChange,
    selectedTypes,
    schoolTypes,
  } = useSchoolForm({
    mode,
    school,
    onSubmit: onSave || (() => {}),
  });

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edytuj szkołę" : "Dodaj szkołę";

  const formContent = (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {/* Basic Information */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Nazwa szkoły"
              fullWidth
              required
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ borderRadius: 1.5 }}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              required
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ borderRadius: 1.5 }}
            />
          )}
        />

        {/* Address Information */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Miasto"
                fullWidth
                required
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ borderRadius: 1.5 }}
              />
            )}
          />

          <Controller
            name="postalCode"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Kod pocztowy"
                fullWidth
                required
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder="XX-XXX"
                sx={{ borderRadius: 1.5 }}
              />
            )}
          />
        </Box>

        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Adres"
              fullWidth
              required
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ borderRadius: 1.5 }}
            />
          )}
        />

        <Controller
          name="municipality"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Gmina"
              fullWidth
              required
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ borderRadius: 1.5 }}
            />
          )}
        />

        {/* School Types */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: "0.9rem" }}>
            Typ szkoły *
          </Typography>
          <FormGroup>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 0.5,
                maxHeight: 120,
                overflowY: "auto",
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: "#fafafa",
              }}
            >
              {schoolTypes.map(([key, label]) => {
                // Check if the stored type (label) matches this checkbox's label
                const isChecked = selectedTypes.includes(label);
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onChange={(e) => handleTypeChange(label as (typeof selectedTypes)[number], e.target.checked)}
                        sx={{
                          py: 0.5,
                          "& .MuiSvgIcon-root": { fontSize: "1rem" },
                        }}
                      />
                    }
                    label={label}
                    sx={{
                      fontSize: "0.8rem",
                      margin: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.8rem",
                        lineHeight: 1.2,
                      },
                    }}
                  />
                );
              })}
            </Box>
          </FormGroup>
          {errors.type && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block", fontSize: "0.75rem" }}>
              {errors.type.message}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );

  return (
    <EditDialog
      open={true}
      onClose={onClose || (() => {})}
      title={title}
      onSave={onSave ? handleSubmit : undefined}
      loading={loading}
      saveText={isEditMode ? "Zapisz zmiany" : "Dodaj szkołę"}
      cancelText="Anuluj"
      maxWidth="md"
      fullWidth
      mode={mode}
    >
      {formContent}
    </EditDialog>
  );
};
