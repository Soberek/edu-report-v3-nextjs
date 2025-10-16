import type { School, SchoolTypes } from "@/types";
import { VALIDATION_MESSAGES } from "@/constants";
import { z } from "zod";

/** Form data for creating a new school */
export type CreateSchoolFormData = Omit<School, "id" | "createdAt" | "updatedAt">;

/** Form data for editing an existing school */
export type EditSchoolFormData = Partial<CreateSchoolFormData>;

/** Form data for filtering schools */
export interface SchoolFilterFormData {
  search: string;
  type: SchoolTypes[];
  city: string;
}

/** Zod schema for creating a school with validated fields */
export const createSchoolSchema = z.object({
  name: z.string().trim().min(1, VALIDATION_MESSAGES.school.name).max(255),
  email: z.string().trim().toLowerCase().email(VALIDATION_MESSAGES.school.email),
  address: z.string().trim().min(1, VALIDATION_MESSAGES.school.address).max(255),
  city: z.string().trim().min(1, VALIDATION_MESSAGES.school.city).max(100),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{3}$/, VALIDATION_MESSAGES.school.postalCode),
  municipality: z.string().trim().min(1, VALIDATION_MESSAGES.school.municipality).max(100),
  type: z.array(z.custom<SchoolTypes>()).min(1, VALIDATION_MESSAGES.school.type),
});

/** Zod schema for editing a school with optional fields */
export const editSchoolSchema = createSchoolSchema.partial();

/** Default values for school creation form */
export const defaultSchoolFormValues: CreateSchoolFormData = {
  name: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  municipality: "",
  type: [],
};

/** Default values for school filter form */
export const defaultFilterValues: SchoolFilterFormData = {
  search: "",
  type: [],
  city: "",
};

