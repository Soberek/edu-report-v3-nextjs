import moment from "moment";
import { z } from "zod";
import ExcelJS from "exceljs";
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
      const firstError = error.issues[0];
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
  const selectedMonths = months.filter((month) => month.selected).map((month) => month.monthNumber);

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
 * Exports aggregated data to Excel format (original format)
 */
export const exportToExcel = async (data: AggregatedData): Promise<boolean> => {
  try {
    if (!data.aggregated || Object.keys(data.aggregated).length === 0) {
      console.warn("No data provided for Excel export.");
      return false;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Miernik");

    worksheet.columns = [
      { width: 15 },
      { width: 40 },
      { width: 10 },
      { width: 10 },
    ];

    Object.entries(data.aggregated).forEach(([programType, programData]) => {
      worksheet.addRow([programType, null, null, null]);

      Object.entries(programData).forEach(([programName, actions], idx) => {
        const programIndex = idx + 1;
        worksheet.addRow([`${programIndex}`, programName, null, null]);

        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${programIndex}.${actionIdx + 1}`;
          worksheet.addRow([actionIndex, actionName, actionData.people, actionData.actionNumber]);
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (window.navigator && "msSaveOrOpenBlob" in window.navigator) {
      // @ts-expect-error: legacy IE API
      window.navigator.msSaveOrOpenBlob(blob, "miernik.xlsx");
    } else {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "miernik.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
