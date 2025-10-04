"use client";

import { Box, Typography, Paper, Grid, Card, CardContent } from "@mui/material";
import { AdminPanelSettings, People, Settings, Analytics } from "@mui/icons-material";
import { useUser } from "@/hooks/useUser";

export default function AdminDashboard() {
  const { userData } = useUser();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Panel Administratora
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        Witaj, {userData?.displayName || userData?.email}! Jesteś zalogowany jako administrator.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{ height: "100%", cursor: "pointer", transition: "box-shadow 0.2s", "&:hover": { boxShadow: 6 } }}
            onClick={() => (window.location.href = "/admin/users")}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <People sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h6">Użytkownicy</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Zarządzaj użytkownikami i ich rolami
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Settings sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h6">Ustawienia</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Konfiguracja systemu i aplikacji
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Analytics sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h6">Statystyki</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Raporty i analiza danych
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AdminPanelSettings sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Typography variant="h6">Administracja</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Narzędzia administratora
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Informacje o koncie
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Email:</strong> {userData?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Rola:</strong> {userData?.role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>UID:</strong> {userData?.uid}
        </Typography>
      </Paper>
    </Box>
  );
}
