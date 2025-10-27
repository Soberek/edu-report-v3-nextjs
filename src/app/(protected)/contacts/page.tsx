"use client";

import { Box, Typography, Container, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

// ============================================================================
// COMPONENTS & HOOKS
// ============================================================================

import {
  useContacts,
  ContactList,
  ContactFormDialog,
  ContactStats,
  ContactSearch,
  ContactEditDialog,
  useContactDialogs,
  useContactOperations,
} from "@/features/contacts";
import type { ContactFormData, Contact } from "@/features/contacts";

import { NotificationSnackbar } from "@/components/shared";
import { useNotification } from "@/hooks";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContactsPage(): React.ReactNode {
  // ========================================================================
  // DATA & STATE MANAGEMENT
  // ========================================================================

  const { data: contacts, loading, error } = useContacts();
  const { notification, close: closeNotification } = useNotification();

  // Dialog state management
  const {
    showAddDialog,
    openAddDialog,
    closeAddDialog,
    editingContact,
    isEditDialogOpen,
    openEditDialog,
    closeEditDialog,
  } = useContactDialogs();

  // CRUD operations
  const { handleCreate, handleUpdate, handleDelete, isLoading } = useContactOperations();

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const onCreateContact = async (data: ContactFormData) => {
    const success = await handleCreate(data);
    if (success) closeAddDialog();
  };

  const onUpdateContact = handleUpdate;

  const onDeleteContact = async (id: string): Promise<void> => {
    await handleDelete(id);
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER SECTION */}
      <HeaderSection
        contactsCount={contacts.length}
        loading={loading}
        onAddContact={openAddDialog}
      />

      {/* STATS SECTION */}
      <StatsSection contacts={contacts} loading={loading} />

      {/* SEARCH SECTION */}
      <SearchSection
        contacts={contacts}
        onEdit={openEditDialog}
        onDelete={onDeleteContact}
      />

      {/* CONTACTS LIST SECTION */}
      <ContactsListSection
        contacts={contacts}
        loading={loading}
        error={error}
        onEdit={openEditDialog}
        onDelete={onDeleteContact}
      />

      {/* DIALOGS SECTION */}
      <DialogsSection
        showAddDialog={showAddDialog}
        editingContact={editingContact}
        isEditDialogOpen={isEditDialogOpen}
        loading={loading || isLoading}
        onCloseAddDialog={closeAddDialog}
        onCloseEditDialog={closeEditDialog}
        onCreateContact={onCreateContact}
        onUpdateContact={onUpdateContact}
      />

      {/* NOTIFICATIONS */}
      <NotificationSnackbar
        notification={notification}
        onClose={closeNotification}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Container>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface HeaderSectionProps {
  contactsCount: number;
  loading: boolean;
  onAddContact: () => void;
}

function HeaderSection({ contactsCount, loading, onAddContact }: HeaderSectionProps) {
  return (
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
          Zarządzaj swoimi kontaktami w jednym miejscu ({contactsCount})
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onAddContact}
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
  );
}

interface StatsSectionProps {
  contacts: Contact[];
  loading: boolean;
}

function StatsSection({ contacts, loading }: StatsSectionProps) {
  return <ContactStats contacts={contacts} loading={loading} />;
}

interface SearchSectionProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
}

function SearchSection({ contacts, onEdit, onDelete }: SearchSectionProps) {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <ContactSearch
        contacts={contacts}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Box>
  );
}

interface ContactsListSectionProps {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
}

function ContactsListSection({ contacts, loading, error, onEdit, onDelete }: ContactsListSectionProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <ContactList
        contacts={contacts}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Box>
  );
}

interface DialogsSectionProps {
  showAddDialog: boolean;
  editingContact: Contact | null;
  isEditDialogOpen: boolean;
  loading: boolean;
  onCloseAddDialog: () => void;
  onCloseEditDialog: () => void;
  onCreateContact: (data: ContactFormData) => Promise<void>;
  onUpdateContact: (id: string, data: ContactFormData) => Promise<boolean>;
}

function DialogsSection({
  showAddDialog,
  editingContact,
  isEditDialogOpen,
  loading,
  onCloseAddDialog,
  onCloseEditDialog,
  onCreateContact,
  onUpdateContact,
}: DialogsSectionProps) {
  return (
    <>
      <ContactFormDialog
        open={showAddDialog}
        onClose={onCloseAddDialog}
        onSave={onCreateContact}
        loading={loading}
      />

      <ContactEditDialog
        open={isEditDialogOpen}
        contact={editingContact}
        onClose={onCloseEditDialog}
        onSave={onUpdateContact}
      />
    </>
  );
}
