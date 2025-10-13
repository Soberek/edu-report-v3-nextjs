import type { School } from "@/types";
import type { IzrzFormData } from "../schemas/izrzSchemas";

// Message types
export interface SubmitMessage {
  readonly type: "success" | "error";
  readonly text: string;
}

// Template types
export interface TemplateOption {
  readonly name: string;
  readonly label: string;
  readonly description?: string;
}

export interface SelectedTemplate {
  readonly file: File;
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

// State types
export interface IzrzState {
  readonly formData: IzrzFormData;
  readonly schools: readonly School[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly submitMessage: SubmitMessage | null;
}

// Action types
export type IzrzAction =
  | { readonly type: "SET_LOADING"; readonly payload: boolean }
  | { readonly type: "SET_ERROR"; readonly payload: string | null }
  | { readonly type: "SET_SCHOOLS"; readonly payload: readonly School[] }
  | { readonly type: "SET_FORM_DATA"; readonly payload: Partial<IzrzFormData> }
  | { readonly type: "RESET_FORM" }
  | { readonly type: "SET_SUBMITTING"; readonly payload: boolean }
  | { readonly type: "SET_SUBMIT_MESSAGE"; readonly payload: SubmitMessage | null };

// Hook types
export interface UseIzrzFormProps {
  readonly onSubmit: (data: IzrzFormData) => Promise<void>;
  readonly defaultValues?: Partial<IzrzFormData>;
}

export interface UseTemplateManagerProps {
  readonly onTemplateSelect: (file: File) => void;
}

export interface UseFormSubmissionProps {
  readonly onSuccess?: (filename: string) => void;
  readonly onError?: (error: Error) => void;
}

// Component props types
export interface IzrzFormProps {
  readonly onSubmit: (data: IzrzFormData) => Promise<void>;
  readonly loading?: boolean;
  readonly error?: string | null;
}

export interface TemplateSelectorProps {
  readonly onTemplateSelect: (file: File) => void;
  readonly selectedTemplate?: SelectedTemplate | null;
  readonly loading?: boolean;
  readonly error?: string | null;
}

export interface FormFieldProps {
  readonly name: keyof IzrzFormData;
  readonly control: unknown; // Will be properly typed in component
  readonly error?: unknown; // Will be properly typed in component
  readonly required?: boolean;
  readonly disabled?: boolean;
}

// Utility types
export type FormFieldType = "text" | "number" | "date" | "textarea" | "select" | "checkbox";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}
