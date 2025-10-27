import React from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { GenericDialog } from "@/components/shared";
import { FormField } from "@/components/shared/FormField";
import { Contact, ContactFormData } from "../types";
import ContactAvatar from "./contact-avatar";

interface EditDialogProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (id: string, data: ContactFormData) => Promise<boolean>;
}

/**
 * Dialog for editing contact information
 * Uses shared GenericDialog component for consistency
 */
export default function EditDialog({
  open,
  contact,
  onClose,
  onSave,
}: EditDialogProps) {
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

  // Reset form when contact changes
  React.useEffect(() => {
    if (contact) {
      reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email || "",
        phone: contact.phone || "",
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: ContactFormData) => {
    if (!contact) return;
    try {
      const success = await onSave(contact.id, data);
      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const headerContent = contact ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ContactAvatar
        firstName={contact.firstName}
        lastName={contact.lastName}
        size="medium"
      />
      <Box>
        <div>{contact.firstName} {contact.lastName}</div>
      </Box>
    </Box>
  ) : null;

  if (!contact) return null;

  return (
    <GenericDialog
      open={open}
      onClose={handleClose}
      title="Edytuj kontakt"
      subtitle={contact ? `${contact.firstName} ${contact.lastName}` : undefined}
      maxWidth="sm"
      loading={isSubmitting}
      saveDisabled={!isDirty}
      onSave={handleSubmit(onSubmit)}
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
