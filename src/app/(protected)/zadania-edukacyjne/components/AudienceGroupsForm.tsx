import React from "react";
import { Box, Typography, Stack, IconButton, Chip } from "@mui/material";
import { Add, Delete, People } from "@mui/icons-material";
import { Controller, Control, FieldArrayWithId, useFormContext } from "react-hook-form";
import { AudienceGroup, CreateEducationalTaskFormData, AudienceType } from "@/types";
import { FormField, ActionButton } from "@/components/shared";

interface AudienceGroupsFormProps {
  control: Control<any, any>;
  fields: FieldArrayWithId<any, any, "id">[];
  append: (value: any) => void;
  remove: (index: number) => void;
  basePath: string; // ścieżka bazowa, np. "audienceGroups" lub "activities.0.audienceGroups"
}

const AUDIENCE_TYPES: { value: AudienceType; label: string }[] = [
  { value: "dorośli", label: "Dorośli" },
  { value: "młodzież", label: "Młodzież" },
  { value: "dzieci", label: "Dzieci" },
  { value: "seniorzy", label: "Seniorzy" },
];

export const AudienceGroupsForm: React.FC<AudienceGroupsFormProps> = ({ control, fields, append, remove, basePath }) => {
  const { watch } = useFormContext();

  const addGroup = () => {
    const nextGroupNumber = fields.length + 1;
    append({
      name: `Grupa ${nextGroupNumber}`,
      type: "dorośli",
      count: 1,
    });
  };

  const removeGroup = (index: number) => {
    remove(index);
  };

  const getTotalAudience = () => {
    const audienceGroups = watch(basePath) || [];
    return audienceGroups.reduce((total: number, group: any) => {
      const count = Number(group.count) || 0;
      return total + count;
    }, 0);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <People sx={{ color: "#1976d2" }} />
        Grupy Odbiorców
      </Typography>

      <Stack spacing={3}>
        {/* Existing Groups */}
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              p: 3,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                {`Grupa ${index + 1}`}
              </Typography>
              <IconButton onClick={() => removeGroup(index)} size="small" sx={{ color: "error.main" }} title="Usuń grupę">
                <Delete />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              {/* Group Name */}
              <Controller
                name={`${basePath}.${index}.name`}
                control={control}
                rules={{
                  required: "Nazwa grupy jest wymagana",
                  minLength: { value: 1, message: "Nazwa nie może być pusta" },
                }}
                render={({ field, fieldState }) => (
                  <FormField
                    name={field.name}
                    control={control}
                    label="Nazwa grupy"
                    placeholder="np. Grupa I"
                    helperText="Wprowadź nazwę grupy"
                    fullWidth
                    required
                  />
                )}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Audience Type */}
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name={`${basePath}.${index}.type`}
                    control={control}
                    rules={{ required: "Wybierz typ odbiorcy" }}
                    render={({ field, fieldState }) => (
                      <FormField
                        name={field.name}
                        control={control}
                        label="Typ odbiorcy"
                        type="select"
                        options={AUDIENCE_TYPES}
                        helperText="Wybierz grupę wiekową"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Box>

                {/* Count */}
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name={`${basePath}.${index}.count`}
                    control={control}
                    rules={{
                      required: "Liczba osób jest wymagana",
                      min: { value: 1, message: "Minimum 1 osoba" },
                      max: { value: 1000, message: "Maksimum 1000 osób" },
                    }}
                    render={({ field, fieldState }) => (
                      <FormField
                        name={field.name}
                        control={control}
                        label="Liczba osób"
                        type="number"
                        placeholder="np. 30"
                        helperText="Wprowadź liczbę osób"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}

        {/* Add Group Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ActionButton onClick={addGroup} variant="outlined" startIcon={<Add />} sx={{ px: 3 }}>
            Dodaj grupę odbiorców
          </ActionButton>
        </Box>

        {/* Summary */}
        {fields.length > 0 && (
          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: "success.light",
              borderRadius: 2,
              backgroundColor: "success.light",
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" color="success.dark" sx={{ mb: 1 }}>
              📊 Podsumowanie odbiorców:
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Chip label={`Liczba grup: ${fields.length}`} variant="outlined" size="small" />
              <Chip label={`Łączna liczba osób: ${getTotalAudience()}`} variant="filled" color="success" size="small" />
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {fields.length === 0 && (
          <Box
            sx={{
              p: 4,
              border: 2,
              borderColor: "grey.300",
              borderRadius: 2,
              backgroundColor: "grey.50",
              textAlign: "center",
            }}
          >
            <People sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Brak grup odbiorców
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Dodaj grupy odbiorców, aby określić liczbę osób i ich typ (dorośli, młodzież, dzieci, seniorzy)
            </Typography>
            <ActionButton onClick={addGroup} variant="outlined" startIcon={<Add />} size="large">
              Dodaj pierwszą grupę
            </ActionButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
