export interface MaterialItem {
  id: string;
  name: string;
  type: string;
  description?: string;
  category: "edukacyjny" | "promocyjny" | "informacyjny";
  defaultCount?: number;
}

// Materiały edukacyjne i promocyjne
export const EDUCATIONAL_MATERIALS: MaterialItem[] = [
  // Ulotki edukacyjne
  {
    id: "ulotka_zdrowie_psychiczne",
    name: "Ulotka - Zdrowie psychiczne młodzieży",
    type: "ulotka",
    description: "Materiały edukacyjne o zdrowiu psychicznym młodzieży",
    category: "edukacyjny",
    defaultCount: 100,
  },
  {
    id: "ulotka_zywienie",
    name: "Ulotka - Zasady zdrowego żywienia",
    type: "ulotka",
    description: "Promocja zdrowego odżywiania",
    category: "edukacyjny",
    defaultCount: 100,
  },
  {
    id: "ulotka_aktywnosc",
    name: "Ulotka - Aktywność fizyczna u dzieci",
    type: "ulotka",
    description: "Zachęta do regularnej aktywności fizycznej",
    category: "edukacyjny",
    defaultCount: 100,
  },
  {
    id: "ulotka_cukrzyca",
    name: "Ulotka - Profilaktyka cukrzycy typu 1",
    type: "ulotka",
    description: "Wczesne wykrywanie objawów cukrzycy",
    category: "edukacyjny",
    defaultCount: 100,
  },
  {
    id: "ulotka_seksualnosc",
    name: "Ulotka - Edukacja seksualna młodzieży",
    type: "ulotka",
    description: "Prawidłowa edukacja o rozwoju seksualnym",
    category: "edukacyjny",
    defaultCount: 50,
  },

  // Broszury edukacyjne
  {
    id: "broszura_rodzice",
    name: "Broszura - Przewodnik dla rodziców",
    type: "broszura",
    description: "Kompleksowy przewodnik zdrowotny dla rodziców",
    category: "edukacyjny",
    defaultCount: 50,
  },
  {
    id: "broszura_otp",
    name: "Broszura - Program OZiPZ",
    type: "broszura",
    description: "Informacje o Ośrodku Zdrowia i Profilaktyki Zdrowotnej",
    category: "informacyjny",
    defaultCount: 30,
  },
  {
    id: "broszura_covid",
    name: "Broszura - Bezpieczeństwo w szkole",
    type: "broszura",
    description: "Zasady bezpieczeństwa podczas pandemii",
    category: "edukacyjny",
    defaultCount: 30,
  },

  // Plakaty
  {
    id: "plakat_aktywniwosc",
    name: "Plakat - Bądź aktywny",
    type: "plakat",
    description: "Motywujący plakat do aktywności fizycznej",
    category: "promocyjny",
    defaultCount: 10,
  },
  {
    id: "plakat_zywienie",
    name: "Plakat - Piramida żywieniowa",
    type: "plakat",
    description: "Graficzny przewodnik zdrowego odżywiania",
    category: "edukacyjny",
    defaultCount: 15,
  },
  {
    id: "plakat_mycie_rack",
    name: "Plakat - Mycie rąk",
    type: "plakat",
    description: "Właściwa technika mycia rąk",
    category: "edukacyjny",
    defaultCount: 20,
  },

  // Książki i komiksy
  {
    id: "ksiazka_cukrzyca",
    name: "Książka - Cukrzyca u dzieci",
    type: "książka",
    description: "Podręcznik dla rodziców dzieci z cukrzycą",
    category: "edukacyjny",
    defaultCount: 5,
  },
  {
    id: "komiks_zdrowie",
    name: "Komiks - Przygody zdrowego życia",
    type: "komiks",
    description: "Interaktywny komiks edukacyjny dla dzieci",
    category: "edukacyjny",
    defaultCount: 25,
  },

  // Broszury specjalistyczne
  {
    id: "ulotka_wsparcie",
    name: "Ulotka - Gdzie szukać wsparcia",
    type: "ulotka",
    description: "Kontakty do specjalistów i ośrodków pomocy",
    category: "informacyjny",
    defaultCount: 75,
  },
  {
    id: "karta_kontakt",
    name: "Karta kontaktowa lekarza",
    type: "zakładka",
    description: "Materiały z danymi kontaktowymi specjalistów",
    category: "informacyjny",
    defaultCount: 200,
  },

  // Magnesy i naklejki
  {
    id: "magnes_kontakt",
    name: "Magnes na lodówkę - Kontakty",
    type: "magnes",
    description: "Magnes z ważnymi kontaktami medycznymi",
    category: "promocyjny",
    defaultCount: 100,
  },
  {
    id: "naklejka_mycie",
    name: "Naklejka łazienkowa - Myj ręce",
    type: "naklejka",
    description: "Przypominająca o higienie",
    category: "informacyjny",
    defaultCount: 300,
  },

  // Materiały specjalne
  {
    id: "szablon_ankiety",
    name: "Szablon ankiety zdrowotnej",
    type: "inne",
    description: "Ankieta do badań zdrowotnych uczniów",
    category: "informacyjny",
    defaultCount: 100,
  },
  {
    id: "kalendarz_zdrowia",
    name: "Kalendarz szczepień i badań",
    type: "inne",
    description: "Harmonogram profilaktycznych badań zdrowotnych",
    category: "edukacyjny",
    defaultCount: 50,
  },
] as const;

// Kategorie materiałów z polskimi nazwami
export const MATERIAL_CATEGORIES = {
  EDUKACYJNY: "edukacyjny",
  PROMOCYJNY: "promocyjny",
  INFORMACYJNY: "informacyjny",
} as const;

export const MATERIAL_CATEGORY_LABELS = {
  [MATERIAL_CATEGORIES.EDUKACYJNY]: "Materiały edukacyjne",
  [MATERIAL_CATEGORIES.PROMOCYJNY]: "Materiały promocyjne",
  [MATERIAL_CATEGORIES.INFORMACYJNY]: "Materiały informacyjne",
} as const;

// Pomocnicze funkcje
export const getMaterialsByType = (type: string) => EDUCATIONAL_MATERIALS.filter((material) => material.type === type);

export const getMaterialsByCategory = (category: string) => EDUCATIONAL_MATERIALS.filter((material) => material.category === category);

export const getMaterialById = (id: string) => EDUCATIONAL_MATERIALS.find((material) => material.id === id);
