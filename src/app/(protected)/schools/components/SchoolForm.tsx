import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { TextField, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useSchoolForm } from "../hooks/useSchoolForm";
import type { SchoolFormProps } from "../types";
import type { CreateSchoolFormData, EditSchoolFormData } from "../schemas/schoolSchemas";

export const SchoolForm: React.FC<SchoolFormProps> = ({
  mode,
  school,
  onClose,
  onSave,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    isFormValid,
    handleTypeChange,
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Typ szkoły *
          </Typography>
          <FormGroup>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1 }}>
              {schoolTypes.map(([key, label]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      size="small"
                      onChange={(e) => handleTypeChange(key, e.target.checked)}
                    />
                  }
                  label={label}
                  sx={{ fontSize: "0.9rem" }}
                />
              ))}
            </Box>
          </FormGroup>
          {errors.type && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
              {errors.type.message}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
          {onClose && (
            <Button
              onClick={onClose}
              variant="outlined"
              size="medium"
              sx={{ borderRadius: 2 }}
            >
              Anuluj
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            size="medium"
            disabled={loading || !isFormValid}
            startIcon={loading ? <CircularProgress size={18} /> : null}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
              },
            }}
          >
            {loading ? "Zapisywanie..." : isEditMode ? "Zapisz zmiany" : "Dodaj szkołę"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  if (isEditMode) {
    return (
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Paper elevation={0} sx={{ p: 3, mt: 2, backgroundColor: "transparent" }}>
            {formContent}
          </Paper>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        border: "1px solid #e9ecef",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#1976d2",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
      {formContent}
    </Paper>
  );
};
