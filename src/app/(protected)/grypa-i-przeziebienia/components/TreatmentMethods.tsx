import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
} from "@mui/material";
import { LocalHospital, Home, Restaurant, FitnessCenter, Psychology, Medication } from "@mui/icons-material";

interface TreatmentMethodsProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const TreatmentMethods: React.FC<TreatmentMethodsProps> = ({ title = "🏥 Metody leczenia i wspomagania", showTitle = true }) => {
  const treatmentCategories = [
    {
      id: "home-care",
      title: "Leczenie domowe",
      icon: <Home />,
      color: "primary" as const,
      methods: [
        "Odpoczynek w łóżku - organizm potrzebuje energii do walki z infekcją",
        "Sen 7-8 godzin dziennie wzmacnia układ odpornościowy",
        "Nawadnianie - woda, herbaty ziołowe (lipa, czarny bez, malina)",
        "Ciepłe napoje łagodzą ból gardła i mogą obniżać temperaturę",
        "Inhalacje z solą fizjologiczną udrażniają nos i zatoki",
        "Płukanie gardła roztworem soli (½ łyżeczki w szklance ciepłej wody)",
      ],
    },
    {
      id: "medications",
      title: "Leki bez recepty",
      icon: <Medication />,
      color: "secondary" as const,
      methods: [
        "Paracetamol/ibuprofen - przeciwgorączkowe i przeciwbólowe",
        "Stosować tylko przy gorączce powyżej 38-38,5°C",
        "Nie dublować preparatów z tym samym składnikiem aktywnym",
        "Krople do nosa nie dłużej niż 5-7 dni (ryzyko uzależnienia)",
        "Syropy na kaszel - wykrztuśne lub przeciwkaszlowe w zależności od typu",
        "Pastylki do ssania łagodzą ból gardła",
      ],
    },
    {
      id: "natural-remedies",
      title: "Naturalne wspomaganie",
      icon: <Restaurant />,
      color: "success" as const,
      methods: [
        "Miód - łagodzi kaszel i ból gardła, szczególnie z ciepłymi napojami",
        "Czosnek i cebula - zawierają allicynę o właściwościach przeciwwirusowych",
        "Imbir - działa przeciwzapalnie i łagodzi nudności",
        "Cytryna z miodem - bogate źródło witaminy C",
        "Rumianek - działa przeciwzapalnie i uspokajająco",
        "Echinacea - może skrócić czas trwania infekcji",
      ],
    },
    {
      id: "lifestyle",
      title: "Styl życia",
      icon: <FitnessCenter />,
      color: "info" as const,
      methods: [
        "Unikanie wysiłku fizycznego podczas gorączki",
        "Lekkie, łatwostrawne posiłki",
        "Unikanie alkoholu - osłabia układ odpornościowy",
        "Nie palenie papierosów - podrażnia drogi oddechowe",
        "Odpowiednia temperatura w pomieszczeniu (18-20°C)",
        "Nawilżanie powietrza w pomieszczeniu",
      ],
    },
    {
      id: "mental-health",
      title: "Wsparcie psychiczne",
      icon: <Psychology />,
      color: "warning" as const,
      methods: [
        "Redukcja stresu - osłabia układ odpornościowy",
        "Pozytywne nastawienie - może wpływać na szybkość powrotu do zdrowia",
        "Kontakt z bliskimi (telefoniczny/wideo) podczas izolacji",
        "Relaksacja - medytacja, głębokie oddychanie",
        "Unikanie negatywnych wiadomości",
        "Planowanie przyjemnych aktywności po wyzdrowieniu",
      ],
    },
    {
      id: "medical-care",
      title: "Kiedy do lekarza",
      icon: <LocalHospital />,
      color: "error" as const,
      methods: [
        "Gorączka powyżej 40°C utrzymująca się ponad 3 dni",
        "Problemy z oddychaniem, duszności",
        "Kaszel z krwistą lub ropną wydzieliną",
        "Silny ból głowy z sztywnością karku",
        "Dezorientacja, utrata przytomności",
        "Brak poprawy po 7-10 dniach",
      ],
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle>Kompleksowe podejście do leczenia</AlertTitle>
        Skuteczne leczenie infekcji wirusowych wymaga połączenia różnych metod. Poniżej znajdziesz szczegółowe informacje o każdym aspekcie
        terapii.
      </Alert>

      <Grid container spacing={3}>
        {treatmentCategories.map((category) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={category.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${category.color}.light`,
                      color: `${category.color}.main`,
                      mr: 2,
                    }}
                  >
                    {category.icon}
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {category.title}
                  </Typography>
                </Box>

                <List dense>
                  {category.methods.map((method, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: `${category.color}.main`,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={method}
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
        ))}
      </Grid>

      <Box sx={{ mt: 3, p: 3, backgroundColor: "error.light", borderRadius: 2, opacity: 0.9 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "error.dark" }}>
          ⚠️ Ważne ostrzeżenie
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Antybiotyki NIE działają na wirusy!</strong> 90% infekcji dróg oddechowych to wirusy. Stosowanie antybiotyków przy
          infekcjach wirusowych:
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>Niszczy florę jelitową na 6 miesięcy</li>
          <li>Obniża odporność organizmu</li>
          <li>Prowadzi do antybiotykooporności</li>
          <li>Może uszkodzić wątrobę i nerki</li>
        </Box>
      </Box>
    </Box>
  );
};
