export const navRoutes: Array<{
  title: string;
  path: string;
  category: "main" | "database";
}> = [
  // Main routes
  {
    title: "Szkoły w programie",
    path: "/",
    category: "main",
  },
  {
    title: "Harmonogram zadań edukacyjnych",
    path: "schedule",
    category: "main",
  },
  {
    title: "Offline miernik budżetowy",
    path: "offline-miernik-budzetowy",
    category: "main",
  },
  {
    title: "Spisy spraw",
    path: "acts",
    category: "database",
  },

  // Database routes
  {
    title: "Szkoły",
    path: "schools",
    category: "database",
  },
  {
    title: "Programy edukacyjne",
    path: "programy-edukacyjne",
    category: "database",
  },
  {
    title: "Baza kontaktów",
    path: "contacts",
    category: "database",
  },

  // {
  //   title: "Canva",
  //   path: "canva",
  //   category: 'main',
  // },
];
