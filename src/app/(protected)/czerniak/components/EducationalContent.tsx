import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandMore, Info, Warning, Lightbulb, Assessment } from "@mui/icons-material";
import { EducationalContent as EducationalContentType, ABCDEFeature } from "../types";

interface EducationalContentProps {
  content: EducationalContentType[];
  abcdeFeatures: ABCDEFeature[];
}

export const EducationalContentComponent: React.FC<EducationalContentProps> = ({ content, abcdeFeatures }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info color="info" />;
      case "warning":
        return <Warning color="warning" />;
      case "tip":
        return <Lightbulb color="primary" />;
      case "fact":
        return <Assessment color="secondary" />;
      default:
        return <Info color="info" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "info":
        return "info";
      case "warning":
        return "warning";
      case "tip":
        return "primary";
      case "fact":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        📚 Materiały edukacyjne o czerniaku
      </Typography>

      {/* Educational Content Cards */}
      <Grid container spacing={3} mb={4}>
        {content.map((item, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {getIcon(item.type)}
                  <Typography variant="h6" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.type}
                    color={getColor(item.type) as "primary" | "secondary" | "success" | "warning" | "error" | "info"}
                    size="small"
                    icon={getIcon(item.type)}
                  />
                </Box>
                <Typography variant="body1">{item.content}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ABCDE System */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            🔍 System ABCDE - Jak rozpoznać czerniaka
          </Typography>

          <Grid container spacing={3}>
            {abcdeFeatures.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.key}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="h3">{feature.icon}</Typography>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {feature.key} - {feature.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">{feature.details}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3}>
            ❓ Najczęściej zadawane pytania
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Kto jest najbardziej narażony na czerniaka?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Najbardziej narażone są osoby z jasną karnacją, dużą liczbą znamion, historią oparzeń słonecznych w dzieciństwie, rodzinną
                historią czerniaka, oraz te, które często korzystają z solariów.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Jak często należy badać skórę?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Zaleca się samobadanie skóry co miesiąc oraz profesjonalne badanie dermatologiczne raz w roku. Osoby z grupy ryzyka powinny
                być badane częściej - co 3-6 miesięcy.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Czy czerniak może wystąpić w miejscach nie wystawionych na słońce?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Tak, czerniak może wystąpić wszędzie na ciele, w tym w miejscach nie wystawionych na słońce, takich jak podeszwy stóp,
                dłonie, pod paznokciami, w jamie ustnej, a nawet w oku.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Jakie są rokowania w przypadku wczesnego wykrycia czerniaka?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Wcześnie wykryty czerniak (w stadium I) ma bardzo dobre rokowania z 5-letnim przeżyciem wynoszącym ponad 95%. Dlatego tak
                ważne są regularne badania skóry i wczesne wykrycie.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Prevention Tips */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3}>
            🛡️ Jak zapobiegać czerniakowi
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Ochrona przed słońcem:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>☀️</ListItemIcon>
                  <ListItemText primary="Używaj kremów z filtrem SPF 30+ przez cały rok" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>🕐</ListItemIcon>
                  <ListItemText primary="Unikaj słońca w godzinach 10:00-16:00" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>👕</ListItemIcon>
                  <ListItemText primary="Noś odzież ochronną i kapelusz" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>🕶️</ListItemIcon>
                  <ListItemText primary="Używaj okularów przeciwsłonecznych" />
                </ListItem>
              </List>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Regularne badania:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>🔍</ListItemIcon>
                  <ListItemText primary="Samobadanie skóry co miesiąc" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>👨‍⚕️</ListItemIcon>
                  <ListItemText primary="Badanie dermatologiczne raz w roku" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>📸</ListItemIcon>
                  <ListItemText primary="Fotografowanie znamion do porównania" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>📝</ListItemIcon>
                  <ListItemText primary="Prowadzenie dziennika zmian skórnych" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
