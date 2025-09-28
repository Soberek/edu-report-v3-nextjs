import { z } from "zod";

// Base form schema
export const izrzFormSchema = z.object({
  caseNumber: z.string().min(1, "Numer sprawy jest wymagany"),
  reportNumber: z.string().min(1, "Numer raportu jest wymagany"),
  programName: z.string().min(1, "Nazwa programu jest wymagana"),
  taskType: z.string().min(1, "Typ zadania jest wymagany"),
  address: z.string().min(1, "Adres jest wymagany"),
  dateInput: z.string().min(1, "Data jest wymagana"),
  viewerCount: z.number().min(0, "Liczba widzów nie może być ujemna"),
  viewerCountDescription: z.string().min(1, "Opis liczby widzów jest wymagany"),
  taskDescription: z.string().min(1, "Opis zadania jest wymagany").max(2000, "Opis nie może przekraczać 2000 znaków"),
  additionalInfo: z.string().optional(),
  attendanceList: z.boolean(),
  rozdzielnik: z.boolean(),
  templateFile: z.instanceof(File).nullable().optional(),
});

// Template types
export const templateSchema = z.enum(["izrz.docx", "lista_obecnosci.docx"]);

// Types
export type IzrzFormData = z.infer<typeof izrzFormSchema>;
export type TemplateType = z.infer<typeof templateSchema>;

// Default values
export const defaultFormValues: IzrzFormData = {
  caseNumber: "",
  reportNumber: "",
  programName: "",
  taskType: "",
  address: "",
  dateInput: "",
  viewerCount: 0,
  viewerCountDescription: `Grupa I: \n Szkoła Podstawowa (klasy 1-3): ... osób \n Opiekunowie: \n Szkola Podstawowa (klasy 4-8): ... osób \n Grupa II: \n Szkoła Ponadpodstawowa (klasy 1-3): ... osób \n Dorosli (studenci, nauczyciele, inni dorośli): ... osób \n`,
  taskDescription: "",
  additionalInfo: "",
  attendanceList: false,
  rozdzielnik: false,
  templateFile: null,
};
