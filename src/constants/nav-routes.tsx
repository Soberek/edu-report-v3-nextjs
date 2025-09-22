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
} from "react-icons/fa";

export const navRoutes: Array<{
  title: string;
  path: string;
  category: "main" | "database";
  isPrivate: boolean;
  icon?: React.JSX.Element;
}> = [
  {
    title: "Strona Główna",
    path: "/",
    category: "main",
    isPrivate: true,
    icon: <FaHome />,
  },
  {
    title: "Generuj Informacje z realizacji zadania",
    path: "wygeneruj-izrz",
    category: "main",
    isPrivate: true,
    icon: <FaFileAlt />,
  },
  {
    title: "Harmonogram zadań edukacyjnych",
    path: "schedule",
    category: "main",
    isPrivate: true,
    icon: <FaCalendarAlt />,
  },
  {
    title: "Offline miernik budżetowy",
    path: "offline-miernik-budzetowy",
    category: "main",
    isPrivate: true,
    icon: <FaMoneyBillAlt />,
  },
  {
    title: "Spisy spraw",
    path: "spisy-spraw",
    category: "database",
    isPrivate: true,
    icon: <FaListAlt />,
  },
  {
    title: "Szkoły",
    path: "schools",
    category: "database",
    isPrivate: true,
    icon: <FaSchool />,
  },
  {
    title: "Programy edukacyjne",
    path: "programy-edukacyjne",
    category: "database",
    isPrivate: true,
    icon: <FaBook />,
  },
  {
    title: "Baza kontaktów",
    path: "contacts",
    category: "database",
    isPrivate: true,
    icon: <FaAddressBook />,
  },
  {
    title: "Nietypowe święta",
    path: "holidays",
    category: "main",
    isPrivate: true,
    icon: <FaGift />,
  },
  {
    title: "Generator postów",
    path: "generator-postow",
    category: "main",
    isPrivate: true,
    icon: <FaPenFancy />,
  },
  {
    title: "Zaloguj się",
    path: "login",
    category: "main",
    isPrivate: false,
    icon: <FaSignInAlt />,
  },
  {
    title: "Zarejestruj się",
    path: "register",
    category: "main",
    isPrivate: false,
    icon: <FaUserPlus />,
  },
];
