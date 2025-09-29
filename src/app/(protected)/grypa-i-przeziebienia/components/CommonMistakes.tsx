import React from "react";
import { Box, Typography, Card, CardContent, Grid, Chip, Alert, AlertTitle } from "@mui/material";
import { Warning, CheckCircle, Error } from "@mui/icons-material";
import { COMMON_MISTAKES } from "../constants";
import type { CommonMistake } from "../types";

interface CommonMistakesProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const CommonMistakes: React.FC<CommonMistakesProps> = ({ title = "⚠️ Najczęstsze błędy w leczeniu", showTitle = true }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "warning.main" }}>
          {title}
        </Typography>
      )}

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle>Unikaj tych błędów!</AlertTitle>
        Poniższe błędy mogą pogorszyć stan zdrowia i opóźnić powrót do zdrowia.
      </Alert>

      <Grid container spacing={3}>
        {COMMON_MISTAKES.map((mistake, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={mistake.id}>
            <Card
              sx={{
                height: "100%",
                border: "2px solid",
                borderColor: "warning.main",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Error sx={{ color: "error.main", mr: 1 }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: "error.main" }}>
                    Błąd #{index + 1}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    ❌ {mistake.mistake}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Skutki:</strong> {mistake.consequences}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: "success.light", borderRadius: 1, opacity: 0.9 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "success.dark" }}>
                      Prawidłowe postępowanie:
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {mistake.correctApproach}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
