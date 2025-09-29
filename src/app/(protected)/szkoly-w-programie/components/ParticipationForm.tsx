import { Box, Typography, Paper, Fade } from "@mui/material";
import { School, Group, Person, CalendarToday, Save, Add } from "@mui/icons-material";
import { UseFormReturn } from "react-hook-form";
import { useMemo } from "react";
import type { Contact, Program, School as SchoolType } from "@/types";
import { schoolYears } from "@/constants";
import { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { AutocompleteField, FormField, ActionButton, type AutocompleteOption } from "@/components/shared";

interface ParticipationFormProps {
  schools: SchoolType[];
  contacts: Contact[];
  programs: Program[];
  loading: boolean;
  onSubmit: (data: SchoolProgramParticipationDTO) => Promise<void>;
  formMethods: UseFormReturn<SchoolProgramParticipationDTO>;
}

// Custom Paper Form Section Component
const CustomFormSection: React.FC<{
  title: string;
  children: React.ReactNode;
  sx?: object;
}> = ({ title, children, sx = {} }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      overflow: "hidden",
      mb: 4,
      ...sx,
    }}
  >
    <Box
      sx={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        p: 2,
        borderBottom: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Add sx={{ color: "#1976d2" }} />
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: 4 }}>
      <Fade in timeout={300}>
        <div>{children}</div>
      </Fade>
    </Box>
  </Paper>
);

export const ParticipationForm: React.FC<ParticipationFormProps> = ({ schools, contacts, programs, loading, onSubmit, formMethods }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = formMethods;

  // Transform data to AutocompleteOption format
  const schoolsOptions: AutocompleteOption[] = useMemo(() => schools.map((school) => ({ id: school.id, name: school.name })), [schools]);

  const contactsOptions: AutocompleteOption[] = useMemo(
    () =>
      contacts.map((contact) => ({
        id: contact.id,
        name: `${contact.firstName} ${contact.lastName}`,
        firstName: contact.firstName,
        lastName: contact.lastName,
      })),
    [contacts]
  );

  const programsOptions: AutocompleteOption[] = useMemo(
    () =>
      programs.map((program) => ({
        id: program.id,
        name: program.name,
        code: program.code,
      })),
    [programs]
  );

  const schoolYearsOptions: AutocompleteOption[] = useMemo(() => schoolYears.map((year) => ({ id: year, name: year })), [schoolYears]);

  const handleFormSubmit = async (data: SchoolProgramParticipationDTO) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <CustomFormSection title="Dodaj nowe uczestnictwo">
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
          {/* School Selection */}
          <AutocompleteField
            name="schoolId"
            control={control}
            label="Szkoła"
            options={schoolsOptions}
            required
            startAdornment={<School />}
          />

          {/* Program Selection */}
          <AutocompleteField
            name="programId"
            control={control}
            label="Program Uczestnictwa"
            options={programsOptions}
            required
            startAdornment={<Group />}
            getOptionLabel={(option) => `${option.code || "Brak kodu"} - ${option.name}`}
          />

          {/* Coordinator Selection */}
          <AutocompleteField
            name="coordinatorId"
            control={control}
            label="Koordynator"
            options={contactsOptions}
            required
            startAdornment={<Person />}
          />

          {/* School Year Selection */}
          <AutocompleteField
            name="schoolYear"
            control={control}
            label="Rok szkolny"
            options={schoolYearsOptions}
            required
            startAdornment={<CalendarToday />}
          />

          {/* Student Count */}
          <FormField
            name="studentCount"
            control={control}
            label="Liczba uczniów"
            type="number"
            required
            helperText="Wprowadź liczbę uczniów uczestniczących w programie"
          />

          {/* Previous Coordinator */}
          <AutocompleteField
            name="previousCoordinatorId"
            control={control}
            label="Poprzedni Koordynator (opcjonalne)"
            options={contactsOptions}
            startAdornment={<Person />}
          />

          {/* Notes */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <FormField
              name="notes"
              control={control}
              label="Notatki"
              type="textarea"
              rows={4}
              helperText="Opcjonalne uwagi dotyczące uczestnictwa"
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            pt: 3,
            borderTop: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <ActionButton
            type="submit"
            disabled={loading || !isDirty}
            variant="contained"
            startIcon={<Save />}
            loading={loading}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: "rgba(0,0,0,0.12)",
                color: "rgba(0,0,0,0.26)",
              },
            }}
          >
            Zapisz uczestnictwo
          </ActionButton>
        </Box>
      </Box>
    </CustomFormSection>
  );
};
