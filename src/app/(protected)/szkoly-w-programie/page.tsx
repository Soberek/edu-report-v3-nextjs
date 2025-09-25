"use client";
import { Autocomplete, Box, Button, CircularProgress, TextField } from "@mui/material";
import { usePrograms } from "@/hooks/useProgram";
import { useForm, Controller } from "react-hook-form";
import type { Contact, Program, School } from "@/types";
import { schoolYears } from "@/constants";
import { useMemo } from "react";

import { useSchoolProgramParticipation } from "@/hooks/useSchoolProgramParticipation";
import { SchoolProgramParticipationTable } from "./components/table";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";

import {
  schoolProgramParticipationDTOSchema,
  schoolProgramParticipationSchema,
  SchoolProgramParticipation,
  SchoolProgramParticipationDTO,
} from "@/models/SchoolProgramParticipation";

export default function SchoolsProgramParticipation() {
  const userContext = useUser();

  const { data: schools } = useFirebaseData<School>("schools", userContext.user?.uid);
  const { data: contacts } = useFirebaseData<Contact>("contacts", userContext.user?.uid);
  const { programs } = usePrograms();

  const {
    participations,
    loading,
    errorMessage,
    isSubmitting,
    // handleParticipationDelete,
    // handleParticipationUpdate,
    handleParticipationSubmit,
  } = useSchoolProgramParticipation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolProgramParticipationDTO>({
    defaultValues: {
      schoolId: "",
      programId: "",
      coordinatorId: "",
      schoolYear: "2025/2026",
      previousCoordinatorId: "",
      studentCount: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: SchoolProgramParticipationDTO) => {
    console.log(data);

    const parsed = schoolProgramParticipationDTOSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error);
      return;
    }
    await handleParticipationSubmit(parsed.data);
  };

  const schoolsMap: Record<string, School> = useMemo(() => Object.fromEntries(schools.map((s) => [s.id, s])), [schools]);

  const contactsMap: Record<string, Contact> = useMemo(() => Object.fromEntries(contacts.map((c) => [c.id, c])), [contacts]);

  const programsMap: Record<string, Program> = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);

  return (
    <>
      {/* Todo list */}
      <ul>
        <li style={{ textDecoration: "line-through" }}>Dodanie pól opcjonalnych do formularza: poprzedni koordynator </li>
        <li>Wyswietlanie bledow przy pobieraniu danych z firebase</li>
        <li>Walidacja formularza</li>
        <li>Edycja i usuwanie pozycji</li>
      </ul>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Controller
          name="schoolId"
          control={control}
          rules={{ required: "Szkoła jest wymagana." }}
          render={({ field }) => (
            <Autocomplete
              options={schools}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={field.value ? schoolsMap[field.value] : null} // całe wybrane object albo null
              onChange={(_, value) => field.onChange(value?.id)} // przekazuje cały obiekt
              renderInput={(params) => (
                <TextField {...params} label="Szkoła" helperText={errors.schoolId?.message} error={!!errors.schoolId} />
              )}
            />
          )}
        />
        <Controller
          name="programId"
          control={control}
          rules={{ required: "Program jest wymagany." }}
          render={({ field }) => (
            <Autocomplete
              value={
                field.value
                  ? programsMap[field.value] // mapuję id na cały obiekt
                  : null
              }
              onChange={(_, value) => field.onChange(value?.id)}
              options={programs}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id} // jeśli masz id
              renderInput={(params) => (
                <TextField {...params} label="Program Uczestnictwa" error={!!errors.programId} helperText={errors.programId?.message} />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.code || "nie ma"} - {option.name}
                </li>
              )}
            />
          )}
        />
        {/* Coordinator */}
        <Controller
          name="coordinatorId"
          control={control}
          rules={{ required: "Koordynator jest wymagany." }}
          render={({ field }) => (
            <Autocomplete
              // id jest zmapowane do imion
              // on change zmieniam na id
              value={field.value ? contactsMap[field.value] : null}
              onChange={(_, value) => field.onChange(value?.id)}
              options={contacts}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              // isOptionEqualToValue={(option, value) => option.id === value.id} // jeśli masz id
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.firstName} {option.lastName}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Koordynator" error={!!errors.coordinatorId} helperText={errors.coordinatorId?.message} />
              )}
            />
          )}
        />
        <Controller
          name="schoolYear"
          control={control}
          rules={{ required: "Rok szkolny jest wymagany." }}
          render={({ field }) => {
            return (
              <Autocomplete
                value={field.value || null}
                onChange={(_, value) => field.onChange(value)}
                getOptionLabel={(option) => `${option}`}
                options={schoolYears}
                renderInput={(params) => (
                  <TextField {...params} label="Rok szkolny" error={!!errors.schoolYear} helperText={errors.schoolYear?.message} />
                )}
              />
            );
          }}
        />
        <Controller
          name="studentCount"
          control={control}
          rules={{ required: "Liczba uczniów jest wymagana.", min: 0 }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                label="Liczba uczniów"
                type="number"
                error={!!errors.studentCount}
                helperText={errors.studentCount?.message}
              />
            );
          }}
        />
        <Controller
          name="notes"
          control={control}
          defaultValue="-"
          render={({ field }) => {
            return <TextField {...field} label="Notatki" multiline minRows={4} error={!!errors.notes} helperText={errors.notes?.message} />;
          }}
        />

        {/* Previous Coordinator */}
        <Controller
          name="previousCoordinatorId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              // id jest zmapowane do imion
              // on change zmieniam na id
              value={field.value ? contactsMap[field.value] : null}
              onChange={(_, value) => field.onChange(value?.id)}
              options={contacts}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              // isOptionEqualToValue={(option, value) => option.id === value.id} // jeśli masz id
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.firstName} {option.lastName}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Poprzedni Koordynator z 2024/2025"
                  error={!!errors.previousCoordinatorId}
                  helperText={errors.previousCoordinatorId?.message}
                />
              )}
            />
          )}
        />
        <Button type="submit" disabled={isSubmitting} variant="contained">
          {isSubmitting ? <CircularProgress size={24} /> : "Zapisz"}
        </Button>
      </Box>

      <SchoolProgramParticipationTable
        participations={participations}
        schoolsMap={schoolsMap}
        contactsMap={contactsMap}
        programsMap={programsMap}
        errorMessage={errorMessage}
        loading={loading}
      />
    </>
  );
}
