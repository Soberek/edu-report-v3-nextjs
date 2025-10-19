import React from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { GenericDialog } from "@/components/shared";
import { FormField } from "@/components/shared/FormField";
import { ContactFormData } from "../types";

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ContactFormData) => Promise<void>;
  loading?: boolean;
}

/**
 * Dialog for creating a new contact
 * Uses shared GenericDialog component for consistency
 */
export default function ContactFormDialog({
  open,
  onClose,
  onSave,
  loading = false,
}: ContactFormDialogProps) {
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<ContactFormData>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const isLoading = loading || isSubmitting;

  const onSubmit = async (data: ContactFormData) => {
    try {
      await onSave(data);
      handleClose();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <GenericDialog
      open={open}
      onClose={handleClose}
      title="Dodaj nowy kontakt"
      subtitle="Utwórz nowy wpis w Twoim katalogu kontaktów"
      maxWidth="sm"
      loading={isLoading}
      saveDisabled={!isDirty}
      onSave={handleSubmit(onSubmit)}
      saveText="Dodaj kontakt"
      sx={{
        "& .MuiDialogContent-root": {
          p: 4,
          mt: 1
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* First Name */}
        <FormField<ContactFormData>
          name="firstName"
          control={control}
          label="Imię"
          type="text"
          required
          placeholder="np. Jan"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "white",
            },
          }}
        />

        {/* Last Name */}
        <FormField<ContactFormData>
          name="lastName"
          control={control}
          label="Nazwisko"
          type="text"
          required
          placeholder="np. Kowalski"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "white",
            },
          }}
        />

        {/* Email */}
        <FormField<ContactFormData>
          name="email"
          control={control}
          label="Adres email"
          type="email"
          placeholder="np. jan.kowalski@example.com"
          helperText="Opcjonalne"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "white",
            },
          }}
        />

        {/* Phone */}
        <FormField<ContactFormData>
          name="phone"
          control={control}
          label="Numer telefonu"
          type="text"
          placeholder="np. 123 456 789"
          helperText="Opcjonalne"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "white",
            },
          }}
        />
      </Box>
    </GenericDialog>
  );
}
