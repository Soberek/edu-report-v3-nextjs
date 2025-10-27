import React, { useState } from "react";
import { Box } from "@mui/material";
import { Edit, Delete, Person } from "@mui/icons-material";
import type { GridColDef } from "@mui/x-data-grid";
import { TableWrapper, DataTable, defaultActions, type DataTableAction } from "@/components/shared";
import { Contact, ContactFormData } from "../types";
import ContactAvatar from "./contact-avatar";

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Contacts list component with card and table views
 * Uses shared TableWrapper and DataTable components for consistency
 */
export default function ContactList({
  contacts,
  loading,
  error,
  onEdit,
  onDelete,
}: ContactListProps) {
  const handleEditContact = (contact: Contact) => {
    onEdit(contact);
  };

  // Table columns configuration for DataTable
  const columns: GridColDef<Contact>[] = [
    {
      field: "name",
      headerName: "Kontakt",
      flex: 1,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, height: "100%" }}>
          <ContactAvatar
            firstName={params.row.firstName}
            lastName={params.row.lastName}
            size="small"
          />
          <Box>
            <Box sx={{ fontWeight: 600, color: "#2c3e50" }}>
              {params.row.firstName} {params.row.lastName}
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) =>
        params.row.email ? (
          <Box
            component="a"
            href={`mailto:${params.row.email}`}
            sx={{
              color: "#1976d2",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {params.row.email}
          </Box>
        ) : (
          <Box sx={{ fontStyle: "italic", color: "text.secondary", fontSize: "0.875rem" }}>
            Brak
          </Box>
        ),
    },
    {
      field: "phone",
      headerName: "Telefon",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        params.row.phone ? (
          <Box
            component="a"
            href={`tel:${params.row.phone}`}
            sx={{
              color: "#1976d2",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {params.row.phone}
          </Box>
        ) : (
          <Box sx={{ fontStyle: "italic", color: "text.secondary", fontSize: "0.875rem" }}>
            Brak
          </Box>
        ),
    },
    {
      field: "createdAt",
      headerName: "Data dodania",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ fontSize: "0.875rem" }}>
          {new Date(params.row.createdAt).toLocaleDateString("pl-PL")}
        </Box>
      ),
    },
  ];

  // Action buttons for DataTable
  const actions: DataTableAction[] = [
    defaultActions.edit((id) => {
      const contact = contacts.find((c) => c.id === id);
      if (contact) handleEditContact(contact);
    }),
    defaultActions.delete((id) => onDelete(id)),
  ];

  return (
    <Box>
      {error ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
            border: "1px solid #ef5350",
          }}
        >
          <Box sx={{ color: "#c62828", fontWeight: 600 }}>
            Błąd ładowania kontaktów: {error}
          </Box>
        </Box>
      ) : (
        <TableWrapper<Contact>
          title="Wszystkie kontakty"
          icon={<Person sx={{ color: "#1976d2" }} />}
          data={contacts}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyTitle="Brak kontaktów"
          emptyDescription="Dodaj swój pierwszy kontakt, aby rozpocząć"
          height={600}
          getRowId={(row) => row.id}
        />
      )}
    </Box>
  );
}
