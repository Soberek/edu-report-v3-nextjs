import React, { useState, useRef, useCallback, useMemo } from "react";
import { Box, Typography, Paper, Menu, MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  SelectAll as SelectAllIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { createColumns } from "./TableConfig";
import { LoadingSpinner, EmptyState, DataTable, defaultActions, NotificationSnackbar } from "@/components/shared";
import { EditParticipationDialog, AddParticipationDialog } from "./TableDialogs";
import { mapParticipationsForDisplay, createDefaultFormValues } from "../utils";
import { STYLE_CONSTANTS, PAGE_CONSTANTS, UI_CONSTANTS, MESSAGES } from "../constants";
import type { TableProps, MappedParticipation } from "../types";
import type { Contact, Program, School } from "@/types";
import { useNotification } from "@/hooks";
import { useTableState } from "../hooks/useTableState";
import { useEmailMenuLogic } from "../hooks/useEmailMenuLogic";

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
  // Notifications
  const { notification, showSuccess, showError, close: closeNotification } = useNotification();

  // Table state management
  const tableState = useTableState();
  const {
    editingParticipation,
    editDialogOpen,
    addDialogOpen,
    dialogLoading,
    formRef,
    setDialogLoading,
    setEditDialogOpen,
    setAddDialogOpen,
  } = tableState;

  // Email menu logic
  const mappedParticipations: readonly MappedParticipation[] = useMemo(
    () => mapParticipationsForDisplay(participations, schoolsMap, contactsMap, programsMap),
    [participations, schoolsMap, contactsMap, programsMap]
  );

  const emailMenu = useEmailMenuLogic(mappedParticipations);

  // Form for adding new participations
  const addFormMethods = useForm<SchoolProgramParticipationDTO>({
    defaultValues: createDefaultFormValues(),
  });

  // Handle edit submission
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
        } finally {
          setDialogLoading(false);
        }
      }
    },
    [editingParticipation, onUpdate, setEditDialogOpen, setDialogLoading]
  );

  // Handle add submission
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
    [onAdd, addFormMethods, setAddDialogOpen, setDialogLoading]
  );

  // Handle email copy with notifications
  const handleCopyEmails = useCallback(
    async (type: "coordinator" | "school" | "both") => {
      const success = await emailMenu.copyEmailsToClipboard(type);
      if (success) {
        const count = emailMenu.emailCounts[type];
        showSuccess(`Skopiowano ${count} ${type === "both" ? "adresów" : "adresów"} email do schowka`);
      } else {
        showError("Nie udało się skopiować adresów email");
      }
      emailMenu.handleCloseEmailMenu();
    },
    [emailMenu, showSuccess, showError]
  );

  // Handle delete with confirmation
  const handleDeleteParticipation = useCallback(
    async (id: string) => {
      if (window.confirm(MESSAGES.CONFIRMATION.DELETE_CONFIRMATION)) {
        await onDelete(id);
      }
    },
    [onDelete]
  );

  // Table configuration
  const columns = useMemo(() => createColumns(), []);
  const actions = useMemo(
    () => [
      defaultActions.edit((id: string) => {
        const participation = participations.find((p) => p.id === id);
        if (participation) {
          tableState.handleEditParticipation(participation);
        }
      }),
      defaultActions.delete(handleDeleteParticipation),
    ],
    [participations, tableState, handleDeleteParticipation]
  );

  // Error state
  if (errorMessage) {
    return <EmptyState title={MESSAGES.EMPTY.ERROR_TITLE} description={errorMessage} />;
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner size={48} message={MESSAGES.LOADING.LOADING_DATA} sx={{ minHeight: 200 }} />;
  }

  // Main render
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
        {/* Table Header */}
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

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={emailMenu.handleOpenEmailMenu}
              variant="outlined"
              size="small"
              startIcon={<EmailIcon />}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
                textTransform: "none",
                fontWeight: "bold",
                borderColor: STYLE_CONSTANTS.COLORS.PRIMARY,
                color: STYLE_CONSTANTS.COLORS.PRIMARY,
                "&:hover": {
                  borderColor: STYLE_CONSTANTS.COLORS.PRIMARY,
                  background: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Kopiuj e-maile ({emailMenu.emailCounts.both})
            </Button>
            <Button
              onClick={tableState.handleAddParticipation}
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
            </Button>
          </Box>
        </Box>

        {/* Table Content */}
        <Box sx={{ px: 2, py: STYLE_CONSTANTS.SPACING.MEDIUM, background: "transparent", height: "auto" }}>
          {mappedParticipations.length === 0 ? (
            <EmptyState title={MESSAGES.EMPTY.NO_DATA} description={MESSAGES.EMPTY.NO_DATA_DESCRIPTION} />
          ) : (
            <DataTable
              data={mappedParticipations as unknown as Record<string, unknown>[]}
              columns={columns}
              actions={actions}
              loading={loading}
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
      </Paper>

      {/* Dialogs */}
      <EditParticipationDialog
        open={editDialogOpen}
        participation={editingParticipation}
        loading={dialogLoading}
        schools={schools as School[]}
        contacts={contacts as Contact[]}
        programs={programs as Program[]}
        formRef={formRef}
        onClose={tableState.handleCloseEditDialog}
        onSubmit={(id, data) => onUpdate(id, { ...editingParticipation, ...data } as SchoolProgramParticipation)}
        onSaveClick={tableState.handleSaveParticipation}
      />

      <AddParticipationDialog
        open={addDialogOpen}
        loading={dialogLoading}
        schools={schools as School[]}
        contacts={contacts as Contact[]}
        programs={programs as Program[]}
        formMethods={addFormMethods}
        onClose={tableState.handleCloseAddDialog}
        onSubmit={handleAddFormSubmit}
        onSaveClick={async () => addFormMethods.handleSubmit(handleAddFormSubmit)()}
      />

      {/* Email Copy Menu */}
      <Menu
        anchorEl={emailMenu.emailMenuAnchor}
        open={Boolean(emailMenu.emailMenuAnchor)}
        onClose={emailMenu.handleCloseEmailMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleCopyEmails("both")}>
          <ListItemIcon>
            <SelectAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`Wszystkie (${emailMenu.emailCounts.both})`} />
        </MenuItem>
        <MenuItem onClick={() => handleCopyEmails("coordinator")}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`Koordynatorzy (${emailMenu.emailCounts.coordinator})`} />
        </MenuItem>
        <MenuItem onClick={() => handleCopyEmails("school")}>
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`Szkoły (${emailMenu.emailCounts.school})`} />
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <NotificationSnackbar
        notification={notification}
        onClose={closeNotification}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
};
