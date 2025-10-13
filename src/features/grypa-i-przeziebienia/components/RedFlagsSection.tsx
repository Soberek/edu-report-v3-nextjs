import React from "react";
import { Box, Typography, Card, CardContent, Chip, Grid, Alert, AlertTitle } from "@mui/material";
import { Warning, Error, Info } from "@mui/icons-material";
import { RED_FLAGS } from "../constants";
import type { RedFlag } from "../types";

interface RedFlagsSectionProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const RedFlagsSection: React.FC<RedFlagsSectionProps> = ({
  title = "🚨 Czerwone flagi - kiedy natychmiast do lekarza",
  showTitle = true,
}) => {
  const getUrgencyIcon = (urgency: RedFlag["urgency"]) => {
    switch (urgency) {
      case "immediate":
        return <Error sx={{ color: "error.main" }} />;
      case "urgent":
        return <Warning sx={{ color: "warning.main" }} />;
      case "consult":
        return <Info sx={{ color: "info.main" }} />;
      default:
        return <Warning sx={{ color: "warning.main" }} />;
    }
  };

  const getUrgencyColor = (urgency: RedFlag["urgency"]): "error" | "warning" | "info" => {
    switch (urgency) {
      case "immediate":
        return "error";
      case "urgent":
        return "warning";
      case "consult":
        return "info";
      default:
        return "warning";
    }
  };

  const getUrgencyText = (urgency: RedFlag["urgency"]): string => {
    switch (urgency) {
      case "immediate":
        return "Natychmiast";
      case "urgent":
        return "Pilnie";
      case "consult":
        return "Konsultacja";
      default:
        return "Pilnie";
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "error.main" }}>
          {title}
        </Typography>
      )}

      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle>Objawy wymagające pilnej konsultacji</AlertTitle>
        Jeśli wystąpi którykolwiek z poniższych objawów, niezwłocznie skontaktuj się z lekarzem lub udaj się na pogotowie.
      </Alert>

      <Grid container spacing={2}>
        {RED_FLAGS.map((flag) => (
          <Grid size={{ xs: 12, md: 6 }} key={flag.id}>
            <Card
              sx={{
                height: "100%",
                border: `3px solid`,
                borderColor: `${getUrgencyColor(flag.urgency)}.main`,
                borderRadius: 3,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1)`,
                "&:hover": {
                  transform: "translateY(-6px) scale(1.02)",
                  boxShadow: `0 12px 40px ${
                    getUrgencyColor(flag.urgency) === "error"
                      ? "rgba(244, 67, 54, 0.3)"
                      : getUrgencyColor(flag.urgency) === "warning"
                      ? "rgba(255, 152, 0, 0.3)"
                      : "rgba(33, 150, 243, 0.3)"
                  }`,
                  borderWidth: "4px",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {getUrgencyIcon(flag.urgency)}
                  <Chip
                    label={getUrgencyText(flag.urgency)}
                    color={getUrgencyColor(flag.urgency)}
                    size="small"
                    sx={{
                      ml: 1,
                      fontWeight: 700,
                      borderWidth: 2,
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  />
                </Box>

                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: "error.main" }}>
                  {flag.symptom}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {flag.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 3,
          p: 3,
          background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
          borderRadius: 3,
          border: "2px solid",
          borderColor: "warning.main",
          boxShadow: "0 4px 16px rgba(255, 152, 0, 0.2)",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <strong>Najczęstsze powikłania:</strong> Zapalenie zatok, ucha środkowego, oskrzeli, płuc. Wyższe ryzyko u osób z chorobami
          przewlekłymi.
        </Typography>
      </Box>
    </Box>
  );
};
