import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Stack } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { EditDialog, FormField, PrimaryButton, SecondaryButton } from "@/components/shared";
import { createProgramSchema, type CreateProgramFormData } from "../schemas/programSchemas";
import { Program } from "../types";
import { PROGRAM_TYPE } from "@/constants/programs";

interface ProgramFormProps {
  mode: "create" | "edit";
  program?: Program | null;
  onClose: () => void;
  onSave: (data: CreateProgramFormData) => Promise<void>;
  loading?: boolean;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({ mode, program, onClose, onSave, loading = false }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProgramFormData>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      code: program?.code || "",
      name: program?.name || "",
      programType: program?.programType || PROGRAM_TYPE.PROGRAMOWY,
      description: program?.description || "",
    },
  });

  const handleFormSubmit = async (data: CreateProgramFormData) => {
    try {
      await onSave(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isEdit = mode === "edit";
  const submitLoading = loading || isSubmitting;

  return (
    <EditDialog open={true} onClose={handleClose} title={isEdit ? "Edytuj program" : "Dodaj nowy program"} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3}>
          <FormField
            name="code"
            control={control}
            label="Kod programu"
            placeholder="Wprowadź kod programu"
            required
            error={!!errors.code}
            helperText={errors.code?.message}
            fullWidth
          />

          <FormField
            name="name"
            control={control}
            label="Nazwa programu"
            placeholder="Wprowadź nazwę programu"
            required
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />

          <FormField
            name="programType"
            control={control}
            label="Typ programu"
            select
            required
            error={!!errors.programType}
            helperText={errors.programType?.message}
            fullWidth
          >
            <option value={PROGRAM_TYPE.PROGRAMOWY}>Programowy</option>
            <option value={PROGRAM_TYPE.NIEPROGRAMOWY}>Nieprogramowy</option>
          </FormField>

          <FormField
            name="description"
            control={control}
            label="Opis programu"
            placeholder="Wprowadź opis programu"
            multiline
            minRows={3}
            required
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <SecondaryButton onClick={handleClose} disabled={submitLoading}>
              Anuluj
            </SecondaryButton>
            <PrimaryButton type="submit" loading={submitLoading} startIcon={isEdit ? <Edit /> : <Add />}>
              {isEdit ? "Zaktualizuj program" : "Dodaj program"}
            </PrimaryButton>
          </Stack>
        </Stack>
      </Box>
    </EditDialog>
  );
};
