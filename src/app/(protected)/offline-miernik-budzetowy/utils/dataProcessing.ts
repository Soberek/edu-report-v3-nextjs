import moment from "moment";
import { z } from "zod";
import type { ExcelRow, Month, AggregatedData, ProgramsData } from "../types";
import { ExcelRowSchema, ERROR_MESSAGES } from "../types";

/**
 * Validates and processes Excel data
 */
export const validateExcelData = (data: ExcelRow[]): { isValid: boolean; error?: string } => {
  if (!data || data.length === 0) {
    return {
      isValid: false,
      error: "Plik nie zawiera danych",
    };
  }
  
  try {
    // Validate each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      ExcelRowSchema.parse(row);
    }
    
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        isValid: false,
        error: `${firstError.path.join(".")}: ${firstError.message}`,
      };
    }
    
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_DATA_FORMAT,
    };
  }
};

/**
 * Aggregates Excel data based on selected months
 */
export const aggregateData = (data: ExcelRow[], months: Month[]): AggregatedData => {
  const selectedMonths = months
    .filter((month) => month.selected)
    .map((month) => month.monthNumber);
  
  if (selectedMonths.length === 0) {
    throw new Error("Wybierz przynajmniej jeden miesiąc");
  }
  
  let allPeople = 0;
  let allActions = 0;
  
  const aggregated: ProgramsData = data.reduce((acc, item) => {
    try {
      const validatedRow = ExcelRowSchema.parse(item);
      
      const programType = validatedRow["Typ programu"];
      const programName = validatedRow["Nazwa programu"];
      const programAction = validatedRow["Działanie"];
      const peopleCount = validatedRow["Liczba ludzi"];
      const actionCount = validatedRow["Liczba działań"];
      
      const date = moment(validatedRow["Data"], "YYYY-MM-DD");
      const month = date.month() + 1; // moment months are 0-indexed
      
      // Skip if month is not selected
      if (!selectedMonths.includes(month)) {
        return acc;
      }
      
      // Initialize nested objects if they don't exist
      if (!acc[programType]) {
        acc[programType] = {};
      }
      
      if (!acc[programType][programName]) {
        acc[programType][programName] = {};
      }
      
      if (!acc[programType][programName][programAction]) {
        acc[programType][programName][programAction] = {
          people: 0,
          actionNumber: 0,
        };
      }
      
      // Accumulate values
      acc[programType][programName][programAction].actionNumber += actionCount;
      acc[programType][programName][programAction].people += peopleCount;
      
      allPeople += peopleCount;
      allActions += actionCount;
      
      return acc;
    } catch (error) {
      console.error("Error processing row:", item, error);
      throw new Error(`Błąd w wierszu danych: ${error instanceof Error ? error.message : "Nieznany błąd"}`);
    }
  }, {} as ProgramsData);
  
  return {
    aggregated,
    allPeople,
    allActions,
  };
};

/**
 * Exports aggregated data to Excel format
 */
export const exportToExcel = async (data: AggregatedData): Promise<boolean> => {
  try {
    const XLSX = await import("xlsx");
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create summary sheet
    const summaryData = [
      ["Podsumowanie"],
      ["Ogólna liczba działań", data.allActions],
      ["Ogólna liczba odbiorców", data.allPeople],
      [""],
      ["Szczegóły programów"],
    ];
    
    // Add program details
    Object.entries(data.aggregated).forEach(([programType, programs]) => {
      summaryData.push([`Typ programu: ${programType}`]);
      
      Object.entries(programs).forEach(([programName, actions]) => {
        summaryData.push([`  Program: ${programName}`]);
        
        Object.entries(actions).forEach(([actionName, stats]) => {
          summaryData.push([
            `    ${actionName}`,
            `Działania: ${stats.actionNumber}`,
            `Odbiorcy: ${stats.people}`,
          ]);
        });
      });
      
      summaryData.push([""]);
    });
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Podsumowanie");
    
    // Save file
    const fileName = `miernik_budzetowy_${moment().format("YYYY-MM-DD")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
