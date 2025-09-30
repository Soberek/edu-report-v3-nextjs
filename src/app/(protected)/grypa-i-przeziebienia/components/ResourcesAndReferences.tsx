import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Chip,
  Grid,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Link as LinkIcon, School, LocalHospital, Public, Science, Book } from "@mui/icons-material";

interface ResourcesAndReferencesProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const ResourcesAndReferences: React.FC<ResourcesAndReferencesProps> = ({
  title = "📚 Źródła i materiały do dalszej lektury",
  showTitle = true,
}) => {
  const resources = [
    {
      category: "Oficjalne źródła medyczne",
      icon: <LocalHospital />,
      color: "primary" as const,
      items: [
        {
          title: "Szczepienia przeciw grypie - PZH",
          url: "https://szczepienia.pzh.gov.pl/faq/jakie-sa-objawy-przeziebienia-grypy-i-covid-19/",
          description: "Oficjalne informacje o objawach i szczepieniach",
        },
        {
          title: "Przeziębienie i grypa - MP.pl",
          url: "https://www.mp.pl/pacjent/grypa/przeziebienie/61677,najwazniejsze-zalecenia-dla-przeziebionych",
          description: "Zalecenia dla przeziębionych - Medycyna Praktyczna",
        },
        {
          title: "Kalendarz szczepień 2025 - Pacjent.gov.pl",
          url: "http://pacjent.gov.pl/aktualnosc/kalendarz-szczepien-dzieci-i-mlodziezy-na-2025-rok",
          description: "Oficjalny kalendarz szczepień dla dzieci i młodzieży",
        },
      ],
    },
    {
      category: "Edukacja i profilaktyka",
      icon: <School />,
      color: "success" as const,
      items: [
        {
          title: "Aktywność fizyczna a odporność - NCEZ",
          url: "https://ncez.pzh.gov.pl/ruch_i_zywienie/aktywnosc-fizyczna-a-odpornosc-organizmu/",
          description: "Wpływ aktywności fizycznej na układ odpornościowy",
        },
        {
          title: "Profilaktyka antystresowa - NFZ",
          url: "https://www.nfz-lodz.pl/dlapacjentow/nfz-blizej-pacjenta/8988-sroda-z-profilaktyka-aktywnosc-fizyczna-jako-profilaktyka-antystresowa",
          description: "Aktywność fizyczna jako profilaktyka antystresowa",
        },
        {
          title: "Szczepienia przeciw grypie - UMP",
          url: "https://onauce.ump.edu.pl/2025/09/16/ruszaja-szczepienia-przeciw-grypie-to-inwestycja-w-zdrowie/",
          description: "Informacje o szczepieniach przeciw grypie",
        },
      ],
    },
    {
      category: "Leczenie i farmakologia",
      icon: <Science />,
      color: "warning" as const,
      items: [
        {
          title: "Domowe sposoby na grypę - Apteline",
          url: "https://apteline.pl/artykuly/domowe-sposoby-na-grype-sprawdz-jak-mozesz-sobie-pomoc",
          description: "Sprawdzone domowe metody leczenia",
        },
        {
          title: "Naturalne sposoby leczenia - Recepta.pl",
          url: "https://recepta.pl/artykuly/przeziebienie-jak-leczyc-naturalnymi-i-babcinymi-sposobami",
          description: "Naturalne i babcine sposoby na przeziębienie",
        },
        {
          title: "Błędy w leczeniu - Aptekarski.com",
          url: "https://aptekarski.com/artykul/lepiej-tego-nie-rob-najczestsze-bledy-przy-leczeniu-przeziebienia",
          description: "Najczęstsze błędy w leczeniu przeziębienia",
        },
      ],
    },
    {
      category: "Fakty i mity",
      icon: <Book />,
      color: "info" as const,
      items: [
        {
          title: "Fakty i mity o odporności - Apteline",
          url: "https://apteline.pl/artykuly/odpornosc-fakty-i-mity",
          description: "Rozwianie mitów na temat odporności",
        },
        {
          title: "Witamina C - fakty i mity - PAP",
          url: "https://zdrowie.pap.pl/dieta/mit-ze-witamina-c-zapobiega-przeziebieniu",
          description: "Prawda o witaminie C i przeziębieniu",
        },
        {
          title: "Szczepienia a autyzm - PAP",
          url: "https://zdrowie.pap.pl/fakty-i-mity/rodzice/sa-dowody-na-ze-szczepienia-powoduja-autyzm",
          description: "Rozwianie mitu o szczepieniach i autyzmie",
        },
      ],
    },
    {
      category: "Źródła internetowe",
      icon: <Public />,
      color: "secondary" as const,
      items: [
        {
          title: "Różnice między grypą a COVID-19 - Aptekarosa",
          url: "https://www.aptekarosa.pl/blog/article/1146-roznice-miedzy-grypa-przeziebieniem-a-covid-19-jak-rozpoznac-czy-to-grypa-czy-covid-zobacz-jak-leczyc-wirusa-grypy-i-koronawirusa.html",
          description: "Szczegółowe porównanie objawów",
        },
        {
          title: "Przeziębienie vs grypa vs COVID-19 - Doz.pl",
          url: "https://www.doz.pl/czytelnia/a15009-Przeziebienie_grypa_alergia_czy_COVID-19_Jak_je_od_siebie_odroznic",
          description: "Jak odróżnić różne infekcje",
        },
        {
          title: "Grypa typu B - objawy i powikłania - Doz.pl",
          url: "https://www.doz.pl/czytelnia/a18199-Grypa_typu_B__objawy_leczenie_mozliwe_powiklania",
          description: "Informacje o grypie typu B",
        },
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
        <AlertTitle>Wiarygodne źródła informacji</AlertTitle>
        Poniżej znajdziesz linki do wiarygodnych źródeł medycznych i edukacyjnych, które posłużyły do przygotowania tego materiału.
      </Alert>

      <Grid container spacing={3}>
        {resources.map((category, categoryIndex) => (
          <Grid size={{ xs: 12, md: 6 }} key={categoryIndex}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                boxShadow: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: `${category.color}.light`,
                      color: `${category.color}.main`,
                      borderRadius: 1,
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category.category}
                  </Typography>
                </Box>

                <List dense>
                  {category.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <LinkIcon sx={{ color: `${category.color}.main`, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: `${category.color}.main`,
                              textDecoration: "none",
                              fontWeight: 500,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {item.title}
                          </Link>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {item.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, p: 3, backgroundColor: "info.light", borderRadius: 2, opacity: 0.9 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "info.dark" }}>
          📋 Dodatkowe materiały edukacyjne
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Dla nauczycieli i edukatorów:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>Materiały do pobrania z PZH (Państwowy Zakład Higieny)</li>
          <li>Scenariusze lekcji o zdrowiu - NCEZ</li>
          <li>Materiały edukacyjne NFZ</li>
          <li>Poradniki dla rodziców - Pacjent.gov.pl</li>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
          <strong>Dla uczniów i rodziców:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>Interaktywne quizy o zdrowiu</li>
          <li>Kolorowanki edukacyjne dla młodszych dzieci</li>
          <li>Filmy instruktażowe o myciu rąk</li>
          <li>Aplikacje mobilne do śledzenia objawów</li>
        </Box>
      </Box>

      <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
        <AlertTitle>Ważne przypomnienie</AlertTitle>
        Materiał edukacyjny przygotowany na podstawie aktualnych wytycznych medycznych. W przypadku wątpliwości lub pogorszenia stanu
        zdrowia zawsze skonsultuj się z lekarzem.
      </Alert>
    </Box>
  );
};
