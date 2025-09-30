import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Grid,
  Paper,
  Divider,
  Fade,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Delete, Edit, Email, Phone, Person, ViewList, ViewModule } from "@mui/icons-material";
import type { Contact } from "@/types";
import type { ContactCreateDTO } from "@/hooks/useContact";
import EditDialog from "./edit-dialog";

interface Props {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  handleContactDelete: (id: string) => void;
  handleContactUpdate: (id: string, data: ContactCreateDTO) => void;
}

export default function ContactList({ contacts, loading, error, handleContactDelete, handleContactUpdate }: Props) {
  const [isCompactView, setIsCompactView] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setEditDialogOpen(true);
  };

  const handleSaveContact = (id: string, data: ContactCreateDTO) => {
    handleContactUpdate(id, data);
    setEditDialogOpen(false);
    setEditingContact(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingContact(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Ładowanie kontaktów...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
          border: "1px solid #ffcdd2",
        }}
      >
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Błąd ładowania kontaktów
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Paper>
    );
  }

  if (contacts.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Person sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Brak kontaktów
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dodaj swój pierwszy kontakt, aby rozpocząć
        </Typography>
      </Paper>
    );
  }

  const renderCompactView = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
            <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Kontakt</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Telefon</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#2c3e50" }}>Data dodania</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#2c3e50", textAlign: "center" }}>Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              sx={{
                "&:hover": {
                  background: "rgba(25, 118, 210, 0.04)",
                },
                "&:last-child td": { border: 0 },
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: getRandomColor(contact.firstName),
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    {getInitials(contact.firstName, contact.lastName)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
                      {contact.firstName} {contact.lastName}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                {contact.email ? (
                  <Typography
                    variant="body2"
                    component="a"
                    href={`mailto:${contact.email}`}
                    sx={{
                      color: "#1976d2",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {contact.email}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    Brak
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {contact.phone ? (
                  <Typography
                    variant="body2"
                    component="a"
                    href={`tel:${contact.phone}`}
                    sx={{
                      color: "#1976d2",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {contact.phone}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    Brak
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(contact.createdAt).toLocaleDateString("pl-PL")}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditContact(contact)}
                    sx={{
                      color: "#1976d2",
                      "&:hover": {
                        background: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleContactDelete(contact.id)}
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        background: "rgba(244, 67, 54, 0.1)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {contacts.map((contact, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={contact.id}>
          <Fade in timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: getRandomColor(contact.firstName),
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    {getInitials(contact.firstName, contact.lastName)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                        lineHeight: 1.2,
                      }}
                    >
                      {contact.firstName} {contact.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dodano: {new Date(contact.createdAt).toLocaleDateString("pl-PL")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditContact(contact)}
                      sx={{
                        color: "#1976d2",
                        "&:hover": {
                          background: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleContactDelete(contact.id)}
                      sx={{
                        color: "#f44336",
                        "&:hover": {
                          background: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Contact Info */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {contact.email && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email sx={{ color: "#666", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#1976d2",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        component="a"
                        href={`mailto:${contact.email}`}
                      >
                        {contact.email}
                      </Typography>
                    </Box>
                  )}

                  {contact.phone && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ color: "#666", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#1976d2",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        component="a"
                        href={`tel:${contact.phone}`}
                      >
                        {contact.phone}
                      </Typography>
                    </Box>
                  )}

                  {!contact.email && !contact.phone && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Brak dodatkowych informacji kontaktowych
                    </Typography>
                  )}
                </Box>

                {/* Tags */}
                <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {contact.email && <Chip label="Email" size="small" color="primary" variant="outlined" sx={{ fontSize: "0.75rem" }} />}
                  {contact.phone && <Chip label="Telefon" size="small" color="success" variant="outlined" sx={{ fontSize: "0.75rem" }} />}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Person sx={{ color: "#1976d2" }} />
          Wszystkie kontakty ({contacts.length})
        </Typography>

        <FormControlLabel
          control={<Switch checked={isCompactView} onChange={(e) => setIsCompactView(e.target.checked)} color="primary" />}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isCompactView ? <ViewList /> : <ViewModule />}
              <Typography variant="body2">{isCompactView ? "Widok kompaktowy" : "Widok kart"}</Typography>
            </Box>
          }
        />
      </Box>

      {isCompactView ? renderCompactView() : renderCardView()}

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        contact={editingContact}
        onClose={handleCloseEditDialog}
        onSave={handleSaveContact}
        loading={loading}
      />
    </Box>
  );
}
