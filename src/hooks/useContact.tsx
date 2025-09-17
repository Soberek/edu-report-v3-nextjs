import { useState } from "react";
import { z } from "zod";

import { useUser } from "./useUser";
import { useFirebaseData } from "./useFirebaseData";

// Zod schema for contact validation
const ContactSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  userId: z.string(),
  createdAt: z.string(),
});

const ContactCreateSchema = ContactSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type ContactT = z.infer<typeof ContactSchema>;
export type ContactCreateDTO = Omit<ContactT, "id" | "createdAt" | "userId">;

export const useContacts = () => {
  const userContext = useUser();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: "success" | "error" | "info" | "warning" | "";
    message: string;
  }>({
    open: false,
    type: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const userId = userContext.user?.uid;

  const { loading, error: fetchError, data: contacts, createItem, deleteItem, updateItem } = useFirebaseData<ContactT>("contacts", userId);

  const handleContactSubmit = async (contactData: ContactCreateDTO) => {
    try {
      setError(null);
      const validatedData = ContactSchema.omit({
        id: true,
        createdAt: true,
        userId: true,
      }).parse(contactData);

      if (!userId) {
        setError("User not authenticated");
        return;
      }

      await createItem({
        ...validatedData,
      });
      setSnackbar({
        open: true,
        type: "success",
        message: "Kontakt dodany pomyślnie",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("Validation failed");
      } else {
        setError("Failed to create contact");
      }
    }
  };

  const handleContactUpdate = async (id: string, contactData: ContactCreateDTO) => {
    try {
      setError(null);
      const validatedData = ContactCreateSchema.parse(contactData);
      await updateItem(id, validatedData);
      setSnackbar({
        open: true,
        type: "success",
        message: "Kontakt zaktualizowany pomyślnie",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("Validation failed");
      } else {
        setError("Failed to update contact");
      }
      //
      setError("Failed to update contact");
    }
  };

  const handleContactDelete = async (id: string) => {
    try {
      setError(null);
      await deleteItem(id);
      setSnackbar({
        open: true,
        type: "success",
        message: "Kontakt usunięty pomyślnie",
      });
    } catch (error) {
      setError("Failed to delete contact" + error);
    }
  };

  const handleShowSnackbar = (message: string, type: "success" | "error" | "info" | "warning" | "") => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    contacts,
    loading,
    error: error || fetchError,
    snackbar,
    handleContactDelete,
    handleContactUpdate,
    handleContactSubmit,
    handleShowSnackbar,
    handleCloseSnackbar,
  };
};
