import moment from "moment";
import { z } from "zod";
import ExcelJS from "exceljs";
import type { ExcelRow, Month, AggregatedData, ProgramsData } from "../types";
import { ExcelRowSchema, ERROR_MESSAGES } from "../types";

/**
 * Checks if a row has any content in required fields
 */
const isRowEmpty = (row: ExcelRow): boolean => {
  const typProgramu = String(row["Typ programu"] || "").trim();
  const nazwaProgramu = String(row["Nazwa programu"] || "").trim();
  const dzialanie = String(row["Działanie"] || "").trim();
  return typProgramu === "" && nazwaProgramu === "" && dzialanie === "";
};

/**
 * Validates and processes Excel data
 * @param data Array of Excel rows to validate
 * @returns Validation result with success status and optional error message
 */
export const validateExcelData = (data: ExcelRow[]): { isValid: boolean; error?: string } => {
  if (!data || data.length === 0) {
    return { isValid: false, error: "Plik nie zawiera danych" };
  }

  // Filter out empty rows
  const nonEmptyData = data.filter((row) => !isRowEmpty(row));

  if (nonEmptyData.length === 0) {
    return { isValid: false, error: "Plik nie zawiera danych (wszystkie wiersze są puste)" };
  }

  // Check if first row has required columns
  const requiredColumns = ["Typ programu", "Nazwa programu", "Działanie", "Liczba ludzi", "Liczba działań", "Data"];
  const presentColumns = Object.keys(nonEmptyData[0]);
  const missingColumns = requiredColumns.filter((col) => !presentColumns.includes(col));

  if (missingColumns.length > 0) {
    const errorMsg = `Plik nie zawiera wymaganych kolumn: ${missingColumns.join(", ")}. Dostępne kolumny: ${presentColumns.join(", ")}`;
    return { isValid: false, error: errorMsg };
  }

  // Validate each non-empty row
  try {
    nonEmptyData.forEach((row) => ExcelRowSchema.parse(row));
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { path, message } = error.issues[0];
      const pathStr = path.map(String).join(".");
      return { isValid: false, error: `Błąd w danych (${pathStr}): ${message}` };
    }
    return { isValid: false, error: ERROR_MESSAGES.INVALID_DATA_FORMAT };
  }
};

/**
 * Aggregates Excel data based on selected months
 * @param data Array of Excel rows to aggregate
 * @param months Array of month selection objects
 * @returns Aggregated data with totals
 * @throws Error if no months are selected
 */
export const aggregateData = (data: ExcelRow[], months: Month[]): AggregatedData => {
  const selectedMonths = months.filter((m) => m.selected).map((m) => m.monthNumber);

  if (selectedMonths.length === 0) {
    throw new Error("Wybierz przynajmniej jeden miesiąc");
  }

  const nonEmptyData = data.filter((row) => !isRowEmpty(row));
  let allPeople = 0;
  let allActions = 0;

  const aggregated: ProgramsData = nonEmptyData.reduce((acc, item) => {
    try {
      const row = ExcelRowSchema.parse(item);
      const month = moment(row["Data"], "YYYY-MM-DD").month() + 1;

      // Skip if month not selected
      if (!selectedMonths.includes(month)) return acc;

      const { "Typ programu": programType, "Nazwa programu": programName, "Działanie": action, "Liczba ludzi": peopleCount, "Liczba działań": actionCount } = row;

      // Ensure nested objects exist
      acc[programType] ??= {};
      acc[programType][programName] ??= {};
      acc[programType][programName][action] ??= { people: 0, actionNumber: 0 };

      // Accumulate values
      acc[programType][programName][action].actionNumber += actionCount;
      acc[programType][programName][action].people += peopleCount;
      allPeople += peopleCount;
      allActions += actionCount;

      return acc;
    } catch (error) {
      throw new Error(`Błąd w wierszu danych: ${error instanceof Error ? error.message : "Nieznany błąd"}`);
    }
  }, {} as ProgramsData);

  return { aggregated, allPeople, allActions };
};

/**
 * Styling configuration for Excel cells
 */
const CELL_STYLES = {
  programName: {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: "FFFF0000" } },
  },
  actionName: {
    font: { name: "Calibri", size: 11, bold: false, color: { argb: "FF000000" } },
  },
} as const;

