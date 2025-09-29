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

// Podstawowe typy
export type AudienceType = "dorośli" | "młodzież" | "dzieci" | "seniorzy";

export interface AudienceGroup {
  id: string;
  name: string; // np. "Grupa I"
  type: AudienceType;
  count: number;
}

export interface Media {
  title: string;
  link: string;
  platform: string;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  distributedCount: number;
  description?: string;
}

// Typy aktywności - każdy z własnymi wymaganymi polami
export interface PresentationActivity {
  type: "presentation";
  title: string;
  actionCount: number; // liczba przeprowadzonych prelekcji
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface DistributionActivity {
  type: "distribution";
  title: string;
  description: string;
  materials: Material[]; // WYMAGANE dla dystrybucji
  audienceGroups: AudienceGroup[];
}

export interface MediaPublicationActivity {
  type: "media_publication";
  title: string;
  description: string;
  media: Media; // WYMAGANE dla publikacji
  // Media nie mają audienceGroups - zasięg jest określony przez platformę
  estimatedReach?: number; // opcjonalny szacowany zasięg
}

// Union type dla wszystkich aktywności
export type Activity = PresentationActivity | DistributionActivity | MediaPublicationActivity;

// Główna struktura zadania
export interface EducationalTask {
  id: string;
  title: string;
  programName: string;
  date: string;
  schoolId: string;
  taskNumber: string; // np. 45/2025
  referenceNumber: string; // np. OZiPZ.966.5.2.2025
  referenceId?: string;
  activities: Activity[]; // Może zawierać mix różnych typów
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// Formularze
export interface CreateEducationalTaskFormData {
  title: string;
  programName: string;
  date: string;
  schoolId: string;
  taskNumber: string;
  referenceNumber: string;
  referenceId?: string;
  activities: Activity[];
}

export interface EditEducationalTaskFormData extends CreateEducationalTaskFormData {
  id: string;
}

// Type guards dla łatwiejszej pracy z union types
export function isPresentationActivity(activity: Activity): activity is PresentationActivity {
  return activity.type === "presentation";
}

export function isDistributionActivity(activity: Activity): activity is DistributionActivity {
  return activity.type === "distribution";
}

export function isMediaPublicationActivity(activity: Activity): activity is MediaPublicationActivity {
  return activity.type === "media_publication";
}

// User Types
export interface User {
  email: string | null;
}
