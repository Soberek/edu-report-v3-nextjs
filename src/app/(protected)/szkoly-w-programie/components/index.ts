// Main components (now using shared components)
export { SchoolProgramParticipationTable } from "./table";
export { ParticipationForm } from "./ParticipationForm";

// Table configuration
export { createColumns, CUSTOM_STYLES, TABLE_COLUMNS, type TableColumnConfig } from "./TableConfig";

// Specific components
export { default as EditDialog } from "./edit-dialog";

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
