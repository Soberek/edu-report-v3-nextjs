"use client";
import { Container, Alert, Snackbar } from "@mui/material";
import { usePrograms } from "@/hooks/useProgram";
import { useForm } from "react-hook-form";
import type { Contact, Program, School as SchoolType } from "@/types";
import { useMemo, useState } from "react";

import { SchoolProgramParticipationTable } from "./components/table";
import { ParticipationForm } from "./components/ParticipationForm";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import { PageHeader, LoadingSpinner } from "@/components/shared";

import { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";

export default function SchoolsProgramParticipation() {
  const userContext = useUser();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const { data: schools, loading: schoolsLoading } = useFirebaseData<SchoolType>("schools", userContext.user?.uid);
  const { data: contacts, loading: contactsLoading } = useFirebaseData<Contact>("contacts", userContext.user?.uid);
  const { programs, loading: programsLoading } = usePrograms();

  const {
    data: schoolProgramParticipation,
    loading: schoolProgramParticipationLoading,
    createItem: createSchoolProgramParticipation,
    updateItem: updateSchoolProgramParticipation,
    deleteItem: deleteSchoolProgramParticipation,
    error: schoolProgramParticipationError,
  } = useFirebaseData<SchoolProgramParticipation>("school-program-participation", userContext.user?.uid);

  const formMethods = useForm<SchoolProgramParticipationDTO>({
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
    try {
      await createSchoolProgramParticipation({ ...data });

      setSnackbar({
        open: true,
        type: "success",
        message: "Uczestnictwo szkoły w programie zostało dodane pomyślnie.",
      });

      formMethods.reset();
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Wystąpił błąd podczas zapisywania danych.",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUpdateParticipation = async (id: string, data: Partial<SchoolProgramParticipation>) => {
    try {
      await updateSchoolProgramParticipation(id, data);
      setSnackbar({
        open: true,
        type: "success",
        message: "Uczestnictwo zostało zaktualizowane pomyślnie.",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Wystąpił błąd podczas aktualizacji danych.",
      });
    }
  };

  const handleDeleteParticipation = async (id: string) => {
    try {
      await deleteSchoolProgramParticipation(id);
      setSnackbar({
        open: true,
        type: "success",
        message: "Uczestnictwo zostało usunięte pomyślnie.",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Wystąpił błąd podczas usuwania danych.",
      });
    }
  };

  // Memoized maps for better performance
  const schoolsMap: Record<string, SchoolType> = useMemo(() => Object.fromEntries(schools.map((s) => [s.id, s])), [schools]);

  const contactsMap: Record<string, Contact> = useMemo(() => Object.fromEntries(contacts.map((c) => [c.id, c])), [contacts]);

  const programsMap: Record<string, Program> = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);

  const isLoading = schoolsLoading || contactsLoading || programsLoading;

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner size={48} message="Ładowanie danych..." sx={{ minHeight: 400 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <PageHeader title="Szkoły w Programie" subtitle="Zarządzaj uczestnictwem szkół w programach edukacyjnych" />

      {/* Error Alert */}
      {schoolProgramParticipationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Błąd podczas ładowania danych: {schoolProgramParticipationError}
        </Alert>
      )}

      {/* Form Section */}
      <ParticipationForm
        schools={schools}
        contacts={contacts}
        programs={programs}
        loading={schoolProgramParticipationLoading}
        onSubmit={onSubmit}
        formMethods={formMethods}
      />

      {/* Table Section */}
      <SchoolProgramParticipationTable
        participations={schoolProgramParticipation || []}
        schoolsMap={schoolsMap}
        contactsMap={contactsMap}
        programsMap={programsMap}
        errorMessage={schoolProgramParticipationError}
        loading={schoolProgramParticipationLoading}
        schools={schools}
        contacts={contacts}
        programs={programs}
        onUpdate={handleUpdateParticipation}
        onDelete={handleDeleteParticipation}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
