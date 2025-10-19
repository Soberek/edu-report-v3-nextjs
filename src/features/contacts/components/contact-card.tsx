import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Fade,
} from "@mui/material";
import { Delete, Edit, Email, Phone } from "@mui/icons-material";
import { Contact } from "../types";
import ContactAvatar from "./contact-avatar";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  transitionDelay?: number;
}

/**
 * Reusable contact card component
 * Used in list and search views
 */
export default function ContactCard({
  contact,
  onEdit,
  onDelete,
  transitionDelay = 0,
}: ContactCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(contact.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(contact.createdAt).toLocaleDateString("pl-PL");

  return (
    <Fade in timeout={300} style={{ transitionDelay: `${transitionDelay}ms` }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header with name and actions */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
            <ContactAvatar
              firstName={contact.firstName}
              lastName={contact.lastName}
              size="medium"
            />
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
                Dodano: {formattedDate}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(contact)}
                disabled={isDeleting}
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
                onClick={handleDelete}
                disabled={isDeleting}
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

          {/* Contact info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
            {contact.email ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ color: "#666", fontSize: 20, flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  component="a"
                  href={`mailto:${contact.email}`}
                  sx={{
                    color: "#1976d2",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {contact.email}
                </Typography>
              </Box>
            ) : null}

            {contact.phone ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ color: "#666", fontSize: 20, flexShrink: 0 }} />
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
              </Box>
            ) : null}

            {!contact.email && !contact.phone ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                Brak dodatkowych informacji
              </Typography>
            ) : null}
          </Box>

          {/* Tags */}
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {contact.email && (
              <Chip label="Email" size="small" color="primary" variant="outlined" />
            )}
            {contact.phone && (
              <Chip label="Telefon" size="small" color="success" variant="outlined" />
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
