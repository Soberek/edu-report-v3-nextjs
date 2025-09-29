export type ArchiveCategories = "A" | "B5" | "B10" | "BE" | "BE5" | "BE10";

export interface Akt {
  code: string; // np. "966.1"
  name: string; // pełna nazwa aktu
  description?: string; // opcjonalny opis
  archiveCategory: ArchiveCategories; // kategoria archiwalna
  subCategories?: Record<string, Akt>;
}

export interface CaseRecord {
  id: string;
  code: Akt["code"];
  referenceNumber: string;
  date: string;
  title: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  sender: string;
  comments: string; // oznaczenie prowadzącego sprawę oraz ewentualne informacje dotyczące sposobu załatwienia sprawy
  notes: string;
  userId: string; // ID użytkownika, który dodał rekord
}

export interface Program {
  id: string;
  code: Akt["code"];
  name: string;
  programType: "programowy" | "nieprogramowy";
  description: string;
}

export type SchoolTypes =
  | "Żłobek"
  | "Przedszkole"
  | "Oddział przedszkolny"
  | "Szkoła podstawowa"
  | "Technikum"
  | "Liceum"
  | "Szkoła branżowa"
  | "Szkoła policealna"
  | "Szkoła specjalna"
  | "Młodzieżowy ośrodek socjoterapii"
  | "Specjalny ośrodek szkolno-wychowawczy";

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  municipality: string;
  email: string;
  type: SchoolTypes[];
  // classes: string[]; // Uncomment if classes are needed
  createdAt: string;
  updatedAt?: string;
}

export type SchoolYear = "2024/2025" | "2025/2026" | "2026/2027" | "2027/2028";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string; // ID użytkownika, który dodał kontakt
}

// export interface MediaPlatform {
//   mediaPlatformId: number;
//   name: string;
// }

// export interface ActionType {
//   actionTypeId: number;
//   name: string;
// }

// export interface Material {
//   materialId: number;
//   name: string;
//   type: "ulotka" | "plakat" | "broszura" | "zakładka" | "inne";
//   description: string;
// }

// Educational Task Types
export interface Media {
  title: string;
  link: string;
  platform: string;
}

export interface Material {
  id: string; // ID z EDUCATIONAL_MATERIALS lub wybrane przez użytkownika
  name: string;
  type: string; // Will be one of MATERIAL_TYPES labels
  distributedCount: number; // Ilość rozdanych egzemplarzy
  description?: string; // Opcjonalny opis dodany przez użytkownika
}

export interface Activity {
  type: string; // Will be one of TASK_TYPES labels
  title: string;
  actionCount: number; // Ilość działań (domyślnie 1)
  audienceCount: number; // Ilość odbiorców (DEPRECATED - use audienceGroups)
  description: string;
  audienceGroups: AudienceGroup[]; // Grupy odbiorców dla tej aktywności
  media?: Media;
  materials?: Material[]; // Materiały dla dystrybucji
}

export type AudienceType = "dorośli" | "młodzież" | "dzieci" | "seniorzy";

export interface AudienceGroup {
  id: string;
  name: string; // np. "Grupa I"
  type: AudienceType; // typ odbiorcy
  count: number; // liczba osób
}

export interface EducationalTask {
  id: string;
  title: string;
  programName: string;
  date: string;
  schoolId: string; // ID szkoły z Firebase
  taskNumber: string; // Numer zadania (np. 45/2025)
  referenceNumber: string; // Numer referencyjny dokumentu (np. OZiPZ.966.5.2.2025)
  referenceId?: string; // odwołanie do sprawy, która jest powiązana
  activities: Activity[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEducationalTaskFormData {
  title: string;
  programName: string;
  date: string;
  schoolId: string;
  taskNumber: string; // Numer zadania (np. 45/2025)
  referenceNumber: string; // Numer referencyjny dokumentu (np. OZiPZ.966.5.2.2025)
  referenceId?: string;
  activities: Activity[];
}

export interface EditEducationalTaskFormData extends CreateEducationalTaskFormData {
  id: string;
}

// User Types
export interface User {
  email: string | null;
}
