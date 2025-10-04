"use client";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { updateUser } from "@/services/userService";
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert } from "@mui/material";

export default function ProfilePage() {
  const { userData, loading } = useUser();
  const [displayName, setDisplayName] = useState(userData?.displayName || "");
  const [city, setCity] = useState(userData?.city || "");
  const [postalCode, setPostalCode] = useState(userData?.postalCode || "");
  const [countryCode, setCountryCode] = useState(userData?.countryCode || "PL");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  if (!userData) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">Nie znaleziono użytkownika.</Alert>
      </Container>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateUser(userData.uid, {
        displayName,
        city,
        postalCode,
        countryCode,
      });
      setSuccess(true);
  } catch (err: unknown) {
      setError("Nie udało się zaktualizować danych użytkownika.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Profil użytkownika
      </Typography>
      <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
        <TextField
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />
        <TextField
          label="Miasto do pogody (opcjonalnie)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Np. Warszawa, Kraków, Gdańsk"
        />
        <TextField
          label="Kod pocztowy (opcjonalnie)"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Np. 74-300"
        />
        <TextField
          label="Kod kraju (opcjonalnie)"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Np. PL"
        />
        <Button type="submit" variant="contained" color="primary" disabled={saving || !displayName}>
          {saving ? "Zapisywanie..." : "Zapisz"}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Nazwa użytkownika została zaktualizowana!</Alert>}
      </Box>
    </Container>
  );
}
