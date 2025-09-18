import { Box, Alert, Snackbar } from "@mui/material";
import { useContacts } from "@/hooks/useContact";
import ContactList from "./components/list";
import ContactForm from "./components/form";

export const Contacts = () => {
  const { contacts, loading, error, snackbar, handleContactSubmit, handleContactDelete, handleCloseSnackbar } = useContacts();

  return (
    <Box
      sx={{
        marginTop: 2,
      }}
    >
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type || "info"} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ContactForm onAddContact={handleContactSubmit} loading={loading} />

      <ContactList contacts={contacts} loading={loading} error={error} handleContactDelete={handleContactDelete} />
    </Box>
  );
};
