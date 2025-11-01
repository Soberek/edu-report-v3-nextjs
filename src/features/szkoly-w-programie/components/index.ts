// Main components (now using shared components)
export { SchoolProgramParticipationTable } from "./table";
export { default as ParticipationView } from "./ParticipationView";
export { default as NonParticipationView } from "./NonParticipationView";
export { ParticipationForm } from "./ParticipationForm";
export { EditParticipationForm } from "./EditParticipationForm";
export { ParticipationFormFields } from "./ParticipationFormFields";
export { ProgramStatistics } from "./ProgramStatistics";
export { EditParticipationDialog, AddParticipationDialog } from "./TableDialogs";

// Form layout components
export { FormSection } from "./FormSection";
export type { FormSectionProps } from "./FormSection";
export { FormSubmitButton } from "./FormSubmitButton";
export type { FormSubmitButtonProps } from "./FormSubmitButton";

// Table configuration
export { createColumns, CUSTOM_STYLES, TABLE_COLUMNS, type TableColumnConfig } from "./TableConfig";

// Re-export shared components for easy access
export {
  AutocompleteField,
  FormField,
  PageHeader,
  LoadingSpinner,
  EmptyState,
  ActionButton,
  AvatarWithText,
  Tag,
  InfoBadge,
  NotesCell,
  DateCell,
  getInitials,
  getRandomColor,
  DataTable,
  defaultActions,
} from "@/components/shared";
