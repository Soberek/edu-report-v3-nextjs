import React from "react";
import { useFieldArray, useFormContext, useWatch, Controller } from "react-hook-form";
import { Box, Typography, Button, IconButton, Stack, Divider, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormField } from "@/components/shared";
import { MEDIA_PLATFORMS } from "@/constants/educationalTasks";
import { isDistributionActivity, isMediaPublicationActivity, hasAudienceGroups, hasActionCount } from "@/types";
import { AudienceGroupsForm } from "./AudienceGroupsForm";
import { MaterialSelector } from "./MaterialSelector";

// interface MaterialsFormProps {
//   activityIndex: number;
// }

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

  // Watch all activities materials at once
  const watchedAllMaterials = useWatch({
    control,
    name: "activities",
  });

  // Extract materials from watched activities
  const materialsData = React.useMemo(() => {
    if (!watchedAllMaterials) return [];
    return watchedAllMaterials.map((activity: Record<string, unknown>) => activity.materials || []);
  }, [watchedAllMaterials]);

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
      const updatedGroups = audienceGroups.filter((_: unknown, index: number) => index !== removeIndex);
      setValue(`activities.${activityIndex}.audienceGroups`, updatedGroups);
    };

    // Create fields array compatible with AudienceGroupsForm
    const fields = audienceGroups.map((group: Record<string, unknown>, index: number) => ({
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
    const materials = materialsData[activityIndex] || [];
    return materials.map((material: Record<string, unknown>, index: number) => ({
      id: `field-${activityIndex}-${index}`, // Unique React key
      originalId: material.id || `material-${activityIndex}-${index}`,
      ...material,
    }));
  };

  const appendMaterial = (activityIndex: number, value: Record<string, unknown>) => {
    const currentMaterials = materialsData[activityIndex] || [];
    const newMaterial = {
      ...value,
      id: value.id || `material-${activityIndex}-${currentMaterials.length}`,
    };
    const updatedMaterials = [...currentMaterials, newMaterial];
    setValue(`activities.${activityIndex}.materials`, updatedMaterials);
  };

  const removeMaterial = (activityIndex: number, materialIndex: number) => {
    const currentMaterials = materialsData[activityIndex] || [];
    const updatedMaterials = currentMaterials.filter((_: unknown, index: number) => index !== materialIndex);
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
        // const isPresentation = activity && isPresentationActivity(activity);
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
                    options={Object.entries(MEDIA_PLATFORMS).map(([, value]) => ({
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
