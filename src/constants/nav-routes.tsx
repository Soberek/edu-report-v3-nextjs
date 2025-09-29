import {
  FaHome,
  FaFileAlt,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaListAlt,
  FaSchool,
  FaBook,
  FaAddressBook,
  FaGift,
  FaPenFancy,
  FaSignInAlt,
  FaUserPlus,
  FaTasks,
  FaCheckSquare,
  FaUserMd,
} from "react-icons/fa";

export interface NavRoute {
  title: string;
  path: string;
  category: "main" | "database" | "tools" | "auth" | "education";
  isPrivate: boolean;
  icon?: React.JSX.Element;
  description?: string;
}

export const navRoutes: NavRoute[] = [
  // Main Dashboard
  {
    title: "Strona Główna",
    path: "/",
    category: "main",
    isPrivate: true,
    icon: <FaHome />,
    description: "Panel główny aplikacji",
  },

  // Education & Programs
  {
    title: "Programy edukacyjne",
    path: "programy-edukacyjne",
    category: "education",
    isPrivate: true,
    icon: <FaBook />,
    description: "Zarządzaj programami edukacyjnymi",
  },
  {
    title: "Zadania edukacyjne",
    path: "zadania-edukacyjne",
    category: "education",
    isPrivate: true,
    icon: <FaTasks />,
    description: "Zarządzaj zadaniami i aktywnościami",
  },
  {
    title: "Harmonogram zadań edukacyjnych",
    path: "schedule",
    category: "education",
    isPrivate: true,
    icon: <FaCalendarAlt />,
    description: "Planowanie i harmonogram zadań",
  },
  {
    title: "Czerniak",
    path: "czerniak",
    category: "education",
    isPrivate: true,
    icon: <FaUserMd />,
    description: "Moduł edukacyjny o czerniaku",
  },

  // Database Management
  {
    title: "Szkoły",
    path: "schools",
    category: "database",
    isPrivate: true,
    icon: <FaSchool />,
    description: "Baza danych szkół",
  },
  {
    title: "Szkoły w programie",
    path: "szkoly-w-programie",
    category: "database",
    isPrivate: true,
    icon: <FaSchool />,
    description: "Szkoły uczestniczące w programach",
  },
  {
    title: "Baza kontaktów",
    path: "contacts",
    category: "database",
    isPrivate: true,
    icon: <FaAddressBook />,
    description: "Zarządzaj kontaktami",
  },
  {
    title: "Spisy spraw",
    path: "spisy-spraw",
    category: "database",
    isPrivate: true,
    icon: <FaListAlt />,
    description: "Archiwum spraw i dokumentów",
  },

  // Tools & Utilities
  {
    title: "Generuj Informacje z realizacji zadania",
    path: "wygeneruj-izrz",
    category: "tools",
    isPrivate: true,
    icon: <FaFileAlt />,
    description: "Generator raportów IZRZ",
  },
  {
    title: "Offline miernik budżetowy",
    path: "offline-miernik-budzetowy",
    category: "tools",
    isPrivate: true,
    icon: <FaMoneyBillAlt />,
    description: "Analiza budżetu offline",
  },
  {
    title: "Nietypowe święta",
    path: "holidays",
    category: "tools",
    isPrivate: true,
    icon: <FaGift />,
    description: "Generator treści na święta",
  },
  {
    title: "Generator postów",
    path: "generator-postow",
    category: "tools",
    isPrivate: true,
    icon: <FaPenFancy />,
    description: "Tworzenie postów i treści",
  },
  {
    title: "TODO",
    path: "todo",
    category: "tools",
    isPrivate: true,
    icon: <FaCheckSquare />,
    description: "Lista zadań do wykonania",
  },

  // Authentication
  {
    title: "Zaloguj się",
    path: "login",
    category: "auth",
    isPrivate: false,
    icon: <FaSignInAlt />,
    description: "Logowanie do systemu",
  },
  {
    title: "Zarejestruj się",
    path: "register",
    category: "auth",
    isPrivate: false,
    icon: <FaUserPlus />,
    description: "Rejestracja nowego użytkownika",
  },
];

// Helper functions for filtering routes
export const getRoutesByCategory = (category: NavRoute["category"]): NavRoute[] => {
  return navRoutes.filter((route) => route.category === category);
};

export const getPrivateRoutes = (): NavRoute[] => {
  return navRoutes.filter((route) => route.isPrivate);
};

export const getPublicRoutes = (): NavRoute[] => {
  return navRoutes.filter((route) => !route.isPrivate);
};

export const getMainNavigation = (): NavRoute[] => {
  return navRoutes.filter((route) => route.isPrivate && ["main", "education", "database", "tools"].includes(route.category));
};
