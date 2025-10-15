import { useState } from "react";
import { z } from "zod";

import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useNotification } from "@/hooks";

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
  const { notification, showSuccess, showError, close: closeNotification } = useNotification();
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
      showSuccess("Kontakt dodany pomyślnie");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("Validation failed");
      } else {
        setError("Failed to create contact");
      }
      showError("Nie udało się utworzyć kontaktu");
    }
  };

  const handleContactUpdate = async (id: string, contactData: ContactCreateDTO) => {
    try {
      setError(null);
      const validatedData = ContactCreateSchema.parse(contactData);
      await updateItem(id, validatedData);
      showSuccess("Kontakt zaktualizowany pomyślnie");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("Validation failed");
      } else {
        setError("Failed to update contact");
      }
      //
      setError("Failed to update contact");
      showError("Nie udało się zaktualizować kontaktu");
    }
  };

  const handleContactDelete = async (id: string) => {
    try {
      setError(null);
      await deleteItem(id);
      showSuccess("Kontakt usunięty pomyślnie");
    } catch (error) {
      setError("Failed to delete contact" + error);
      showError("Nie udało się usunąć kontaktu");
    }
  };

  return {
    contacts,
    loading,
    error: error || fetchError,
    notification,
    handleContactDelete,
    handleContactUpdate,
    handleContactSubmit,
    closeNotification,
  };
};
