import moment from "moment";
import { z } from "zod";
import ExcelJS from "exceljs";
import type { ExcelRow, Month, AggregatedData, ProgramsData } from "../types";
import { ExcelRowSchema } from "../types";
import { ERROR_MESSAGES } from "../constants";
import { filterExcelData, getFilteringWarnings, isNonProgramVisitWithWizytacja } from "./dataFiltering";
import { calculateAllIndicators } from "../taby/wskazniki/utils/indicatorCalculation";
import {
  createEmptyDataError,
  createMissingColumnsError,
  createNumberFormatError,
  createDateFormatError,
  parseZodError,
  createProcessingError,
  formatErrorForDisplay,
} from "./errorHandler";

/**
 * Validates and processes Excel data
 * @param data Array of Excel rows to validate
 * @returns Validation result with success status and optional error message
 */
export const validateExcelData = (data: ExcelRow[]): { isValid: boolean; error?: string } => {
  if (!data || data.length === 0) {
    const error = createEmptyDataError(false);
    return { isValid: false, error: formatErrorForDisplay(error) };
  }

  // Filter out invalid and non-program rows using centralized filtering
  const validData = filterExcelData(data);

  if (validData.length === 0) {
    const error = createEmptyDataError(true);
    return { isValid: false, error: formatErrorForDisplay(error) };
  }

  // Check if first row has required columns
  const requiredColumns = ["Typ programu", "Nazwa programu", "Działanie", "Liczba ludzi", "Liczba działań", "Data"];
  const presentColumns = Object.keys(validData[0]);
  const missingColumns = requiredColumns.filter((col) => !presentColumns.includes(col));

  if (missingColumns.length > 0) {
    const error = createMissingColumnsError(missingColumns, presentColumns);
    return { isValid: false, error: formatErrorForDisplay(error) };
  }

  // Validate each valid row
  try {
    validData.forEach((row, index) => {
      try {
        ExcelRowSchema.parse(row);
      } catch (err) {
        if (err instanceof z.ZodError) {
          const detailedError = parseZodError(err, index + 2); // +2 because row 1 is header, index starts at 0
          throw new Error(formatErrorForDisplay(detailedError));
        }
        throw err;
      }
    });
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.DATA_NO_CONTENT;
    return { isValid: false, error: errorMessage };
  }
};

/**
 * Aggregates Excel data based on selected months
 * @param data Array of Excel rows to aggregate
 * @param months Array of month selection objects
 * @returns Aggregated data with totals, warnings about filtered rows, and indicator results
 * @throws Error if no months are selected
 */
