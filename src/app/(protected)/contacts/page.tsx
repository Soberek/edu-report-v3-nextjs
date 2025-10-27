"use client";
import { Box, Typography, Container, Button } from "@mui/material";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import {
  useContacts,
  ContactList,
  ContactFormDialog,
  ContactStats,
  ContactSearch,
  ContactEditDialog,
} from "@/features/contacts";
import { NotificationSnackbar } from "@/components/shared";
import { useNotification } from "@/hooks";
import type { ContactFormData, Contact } from "@/features/contacts";

export default function ContactsPage(): React.ReactNode {
  const { data: contacts, loading, error, createContact, updateContact, deleteContact } =
    useContacts();
  const { notification, close: closeNotification } = useNotification();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleCreateContact = async (data: ContactFormData) => {
    try {
      const result = await createContact(data);
      if (result) {
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact(id);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleUpdateContact = async (id: string, data: ContactFormData) => {
    try {
      return await updateContact(id, data);
    } catch (error) {
      console.error("Error updating contact:", error);
      return false;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header with Action Button */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Kontakty
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Zarządzaj swoimi kontaktami w jednym miejscu ({contacts.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddDialog(true)}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
            },
          }}
        >
          Dodaj kontakt
        </Button>
      </Box>

      {/* Stats Cards */}
      <ContactStats contacts={contacts} loading={loading} />

      {/* Search Section */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <ContactSearch
          contacts={contacts}
          onDelete={handleDeleteContact}
        />
      </Box>

      {/* Contacts List */}
      <Box sx={{ mt: 4 }}>
        <ContactList
          contacts={contacts}
          loading={loading}
          error={error}
          onEdit={setEditingContact}
          onDelete={handleDeleteContact}
        />
      </Box>

      {/* Add Contact Dialog */}
      <ContactFormDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleCreateContact}
        loading={loading}
      />

      {/* Edit Contact Dialog */}
      <ContactEditDialog
        open={editingContact !== null}
        contact={editingContact}
        onClose={() => setEditingContact(null)}
        onSave={handleUpdateContact}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        notification={notification}
        onClose={closeNotification}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Container>
  );
}
