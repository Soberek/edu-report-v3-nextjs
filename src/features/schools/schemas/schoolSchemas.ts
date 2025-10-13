import type { School, SchoolTypes } from "@/types";
import { z } from "zod";

// Form data types
export type CreateSchoolFormData = Omit<School, "id" | "createdAt" | "updatedAt">;

export type EditSchoolFormData = Partial<CreateSchoolFormData>;

export interface SchoolFilterFormData {
  search: string;
  type: SchoolTypes[];
  city: string;
}

// Validation schemas
export const createSchoolSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  email: z.string().email("Nieprawidłowy adres email"),
  address: z.string().min(1, "Adres jest wymagany"),
  city: z.string().min(1, "Miasto jest wymagane"),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
  municipality: z.string().min(1, "Gmina jest wymagana"),
  type: z.array(z.custom<SchoolTypes>()).min(1, "Wybierz przynajmniej jeden typ"),
}) satisfies z.ZodType<CreateSchoolFormData>;

export const editSchoolSchema = createSchoolSchema.partial();

// Default values
export const defaultSchoolFormValues: Partial<CreateSchoolFormData> = {
  name: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  municipality: "",
  type: [],
};

export const defaultFilterValues: SchoolFilterFormData = {
  search: "",
  type: [],
  city: "",
};

