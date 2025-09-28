"use client";
import React from "react";
import { Container, Typography, Box, Button, Alert, CircularProgress, useTheme } from "@mui/material";
import { Add, School, ContentCopy } from "@mui/icons-material";
import { useSchoolState } from "./hooks/useSchoolState";
import { useSchoolFilters } from "./hooks/useSchoolFilters";
import { SchoolForm } from "./components/SchoolForm";
import { SchoolTable } from "./components/SchoolTable";
import { SchoolFilter } from "./components/SchoolFilter";
import type { CreateSchoolFormData, EditSchoolFormData } from "./schemas/schoolSchemas";

export default function Schools(): React.ReactNode {
  const theme = useTheme();
  const { state, setFilter, toggleForm, setEditSchool, handleCreateSchool, handleUpdateSchool, handleDeleteSchool } = useSchoolState();

  const { filteredSchools, uniqueTypes, uniqueCities } = useSchoolFilters({
    schools: state.schools,
    filter: state.filter,
  });

  const handleAddSchool = () => {
    setEditSchool(null);
    toggleForm(true);
  };

  const handleEditSchool = (school: any) => {
    setEditSchool(school);
    toggleForm(true);
  };

  const handleDeleteSchoolConfirm = (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę szkołę?")) {
      handleDeleteSchool(id);
    }
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
    const emails = filteredSchools.map(school => school.email).join("; ");
    navigator.clipboard.writeText(emails).then(() => {
      alert(`Skopiowano ${filteredSchools.length} adresów email do schowka`);
    }).catch(() => {
      alert("Błąd podczas kopiowania emaili");
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
          <School sx={{ fontSize: "2.5rem", color: theme.palette.primary.main }} />
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Zarządzanie szkołami
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
          Dodawaj, edytuj i zarządzaj szkołami w systemie
        </Typography>
      </Box>

      {/* Error Display */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="outlined"
          startIcon={<ContentCopy />}
          onClick={handleCopyEmails}
          disabled={filteredSchools.length === 0}
          sx={{
            px: 3,
            py: 1.5,
            fontSize: "0.9rem",
            fontWeight: "bold",
            borderRadius: 2,
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
            "&:hover": {
              borderColor: theme.palette.secondary.dark,
              backgroundColor: theme.palette.secondary.main,
              color: "white",
            },
          }}
        >
          Kopiuj emaile ({filteredSchools.length})
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSchool}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 2,
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
            },
          }}
        >
          Dodaj szkołę
        </Button>
      </Box>

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
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#1976d2" }}>
          Lista szkół ({filteredSchools.length})
        </Typography>

        {state.loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <SchoolTable schools={filteredSchools} onEdit={handleEditSchool} onDelete={handleDeleteSchoolConfirm} loading={state.loading} />
        )}
      </Box>
    </Container>
  );
}
