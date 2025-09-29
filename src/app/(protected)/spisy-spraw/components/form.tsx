import React from "react";
import { Box, MenuItem, Select, FormControl, FormHelperText, SelectChangeEvent } from "@mui/material";
import { Controller, type Control, type FieldErrors, type UseFormHandleSubmit } from "react-hook-form";
import type { CaseRecord } from "@/types";
import { FormField, FormSection, ActionButton } from "@/components/shared";
import { Assignment, Save } from "@mui/icons-material";

interface ActFormProps {
  control: Control<CaseRecord>;
  handleSubmit: UseFormHandleSubmit<CaseRecord>;
  onSubmit: (data: CaseRecord) => void;
  errors: FieldErrors<CaseRecord>;
  actsOptions: string[];
}

const CustomSelectField: React.FC<{
  control: Control<CaseRecord>;
  name: "code";
  label: string;
  options: string[];
  errors: FieldErrors<CaseRecord>;
}> = ({ control, name, label, options, errors }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Kod jest wymagany" }}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors[name]}>
          <Select
            {...field}
            displayEmpty
            inputProps={{ "aria-placeholder": label }}
            onChange={(event: SelectChangeEvent) => field.onChange(event.target.value)}
            sx={{
              borderRadius: 2,
              background: "white",
            }}
          >
            <MenuItem value="" disabled>
              <em>{label}</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {errors[name] && (
            <FormHelperText>{errors[name]?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export const ActForm: React.FC<ActFormProps> = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
  actsOptions,
}) => {
  return (
    <FormSection
      title="Dodaj nowy akt sprawy"
      icon={<Assignment />}
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
        }}
      >
        {/* Code Selection */}
        <Box>
          <CustomSelectField
            control={control}
            name="code"
            label="Wybierz kod"
            options={actsOptions}
            errors={errors}
          />
        </Box>

        {/* Reference Number */}
        <FormField
          name="referenceNumber"
          control={control}
          label="Numer referencyjny"
          placeholder="Wprowadź numer referencyjny np. OZiPZ.0442.1.2024"
          required
          helperText="Format: OZiPZ.XXXX.X.YYYY"
        />

        {/* Date */}
        <FormField
          name="date"
          control={control}
          label="Data"
          required
        />

        {/* Title */}
        <FormField
          name="title"
          control={control}
          label="Tytuł"
          required
        />

        {/* Start Date */}
        <FormField
          name="startDate"
          control={control}
          label="Data wszczęcia sprawy"
          required
        />

        {/* End Date */}
        <FormField
          name="endDate"
          control={control}
          label="Data zakończenia sprawy"
          required
        />

        {/* Sender */}
        <FormField
          name="sender"
          control={control}
          label="Nadawca"
        />

        {/* Comments */}
        <FormField
          name="comments"
          control={control}
          label="Uwagi"
        />

        {/* Notes - spanning full width */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <FormField
            name="notes"
            control={control}
            label="Notatki"
            type="textarea"
            rows={4}
            helperText="Szczegółowe uwagi dotyczące akt sprawy"
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", mt: 2 }}>
          <ActionButton
            type="submit"
            variant="contained"
            startIcon={<Save />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
              px: 4,
              p: 1.5,
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Zapisz akt sprawy
          </ActionButton>
        </Box>
      </Box>
    </FormSection>
  );
};