/**
 * Determines if a cell value represents a program number (e.g., "1.", "2.", "3.")
 * @param value Cell value to check
 * @returns true if value matches program number pattern
 */
const isProgramNumber = (value: unknown): boolean => /^\d+\.$/.test(String(value || "").trim());

/**
 * Styles a cell based on whether it's a program or action row
 * Program rows get red/bold styling, action rows get black/normal
 * @param cell The cell to style
 * @param numberCell The number cell to check (determines if it's a program row)
 */
const styleProgramNameCell = (cell: ExcelJS.Cell, numberCell: ExcelJS.Cell): void => {
  const style = isProgramNumber(numberCell.value) ? CELL_STYLES.programName : CELL_STYLES.actionName;
  cell.style = { ...cell.style, ...style };
};

/**
 * Exports aggregated data to Excel format (original format)
 */
export const exportToExcel = async (data: AggregatedData, customFileName?: string): Promise<boolean> => {
  try {
    if (!data.aggregated || Object.keys(data.aggregated).length === 0) {
      console.warn("No data provided for Excel export.");
      return false;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Miernik");

    worksheet.columns = [{ width: 15 }, { width: 40 }, { width: 10 }, { width: 10 }];

    Object.entries(data.aggregated).forEach(([programType, programData]) => {
      worksheet.addRow([programType, null, null, null]);

      Object.entries(programData).forEach(([programName, actions], idx) => {
        const programIndex = idx + 1;
        // Add program name without data
        worksheet.addRow([`${programIndex}.`, programName, null, null]);

        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${programIndex}.${actionIdx + 1}`;
          // Add action with data: name, liczba działań, liczba odbiorców
          worksheet.addRow([actionIndex, actionName, actionData.actionNumber, actionData.people]);
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentDate = moment().format("DD-MM-YYYY");
    const fileName = `${customFileName || `miernik ${currentDate}`}.xlsx`;

    if (window.navigator && "msSaveOrOpenBlob" in window.navigator) {
      // @ts-expect-error: legacy IE API
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
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

/**
 * Internal helper function to fill worksheet sections with program and action data
 * @param worksheet The Excel worksheet to fill
 * @param programoweData Programs data to fill
 * @param nieprogramoweData Non-programs data to fill

 */
const fillWorksheetSections = (
  worksheet: ExcelJS.Worksheet,
  programoweData: ProgramsData,
  nieprogramoweData: ProgramsData,
  sectionPrefix: string,
): void => {
  // Fill in Programowe section (A7:D94)
  let currentRow = 7;
  let programCounter = 0;

  Object.entries(programoweData).forEach(([programType, programData]) => {
    Object.entries(programData).forEach(([programName, actions]) => {
      programCounter++;

      // Column A: numer programu i style
      const programNumberCell = worksheet.getCell(`A${currentRow}`);
      programNumberCell.value = `${programCounter}.`;
      styleProgramNameCell(programNumberCell, programNumberCell);


      // Column G: numer programu i style
      const programNumberCellG = worksheet.getCell(`G${currentRow}`);
      programNumberCellG.value = `${programCounter}.`;
      styleProgramNameCell(programNumberCellG, programNumberCellG);

      // Column B: nazwa programu
      const programNameCell = worksheet.getCell(`B${currentRow}`);
      programNameCell.value = programName;

      styleProgramNameCell(programNameCell, worksheet.getCell(`A${currentRow}`));

      currentRow++;

      // Add action rows with data
      Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
        const actionIndex = `${programCounter}.${actionIdx + 1}`;

        worksheet.getCell(`A${currentRow}`).value = actionIndex;
        worksheet.getCell(`G${currentRow}`).value = actionIndex;
        worksheet.getCell(`B${currentRow}`).value = actionName;

        if (actionName === "Wizytacja") {
          worksheet.getCell(`D${currentRow}`).value = actionData.actionNumber;
        } else {
          worksheet.getCell(`C${currentRow}`).value = actionData.actionNumber;
        }

        worksheet.getCell(`H${currentRow}`).value = actionData.people;

        currentRow++;
      });
    });
  });

  // Fill in Nieprogramowe section (I7:L?)
  currentRow = 7;
  programCounter = 0;

  Object.entries(nieprogramoweData).forEach(([programType, programData]) => {
    Object.entries(programData).forEach(([programName, actions]) => {
      programCounter++;

      // Column I: numer programu i style
      const programNumberCellI = worksheet.getCell(`I${currentRow}`);
      programNumberCellI.value = `${programCounter}.`;
      styleProgramNameCell(programNumberCellI, programNumberCellI);

      // Column N: numer programu i style
      const programNumberCellN = worksheet.getCell(`N${currentRow}`);
      programNumberCellN.value = `${programCounter}.`;
      styleProgramNameCell(programNumberCellN, programNumberCellN);

      const programNameCellNie = worksheet.getCell(`J${currentRow}`);

      programNameCellNie.value = programName;


      // Style program name cell
      styleProgramNameCell(programNameCellNie, worksheet.getCell(`I${currentRow}`));


      currentRow++;

      // Add action rows with data
      Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
        const actionIndex = `${programCounter}.${actionIdx + 1}`;

        worksheet.getCell(`I${currentRow}`).value = actionIndex;
        worksheet.getCell(`N${currentRow}`).value = actionIndex;
        worksheet.getCell(`J${currentRow}`).value = actionName;
        worksheet.getCell(`K${currentRow}`).value = actionData.actionNumber;
        worksheet.getCell(`O${currentRow}`).value = actionData.people;

        currentRow++;
      });
    });
  });
};

/**
 * Generic export function for template-based Excel files
 * @param data Aggregated data to export
 * @param templatePath Path to the template file (e.g., "/generate-templates/zalnr1.xlsx")
 * @param defaultFileName Default filename without extension
 * @param exportType Export type for logging purposes
 * @param customFileName Optional custom filename
 * @returns Promise<boolean> true if export was successful
 */
const exportToTemplateGeneric = async (
  data: AggregatedData,
  templatePath: string,
  defaultFileName: string,
  customFileName?: string,
  exportType: string = defaultFileName
): Promise<boolean> => {
  try {

    if (!data.aggregated || Object.keys(data.aggregated).length === 0) {
      console.warn(`No data provided for ${exportType} export.`);
      return false;
    }

    // Load the template
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load template file: ${templatePath}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error(`Template worksheet not found in ${templatePath}`);
    }

    // Separate programowe and nieprogramowe data
    const programoweData: ProgramsData = {};
    const nieprogramoweData: ProgramsData = {};

    Object.entries(data.aggregated).forEach(([programType, programData]) => {
      if (programType.toLowerCase().includes("nieprogramowe")) {
        nieprogramoweData[programType] = programData;
      } else {
        programoweData[programType] = programData;
      }
    });

    // Fill worksheet sections
    fillWorksheetSections(worksheet, programoweData, nieprogramoweData, exportType);

    // Generate filename with current date
    const currentDate = moment().format("DD-MM-YYYY");
    const fileName = `${customFileName || `${defaultFileName} ${currentDate}`}.xlsx`;

    // Save and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (window.navigator && "msSaveOrOpenBlob" in window.navigator) {
      // @ts-expect-error: legacy IE API
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }


    return true;
  } catch (error) {
    console.error(`Error exporting to ${exportType}:`, error);
    return false;
  }
};

/**
 * Exports aggregated data to the zalnr1.xlsx template
 * Fills in "Programowe" section (A7:D94) and "Nieprogramowe" section (I7:L?)
 * @param data Aggregated data to export
 * @param customFileName Optional custom filename
 * @returns Promise<boolean> true if export was successful
 */
export const exportToTemplate = async (data: AggregatedData, customFileName?: string): Promise<boolean> => {
  return exportToTemplateGeneric(data, "/generate-templates/zalnr1.xlsx", "zalnr1", customFileName);
};

/**
 * Exports aggregated data to the zalnr2.xlsx template (cumulative/narastający)
 * Fills in "Programowe" section (A7:D94) and "Nieprogramowe" section (I7:L?)
 * @param data Aggregated data to export
 * @param customFileName Optional custom filename
 * @returns Promise<boolean> true if export was successful
 */
export const exportToCumulativeTemplate = async (data: AggregatedData, customFileName?: string): Promise<boolean> => {
  return exportToTemplateGeneric(data, "/generate-templates/zalnr2.xlsx", "zalnr2", customFileName);
};
