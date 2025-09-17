import type { SchoolYear, SchoolTypes } from "../types";

export const schoolYears: SchoolYear[] = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
  "2027/2028",
] as const;

export const schoolTypes: Record<string, SchoolTypes> = {
  ZLOBEK: "Żłobek",
  PRZEDSZKOLE: "Przedszkole",
  ODDZIAL_PRZEDSZKOLNY: "Oddział przedszkolny",
  SZKOLA_PODSTAWOWA: "Szkoła podstawowa",
  TECHNIKUM: "Technikum",
  LICEUM: "Liceum",
  SZKOLA_BRANZOWA: "Szkoła branżowa",
  SZKOLA_POLICEALNA: "Szkoła policealna",
  SZKOLA_SPECJALNA: "Szkoła specjalna",
  MLODZIEZOWY_OSRODEK_SOCJOTERAPII: "Młodzieżowy ośrodek socjoterapii",
  SPECJALNY_OSRODEK_SZKOLNO_WYCHOWAWCZY:
    "Specjalny ośrodek szkolno-wychowawczy",
} as const;

// dostępne klasy
export const classes = {
  PODSTAWOWA: [
    "Klasa podstawowa 1",
    "Klasa podstawowa 2",
    "Klasa podstawowa 3",
    "Klasa podstawowa 4",
    "Klasa podstawowa 5",
    "Klasa podstawowa 6",
    "Klasa podstawowa 7",
    "Klasa podstawowa 8",
  ],
  LICEUM: [
    "Klasa liceum 1",
    "Klasa liceum 2",
    "Klasa liceum 3",
    "Klasa liceum 4",
  ],
  TECHNIKUM: [
    "Klasa technikum 1",
    "Klasa technikum 2",
    "Klasa technikum 3",
    "Klasa technikum 4",
  ],
  BRANZOWA: ["Klasa branżowa 1", "Klasa branżowa 2", "Klasa branżowa 3"],
} as const;
