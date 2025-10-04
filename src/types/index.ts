// Re-export user types
export * from "./user";

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

export interface EducationalInfoStandActivity {
  type: "educational_info_stand";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface ReportActivity {
  type: "report";
  title: string;
  description: string;
  // Sprawozdania nie mają audienceGroups - są dokumentami wewnętrznymi
}

export interface MonthlyReportActivity {
  type: "monthly_report";
  title: string;
  description: string;
  // Sprawozdania miesięczne nie mają audienceGroups - są dokumentami wewnętrznymi
}

export interface LectureActivity {
  type: "lecture";
  title: string;
  actionCount: number; // liczba przeprowadzonych wykładów
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface IntentLetterActivity {
  type: "intent_letter";
  title: string;
  description: string;
  // Listy intencyjne nie mają audienceGroups - są dokumentami formalnymi
}

export interface VisitationActivity {
  type: "visitation";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface GamesActivity {
  type: "games";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface InstructionActivity {
  type: "instruction";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface IndividualInstructionActivity {
  type: "individual_instruction";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface MeetingActivity {
  type: "meeting";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface TrainingActivity {
  type: "training";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface ConferenceActivity {
  type: "conference";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface CounselingActivity {
  type: "counseling";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface WorkshopActivity {
  type: "workshop";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface ContestActivity {
  type: "contest";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface OtherActivity {
  type: "other";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

export interface StreetHappeningActivity {
  type: "street_happening";
  title: string;
  description: string;
  audienceGroups: AudienceGroup[];
}

// Union type dla wszystkich aktywności
export type Activity =
  | PresentationActivity
  | DistributionActivity
  | MediaPublicationActivity
  | EducationalInfoStandActivity
  | ReportActivity
  | MonthlyReportActivity
  | LectureActivity
  | IntentLetterActivity
  | VisitationActivity
  | GamesActivity
  | InstructionActivity
  | IndividualInstructionActivity
  | MeetingActivity
  | TrainingActivity
  | ConferenceActivity
  | CounselingActivity
  | WorkshopActivity
  | ContestActivity
  | OtherActivity
  | StreetHappeningActivity;

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

export function isEducationalInfoStandActivity(activity: Activity): activity is EducationalInfoStandActivity {
  return activity.type === "educational_info_stand";
}

export function isReportActivity(activity: Activity): activity is ReportActivity {
  return activity.type === "report";
}

export function isMonthlyReportActivity(activity: Activity): activity is MonthlyReportActivity {
  return activity.type === "monthly_report";
}

export function isLectureActivity(activity: Activity): activity is LectureActivity {
  return activity.type === "lecture";
}

export function isIntentLetterActivity(activity: Activity): activity is IntentLetterActivity {
  return activity.type === "intent_letter";
}

export function isVisitationActivity(activity: Activity): activity is VisitationActivity {
  return activity.type === "visitation";
}

export function isGamesActivity(activity: Activity): activity is GamesActivity {
  return activity.type === "games";
}

export function isInstructionActivity(activity: Activity): activity is InstructionActivity {
  return activity.type === "instruction";
}

export function isIndividualInstructionActivity(activity: Activity): activity is IndividualInstructionActivity {
  return activity.type === "individual_instruction";
}

export function isMeetingActivity(activity: Activity): activity is MeetingActivity {
  return activity.type === "meeting";
}

export function isTrainingActivity(activity: Activity): activity is TrainingActivity {
  return activity.type === "training";
}

export function isConferenceActivity(activity: Activity): activity is ConferenceActivity {
  return activity.type === "conference";
}

export function isCounselingActivity(activity: Activity): activity is CounselingActivity {
  return activity.type === "counseling";
}

export function isWorkshopActivity(activity: Activity): activity is WorkshopActivity {
  return activity.type === "workshop";
}

export function isContestActivity(activity: Activity): activity is ContestActivity {
  return activity.type === "contest";
}

export function isOtherActivity(activity: Activity): activity is OtherActivity {
  return activity.type === "other";
}

export function isStreetHappeningActivity(activity: Activity): activity is StreetHappeningActivity {
  return activity.type === "street_happening";
}

// Helper functions to check if activity has audience groups
export function hasAudienceGroups(activity: Activity): activity is Activity & { audienceGroups: AudienceGroup[] } {
  return !["report", "monthly_report", "intent_letter", "media_publication"].includes(activity.type);
}

// Helper functions to check if activity has action count
export function hasActionCount(activity: Activity): activity is Activity & { actionCount: number } {
  return ["presentation", "lecture"].includes(activity.type);
}

// User Types
export interface User {
  email: string | null;
}
