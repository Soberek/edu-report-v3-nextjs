/**
 * Custom hook for managing contact dialogs state
 * Centralizes dialog open/close logic and contact selection
 */

import { useState } from "react";
import type { Contact } from "../types";

export function useContactDialogs() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const openAddDialog = () => setShowAddDialog(true);
  const closeAddDialog = () => setShowAddDialog(false);

  const openEditDialog = (contact: Contact) => setEditingContact(contact);
  const closeEditDialog = () => setEditingContact(null);

  return {
    // Add dialog state
    showAddDialog,
    openAddDialog,
    closeAddDialog,

    // Edit dialog state
    editingContact,
    isEditDialogOpen: editingContact !== null,
    openEditDialog,
    closeEditDialog,
  };
}