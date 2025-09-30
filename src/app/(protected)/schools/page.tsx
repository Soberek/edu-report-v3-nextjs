"use client";
import React from "react";
import { Container, Box } from "@mui/material";
import { Add, School, ContentCopy } from "@mui/icons-material";
import type { School as SchoolType } from "@/types";
import { PageHeader, PrimaryButton, SecondaryButton, ErrorDisplay, LoadingSpinner, useConfirmDialog } from "@/components/shared";
import { useSchoolState } from "./hooks/useSchoolState";
import { useSchoolFilters } from "./hooks/useSchoolFilters";
import { useSchoolStats } from "./hooks/useSchoolStats";
import { SchoolForm } from "./components/SchoolForm";
import { SchoolTable } from "./components/SchoolTable";
import { SchoolFilter } from "./components/SchoolFilter";
import { SchoolStats } from "./components/SchoolStats";
import type { CreateSchoolFormData, EditSchoolFormData } from "./schemas/schoolSchemas";

export default function Schools(): React.ReactNode {
  const { state, setFilter, toggleForm, setEditSchool, handleCreateSchool, handleUpdateSchool, handleDeleteSchool } = useSchoolState();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const { filteredSchools, uniqueTypes, uniqueCities } = useSchoolFilters({
    schools: state.schools,
    filter: state.filter,
  });

  const { totalSchools, typeStats } = useSchoolStats({
    schools: state.schools,
  });

  const handleAddSchool = () => {
    setEditSchool(null);
    toggleForm(true);
  };

  const handleEditSchool = (school: SchoolType) => {
    setEditSchool(school);
    toggleForm(true);
  };

  const handleDeleteSchoolConfirm = (id: string) => {
    showConfirm(
      "Usuń szkołę",
      "Czy na pewno chcesz usunąć tę szkołę? Ta operacja nie może zostać cofnięta.",
      () => handleDeleteSchool(id),
      "delete"
    );
  };

  const handleFormSave = async (data: CreateSchoolFormData | EditSchoolFormData) => {
    if (state.editSchool) {
      await handleUpdateSchool(state.editSchool.id, data);
    } else {
      await handleCreateSchool(data);
    }
  };

  const handleFormClose = () => {
    toggleForm(false);
    setEditSchool(null);
  };

  const handleCopyEmails = () => {
    const emails = filteredSchools.map((school) => school.email).join("; ");
    navigator.clipboard
      .writeText(emails)
      .then(() => {
        alert(`Skopiowano ${filteredSchools.length} adresów email do schowka`);
      })
      .catch(() => {
        alert("Błąd podczas kopiowania emaili");
      });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <PageHeader
        title="Zarządzanie szkołami"
        subtitle="Dodawaj, edytuj i zarządzaj szkołami w systemie"
        actions={
          <Box sx={{ display: "flex", gap: 2 }}>
            <SecondaryButton startIcon={<ContentCopy />} onClick={handleCopyEmails} disabled={filteredSchools.length === 0}>
              Kopiuj emaile ({filteredSchools.length})
            </SecondaryButton>
            <PrimaryButton startIcon={<Add />} onClick={handleAddSchool}>
              Dodaj szkołę
            </PrimaryButton>
          </Box>
        }
      />

      {/* Error Display */}
      {state.error && <ErrorDisplay error={state.error} sx={{ mb: 3 }} />}

      {/* School Statistics */}
      <SchoolStats totalSchools={totalSchools} typeStats={typeStats} />

      {/* Filters */}
      <SchoolFilter filter={state.filter} onFilterChange={setFilter} uniqueTypes={uniqueTypes} uniqueCities={uniqueCities} />

      {/* School Form */}
      {state.openForm && (
        <SchoolForm
          mode={state.editSchool ? "edit" : "create"}
          school={state.editSchool}
          onClose={handleFormClose}
          onSave={handleFormSave}
          loading={state.isSubmitting}
        />
      )}

      {/* School Table */}
      <Box sx={{ mb: 4 }}>
        {state.loading ? (
          <LoadingSpinner message="Ładowanie szkół..." />
        ) : (
          <SchoolTable schools={filteredSchools} onEdit={handleEditSchool} onDelete={handleDeleteSchoolConfirm} loading={state.loading} />
        )}
      </Box>

      {/* Confirm Dialog */}
      {ConfirmDialog}
    </Container>
  );
}
