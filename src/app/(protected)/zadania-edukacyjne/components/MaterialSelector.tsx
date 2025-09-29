import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Autocomplete,
  Alert,
} from "@mui/material";
import { Add, Delete, LocalLibrary } from "@mui/icons-material";
import { Controller, Control, FieldArrayWithId } from "react-hook-form";
import { FormField } from "@/components/shared";
import { EDUCATIONAL_MATERIALS, MATERIAL_CATEGORY_LABELS, getMaterialById } from "@/constants/materials";
import type { MaterialItem } from "@/constants/materials";

interface MaterialSelectorProps {
  control: Control<any, any>;
  fields: (FieldArrayWithId<any, any, "id"> & {
    originalId?: string;
    name?: string;
    type?: string;
  })[];
  append: (value: any) => void;
  remove: (index: number) => void;
  activityIndex: number;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({ control, fields, append, remove, activityIndex }) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");

  const addMaterial = () => {
    if (selectedMaterialId) {
      const materialTemplate = getMaterialById(selectedMaterialId);
      if (materialTemplate) {
        append({
          id: materialTemplate.id,
          name: materialTemplate.name,
          type: materialTemplate.type,
          distributedCount: materialTemplate.defaultCount || 1,
          description: materialTemplate.description || "",
        });
        setSelectedMaterialId("");
      }
    }
  };

  const removeMaterial = (index: number) => {
    remove(index);
  };

  // Group materials by category for better UX
  const groupedMaterials = Object.values(MATERIAL_CATEGORY_LABELS).map((categoryLabel) => {
    const categoryKey = Object.keys(MATERIAL_CATEGORY_LABELS).find(
      (key) => MATERIAL_CATEGORY_LABELS[key as keyof typeof MATERIAL_CATEGORY_LABELS] === categoryLabel
    );
    const materials = EDUCATIONAL_MATERIALS.filter((material) => material.category === categoryKey?.toLowerCase());
    return { category: categoryLabel, materials };
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalLibrary sx={{ color: "#1976d2" }} />
          Materiały edukacyjne
        </Typography>
        <Button startIcon={<Add />} onClick={addMaterial} variant="outlined" disabled={!selectedMaterialId} sx={{ fontWeight: "medium" }}>
          Dodaj materiał
        </Button>
      </Box>

      {/* Material selection */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          value={selectedMaterialId ? EDUCATIONAL_MATERIALS.find((m) => m.id === selectedMaterialId) : null}
          onChange={(_, material) => setSelectedMaterialId(material?.id || "")}
          options={EDUCATIONAL_MATERIALS}
          getOptionLabel={(option) => option.name}
          groupBy={(option) => MATERIAL_CATEGORY_LABELS[option.category as keyof typeof MATERIAL_CATEGORY_LABELS]}
          renderInput={(params) => (
            <TextField {...params} label="Wybierz materiał z listy" placeholder="Wpisz nazwę lub wybierz z listy..." fullWidth />
          )}
          renderGroup={(params) => (
            <Box key={`group-${params.group}`}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 1,
                  ml: 1,
                }}
              >
                {params.group}
              </Typography>
              {params.children}
            </Box>
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight="medium">
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.type} • Domyślnie: {option.defaultCount || 1} szt.
                </Typography>
                {option.description && (
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
          sx={{ mb: 2 }}
        />

        {selectedMaterialId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Wybrano: {getMaterialById(selectedMaterialId)?.name}
            {getMaterialById(selectedMaterialId)?.description && ` - ${getMaterialById(selectedMaterialId)?.description}`}
          </Alert>
        )}
      </Box>

      {/* Selected materials */}
      {fields.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outlined" sx={{ backgroundColor: "grey.50" }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {EDUCATIONAL_MATERIALS.find((m) => m.id === field.originalId)?.name || field.name || `Materiał ${index + 1}`}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        label={EDUCATIONAL_MATERIALS.find((m) => m.id === field.originalId)?.type || field.type || "brak typu"}
                        size="small"
                        variant="outlined"
                      />
                      <Chip label={`ID: ${field.originalId || field.id}`} size="small" variant="outlined" color="secondary" />
                    </Box>
                  </Stack>
                  <IconButton onClick={() => removeMaterial(index)} size="small" sx={{ color: "error.main" }} title="Usuń materiał">
                    <Delete />
                  </IconButton>
                </Box>
                <Stack spacing={2}>
                  <Controller
                    name={`activities.${activityIndex}.materials.${index}.distributedCount`}
                    control={control}
                    rules={{
                      required: "Ilość jest wymagana",
                      min: { value: 1, message: "Minimum 1 sztuka" },
                      max: { value: 10000, message: "Maksimum 10000 sztuk" },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Ilość rozdanych egzemplarzy"
                        type="number"
                        required
                        fullWidth
                        size="small"
                        error={fieldState.error !== undefined}
                        helperText={fieldState.error?.message}
                        inputProps={{ min: 1, max: 10000 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="body2" color="text.secondary">
                                szt.
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Controller
                    name={`activities.${activityIndex}.materials.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dodatkowy opis (opcjonalny)"
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                        placeholder="Wpisz dodatkowe informacje o dystrybucji..."
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Empty state */}
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
          <LocalLibrary sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Brak materiałów
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Wybierz materiał z listy powyżej i kliknij "Dodaj materiał" aby rozpocząć dystrybucję
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              if (EDUCATIONAL_MATERIALS[0]) {
                setSelectedMaterialId(EDUCATIONAL_MATERIALS[0].id);
              }
            }}
          >
            Wybierz pierwszy materiał
          </Button>
        </Box>
      )}
    </Box>
  );
};
