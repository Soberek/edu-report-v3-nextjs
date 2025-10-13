import type { School, SchoolTypes } from "@/types";
import type { CreateSchoolFormData, EditSchoolFormData, SchoolFilterFormData } from "../schemas/schoolSchemas";

// Re-export schema types
export type { CreateSchoolFormData, EditSchoolFormData, SchoolFilterFormData };

// State types
export interface SchoolState {
  loading: boolean;
  error: string | null;
  schools: School[];
  filter: SchoolFilterFormData;
  openForm: boolean;
  editSchool: School | null;
  isSubmitting: boolean;
}

// Action types
export type SchoolAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SCHOOLS"; payload: School[] }
  | { type: "SET_FILTER"; payload: Partial<SchoolFilterFormData> }
  | { type: "TOGGLE_FORM"; payload: boolean }
  | { type: "SET_EDIT_SCHOOL"; payload: School | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "ADD_SCHOOL"; payload: School }
  | { type: "UPDATE_SCHOOL"; payload: { id: string; updates: Partial<School> } }
  | { type: "DELETE_SCHOOL"; payload: string };

// Component props types
export interface SchoolFormProps {
  mode: "create" | "edit";
  school?: School | null;
  onClose?: () => void;
  onSave?: (data: CreateSchoolFormData | EditSchoolFormData) => void;
  loading?: boolean;
}

export interface SchoolTableProps {
  schools: School[];
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export interface SchoolFilterProps {
  filter: SchoolFilterFormData;
  onFilterChange: (filter: Partial<SchoolFilterFormData>) => void;
  uniqueTypes: SchoolTypes[];
  uniqueCities: string[];
}

export interface UseSchoolFormProps {
  mode: "create" | "edit";
  school?: School | null;
  onSubmit: (data: CreateSchoolFormData | EditSchoolFormData) => void;
}
