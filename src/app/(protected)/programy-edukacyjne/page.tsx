"use client";
import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PageHeader, PrimaryButton, ErrorDisplay, LoadingSpinner, useConfirmDialog } from "@/components/shared";
import { useProgramsState, useProgramFilters, useProgramStats } from "./hooks";
import { ProgramForm, ProgramTable, ProgramFilter, ProgramStats } from "./components";
import type { CreateProgramFormData, Program } from "./types";
import type { ProgramFilter as ProgramFilterType } from "./hooks/useProgramFilters";

export default function Programs(): React.ReactNode {
  const { state, handleCreateProgram, handleUpdateProgram, handleDeleteProgram, toggleForm, setEditProgram, clearError } =
    useProgramsState();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const [filter, setFilter] = useState<ProgramFilterType>({
    search: "",
    programType: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const { filteredPrograms, uniqueProgramTypes } = useProgramFilters({
    programs: state.programs,
    filter,
  });

  const { totalPrograms, programowyCount, nieprogramowyCount } = useProgramStats({
    programs: state.programs,
  });

  const handleAddProgram = () => {
    setEditProgram(null);
    toggleForm(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditProgram(program);
    toggleForm(true);
  };

  const handleDeleteProgramConfirm = (id: string) => {
    showConfirm(
      "Usuń program",
      "Czy na pewno chcesz usunąć ten program? Ta operacja nie może zostać cofnięta.",
      () => handleDeleteProgram(id),
      "delete"
    );
  };

  const handleFormSave = async (data: CreateProgramFormData) => {
    if (state.editProgram) {
      await handleUpdateProgram(state.editProgram.id, data);
    } else {
      await handleCreateProgram(data);
    }
  };

  const handleFormClose = () => {
    toggleForm(false);
    setEditProgram(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <PageHeader
        title="Programy edukacyjne"
        subtitle="Zarządzaj programami edukacyjnymi w systemie"
        actions={
          <PrimaryButton startIcon={<Add />} onClick={handleAddProgram}>
            Dodaj program
          </PrimaryButton>
        }
      />

      {/* Error Display */}
      {state.error && <ErrorDisplay error={state.error} sx={{ mb: 3 }} />}

      {/* Program Statistics */}
      <ProgramStats totalPrograms={totalPrograms} programowyCount={programowyCount} nieprogramowyCount={nieprogramowyCount} />

      {/* Filters */}
      <ProgramFilter filter={filter} onFilterChange={setFilter} uniqueProgramTypes={uniqueProgramTypes} />

      {/* Program Form */}
      {state.openForm && (
        <ProgramForm
          mode={state.editProgram ? "edit" : "create"}
          program={state.editProgram}
          onClose={handleFormClose}
          onSave={handleFormSave}
          loading={state.isSubmitting}
        />
      )}

      {/* Program Table */}
      <Box sx={{ mb: 4 }}>
        {state.loading ? (
          <LoadingSpinner message="Ładowanie programów..." />
        ) : (
          <ProgramTable
            programs={filteredPrograms}
            onEdit={handleEditProgram}
            onDelete={handleDeleteProgramConfirm}
            loading={state.loading}
          />
        )}
      </Box>

      {/* Confirm Dialog */}
      {ConfirmDialog}
    </Container>
  );
}
