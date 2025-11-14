/**
 * Excel Tasks Feature - Barrel Export
 * IZRZ Document generation from Excel data
 */

// Main components
export { ExcelTasksTable } from "./ExcelTasksTable";
export { GenerateDocumentDialog } from "./components";

// Hooks
export { useGenerateDocument, useGenerateDocumentForm } from "./hooks";

// Schemas and types
export { generateDocumentFormSchema, type GenerateDocumentFormData } from "./schemas";
export type { SectionProps, GenerateDocumentDialogProps } from "./types";
