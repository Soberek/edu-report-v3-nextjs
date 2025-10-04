import type { ReactNode } from "react";
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
  FaVirus,
  FaChartLine,
  FaHeartbeat,
  FaClipboardList,
  FaFileExport,
  FaCog,
  FaUsers,
  FaChartBar,
  FaQuestionCircle,
} from "react-icons/fa";

export type NavCategory = "main" | "education" | "database" | "tools" | "auth" | "admin";

export interface NavRoute {
  title: string;
  path: string;
  category: NavCategory;
  isPrivate: boolean;
  icon: ReactNode;
  description: string;
  isAdminOnly?: boolean;
}

export const navRoutes: NavRoute[] = [
  // Admin-only routes
  {
    title: "Panel administratora",
    path: "/admin",
    category: "admin",
    isPrivate: true,
    isAdminOnly: true,
    icon: <FaCog />,
    description: "Panel zarządzania dla administratorów",
  },
  {
    title: "Zarządzaj użytkownikami",
    path: "/admin/users",
    category: "admin",
    isPrivate: true,
    isAdminOnly: true,
    icon: <FaUsers />,
    description: "Lista i zarządzanie użytkownikami",
  },
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
    title: "Czerniak",
    path: "czerniak",
    category: "education",
    isPrivate: true,
    icon: <FaUserMd />,
    description: "Moduł edukacyjny o czerniaku",
  },
  {
    title: "Grypa i przeziębienia",
    path: "grypa-i-przeziebienia",
    category: "education",
    isPrivate: true,
    icon: <FaVirus />,
    description: "Edukacja na temat grypy i przeziębień",
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
  {
    title: "Programy edukacyjne",
    path: "programy-edukacyjne",
    category: "database",
    isPrivate: true,
    icon: <FaBook />,
    description: "Zarządzaj programami edukacyjnymi",
  },

  // Tools & Utilities
  {
    title: "Harmonogram zadań edukacyjnych",
    path: "schedule",
    category: "tools",
    isPrivate: true,
    icon: <FaCalendarAlt />,
    description: "Planowanie i harmonogram zadań",
  },
  {
    title: "Zadania edukacyjne",
    path: "zadania-edukacyjne",
    category: "tools",
    isPrivate: true,
    icon: <FaTasks />,
    description: "Zarządzaj zadaniami i aktywnościami",
  },
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
    title: "Sprawozdanie z tytoniu",
    path: "sprawozdanie-z-tytoniu",
    category: "tools",
    isPrivate: true,
    icon: <FaHeartbeat />,
    description: "Agregacja danych kontroli ochrony zdrowia",
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
  {
    title: "Wyloguj się",
    path: "logout",
    category: "auth",
    isPrivate: true,
    icon: <FaSignInAlt />,
    description: "Wylogowanie z systemu",
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

export const getMainNavigation = (isAdmin = false): NavRoute[] => {
  return navRoutes.filter((route) => {
    if (!route.isPrivate) return false;
    if (route.isAdminOnly && !isAdmin) return false;
    return ["tools", "main", "education", "database", "admin"].includes(route.category);
  });
};
