import type { School } from "@/types";
import type { IzrzFormData } from "../schemas/izrzSchemas";

// State types
export interface IzrzState {
  formData: IzrzFormData;
  schools: School[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitMessage: string | null;
}

// Action types
export type IzrzAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SCHOOLS"; payload: School[] }
  | { type: "SET_FORM_DATA"; payload: IzrzFormData }
  | { type: "RESET_FORM" }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUBMIT_MESSAGE"; payload: string | null };

// Component props types
export interface IzrzFormProps {
  onSubmit: (data: IzrzFormData) => void;
  loading?: boolean;
  error?: string | null;
}

export interface TemplateSelectorProps {
  onTemplateSelect: (file: File) => void;
  selectedTemplate?: File | null;
}