export const aggregateData = (data: ExcelRow[], months: Month[]): AggregatedData => {
  const selectedMonths = months.filter((m) => m.selected).map((m) => m.monthNumber);

  if (selectedMonths.length === 0) {
    throw new Error("Wybierz przynajmniej jeden miesiąc");
  }

  // Use centralized filtering to get clean data
  const validData = filterExcelData(data);

  let allPeople = 0;
  let allActions = 0;
  const warnings: string[] = [];

  // Get filtering warnings
  const { warnings: filteringWarnings } = getFilteringWarnings(data);
  warnings.push(...filteringWarnings);

  // Calculate indicators from all valid data (before month filtering)
  const indicatorsMap = calculateAllIndicators(validData);
  const indicators: Record<string, unknown> = {};
  indicatorsMap.forEach((result, indicatorId) => {
    indicators[indicatorId] = result;
  });

  const aggregated: ProgramsData = validData.reduce((acc, item, index) => {
    try {
      const row = ExcelRowSchema.parse(item);
      const programType = String(row["Typ programu"] || "").trim();
      const dateStr = String(row["Data"]);
      const month = moment(dateStr, "YYYY-MM-DD").month() + 1;

      // Skip if month not selected
      if (!selectedMonths.includes(month)) return acc;

      // Skip non-program visits with wizytacja action (NIEPROGRAMOWE + wizytacja)
      if (isNonProgramVisitWithWizytacja(item)) return acc;

      const { "Nazwa programu": programName, "Działanie": action, "Liczba ludzi": peopleCount, "Liczba działań": actionCount } = row;

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
      if (error instanceof z.ZodError) {
        const detailedError = parseZodError(error, index + 2); // +2 because row 1 is header
        throw new Error(formatErrorForDisplay(detailedError));
      }
      throw createProcessingError(error);
    }
  }, {} as ProgramsData);

  return { aggregated, allPeople, allActions, warnings, indicators };
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
 * Triggers browser download of a blob
 * @param blob The data blob to download
 * @param fileName The filename for the download
 */
const downloadBlob = (blob: Blob, fileName: string): void => {
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
};

/**
 * Exports aggregated data to Excel format (original format)
 * @param data Aggregated data to export
 * @param customFileName Optional custom filename
 * @returns Promise<boolean> true if export was successful
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
        worksheet.addRow([`${idx + 1}.`, programName, null, null]);
        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${idx + 1}.${actionIdx + 1}`;
          worksheet.addRow([actionIndex, actionName, actionData.actionNumber, actionData.people]);
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `${customFileName || `miernik ${moment().format("DD-MM-YYYY")}`}.xlsx`;
    downloadBlob(blob, fileName);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};

/**
 * Column configuration for programowe and nieprogramowe sections
 */
const COLUMN_CONFIG = {
  programowe: { number: "A", name: "B", copy: "G", action: "C", wizytacja: "D", people: "H" },
  nieprogramowe: { number: "I", name: "J", copy: "N", action: "K", wizytacja: "D", people: "O" },
} as const;

/**
 * Fills a section (programowe or nieprogramowe) of the worksheet
 * @param worksheet The worksheet to fill
 * @param data Programs data to populate
 * @param columns Column configuration for this section
 */
const fillSection = (worksheet: ExcelJS.Worksheet, data: ProgramsData, columns: typeof COLUMN_CONFIG[keyof typeof COLUMN_CONFIG]): number => {
  let currentRow = 7;
  let programCounter = 0;

  Object.entries(data).forEach(([, programData]) => {
    Object.entries(programData).forEach(([programName, actions]) => {
      programCounter++;

      // Set program number and style
      const numberCell = worksheet.getCell(`${columns.number}${currentRow}`);
      numberCell.value = `${programCounter}.`;
      styleProgramNameCell(numberCell, numberCell);

      const copyCell = worksheet.getCell(`${columns.copy}${currentRow}`);
      copyCell.value = `${programCounter}.`;

      // Set program name and style
      const nameCell = worksheet.getCell(`${columns.name}${currentRow}`);
      nameCell.value = programName;
      styleProgramNameCell(nameCell, numberCell);

      currentRow++;

      // Add action rows
      Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
        const actionIndex = `${programCounter}.${actionIdx + 1}`;

        worksheet.getCell(`${columns.number}${currentRow}`).value = actionIndex;
        worksheet.getCell(`${columns.copy}${currentRow}`).value = actionIndex;
        worksheet.getCell(`${columns.name}${currentRow}`).value = actionName;

        // Handle wizytacja vs regular actions
        const countCell = actionName === "Wizytacja" ? columns.wizytacja : columns.action;
        worksheet.getCell(`${countCell}${currentRow}`).value = actionData.actionNumber;

        worksheet.getCell(`${columns.people}${currentRow}`).value = actionData.people;

        currentRow++;
      });
    });
  });

  return currentRow;
};

/**
 * Internal helper function to fill worksheet sections with program and action data
 * @param worksheet The Excel worksheet to fill
 * @param programoweData Programs data to fill
 * @param nieprogramoweData Non-programs data to fill
 */
const fillWorksheetSections = (worksheet: ExcelJS.Worksheet, programoweData: ProgramsData, nieprogramoweData: ProgramsData): void => {
  fillSection(worksheet, programoweData, COLUMN_CONFIG.programowe);
  fillSection(worksheet, nieprogramoweData, COLUMN_CONFIG.nieprogramowe);
};

/**
 * Generic export function for template-based Excel files
 * @param data Aggregated data to export
 * @param templatePath Path to the template file (e.g., "/generate-templates/zalnr1.xlsx")
 * @param defaultFileName Default filename without extension
 * @param customFileName Optional custom filename
 * @returns Promise<boolean> true if export was successful
 */
const exportToTemplateGeneric = async (
  data: AggregatedData,
  templatePath: string,
  defaultFileName: string,
  customFileName?: string
): Promise<boolean> => {
  try {
    if (!data.aggregated || Object.keys(data.aggregated).length === 0) {
      console.warn(`No data provided for export.`);
      return false;
    }

    // Load template
    const response = await fetch(templatePath);
    if (!response.ok) throw new Error(`Failed to load template: ${templatePath}`);

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("Template worksheet not found");

    // Separate programowe and nieprogramowe data
    const { programowe: programoweData, nieprogramowe: nieprogramoweData } = Object.entries(data.aggregated).reduce(
      (acc, [programType, programData]) => {
        const target = programType.toLowerCase().includes("nieprogramowe") ? "nieprogramowe" : "programowe";
        acc[target][programType] = programData;
        return acc;
      },
      { programowe: {} as ProgramsData, nieprogramowe: {} as ProgramsData }
    );

    // Fill sections and save
    fillWorksheetSections(worksheet, programoweData, nieprogramoweData);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = `${customFileName || `${defaultFileName} ${moment().format("DD-MM-YYYY")}`}.xlsx`;
    downloadBlob(blob, fileName);

    return true;
  } catch (error) {
    console.error(`Error exporting:`, error);
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
