import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Delete, Edit, Person } from "@mui/icons-material";
import type { GridColDef } from "@mui/x-data-grid";
import { FilterSection, TableWrapper, defaultActions, type DataTableAction } from "@/components/shared";
import { Contact } from "../types";
import { searchContacts } from "../utils";
import ContactAvatar from "./contact-avatar";

interface ContactSearchProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => Promise<void>;
}

/**
 * Search and display contacts using shared FilterSection and TableWrapper
 * Filters by name, email, or phone and displays results in table format
 */
export default function ContactSearch({
  contacts,
  onEdit,
  onDelete,
}: ContactSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = useMemo(() => {
    return searchContacts(contacts, searchTerm);
  }, [contacts, searchTerm]);

  const handleEditContact = (contact: Contact) => {
    onEdit?.(contact);
  };

  // Table columns configuration
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
      const contact = filteredContacts.find((c) => c.id === id);
      if (contact) handleEditContact(contact);
    }),
    defaultActions.delete((id) => onDelete?.(id)),
  ];

  const filterFields = [
    {
      id: "search",
      type: "text" as const,
      label: "Szukaj",
      placeholder: "Szukaj po imieniu, nazwisku, emailu lub telefonie...",
      value: searchTerm,
      onChange: setSearchTerm,
      gridColumn: "1 / -1",
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#2c3e50" }}>
        Wyszukaj kontakty
      </Typography>

      {/* Search Filter Section */}
      <FilterSection
        title="Kryteria wyszukiwania"
        fields={filterFields}
        onClearAll={() => setSearchTerm("")}
        showClearAll={Boolean(searchTerm)}
      />

      {/* Results Info */}
      {searchTerm && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Znaleziono {filteredContacts.length} {filteredContacts.length === 1 ? "kontakt" : "kontaktów"}
          </Typography>
        </Box>
      )}

      {/* Results Table - Only show when searching */}
      {searchTerm && (
        <TableWrapper<Contact>
          title="Wyniki wyszukiwania"
          icon={<Person sx={{ color: "#1976d2" }} />}
          data={filteredContacts}
          columns={columns}
          actions={actions}
          loading={false}
          emptyTitle="Nie znaleziono kontaktów"
          emptyDescription="Spróbuj zmienić kryteria wyszukiwania"
          height={500}
          getRowId={(row) => row.id}
          showHeader={true}
        />
      )}
    </Box>
  );
}
