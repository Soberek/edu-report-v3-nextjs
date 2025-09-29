import React from "react";
import { Box, Typography, Card, CardContent, Grid, Chip, Avatar } from "@mui/material";
import { PREVENTION_TIPS } from "../constants";
import type { PreventionTip } from "../types";

interface PreventionTipsProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const PreventionTips: React.FC<PreventionTipsProps> = ({ title = "🛡️ Profilaktyka - jak się chronić", showTitle = true }) => {
  const getCategoryColor = (category: PreventionTip["category"]): "primary" | "secondary" | "success" | "warning" | "error" | "info" => {
    switch (category) {
      case "hygiene":
        return "primary";
      case "lifestyle":
        return "success";
      case "vaccination":
        return "info";
      case "environment":
        return "warning";
      default:
        return "default";
    }
  };

  const getCategoryLabel = (category: PreventionTip["category"]): string => {
    switch (category) {
      case "hygiene":
        return "Higiena";
      case "lifestyle":
        return "Styl życia";
      case "vaccination":
        return "Szczepienia";
      case "environment":
        return "Środowisko";
      default:
        return "Inne";
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={3}>
        {PREVENTION_TIPS.map((tip) => (
          <Grid item xs={12} sm={6} md={4} key={tip.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                  borderColor: "primary.light",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${getCategoryColor(tip.category)}.light`,
                      color: `${getCategoryColor(tip.category)}.main`,
                      mr: 2,
                      fontSize: "1.5rem",
                      width: 56,
                      height: 56,
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                      border: "2px solid rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {tip.icon}
                  </Avatar>
                  <Chip
                    label={getCategoryLabel(tip.category)}
                    color={getCategoryColor(tip.category)}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderWidth: 2,
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  />
                </Box>

                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {tip.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {tip.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 3,
          p: 4,
          background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
          borderRadius: 3,
          border: "2px solid",
          borderColor: "success.main",
          boxShadow: "0 4px 16px rgba(76, 175, 80, 0.2)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "success.dark" }}>
          💡 Kluczowe informacje o szczepieniach
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Skuteczność szczepień przeciw grypie:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>32-60% ochrony przed zachorowaniem u dzieci</li>
          <li>63-78% ochrony przed hospitalizacją u dzieci</li>
          <li>Bezpłatne dla dzieci i młodzieży do 18 lat w Polsce</li>
          <li>Dostępne w przychodniach POZ i aptekach</li>
        </Box>
      </Box>
    </Box>
  );
};
