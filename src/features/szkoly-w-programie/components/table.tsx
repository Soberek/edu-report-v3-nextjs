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
// import type { Contact, Program, School } from "@/types";
import { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { createColumns } from "./TableConfig";
import { LoadingSpinner, EmptyState, DataTable, defaultActions, GenericDialog, NotificationSnackbar } from "@/components/shared";
import { EditParticipationForm } from "./EditParticipationForm";
import { ParticipationForm } from "./ParticipationForm";
import { mapParticipationsForDisplay, createDefaultFormValues } from "../utils";
import { STYLE_CONSTANTS, PAGE_CONSTANTS, UI_CONSTANTS, MESSAGES } from "../constants";
import type { TableProps, MappedParticipation } from "../types";
import { Contact, Program, School } from "@/types";
import { useNotification } from "@/hooks";

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
  const { notification, showSuccess, showError, close: closeNotification } = useNotification();
  const [emailMenuAnchor, setEmailMenuAnchor] = useState<null | HTMLElement>(null);
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

  // Count available emails by type
  const emailCounts = useMemo(() => {
    const coordinatorEmails = new Set(
      mappedParticipations.map((row) => row.coordinatorEmail).filter((email) => email && email.trim() !== "")
    );

    const schoolEmails = new Set(mappedParticipations.map((row) => row.schoolEmail).filter((email) => email && email.trim() !== ""));

    const allEmails = mappedParticipations.flatMap((row) => {
      const emails = [];
      if (row.coordinatorEmail && row.coordinatorEmail.trim() !== "") {
        emails.push(row.coordinatorEmail);
      }
      if (row.schoolEmail && row.schoolEmail.trim() !== "") {
        emails.push(row.schoolEmail);
      }
      return emails;
    });

    return {
      coordinator: coordinatorEmails.size,
      school: schoolEmails.size,
      both: new Set(allEmails).size,
    };
  }, [mappedParticipations]);

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

  const handleOpenEmailMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setEmailMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseEmailMenu = useCallback(() => {
    setEmailMenuAnchor(null);
  }, []);

  const handleCopyEmails = useCallback(
    (type: "coordinator" | "school" | "both") => {
      let emailsToCopy: string[] = [];
      let typeLabel = "";

      if (type === "coordinator") {
        emailsToCopy = Array.from(
          new Set(
            mappedParticipations
              .map((row: MappedParticipation) => row.coordinatorEmail)
              .filter((email): email is string => !!email && email.trim() !== "")
          )
        );
        typeLabel = "koordynatorów";
      } else if (type === "school") {
        emailsToCopy = Array.from(
          new Set(
            mappedParticipations
              .map((row: MappedParticipation) => row.schoolEmail)
              .filter((email): email is string => !!email && email.trim() !== "")
          )
        );
        typeLabel = "szkół";
      } else {
        // both
        const allEmails = mappedParticipations.flatMap((row: MappedParticipation) => {
          const emails = [];
          if (row.coordinatorEmail && row.coordinatorEmail.trim() !== "") {
            emails.push(row.coordinatorEmail);
          }
          if (row.schoolEmail && row.schoolEmail.trim() !== "") {
            emails.push(row.schoolEmail);
          }
          return emails;
        });
        emailsToCopy = Array.from(new Set(allEmails));
        typeLabel = "wszystkich";
      }

      if (emailsToCopy.length === 0) {
        showError("Brak adresów email do skopiowania");
        handleCloseEmailMenu();
        return;
      }

      // Format emails with semicolon separator
      const emailString = emailsToCopy.join("; ");

      // Copy to clipboard
      navigator.clipboard
        .writeText(emailString)
        .then(() => {
          showSuccess(`Skopiowano ${emailsToCopy.length} ${typeLabel} adresów email do schowka`);
        })
        .catch(() => {
          showError("Nie udało się skopiować adresów email");
        });

      handleCloseEmailMenu();
    },
    [mappedParticipations, handleCloseEmailMenu, showSuccess, showError]
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
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          onClick={handleOpenEmailMenu}
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
          Kopiuj e-maile ({emailCounts.both})
        </Button>
        <Button
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
        </Button>
      </Box>
    </Box>
  );

  const renderTableContent = () => (
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
  );

  const renderEditDialog = () => (
    <GenericDialog
      open={editDialogOpen}
      onClose={handleCloseEditDialog}
      title="Edytuj uczestnictwo szkoły"
      subtitle="Aktualizuj dane programu i opiekuna"
      onSave={handleSaveParticipation}
      loading={dialogLoading}
      maxWidth={UI_CONSTANTS.DIALOG_MAX_WIDTH}
      saveText="Zapisz zmiany"
      saveDisabled={dialogLoading}
    >
      <EditParticipationForm
        ref={formRef}
        participation={editingParticipation}
        schools={schools as School[]}
        contacts={contacts as Contact[]}
        programs={programs as Program[]}
        onSubmit={handleFormSubmit}
      />
    </GenericDialog>
  );

  const renderAddDialog = () => (
    <GenericDialog
      open={addDialogOpen}
      onClose={handleCloseAddDialog}
      title="Dodaj uczestnictwo szkoły"
      subtitle="Wypełnij formularz, aby przypisać szkołę do programu"
      loading={dialogLoading}
      maxWidth={UI_CONSTANTS.DIALOG_MAX_WIDTH}
      onSave={() => addFormMethods.handleSubmit(handleAddFormSubmit)()}
      saveText="Dodaj uczestnictwo"
      saveDisabled={dialogLoading || !addFormMethods.formState.isDirty}
    >
      <ParticipationForm
        schools={schools as School[]}
        contacts={contacts as Contact[]}
        programs={programs as Program[]}
        loading={dialogLoading}
        onSubmit={handleAddFormSubmit}
        formMethods={addFormMethods}
        showSubmitButton={false}
      />
    </GenericDialog>
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

      {/* Email Copy Menu */}
      <Menu
        anchorEl={emailMenuAnchor}
        open={Boolean(emailMenuAnchor)}
        onClose={handleCloseEmailMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleCopyEmails("both")}>
          <ListItemIcon>
            <SelectAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`Wszystkie (${emailCounts.both})`} />
        </MenuItem>
        <MenuItem onClick={() => handleCopyEmails("coordinator")}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`Koordynatorzy (${emailCounts.coordinator})`} />
        </MenuItem>
        <MenuItem onClick={() => handleCopyEmails("school")}>
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={`Szkoły (${emailCounts.school})`} />
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
