/**
 * Components barrel export
 * Includes main dialog and re-exports section components
 */
export { GenerateDocumentDialog } from "./GenerateDocumentDialog";

// Section components
export type { SectionProps } from "../types/SectionProps";
export {
  IdentifiersSection,
  ProgramNameSection,
  TaskTypeSection,
  LocationSection,
  DateSection,
  ParticipantsSection,
  ScopeSection,
  NotesSection,
  AttachmentsSection,
} from "./sections";
