import { z } from "zod";

/**
 * Schema for the IZRZ form
 * Validates all required fields for generating the IZRZ document
 */
export const izrzFormSchema = z.object({
  templateFile: z.instanceof(File, { message: "Szablon jest wymagany" }),
  caseNumber: z.string().min(1, "Numer sprawy jest wymagany"),
  reportNumber: z.string().min(1, "Numer sprawozdania jest wymagany"),
  programName: z.string().min(1, "Nazwa programu jest wymagana"),
  taskType: z.string().min(1, "Typ zadania jest wymagany"),
  address: z.string().min(1, "Adres jest wymagany"),
  dateInput: z.string().min(1, "Data jest wymagana"),
  viewerCount: z.number().min(1, "Liczba widzów musi być większa niż 0"),
  viewerCountDescription: z.string().min(1, "Opis liczby widzów jest wymagany"),
  taskDescription: z.string().min(1, "Opis zadania jest wymagany"),
  additionalInfo: z.string().optional(),
  attendanceList: z.boolean().optional(),
  rozdzielnik: z.boolean().optional(),
});

export type IzrzFormData = z.infer<typeof izrzFormSchema>;

/**
 * Default form values for IZRZ form initialization
 */
export const defaultFormValues: Partial<IzrzFormData> = {
  caseNumber: "",
  reportNumber: "",
  programName: "",
  taskType: "",
  address: "",
  dateInput: "",
  viewerCount: 0,
  viewerCountDescription: "",
  taskDescription: "",
  additionalInfo: "",
  attendanceList: false,
  rozdzielnik: false,
};

/**
 * Pre-defined templates for viewer description
 * Provides common descriptions for educational activities
 */
export const viewerDescriptionTemplates = [
  { 
    key: "poz", 
    label: "POZ", 
    description: 'W ramach realizacji programu "Porozmawiajmy o zdrowiu i nowych zagrożeniach" przeprowadzono zajęcia edukacyjne z uczniami klasy VII. W trakcie zajęć wykorzystano filmy edukacyjne. Omówiono skutki zdrowotne wynikające z używania substancji psychoaktywnych, w tym nowych narkotyków, alkoholu, e-papierosów i napojów energetycznych. Zajęcia przeprowadzono z policją.' 
  },
  { 
    key: "bezpieczne-wakacje", 
    label: "Bezpieczne Wakacje", 
    description: 'W ramach akcji "Bezpieczne wakacje" przeprowadzono prelekcje edukacyjne z uczniami klas I-VIII. Podczas spotkań omówiono zasady bezpiecznego spędzania czasu wolnego, zachowania nad wodą, bezpieczeństwo w ruchu drogowym oraz zagrożenia związane z używaniem substancji psychoaktywnych w okresie wakacyjnym. Prelekcje zrealizowano we współpracy z funkcjonariuszem policji.' 
  },
  { 
    key: "higiena", 
    label: "Higiena naszą tarczą", 
    description: 'W ramach realizacji programu "Higiena naszą tarczą ochronną" przeprowadzono zajęcia edukacyjne z uczniami klas I. Podczas tych zajęć rozmawialiśmy o znaczeniu higieny dla naszego zdrowia. Omówiliśmy również, gdzie najczęściej znajdują się bakterie i jak mogą one wpływać na nasze zdrowie.' 
  },
  { 
    key: "zdrowe-zeby", 
    label: "Zdrowe zęby", 
    description: 'Przeprowadzono prelekcje dla uczniów przedszkolnych w wieku 5-6 lat, które miały na celu zwiększenie ich świadomości na temat prawidłowej higieny jamy ustnej oraz znaczenia zdrowego stylu życia.' 
  },
  { 
    key: "swiatowy-dzien-bez-tytoniu", 
    label: "Dzień bez Tytoniu", 
    description: 'W ramach obchodów Światowego Dnia Bez Tytoniu przeprowadzono zajęcia edukacyjne z uczniami klas V, VI, VII i VIII. W trakcie zajęć wykorzystano filmy edukacyjne dotyczące szkodliwości tytoniu i e-papierosów.' 
  },
];