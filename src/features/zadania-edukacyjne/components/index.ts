// Page components
export { FilterSection } from "./FilterSection";
export { TaskGroups } from "./TaskGroups";
export { TaskCard } from "./TaskCard";
export { EmptyState } from "./EmptyState";

// Form components
export { EducationalTaskForm } from "./EducationalTaskForm";
export { ActivityForm } from "./ActivityForm";
export { TaskNumberField } from "./TaskNumberField";
export { AudienceGroupsForm } from "./AudienceGroupsForm";
export { MaterialSelector } from "./MaterialSelector";

// Re-export types and reducer for external usage
export * from "../types";
export * from "../reducers/educationalTasksPageReducer";
