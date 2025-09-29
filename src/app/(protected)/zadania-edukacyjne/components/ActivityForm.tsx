import React from "react";
import { useFieldArray, useFormContext, useWatch, Controller } from "react-hook-form";
import { Box, Typography, Button, IconButton, Stack, Divider, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormField } from "@/components/shared";
import { MEDIA_PLATFORMS, MATERIAL_TYPES } from "@/constants/educationalTasks";
import {
  CreateEducationalTaskFormData,
  isPresentationActivity,
  isDistributionActivity,
  isMediaPublicationActivity,
  hasAudienceGroups,
  hasActionCount,
} from "@/types";
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
      type: "presentation",
      title: "",
      description: "",
      actionCount: 1,
      audienceGroups: [
        {
          id: `group-${Date.now()}`,
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
        const activity = watchedActivities?.[index];
        const isPresentation = activity && isPresentationActivity(activity);
        const isDistribution = activity && isDistributionActivity(activity);
        const isMediaPublication = activity && isMediaPublicationActivity(activity);
        const hasAudience = activity && hasAudienceGroups(activity);
        const hasAction = activity && hasActionCount(activity);

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
                  <FormControl fullWidth>
                    <InputLabel required>Typ aktywności</InputLabel>
                    <Select
                      {...field}
                      label="Typ aktywności"
                      onChange={(e) => {
                        const value = e.target.value as string;
                        console.log(`🔄 Activity ${index} type changed to:`, value);
                        field.onChange(value);
                        // Clear materials and media when activity type changes
                        if (value !== "distribution") {
                          console.log(`🧹 Clearing materials for activity ${index}`);
                          setValue(`activities.${index}.materials`, []);
                        }
                        if (value !== "media_publication") {
                          console.log(`🧹 Clearing media for activity ${index}`);
                          setValue(`activities.${index}.media`, undefined);
                        }
                      }}
                    >
                      <MenuItem value="presentation">Prelekcja</MenuItem>
                      <MenuItem value="lecture">Wykład</MenuItem>
                      <MenuItem value="distribution">Dystrybucja</MenuItem>
                      <MenuItem value="media_publication">Publikacja media</MenuItem>
                      <MenuItem value="educational_info_stand">Stoisko informacyjne-edukacyjne</MenuItem>
                      <MenuItem value="report">Sprawozdanie</MenuItem>
                      <MenuItem value="monthly_report">Sprawozdanie miesięczne</MenuItem>
                      <MenuItem value="intent_letter">List intencyjny</MenuItem>
                      <MenuItem value="visitation">Wizytacja</MenuItem>
                      <MenuItem value="games">Gry i zabawy</MenuItem>
                      <MenuItem value="instruction">Instruktaż</MenuItem>
                      <MenuItem value="individual_instruction">Instruktaż indywidualny</MenuItem>
                      <MenuItem value="meeting">Narada</MenuItem>
                      <MenuItem value="training">Szkolenie</MenuItem>
                      <MenuItem value="conference">Konferencja</MenuItem>
                      <MenuItem value="counseling">Poradnictwo</MenuItem>
                      <MenuItem value="workshop">Warsztaty</MenuItem>
                      <MenuItem value="contest">Konkurs</MenuItem>
                      <MenuItem value="other">Inny</MenuItem>
                      <MenuItem value="street_happening">Happening uliczny</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <FormField name={`activities.${index}.title`} control={control} label="Tytuł aktywności" required fullWidth />

              {hasAction && (
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
              )}

              <FormField name={`activities.${index}.description`} control={control} label="Opis" multiline rows={2} required fullWidth />

              {hasAudience && (
                <>
                  <Divider />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mt: 2, mb: 1 }}>
                    Grupy odbiorców dla tej aktywności
                  </Typography>

                  <ActivityAudienceGroups activityIndex={index} />
                </>
              )}

              {isMediaPublication && (
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

                  <FormField
                    name={`activities.${index}.estimatedReach`}
                    control={control}
                    label="Szacowany zasięg (opcjonalny)"
                    type="number"
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
