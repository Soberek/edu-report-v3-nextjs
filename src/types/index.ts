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

export type SchoolProgramParticipation = {
  id: string;
  schoolId: string;
  programId: string;
  coordinatorId: string;
  // Rozwiązanie tymczasowe
  previousCoordinatorId?: string; // ID koordynatora z poprzedniego roku
  previousParticipationYear?: "2024/2025"; // czy szkoła brała udział w roku szkolnym 2024/2025
  //
  schoolYear: SchoolYear;
  studentCount: number;
  createdAt: string;
  notes?: string;
  userId: string;
};

export type SchoolProgramParticipationDTO = Omit<SchoolProgramParticipation, "id" | "createdAt" | "updatedAt" | "userId">;

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
