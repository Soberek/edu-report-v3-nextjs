import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateDocumentFormSchema, type GenerateDocumentFormData } from "../schemas";
import { parseDateToIso, formatDateDisplay } from "../utils/dateUtils";
import { parseViewerCount } from "../utils/numberUtils";
import type { ExcelRow } from "../../../types";

/**
 * Hook to manage IZRZ document generation form state and logic
 * Encapsulates react-hook-form setup, validation, and data transformation
 *
 * @param rowData - Excel row data to prefill form
 * @param rowIndex - Index of row for display/debugging
 * @returns Form methods and control objects from react-hook-form
 */
export function useGenerateDocumentForm(rowData: ExcelRow, rowIndex: number): UseFormReturn<GenerateDocumentFormData> {
  const form = useForm<GenerateDocumentFormData>({
    resolver: zodResolver(generateDocumentFormSchema),
    mode: "onBlur",
    defaultValues: {
      reportNumber: "",
      caseNumber: "",
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
    },
  });

  // Reset form with Excel data when rowData changes
  React.useEffect(() => {
    form.reset({
      // Numer informacji
      reportNumber: String(rowData["Nr informacji"] || ""),

      // Numer sprawy JRWA
      caseNumber: String(rowData["Numer sprawy JRWA"] || ""),

      // 1. Zadanie realizowane w ramach
      programName: String(rowData["Nazwa programu"] || ""),

      // 2. Forma zadania
      taskType: String(rowData["Działanie"] || ""),

      // 3. Miejsce wykonania zadania
      address: String(rowData["Lokalizacja"] || ""),

      // 4. Termin wykonania zadania
      dateInput: formatDateDisplay(parseDateToIso(rowData["Data"])),

      // 5. Grupa docelowa i liczba osób objętych zadaniem
      viewerCount: parseViewerCount(rowData["Liczba ludzi"]),

      viewerCountDescription: String(rowData["Grupa docelowa"] || ""),

      // 6. Zakres uczestnictwa
      taskDescription: String(rowData["Zakres uczestnictwa"] || ""),

      // 7. Dodatkowe informacje
      additionalInfo: String(rowData["Dodatkowe informacje"] || ""),

      // Czy załączyć listę obecności albo rozdzielnik
      attendanceList: rowData["Lista obecności"] === "tak",
      rozdzielnik: rowData["Rozdzielnik"] === "tak",
    });
  }, [rowData, rowIndex, form]);

  return form;
}
