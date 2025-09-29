import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ExpandMore, LocalHospital, Home, Warning, Info, CheckCircle } from "@mui/icons-material";

interface DetailedSymptomGuideProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const DetailedSymptomGuide: React.FC<DetailedSymptomGuideProps> = ({
  title = "🔍 Szczegółowy przewodnik po objawach",
  showTitle = true,
}) => {
  const [expanded, setExpanded] = useState<string | false>("cold");

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const symptomDetails = [
    {
      id: "cold",
      title: "🤧 Przeziębienie - stopniowy rozwój objawów",
      severity: "low" as const,
      description: "Najczęstsza infekcja wirusowa górnych dróg oddechowych o łagodnym przebiegu",
      timeline: "2-3 dni rozwoju objawów",
      symptoms: [
        "Katar - początkowo wodnisty, potem gęsty",
        "Drapanie w gardle - uczucie suchości i podrażnienia",
        "Kichanie - częste, szczególnie rano",
        "Lekki kaszel - suchy lub z niewielką ilością wydzieliny",
        "Zatkany nos - utrudnione oddychanie",
        "Lekkie osłabienie - możliwość kontynuowania codziennych aktywności",
      ],
      fever: "Rzadko, jeśli już to poniżej 38°C",
      duration: "7-10 dni",
      complications: "Rzadkie - zapalenie zatok, ucha środkowego",
      treatment: "Leczenie objawowe, odpoczynek, nawadnianie",
    },
    {
      id: "flu",
      title: "🔥 Grypa - nagły atak na organizm",
      severity: "high" as const,
      description: "Poważniejsza infekcja wirusowa atakująca cały organizm",
      timeline: "Nagły początek w ciągu kilku godzin",
      symptoms: [
        "Wysoka gorączka - powyżej 39°C, często 40-41°C",
        "Silne bóle mięśni - szczególnie pleców, nóg, ramion",
        "Ból głowy - intensywny, pulsujący",
        "Wyczerpanie - skrajne zmęczenie, niemożność wstania z łóżka",
        "Dreszcze - uczucie zimna mimo gorączki",
        "Ból gardła - często towarzyszy suchy kaszel",
        "Brak apetytu - nudności, czasem wymioty",
      ],
      fever: "Wysoka, powyżej 39°C, utrzymuje się 3-7 dni",
      duration: "7-14 dni, często wymusza pozostanie w łóżku",
      complications: "Zapalenie płuc, oskrzeli, powikłania sercowe, zapalenie mózgu",
      treatment: "Leki przeciwwirusowe (w ciągu 48h), leżenie w łóżku, nawadnianie",
    },
    {
      id: "covid19",
      title: "😷 COVID-19 - zróżnicowany przebieg",
      severity: "variable" as const,
      description: "Choroba o bardzo zróżnicowanym przebiegu - od bezobjawowego po ciężkie zapalenie płuc",
      timeline: "2-7 dni od zakażenia, różny",
      symptoms: [
        "Utrata smaku i węchu - charakterystyczny objaw, często pierwszy",
        "Kaszel - suchy, uporczywy, może być bardzo silny",
        "Gorączka - różna wysokość, może być wysoka",
        "Duszności - problemy z oddychaniem, szczególnie przy wysiłku",
        "Bóle mięśni - podobne do grypy, ale mniej intensywne",
        "Ból głowy - często towarzyszy zmęczeniu",
        "Biegunka - czasem występuje u dzieci",
        "Wysypka - rzadko, ale może się pojawić",
      ],
      fever: "Często, różna wysokość",
      duration: "Zróżnicowany - od kilku dni do tygodni, możliwe długotrwałe objawy",
      complications: "Ciężkie zapalenie płuc, niewydolność oddechowa, long COVID, zakrzepica",
      treatment: "Leki przeciwwirusowe, tlenoterapia w ciężkich przypadkach, izolacja",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "success";
      case "high":
        return "error";
      case "variable":
        return "warning";
      default:
        return "primary";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "low":
        return "Łagodny";
      case "high":
        return "Ciężki";
      case "variable":
        return "Zróżnicowany";
      default:
        return "Nieznany";
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle>Szczegółowa analiza objawów</AlertTitle>
        Każda infekcja wirusowa ma charakterystyczne objawy i przebieg. Poniżej znajdziesz szczegółowe informacje o każdej z nich.
      </Alert>

      {symptomDetails.map((condition) => (
        <Accordion
          key={condition.id}
          expanded={expanded === condition.id}
          onChange={handleChange(condition.id)}
          sx={{
            mb: 2,
            borderRadius: 2,
            "&:before": { display: "none" },
            boxShadow: 2,
            "&.Mui-expanded": {
              margin: 0,
              marginBottom: 2,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              backgroundColor: "grey.50",
              borderRadius: "8px 8px 0 0",
              "&.Mui-expanded": {
                borderRadius: "8px 8px 0 0",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                {condition.title}
              </Typography>
              <Chip label={getSeverityLabel(condition.severity)} color={getSeverityColor(condition.severity)} size="small" sx={{ ml: 2 }} />
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
                      📋 Charakterystyka
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {condition.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Info sx={{ mr: 1, color: "info.main", fontSize: 16 }} />
                        <Typography variant="body2">
                          <strong>Czas rozwoju:</strong> {condition.timeline}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Warning sx={{ mr: 1, color: "warning.main", fontSize: 16 }} />
                        <Typography variant="body2">
                          <strong>Gorączka:</strong> {condition.fever}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckCircle sx={{ mr: 1, color: "success.main", fontSize: 16 }} />
                        <Typography variant="body2">
                          <strong>Czas trwania:</strong> {condition.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "error.main" }}>
                      ⚠️ Powikłania i leczenie
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Możliwe powikłania:</strong> {condition.complications}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Leczenie:</strong> {condition.treatment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "secondary.main" }}>
                      🔍 Szczegółowe objawy
                    </Typography>
                    <List dense>
                      {condition.symptoms.map((symptom, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "secondary.main",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={symptom}
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: { lineHeight: 1.4 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
