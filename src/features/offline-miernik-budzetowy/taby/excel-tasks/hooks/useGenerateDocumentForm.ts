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
      reportNumber: String(rowData["Numer IZRZ"] || rowData["Nr informacji"] || `Wiersz ${rowIndex + 1}`),
      caseNumber: String(rowData["Znak sprawy"] || rowData["Nr informacji"] || `Wiersz ${rowIndex + 1}`),
      programName: String(rowData["Nazwa programu"] || ""),
      taskType: String(rowData["Działanie"] || ""),
      address: String(rowData["Adres"] || rowData["Szkoła"] || rowData["Osoba odpowiedzialna"] || ""),
      dateInput: formatDateDisplay(parseDateToIso(rowData["Data"])),
      viewerCount: parseViewerCount(rowData["Liczba ludzi"]),
      viewerCountDescription: String(rowData["Liczba działań"] || ""),
      taskDescription: String(rowData["Działanie"] || ""),
      additionalInfo: String(rowData["Dodatkowe informacje"] || ""),
      attendanceList: rowData["Lista obecności"] === "tak",
      rozdzielnik: rowData["Rozdzielnik"] === "tak",
    });
  }, [rowData, rowIndex, form]);

  return form;
}
