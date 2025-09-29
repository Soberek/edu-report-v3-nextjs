import React from "react";
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemIcon, ListItemText, Chip, Divider } from "@mui/material";
import { CheckCircle, Cancel, Shield, Warning, Lightbulb } from "@mui/icons-material";

interface GoldenRulesProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const GoldenRules: React.FC<GoldenRulesProps> = ({ title = "✅ Złote zasady - podsumowanie", showTitle = true }) => {
  const preventionRules = [
    "Szczepienie przeciw grypie co sezon",
    "Higiena rąk – 20 sekund z mydłem",
    "Aktywność fizyczna – umiarkowana, regularna",
    "Zdrowy sen – 7-8 godzin dziennie",
    "Redukcja stresu – sport, relaks",
  ];

  const neverDoRules = [
    "Nie brać antybiotyków na infekcje wirusowe",
    "Nie lekceważyć wysokiej gorączki ponad 3 dni",
    "Nie wracać do szkoły z gorączką",
    "Nie wierzyć w mity o 'cudownych' suplementach",
    "Nie pić alkoholu podczas choroby",
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              border: "3px solid",
              borderColor: "success.main",
              borderRadius: 3,
              background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
              boxShadow: "0 4px 16px rgba(76, 175, 80, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Shield sx={{ color: "success.main", mr: 2, fontSize: 30 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "success.dark" }}>
                  🛡️ Profilaktyka
                </Typography>
              </Box>

              <List>
                {preventionRules.map((rule, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: "success.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={rule}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { fontWeight: 500 },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              border: "3px solid",
              borderColor: "error.main",
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)",
              boxShadow: "0 4px 16px rgba(244, 67, 54, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 32px rgba(244, 67, 54, 0.3)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Warning sx={{ color: "error.main", mr: 2, fontSize: 30 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "error.dark" }}>
                  ⚠️ Czego NIGDY nie robić
                </Typography>
              </Box>

              <List>
                {neverDoRules.map((rule, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Cancel sx={{ color: "error.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={rule}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { fontWeight: 500 },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          mt: 3,
          background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
          borderRadius: 3,
          border: "3px solid",
          borderColor: "info.main",
          boxShadow: "0 4px 16px rgba(33, 150, 243, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 32px rgba(33, 150, 243, 0.3)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Lightbulb sx={{ color: "info.main", mr: 2, fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "info.dark" }}>
              💡 Pamiętaj
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
            Większość infekcji wirusowych mija sama w 7-10 dni. Domowe metody mogą łagodzić objawy, ale nie zastąpią profesjonalnej opieki w
            przypadku powikłań.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ fontWeight: 600, color: "info.dark" }}>
            Najważniejsza jest profilaktyka: szczepienia, higiena, zdrowy styl życia i odpowiedzialne zachowanie podczas choroby.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
