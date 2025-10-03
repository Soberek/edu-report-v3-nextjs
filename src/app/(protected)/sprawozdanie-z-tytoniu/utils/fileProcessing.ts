import * as XLSX from "xlsx";
import {
  type HealthInspectionRow,
  type AggregatedHealthData,
  HealthInspectionRowSchema,
  ERROR_MESSAGES,
  VALID_FILE_EXTENSIONS,
  MAX_FILE_SIZE,
  FACILITY_TYPES,
} from "../types";

/**
 * Validates if a file is a valid Excel file
 */
export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file extension
  const hasValidExtension = VALID_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  return { isValid: true };
};

/**
 * Reads Excel file and returns parsed data
 */
export const readExcelFile = async (file: File): Promise<{ fileName: string; data: HealthInspectionRow[]; worksheet: XLSX.WorkSheet }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          throw new Error(ERROR_MESSAGES.PROCESSING_ERROR);
        }

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Read data starting from row 5 (skip header rows)
        const data = XLSX.utils.sheet_to_json<HealthInspectionRow>(worksheet, {
          raw: false,
          range: 4, // Start from row 5 (0-indexed, so 4)
        });

        // Filter out empty rows and RAZEM row
        const filteredData = data.filter((row) => {
          const facilityType = row["RODZAJ OBIEKTU"];
          return facilityType && facilityType.trim() !== "" && !facilityType.toLowerCase().includes("razem");
        });

        if (filteredData.length === 0) {
          throw new Error(ERROR_MESSAGES.NO_DATA);
        }

        resolve({
          fileName: file.name,
          data: filteredData,
          worksheet,
        });
      } catch (error) {
        reject(new Error(error instanceof Error ? error.message : ERROR_MESSAGES.PROCESSING_ERROR));
      }
    };

    reader.onerror = () => {
      reject(new Error(ERROR_MESSAGES.PROCESSING_ERROR));
    };

    const aggregatedData: {
      [key: string]: {
        skontrolowane: number;
        realizowane: number;
        zWykorzystaniemPalarni: number;
      };
    } = {};
  });
};

/**
 * Validates Excel data structure
 */
export const validateExcelData = (data: HealthInspectionRow[]): { isValid: boolean; error?: string } => {
  if (!data || data.length === 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NO_DATA,
    };
  }

  try {
    // Validate each row
    for (let i = 0; i < data.length; i++) {
      HealthInspectionRowSchema.parse(data[i]);
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.INVALID_DATA_FORMAT,
    };
  }
};

/**
 * Normalizes facility type name to match predefined types
 */
const normalizeFacilityType = (type: string): string => {
  const normalized = type.trim().toLowerCase();

  // Find matching facility type
  const match = FACILITY_TYPES.find((ft) => ft.toLowerCase() === normalized);

  return match || type.trim();
};

/**
 * Converts string or number to number
 */
const toNumber = (value: number | string | undefined): number => {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return value;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

/**
 * Aggregates data from multiple Excel files
 */
export function aggregateHealthData(
  filesData: Array<{ fileName: string; data: HealthInspectionRow[] }>
): AggregatedHealthData {
  console.log("aggregateHealthData called with filesData:", filesData);

  // Initialize all facility types with zeros
  const result: AggregatedHealthData = {};
  FACILITY_TYPES.forEach((type) => {
    result[type] = {
      skontrolowane: 0,
      realizowane: 0,
      zWykorzystaniemPalarni: 0,
    };
  });

  filesData.forEach((fileData) => {
    fileData.data.forEach((row: any) => {
      // Skip rows that are not within the data range (rows 6-15 in Excel)
      // Only apply row filtering if __rowNum__ is present (from actual Excel files)
      if (row.__rowNum__ !== undefined && (row.__rowNum__ < 6 || row.__rowNum__ > 15)) {
        return;
      }

      const facilityType = row["RODZAJ OBIEKTU"];
      if (facilityType && result[facilityType]) {
        const skontrolowane = toNumber(
          row["LICZBA SKONTROLOWANYCH OBIEKTÓW"]
        );
        const realizowane = toNumber(row["OGÓŁEM"]);
        const zWykorzystaniemPalarni = toNumber(
          row["W TYM Z WYKORZYSTANIEM PALARNI"]
        );

        result[facilityType].skontrolowane += skontrolowane;
        result[facilityType].realizowane += realizowane;
        result[facilityType].zWykorzystaniemPalarni += zWykorzystaniemPalarni;
      }
    });
  });

  console.log("Aggregated result:", result);
  return result;
}

/**
 * Exports aggregated data to Excel format
 */
export const exportToExcel = async (aggregatedData: AggregatedHealthData, month: string = "sierpień 2025"): Promise<boolean> => {
  try {
    // Calculate totals
    const totals = Object.values(aggregatedData).reduce(
      (acc, curr) => ({
        skontrolowane: acc.skontrolowane + curr.skontrolowane,
        realizowane: acc.realizowane + curr.realizowane,
        zWykorzystaniemPalarni: acc.zWykorzystaniemPalarni + curr.zWykorzystaniemPalarni,
      }),
      { skontrolowane: 0, realizowane: 0, zWykorzystaniemPalarni: 0 }
    );

    // Prepare data for Excel
    const excelData: (string | number | undefined)[][] = [
      [],
      [],
      ["Aktualna sytuacja w zakresie realizacji ustawy o ochronie zdrowia przed następstwami używania tytoniu i wyrobów tytoniowych"],
      [`w województwie zachodniopomorskim, w miesiącu: ${month}`],
      [],
      ["Lp.", "RODZAJ OBIEKTU", "LICZBA SKONTROLOWANYCH OBIEKTÓW", "LICZBA OBIEKTÓW, W KTÓRYCH USTAWA JEST REALIZOWANA", ""],
      ["", "", "", "OGÓŁEM", "W TYM Z WYKORZYSTANIEM PALARNI"],
    ];

    // Add data rows
    FACILITY_TYPES.forEach((type, index) => {
      const data = aggregatedData[type];
      excelData.push([index + 1, type, data.skontrolowane || "", data.realizowane || "", data.zWykorzystaniemPalarni || ""]);
    });

    // Add totals row
    excelData.push(["RAZEM:", "", totals.skontrolowane, totals.realizowane, totals.zWykorzystaniemPalarni]);

    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Merge cells for headers
    worksheet["!merges"] = [
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Title row
      { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } }, // Subtitle row
      { s: { r: 5, c: 3 }, e: { r: 5, c: 4 } }, // "LICZBA OBIEKTÓW..." header
      { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } }, // "Lp." header
      { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } }, // "RODZAJ OBIEKTU" header
      { s: { r: 5, c: 2 }, e: { r: 6, c: 2 } }, // "LICZBA SKONTROLOWANYCH..." header
    ];

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 }, // Lp.
      { wch: 45 }, // RODZAJ OBIEKTU
      { wch: 30 }, // LICZBA SKONTROLOWANYCH OBIEKTÓW
      { wch: 15 }, // OGÓŁEM
      { wch: 30 }, // W TYM Z WYKORZYSTANIEM PALARNI
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ochrona Zdrowia");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `ochrona_zdrowia_agregacja_${timestamp}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
