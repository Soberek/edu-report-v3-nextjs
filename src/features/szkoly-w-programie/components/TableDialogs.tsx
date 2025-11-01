/**
 * Table dialog manager component
 * Manages add/edit dialogs for participation forms
 * Extracted from main table component for better separation of concerns
 */

import React, { useCallback } from "react";
import { GenericDialog } from "@/components/shared";
import { EditParticipationForm, EditParticipationFormRef } from "./EditParticipationForm";
import { ParticipationForm } from "./ParticipationForm";
import type { School, Contact, Program, SchoolProgramParticipation } from "@/types";
import type { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for edit dialog
 */
interface EditDialogProps {
  open: boolean;
  participation: SchoolProgramParticipation | null;
  loading: boolean;
  schools: School[];
  contacts: Contact[];
  programs: Program[];
  formRef: React.Ref<EditParticipationFormRef>;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<SchoolProgramParticipation>) => Promise<void>;
  onSaveClick: () => Promise<void>;
}

/**
 * Props for add dialog
 */
interface AddDialogProps {
  open: boolean;
  loading: boolean;
  schools: School[];
  contacts: Contact[];
  programs: Program[];
  formMethods: UseFormReturn<SchoolProgramParticipationDTO>;
  onClose: () => void;
  onSubmit: (data: SchoolProgramParticipationDTO) => Promise<void>;
  onSaveClick: () => Promise<void>;
}

/**
 * Edit Participation Dialog
 */
export const EditParticipationDialog: React.FC<EditDialogProps> = ({
  open,
  participation,
  loading,
  schools,
  contacts,
  programs,
  formRef,
  onClose,
  onSubmit,
  onSaveClick,
}) => {
  const handleFormSubmit = useCallback(
    async (data: Partial<SchoolProgramParticipation>) => {
      if (participation) {
        const updatedParticipation: SchoolProgramParticipation = {
          ...participation,
          ...data,
        };
        await onSubmit(participation.id, updatedParticipation);
        onClose();
      }
    },
    [participation, onSubmit, onClose]
  );

  return (
    <GenericDialog
      open={open}
      title="Edytuj uczestnictwo szkoły"
      onClose={onClose}
      onSave={onSaveClick}
      loading={loading}
      maxWidth="md"
    >
      <EditParticipationForm
        ref={formRef}
        participation={participation}
        schools={schools}
        contacts={contacts}
        programs={programs}
        onSubmit={handleFormSubmit}
      />
    </GenericDialog>
  );
};

/**
 * Add Participation Dialog
 */
export const AddParticipationDialog: React.FC<AddDialogProps> = ({
  open,
  loading,
  schools,
  contacts,
  programs,
  formMethods,
  onClose,
  onSubmit,
  onSaveClick,
}) => {
  const handleFormSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      await onSubmit(data);
      onClose();
    },
    [onSubmit, onClose]
  );

  return (
    <GenericDialog
      open={open}
      title="Dodaj nowe uczestnictwo szkoły"
      onClose={onClose}
      onSave={onSaveClick}
      loading={loading}
      maxWidth="md"
    >
      <ParticipationForm
        schools={schools}
        contacts={contacts}
        programs={programs}
        loading={loading}
        onSubmit={handleFormSubmit}
        formMethods={formMethods}
        showSubmitButton={false}
      />
    </GenericDialog>
  );
};
