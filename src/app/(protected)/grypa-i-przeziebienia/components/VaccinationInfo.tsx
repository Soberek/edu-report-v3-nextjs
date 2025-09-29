import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { CheckCircle, Warning, Info, LocalHospital, School, Home } from "@mui/icons-material";

interface VaccinationInfoProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const VaccinationInfo: React.FC<VaccinationInfoProps> = ({
  title = "💉 Szczepienia przeciw grypie - kompletny przewodnik",
  showTitle = true,
}) => {
  const effectivenessData = [
    { ageGroup: "Dzieci 6 miesięcy - 8 lat", protection: "32-60%", hospitalization: "63-78%" },
    { ageGroup: "Dzieci 9-17 lat", protection: "35-65%", hospitalization: "65-80%" },
    { ageGroup: "Dorośli 18-64 lata", protection: "40-70%", hospitalization: "70-85%" },
    { ageGroup: "Seniorzy 65+ lat", protection: "30-50%", hospitalization: "60-75%" },
  ];

  const benefits = [
    "Ochrona przed zachorowaniem na grypę",
    "Zmniejszenie ryzyka hospitalizacji",
    "Ochrona przed powikłaniami (zapalenie płuc, oskrzeli)",
    "Zmniejszenie ryzyka zawału serca i udaru",
    "Neuroprotekcja - zmniejszenie ryzyka demencji",
    "Ochrona osób z otoczenia (efekt stada)",
    "Zmniejszenie absencji w szkole/pracy",
    "Ochrona przed ciężkim przebiegiem choroby",
  ];

  const sideEffects = [
    "Ból w miejscu wkłucia - łagodny, trwa 1-2 dni",
    "Obrzęk i zaczerwienienie w miejscu wkłucia",
    "Gorączka niskiego stopnia (37-38°C)",
    "Ból głowy, zmęczenie - 1-2 dni",
    "Bóle mięśni - rzadko, łagodne",
  ];

  const contraindications = [
    "Ciężka alergia na składniki szczepionki",
    "Alergia na jaja kurze (w przypadku szczepionek zawierających białko jaja)",
    "Gorączka powyżej 38°C w dniu szczepienia",
    "Ostra choroba zakaźna",
    "Zaostrzenie choroby przewlekłej",
  ];

  const whenToVaccinate = [
    "Optymalny czas: wrzesień-październik",
    "Można szczepić się przez cały sezon grypowy",
    "Ochrona rozwija się po 2-3 tygodniach",
    "Szczepionka chroni przez cały sezon (6-8 miesięcy)",
    "Warto szczepić się co roku - wirusy mutują",
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle>Szczepienia to najlepsza ochrona!</AlertTitle>
        Szczepienia przeciw grypie są bezpieczne, skuteczne i bezpłatne dla dzieci i młodzieży do 18 lat w Polsce.
      </Alert>

      <Grid container spacing={3}>
        {/* Skuteczność szczepień */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "success.main" }}>
                📊 Skuteczność szczepień
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "success.light" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Grupa wiekowa</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ochrona przed zachorowaniem</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ochrona przed hospitalizacją</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {effectivenessData.map((row, index) => (
                      <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "grey.50" : "white" }}>
                        <TableCell>{row.ageGroup}</TableCell>
                        <TableCell>
                          <Chip label={row.protection} color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={row.hospitalization} color="info" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Korzyści ze szczepień */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "info.main" }}>
                ✅ Korzyści ze szczepień
              </Typography>
              <List dense>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit}
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

        {/* Kiedy się szczepić */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "warning.main" }}>
                📅 Kiedy się szczepić
              </Typography>
              <List dense>
                {whenToVaccinate.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Info sx={{ color: "warning.main", fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
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

        {/* Przeciwwskazania */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "error.main" }}>
                ⚠️ Przeciwwskazania
              </Typography>
              <List dense>
                {contraindications.map((contraindication, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Warning sx={{ color: "error.main", fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={contraindication}
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

        {/* Skutki uboczne */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "secondary.main" }}>
                🔍 Skutki uboczne
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Łagodne i przejściowe</AlertTitle>
                Skutki uboczne są zwykle łagodne i ustępują samoistnie w ciągu 1-2 dni.
              </Alert>
              <List dense>
                {sideEffects.map((effect, index) => (
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
                      primary={effect}
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

        {/* Gdzie się szczepić */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
                🏥 Gdzie się szczepić
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <LocalHospital sx={{ color: "primary.main", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Przychodnie POZ (Podstawowa Opieka Zdrowotna)"
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { lineHeight: 1.4 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Home sx={{ color: "primary.main", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Apteki (NFZ finansuje podanie szczepionki)"
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { lineHeight: 1.4 },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <School sx={{ color: "primary.main", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Szkoły (akcje szczepień organizowane przez sanepid)"
                    primaryTypographyProps={{
                      variant: "body2",
                      sx: { lineHeight: 1.4 },
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 3, backgroundColor: "success.light", borderRadius: 2, opacity: 0.9 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "success.dark" }}>
          💡 Ważne informacje
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Dostępność w Polsce 2025:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>Bezpłatne dla dzieci i młodzieży do 18 lat</li>
          <li>NFZ finansuje podanie szczepionki w aptekach</li>
          <li>Dostępne od września do marca</li>
          <li>Można szczepić się przez cały sezon grypowy</li>
        </Box>
      </Box>
    </Box>
  );
};
