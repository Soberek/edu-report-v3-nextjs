import React, { useState, useRef, useCallback, useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import type { Contact, Program, School } from "@/types";
import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import { createColumns } from "./TableConfig";
import { LoadingSpinner, EmptyState, DataTable, defaultActions, EditDialog } from "@/components/shared";
import { EditParticipationForm } from "./EditParticipationForm";
import { mapParticipationsForDisplay } from "../utils";
import {
  STYLE_CONSTANTS,
  PAGE_CONSTANTS,
  TABLE_CONSTANTS,
  UI_CONSTANTS,
  MESSAGES,
  BUTTON_LABELS
} from "../constants";
import type { TableProps, MappedParticipation } from "../types";

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
}) => {
  const [editingParticipation, setEditingParticipation] = useState<SchoolProgramParticipation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const formRef = useRef<any>(null);

  // Map participations for display using utility function
  const mappedParticipations: MappedParticipation[] = useMemo(
    () => mapParticipationsForDisplay(participations, schoolsMap, contactsMap, programsMap),
    [participations, schoolsMap, contactsMap, programsMap]
  );

  const handleEditParticipation = useCallback((participation: SchoolProgramParticipation) => {
    setEditingParticipation(participation);
    setEditDialogOpen(true);
  }, []);

  const handleSaveParticipation = useCallback(async () => {
    if (formRef.current && formRef.current.submit) {
      await formRef.current.submit();
    }
  }, []);

  const handleFormSubmit = useCallback(async (data: any) => {
    if (editingParticipation) {
      setDialogLoading(true);
      try {
        await onUpdate(editingParticipation.id, data);
        setEditDialogOpen(false);
        setEditingParticipation(null);
      } finally {
        setDialogLoading(false);
      }
    }
  }, [editingParticipation, onUpdate]);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingParticipation(null);
  }, []);

  const handleDeleteParticipation = useCallback(async (id: string) => {
    if (window.confirm(MESSAGES.CONFIRMATION.DELETE_CONFIRMATION)) {
      await onDelete(id);
    }
  }, [onDelete]);

  const columns = useMemo(() => createColumns(), []);
  const actions = useMemo(() => [
    defaultActions.edit((id: string) => {
      const participation = participations.find((p) => p.id === id);
      if (participation) {
        handleEditParticipation(participation);
      }
    }),
    defaultActions.delete(handleDeleteParticipation),
  ], [participations, handleEditParticipation, handleDeleteParticipation]);

  const renderErrorState = () => (
    <EmptyState
      title={MESSAGES.EMPTY.ERROR_TITLE}
      description={errorMessage || ""}
      sx={{ mb: STYLE_CONSTANTS.SPACING.MEDIUM }}
    />
  );

  const renderLoadingState = () => (
    <LoadingSpinner
      size={48}
      message={MESSAGES.LOADING.LOADING_DATA}
      sx={{ minHeight: 200 }}
    />
  );

  const renderTableHeader = () => (
    <Box
      sx={{
        background: STYLE_CONSTANTS.COLORS.HEADER_BACKGROUND,
        backdropFilter: "blur(10px)",
        p: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderBottom: "1px solid rgba(255,255,255,0.2)",
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
    </Box>
  );

  const renderTableContent = () => (
    <Box sx={{ p: STYLE_CONSTANTS.SPACING.MEDIUM, background: "transparent" }}>
      {mappedParticipations.length === 0 ? (
        <EmptyState
          title={MESSAGES.EMPTY.NO_DATA}
          description={MESSAGES.EMPTY.NO_DATA_DESCRIPTION}
        />
      ) : (
        <DataTable
          data={mappedParticipations}
          columns={columns}
          actions={actions}
          loading={loading}
          height={UI_CONSTANTS.TABLE_HEIGHT}
          pageSizeOptions={UI_CONSTANTS.PAGE_SIZE_OPTIONS}
          getRowId={(row) => row.id}
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
        schools={schools}
        contacts={contacts}
        programs={programs}
        onSubmit={handleFormSubmit}
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
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.EXTRA_LARGE,
          background: STYLE_CONSTANTS.COLORS.BACKGROUND_GRADIENT,
          overflow: "hidden",
        }}
      >
        {renderTableHeader()}
        {renderTableContent()}
      </Paper>
      {renderEditDialog()}
    </>
  );
};
