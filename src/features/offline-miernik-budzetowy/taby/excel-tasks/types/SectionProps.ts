import type { Control, FieldErrors } from "react-hook-form";
import type { GenerateDocumentFormData } from "../schemas";

/**
 * Form section props interface
 * Defines the contract for all presentational section components
 * Ensures consistency across form sections
 */
export interface SectionProps {
  readonly control: Control<GenerateDocumentFormData>;
  readonly errors: FieldErrors<GenerateDocumentFormData>;
  readonly isLoading: boolean;
}
