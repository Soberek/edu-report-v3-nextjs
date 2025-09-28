import React from "react";
import { useFieldArray, useFormContext, useWatch, Controller } from "react-hook-form";
import { Box, Typography, Button, IconButton, Stack, Divider, TextField } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormField } from "@/components/shared";
import { TASK_TYPES } from "@/constants/tasks";
import { MEDIA_PLATFORMS, MATERIAL_TYPES } from "@/constants/educationalTasks";
import { CreateEducationalTaskFormData } from "@/types";

interface MaterialsFormProps {
  activityIndex: number;
}

const MaterialsForm: React.FC<MaterialsFormProps> = ({ activityIndex }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `activities.${activityIndex}.materials`,
  });

  const addMaterial = () => {
    append({
      type: "ulotka",
      name: "",
      distributedCount: 1,
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2" fontWeight="bold">
          Materiały
        </Typography>
        <Button startIcon={<Add />} onClick={addMaterial} variant="outlined" size="small">
          Dodaj materiał
        </Button>
      </Box>

      {fields.map((field, materialIndex) => (
        <Box
          key={field.id}
          sx={{
            p: 2,
            mb: 1,
            backgroundColor: "grey.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="bold">
              Materiał {materialIndex + 1}
            </Typography>
            <IconButton onClick={() => remove(materialIndex)} color="error" size="small" disabled={fields.length === 1}>
              <Delete />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <FormField
              name={`activities.${activityIndex}.materials.${materialIndex}.type`}
              control={control}
              label="Typ materiału"
              type="select"
              required
              fullWidth
              options={Object.entries(MATERIAL_TYPES).map(([key, value]) => ({
                value,
                label: value,
              }))}
            />

            <FormField
              name={`activities.${activityIndex}.materials.${materialIndex}.name`}
              control={control}
              label="Nazwa materiału"
              required
              fullWidth
            />

            <Controller
              name={`activities.${activityIndex}.materials.${materialIndex}.distributedCount`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ilość rozdanych egzemplarzy"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 1, max: 10000 }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                />
              )}
            />
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export const ActivityForm: React.FC = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  // Watch all activity types at once
  const watchedActivities = useWatch({
    control,
    name: "activities",
  });

  const addActivity = () => {
    append({
      type: "prelekcja",
      title: "",
      description: "",
      actionCount: 1,
      audienceCount: 0,
    });
  };

  const removeActivity = (index: number) => {
    remove(index);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Aktywności
        </Typography>
        <Button startIcon={<Add />} onClick={addActivity} variant="outlined" size="small">
          Dodaj aktywność
        </Button>
      </Box>

      {fields.map((field, index) => {
        const activityType = watchedActivities?.[index]?.type;
        const isPublication = activityType === "publikacja media";
        const isDistribution = activityType === "dystrybucja";

        return (
          <Box key={field.id} sx={{ mb: 3, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Aktywność {index + 1}
              </Typography>
              <IconButton onClick={() => removeActivity(index)} color="error" size="small" disabled={fields.length === 1}>
                <Delete />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              <FormField
                name={`activities.${index}.type`}
                control={control}
                label="Typ aktywności"
                type="select"
                required
                fullWidth
                options={Object.values(TASK_TYPES).map((taskType) => ({
                  value: taskType.label,
                  label: taskType.label,
                }))}
              />

              <FormField name={`activities.${index}.title`} control={control} label="Tytuł aktywności" required fullWidth />

              <Controller
                name={`activities.${index}.actionCount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ilość działań"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ min: 1, max: 100 }}
                    onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                  />
                )}
              />

              <Controller
                name={`activities.${index}.audienceCount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ilość odbiorców"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ min: 0, max: 10000 }}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  />
                )}
              />

              <FormField name={`activities.${index}.description`} control={control} label="Opis" multiline rows={2} required fullWidth />

              {isPublication && (
                <>
                  <Divider />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Informacje o publikacji
                  </Typography>

                  <FormField name={`activities.${index}.media.title`} control={control} label="Tytuł publikacji" required fullWidth />
                  <FormField
                    name={`activities.${index}.media.platform`}
                    control={control}
                    label="Platforma"
                    type="select"
                    required
                    fullWidth
                    options={Object.entries(MEDIA_PLATFORMS).map(([key, value]) => ({
                      value,
                      label: value,
                    }))}
                  />

                  <FormField
                    name={`activities.${index}.media.link`}
                    control={control}
                    label="Link do publikacji"
                    type="text"
                    required
                    fullWidth
                  />
                </>
              )}

              {isDistribution && (
                <>
                  <Divider />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Materiały do dystrybucji
                  </Typography>

                  <MaterialsForm activityIndex={index} />
                </>
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};
