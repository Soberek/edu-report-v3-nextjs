import React from "react";
import { useFieldArray, useFormContext, useWatch, Controller } from "react-hook-form";
import { Box, Typography, Button, IconButton, Stack, Divider, TextField } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormField } from "@/components/shared";
import { TASK_TYPES } from "@/constants/tasks";
import { MEDIA_PLATFORMS, MATERIAL_TYPES } from "@/constants/educationalTasks";
import { CreateEducationalTaskFormData } from "@/types";
import { AudienceGroupsForm } from "./AudienceGroupsForm";
import { MaterialSelector } from "./MaterialSelector";

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
  const { control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  // Watch all activity types at once
  const watchedActivities = useWatch({
    control,
    name: "activities",
  });

  // Pre-define maximum number of activities to avoid conditional hooks
  const maxActivities = 10;
  const materialWatches = Array.from({ length: maxActivities }, (_, index) =>
    useWatch({
      control,
      name: `activities.${index}.materials`,
    })
  );

  // Only use the materials for existing activities
  const watchedAllMaterials = React.useMemo(() => {
    if (!watchedActivities) return [];
    return materialWatches.slice(0, watchedActivities.length);
  }, [watchedActivities, materialWatches]);

  // Helper component for activity audience groups
  const ActivityAudienceGroups: React.FC<{ activityIndex: number }> = ({ activityIndex }) => {
    const { setValue } = useFormContext();
    const audienceGroups =
      useWatch({
        control,
        name: `activities.${activityIndex}.audienceGroups`,
      }) || [];

    const addAudienceGroup = () => {
      const nextGroupNumber = audienceGroups.length + 1;
      const newGroup = {
        id: `audience-${activityIndex}-${nextGroupNumber}`,
        name: `Grupa ${nextGroupNumber}`,
        type: "dorośli",
        count: 30,
      };
      const updatedGroups = [...audienceGroups, newGroup];

      // Use setValue to update the form field
      setValue(`activities.${activityIndex}.audienceGroups`, updatedGroups);
    };

    const removeAudienceGroup = (removeIndex: number) => {
      const updatedGroups = audienceGroups.filter((_: any, index: number) => index !== removeIndex);
      setValue(`activities.${activityIndex}.audienceGroups`, updatedGroups);
    };

    // Create fields array compatible with AudienceGroupsForm
    const fields = audienceGroups.map((group: any, index: number) => ({
      id: group.id || `audience-${activityIndex}-${index}`,
      ...group,
    }));

    return (
      <AudienceGroupsForm
        control={control}
        fields={fields}
        append={() => addAudienceGroup()}
        remove={removeAudienceGroup}
        basePath={`activities.${activityIndex}.audienceGroups`}
      />
    );
  };

  // Helper functions for activity materials
  const getMaterialsFields = (activityIndex: number) => {
    const materials = watchedAllMaterials[activityIndex] || [];
    return materials.map((material: any, index: number) => ({
      id: `field-${activityIndex}-${index}`, // Unique React key
      originalId: material.id || `material-${activityIndex}-${index}`,
      ...material,
    }));
  };

  const appendMaterial = (activityIndex: number, value: any) => {
    const currentMaterials = watchedAllMaterials[activityIndex] || [];
    const newMaterial = {
      ...value,
      id: value.id || `material-${activityIndex}-${currentMaterials.length}`,
    };
    const updatedMaterials = [...currentMaterials, newMaterial];
    setValue(`activities.${activityIndex}.materials`, updatedMaterials);
  };

  const removeMaterial = (activityIndex: number, materialIndex: number) => {
    const currentMaterials = watchedAllMaterials[activityIndex] || [];
    const updatedMaterials = currentMaterials.filter((_: any, index: number) => index !== materialIndex);
    setValue(`activities.${activityIndex}.materials`, updatedMaterials);
  };

  const addActivity = () => {
    append({
      type: "prelekcja",
      title: "",
      description: "",
      actionCount: 1,
      audienceCount: 0,
      audienceGroups: [
        {
          name: "Grupa I",
          type: "dorośli",
          count: 30,
        },
      ],
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
              <Controller
                name={`activities.${index}.type`}
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="Typ aktywności"
                    type="select"
                    required
                    fullWidth
                    options={Object.values(TASK_TYPES).map((taskType) => ({
                      value: taskType.label,
                      label: taskType.label,
                    }))}
                    onChange={(value) => {
                      field.onChange(value);
                      // Clear materials and media when activity type changes
                      if (value !== "dystrybucja") {
                        setValue(`activities.${index}.materials`, []);
                      }
                      if (value !== "publikacja media") {
                        setValue(`activities.${index}.media`, undefined);
                      }
                    }}
                  />
                )}
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

              <Divider />
              <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mt: 2, mb: 1 }}>
                Grupy odbiorców dla tej aktywności
              </Typography>

              <ActivityAudienceGroups activityIndex={index} />

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

                  <MaterialSelector
                    control={control}
                    fields={getMaterialsFields(index)}
                    append={(value) => appendMaterial(index, value)}
                    remove={(materialIndex) => removeMaterial(index, materialIndex)}
                    activityIndex={index}
                  />
                </>
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};
