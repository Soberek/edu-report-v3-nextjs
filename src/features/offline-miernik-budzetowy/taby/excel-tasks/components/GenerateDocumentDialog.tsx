import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Stack, Divider, CircularProgress } from "@mui/material";
import { useGenerateDocumentForm } from "../hooks/useGenerateDocumentForm";
import {
  IdentifiersSection,
  ProgramNameSection,
  TaskTypeSection,
  LocationSection,
  DateSection,
  ParticipantsSection,
  ScopeSection,
  NotesSection,
  AttachmentsSection,
} from "./sections";
import type { GenerateDocumentFormData } from "../schemas";
import type { GenerateDocumentDialogProps } from "../types";
import type { ExcelRow } from "../../../types";

/**
 * Dialog for reviewing and editing IZRZ document data
 * Uses custom hook to manage form state, validation, and data transformation
 *
 * Single Responsibility: Render form UI and handle submission
 * Form logic delegated to useGenerateDocumentForm hook
 */
export const GenerateDocumentDialog: React.FC<GenerateDocumentDialogProps> = ({
  open,
  onClose,
  rowData,
  rowIndex,
  onSubmit,
  isLoading = false,
}) => {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const form = useGenerateDocumentForm(rowData as ExcelRow, rowIndex);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmitHandler = async (data: GenerateDocumentFormData) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Błąd podczas generowania dokumentu");
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>📝 Generuj dokument IZRZ - Wiersz {rowIndex + 1}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Section 0: Identifiers - ON TOP */}
            <IdentifiersSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 1: Task - Nazwa programu */}
            <ProgramNameSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 2: Form - Działanie */}
            <TaskTypeSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 3: Location & Address */}
            <LocationSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 4: Date */}
            <DateSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 5: Target Group & People Count */}
            <ParticipantsSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 6: Scope of Participation - Task Description */}
            <ScopeSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 7: Additional Notes */}
            <NotesSection control={control} errors={errors} isLoading={isLoading} />

            <Divider />

            {/* Section 8: Attachments */}
            <AttachmentsSection control={control} errors={errors} isLoading={isLoading} />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Anuluj
        </Button>
        <Button
          onClick={handleSubmit(onSubmitHandler)}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
        >
          {isLoading ? "Generowanie..." : "Generuj dokument"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GenerateDocumentDialog.displayName = "GenerateDocumentDialog";
