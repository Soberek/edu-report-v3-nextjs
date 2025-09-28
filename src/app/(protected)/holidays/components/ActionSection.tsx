import React from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import { CloudDownload, Psychology, PostAdd } from "@mui/icons-material";

interface ActionSectionProps {
  onFetchHolidays: () => void;
  onExtractHealthHolidays: () => void;
  onGeneratePosts: () => void;
  loading: boolean;
  aiLoading: boolean;
  hasHolidays: boolean;
  hasHealthHolidays: boolean;
}

export const ActionSection: React.FC<ActionSectionProps> = ({
  onFetchHolidays,
  onExtractHealthHolidays,
  onGeneratePosts,
  loading,
  aiLoading,
  hasHolidays,
  hasHealthHolidays,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
        Akcje
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <CloudDownload color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 1: Pobierz święta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Pobierz nietypowe święta z wybranego URL
            </Typography>
            <Button variant="contained" startIcon={<CloudDownload />} onClick={onFetchHolidays} disabled={loading} sx={{ px: 3, py: 1.5 }}>
              {loading ? "Ładowanie..." : "Pobierz święta"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Psychology color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 2: Wyodrębnij święta zdrowotne
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Użyj AI do wyodrębnienia świąt związanych ze zdrowiem
            </Typography>
            <Button
              variant="contained"
              startIcon={<Psychology />}
              onClick={onExtractHealthHolidays}
              disabled={!hasHolidays || aiLoading}
              sx={{ px: 3, py: 1.5 }}
            >
              {aiLoading ? "Przetwarzanie..." : "Wyodrębnij święta"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <PostAdd color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 3: Wygeneruj posty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Wygeneruj posty na social media dla świąt zdrowotnych
            </Typography>
            <Button
              variant="contained"
              startIcon={<PostAdd />}
              onClick={onGeneratePosts}
              disabled={!hasHealthHolidays || aiLoading}
              sx={{ px: 3, py: 1.5 }}
            >
              {aiLoading ? "Generowanie..." : "Wygeneruj posty"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
