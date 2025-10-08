import React, { useState, useRef, useCallback, useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
// import type { Contact, Program, School } from "@/types";
import { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { createColumns } from "./TableConfig";
import { LoadingSpinner, EmptyState, DataTable, defaultActions, EditDialog, ActionButton } from "@/components/shared";
import { EditParticipationForm } from "./EditParticipationForm";
import { ParticipationForm } from "./ParticipationForm";
import { mapParticipationsForDisplay, createDefaultFormValues } from "../utils";
import { STYLE_CONSTANTS, PAGE_CONSTANTS, UI_CONSTANTS, MESSAGES } from "../constants";
import type { TableProps, MappedParticipation } from "../types";
import { Contact, Program, School } from "@/types";

export const SchoolProgramParticipationTable: React.FC<TableProps> = ({
  schoolsMap,
  contactsMap,
  programsMap,
  participations,
  errorMessage,
  loading,
  schools,
  contacts,
  programs,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const [editingParticipation, setEditingParticipation] = useState<SchoolProgramParticipation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const formRef = useRef<{ submit: () => void; isDirty: boolean } | null>(null);

  // Form for adding new participations
  const addFormMethods = useForm<SchoolProgramParticipationDTO>({
    defaultValues: createDefaultFormValues(),
  });

  // Map participations for display using utility function
  const mappedParticipations: MappedParticipation[] = useMemo(
    () => mapParticipationsForDisplay(participations, schoolsMap, contactsMap, programsMap),
    [participations, schoolsMap, contactsMap, programsMap]
  );

  const handleEditParticipation = useCallback((participation: SchoolProgramParticipation) => {
    setEditingParticipation(participation);
    setEditDialogOpen(true);
  }, []);

  const handleAddParticipation = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const handleSaveParticipation = useCallback(async () => {
    if (formRef.current && formRef.current.submit) {
      await formRef.current.submit();
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (data: Partial<SchoolProgramParticipation>) => {
      if (editingParticipation) {
        setDialogLoading(true);
        try {
          const updatedParticipation: SchoolProgramParticipation = {
            ...editingParticipation,
            ...data,
          };
          await onUpdate(editingParticipation.id, updatedParticipation);
          setEditDialogOpen(false);
          setEditingParticipation(null);
        } finally {
          setDialogLoading(false);
        }
      }
    },
    [editingParticipation, onUpdate]
  );

  const handleAddFormSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      setDialogLoading(true);
      try {
        await onAdd(data);
        setAddDialogOpen(false);
        addFormMethods.reset();
      } finally {
        setDialogLoading(false);
      }
    },
    [onAdd, addFormMethods]
  );

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingParticipation(null);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setAddDialogOpen(false);
    addFormMethods.reset();
  }, [addFormMethods]);

  const handleDeleteParticipation = useCallback(
    async (id: string) => {
      if (window.confirm(MESSAGES.CONFIRMATION.DELETE_CONFIRMATION)) {
        await onDelete(id);
      }
    },
    [onDelete]
  );

  const columns = useMemo(() => createColumns(), []);
  const actions = useMemo(
    () => [
      defaultActions.edit((id: string) => {
        const participation = participations.find((p) => p.id === id);
        if (participation) {
          handleEditParticipation(participation);
        }
      }),
      defaultActions.delete(handleDeleteParticipation),
    ],
    [participations, handleEditParticipation, handleDeleteParticipation]
  );

  const renderErrorState = () => (
    <EmptyState title={MESSAGES.EMPTY.ERROR_TITLE} description={errorMessage || ""} sx={{ mb: STYLE_CONSTANTS.SPACING.MEDIUM }} />
  );

  const renderLoadingState = () => <LoadingSpinner size={48} message={MESSAGES.LOADING.LOADING_DATA} sx={{ minHeight: 200 }} />;

  const renderTableHeader = () => (
    <Box
      sx={{
        background: STYLE_CONSTANTS.COLORS.HEADER_BACKGROUND,
        backdropFilter: "blur(10px)",
        p: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          display: "flex",
          alignItems: "center",
          gap: STYLE_CONSTANTS.SPACING.SMALL,
        }}
      >
        <SchoolIcon sx={{ color: STYLE_CONSTANTS.COLORS.PRIMARY }} />
        {PAGE_CONSTANTS.TABLE_TITLE} ({mappedParticipations.length})
      </Typography>
      <ActionButton
        onClick={handleAddParticipation}
        variant="contained"
        size="small"
        sx={{
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
          textTransform: "none",
          fontWeight: "bold",
          background: STYLE_CONSTANTS.GRADIENTS.PRIMARY,
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            background: STYLE_CONSTANTS.GRADIENTS.PRIMARY_HOVER,
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
            transform: "translateY(-1px)",
          },
        }}
      >
        Dodaj uczestnictwo
      </ActionButton>
    </Box>
  );

  const renderTableContent = () => (
    <Box sx={{ px: 2, py: STYLE_CONSTANTS.SPACING.MEDIUM, background: "transparent" }}>
      {mappedParticipations.length === 0 ? (
        <EmptyState title={MESSAGES.EMPTY.NO_DATA} description={MESSAGES.EMPTY.NO_DATA_DESCRIPTION} />
      ) : (
        <DataTable
          data={mappedParticipations as unknown as Record<string, unknown>[]}
          columns={columns}
          actions={actions}
          loading={loading}
          height={UI_CONSTANTS.TABLE_HEIGHT}
          pageSizeOptions={[...UI_CONSTANTS.PAGE_SIZE_OPTIONS]}
          getRowId={(row) => (row as unknown as MappedParticipation).id}
          sx={{
            background: "white",
            borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.LARGE,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        />
      )}
    </Box>
  );

  const renderEditDialog = () => (
    <EditDialog
      open={editDialogOpen}
      onClose={handleCloseEditDialog}
      title="Edytuj uczestnictwo szkoły"
      onSave={handleSaveParticipation}
      loading={dialogLoading}
      maxWidth={UI_CONSTANTS.DIALOG_MAX_WIDTH}
    >
      <EditParticipationForm
        ref={formRef}
        participation={editingParticipation}
        schools={schools as School[]}
        contacts={contacts as Contact[]}
        programs={programs as Program[]}
        onSubmit={handleFormSubmit}
      />
    </EditDialog>
  );

  const renderAddDialog = () => (
    <EditDialog
      open={addDialogOpen}
      onClose={handleCloseAddDialog}
      title="Dodaj uczestnictwo szkoły"
      onSave={handleSaveParticipation}
      loading={dialogLoading}
      maxWidth={UI_CONSTANTS.DIALOG_MAX_WIDTH}
    >
      <ParticipationForm
        schools={schools as School[]}
        contacts={contacts as Contact[]}
        programs={programs as Program[]}
        loading={dialogLoading}
        onSubmit={handleAddFormSubmit}
        formMethods={addFormMethods}
      />
    </EditDialog>
  );

  if (errorMessage) {
    return renderErrorState();
  }

  if (loading) {
    return renderLoadingState();
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.EXTRA_LARGE,
          background: STYLE_CONSTANTS.COLORS.BACKGROUND_GRADIENT,
          overflow: "hidden",
        }}
      >
        {renderTableHeader()}
        {renderTableContent()}
      </Paper>
      {renderEditDialog()}
      {renderAddDialog()}
    </>
  );
};
