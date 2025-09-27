import { EducationalPost } from "../types";

/**
 * Initial posts data
 */
export const initialPosts: EducationalPost[] = [
  {
    id: 1,
    title: "Światowy Dzień bez Tytoniu",
    description: "Edukacja na temat szkodliwości palenia tytoniu",
    content:
      "31 maja obchodzimy Światowy Dzień bez Tytoniu. To doskonała okazja, aby przypomnieć o szkodliwych skutkach palenia i zachęcić do zdrowego stylu życia.",
    query: "no tobacco day, no smoking, smoke free, health",
    tag: "no tobacco day",
    imageUrl: "",
    template: "modern",
    textOverlay: {
      enabled: true,
      text: "Światowy Dzień bez Tytoniu",
      position: "top",
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
    },
    styling: {
      backgroundColor: "#f8f9fa",
      borderRadius: 12,
      padding: 16,
    },
    platform: "instagram",
    createdAt: new Date(),
    isFavorite: false,
  },
  {
    id: 2,
    title: "Dzień Ziemi",
    description: "Świadomość ekologiczna i ochrona środowiska",
    content:
      "22 kwietnia to Dzień Ziemi - czas, w którym szczególnie myślimy o naszej planecie i tym, jak możemy ją chronić. Każdy z nas może przyczynić się do lepszej przyszłości.",
    query: "earth day, nature, environment, sustainability",
    tag: "earth day",
    imageUrl: "",
    template: "vibrant",
    textOverlay: {
      enabled: true,
      text: "Dzień Ziemi",
      position: "center",
      color: "#2e7d32",
      fontSize: 28,
      fontWeight: "bold",
    },
    styling: {
      backgroundColor: "#e8f5e8",
      borderRadius: 16,
      padding: 20,
    },
    platform: "facebook",
    createdAt: new Date(),
    isFavorite: false,
  },
];
