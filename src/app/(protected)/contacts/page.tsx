"use client";
import { Box, Typography, Container, Paper, Tabs, Tab, Fade, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useContacts, ContactList, ContactForm, ContactStats, ContactSearch } from "@/features/contacts";
import { NotificationSnackbar } from "@/components/shared";

export default function Contacts(): React.ReactNode {
  const { contacts, loading, error, notification, handleContactSubmit, handleContactDelete, handleContactUpdate, closeNotification } =
    useContacts();
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Kontakty
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Zarządzaj swoimi kontaktami w jednym miejscu
        </Typography>
      </Box>

      {/* Stats Cards */}
      <ContactStats contacts={contacts} loading={loading} />

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1.1rem",
                minHeight: 60,
              },
            }}
          >
            <Tab label="Wszystkie kontakty" />
            <Tab label="Dodaj kontakt" />
            <Tab label="Wyszukaj" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Tab 0: Contact List */}
          <Fade in={activeTab === 0} timeout={300}>
            <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
              <ContactList
                contacts={contacts}
                loading={loading}
                error={error}
                handleContactDelete={handleContactDelete}
                handleContactUpdate={handleContactUpdate}
              />
            </Box>
          </Fade>

          {/* Tab 1: Add Contact */}
          <Fade in={activeTab === 1} timeout={300}>
            <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
              <ContactForm onAddContact={handleContactSubmit} loading={loading} />
            </Box>
          </Fade>

          {/* Tab 2: Search */}
          <Fade in={activeTab === 2} timeout={300}>
            <Box sx={{ display: activeTab === 2 ? "block" : "none" }}>
              <ContactSearch contacts={contacts} />
            </Box>
          </Fade>
        </Box>
      </Paper>

      <NotificationSnackbar
        notification={notification}
        onClose={closeNotification}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Container>
  );
}
