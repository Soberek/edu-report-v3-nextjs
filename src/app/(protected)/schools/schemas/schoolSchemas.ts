import { z } from "zod";
import type { SchoolTypes } from "@/types";

// School types enum for validation
const schoolTypesEnum = z.enum([
  "Żłobek",
  "Przedszkole", 
  "Oddział przedszkolny",
  "Szkoła podstawowa",
  "Technikum",
  "Liceum",
  "Szkoła branżowa",
  "Szkoła policealna",
  "Szkoła specjalna",
  "Młodzieżowy ośrodek socjoterapii",
  "Specjalny ośrodek szkolno-wychowawczy"
]);

// Base school schema
export const schoolBaseSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana").max(100, "Nazwa nie może przekraczać 100 znaków"),
  email: z.string().email("Nieprawidłowy adres email").min(1, "Email jest wymagany"),
  address: z.string().min(1, "Adres jest wymagany").max(200, "Adres nie może przekraczać 200 znaków"),
  city: z.string().min(1, "Miasto jest wymagane").max(50, "Miasto nie może przekraczać 50 znaków"),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany").regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX"),
  municipality: z.string().min(1, "Gmina jest wymagana").max(50, "Gmina nie może przekraczać 50 znaków"),
  type: z.array(schoolTypesEnum).min(1, "Wybierz co najmniej jeden typ szkoły"),
});

// Create school schema
export const createSchoolSchema = schoolBaseSchema;

// Edit school schema
export const editSchoolSchema = schoolBaseSchema;

// Filter schema
export const schoolFilterSchema = z.object({
  search: z.string(),
  type: z.string(),
  city: z.string(),
});

// Types
export type CreateSchoolFormData = z.infer<typeof createSchoolSchema>;
export type EditSchoolFormData = z.infer<typeof editSchoolSchema>;
export type SchoolFilterFormData = z.infer<typeof schoolFilterSchema>;

// Default values
export const defaultSchoolFormValues: CreateSchoolFormData = {
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
  type: "",
  city: "",
};
