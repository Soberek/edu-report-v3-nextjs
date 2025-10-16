import moment from "moment";
import { z } from "zod";
import ExcelJS from "exceljs";
import type { ExcelRow, Month, AggregatedData, ProgramsData } from "../types";
import { ExcelRowSchema, ERROR_MESSAGES } from "../types";

/**
 * Validates and processes Excel data
 */
export const validateExcelData = (data: ExcelRow[]): { isValid: boolean; error?: string } => {
  console.log("🔍 DEBUG: validateExcelData called");
  console.log("📊 DEBUG: Data length:", data?.length);

  if (!data || data.length === 0) {
    console.log("❌ DEBUG: No data in file");
    return {
      isValid: false,
      error: "Plik nie zawiera danych",
    };
  }

  // Filter out empty rows - rows where all required fields are empty
  const nonEmptyData = data.filter(row => {
    const typProgramu = String(row["Typ programu"] || "").trim();
    const nazwaProgramu = String(row["Nazwa programu"] || "").trim();
    const dzialanie = String(row["Działanie"] || "").trim();

    // Row is considered non-empty if it has at least one of the main text fields filled
    const hasContent = typProgramu !== "" || nazwaProgramu !== "" || dzialanie !== "";

    if (!hasContent) {
      console.log("⏭️  DEBUG: Skipping empty row");
    }

    return hasContent;
  });

  console.log("📊 DEBUG: Non-empty rows:", nonEmptyData.length);

  if (nonEmptyData.length === 0) {
    console.log("❌ DEBUG: No non-empty data in file");
    return {
      isValid: false,
      error: "Plik nie zawiera danych (wszystkie wiersze są puste)",
    };
  }

  // Check if first row has required columns
  const firstRow = nonEmptyData[0];
  console.log("📋 DEBUG: First non-empty row data:", JSON.stringify(firstRow, null, 2));

  const requiredColumns = [
    "Typ programu",
    "Nazwa programu",
    "Działanie",
    "Liczba ludzi",
    "Liczba działań",
    "Data"
  ];

  const presentColumns = Object.keys(firstRow);
  console.log("✅ DEBUG: Present columns:", presentColumns);
  console.log("📝 DEBUG: Required columns:", requiredColumns);

  const missingColumns = requiredColumns.filter(col => !presentColumns.includes(col));
  console.log("❌ DEBUG: Missing columns:", missingColumns);

  if (missingColumns.length > 0) {
    const errorMsg = `Plik nie zawiera wymaganych kolumn: ${missingColumns.join(", ")}. Dostępne kolumny: ${presentColumns.join(", ")}`;
    console.log("🚫 DEBUG: Validation failed - missing columns:", errorMsg);
    return {
      isValid: false,
      error: errorMsg,
    };
  }

  try {
    console.log("🔄 DEBUG: Starting row validation...");
    // Validate each non-empty row
    for (let i = 0; i < nonEmptyData.length; i++) {
      const row = nonEmptyData[i];
      console.log(`📄 DEBUG: Validating row ${i + 1}:`, JSON.stringify(row, null, 2));
      ExcelRowSchema.parse(row);
    }

    console.log("✅ DEBUG: All rows validated successfully");
    return { isValid: true };
  } catch (error) {
    console.log("❌ DEBUG: Validation error:", error);
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      console.log("🔍 DEBUG: Zod error details:", JSON.stringify(firstError, null, 2));
      const path = firstError.path.map(p => String(p)).join(".");
      const errorMsg = `Błąd w danych (${path}): ${firstError.message}`;
      console.log("🚫 DEBUG: Formatted error:", errorMsg);
      return {
        isValid: false,
        error: errorMsg,
      };
    }

    console.log("🚫 DEBUG: Unknown error type:", error);
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

  // Filter out empty rows before processing
  const nonEmptyData = data.filter(row => {
    const typProgramu = String(row["Typ programu"] || "").trim();
    const nazwaProgramu = String(row["Nazwa programu"] || "").trim();
    const dzialanie = String(row["Działanie"] || "").trim();

    return typProgramu !== "" || nazwaProgramu !== "" || dzialanie !== "";
  });

  console.log("📊 DEBUG aggregateData: Processing", nonEmptyData.length, "non-empty rows out of", data.length, "total rows");

  let allPeople = 0;
  let allActions = 0;

  const aggregated: ProgramsData = nonEmptyData.reduce((acc, item) => {
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
 * Styles a program name cell based on the program number
 * Only cells with value "1." get red/bold styling, others get black/normal
 */
const styleProgramNameCell = (
  cell: ExcelJS.Cell,
  programNumberCell: ExcelJS.Cell,
  sectionName: string
): void => {
  const cellValue = String(programNumberCell.value || "").trim();
  const isProgramNumber = /^\d+\.$/.test(cellValue);
  
  console.log(`DEBUG: Cell ${cell.address}, Number cell value: "${cellValue}", isProgramNumber: ${isProgramNumber}`);
  
  // Get current style or create new one
  const currentStyle = cell.style || {};
  
  if (isProgramNumber) {
    console.log(`Styling ${sectionName} program name cell RED`, cell.address);
    cell.style = {
      ...currentStyle,
      font: {
        name: 'Calibri',
        size: 11,
        bold: true,
        color: { argb: 'FFFF0000' }
      }
    };
  } else {
    console.log(`Styling ${sectionName} action name cell BLACK`, cell.address);
    cell.style = {
      ...currentStyle,
      font: {
        name: 'Calibri',
        size: 11,
        bold: false,
        color: { argb: 'FF000000' }
      }
    };
  }
  
  console.log(`Font after setting:`, cell.font);
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
 * Exports aggregated data to the zalnr1.xlsx template
 * Fills in "Programowe" section (A7:D94) and "Nieprogramowe" section (I7:L?)
 */
export const exportToTemplate = async (data: AggregatedData, customFileName?: string): Promise<boolean> => {
  try {
    console.log(`🚀 DEBUG EXPORT: Starting template export with ${Object.keys(data.aggregated || {}).length} program types`);
    console.log(`📊 DEBUG EXPORT: Total people: ${data.allPeople}, Total actions: ${data.allActions}`);

    if (!data.aggregated || Object.keys(data.aggregated).length === 0) {
      console.warn("No data provided for template export.");
      return false;
    }

    // Load the template
    const response = await fetch("/generate-templates/zalnr1.xlsx");
    if (!response.ok) {
      throw new Error("Failed to load template file");
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Template worksheet not found");
    }

    // Separate programowe and nieprogramowe data
    const programoweData: ProgramsData = {};
    const nieprogramoweData: ProgramsData = {};

    Object.entries(data.aggregated).forEach(([programType, programData]) => {
      // Check if programType contains "nieprogramowe" (case-insensitive)
      if (programType.toLowerCase().includes("nieprogramowe")) {
        nieprogramoweData[programType] = programData;
      } else {
        programoweData[programType] = programData;
      }
    });

    // Fill in Programowe section (A7:D94)
    let currentRow = 7;
    let programCounter = 0;

    Object.entries(programoweData).forEach(([programType, programData]) => {
      Object.entries(programData).forEach(([programName, actions]) => {
        programCounter++;

        console.log(`📋 DEBUG EXPORT [Programowe]: Processing program #${programCounter}: "${programName}" at row ${currentRow}`);

        // Add program name row (no data, just name)
        worksheet.getCell(`A${currentRow}`).value = `${programCounter}.`;
        // Copy of program counter to column G
        worksheet.getCell(`G${currentRow}`).value = `${programCounter}.`;

        // Column B: nazwa programu
        const programNameCell = worksheet.getCell(`B${currentRow}`);
        programNameCell.value = programName;

        console.log(`🎨 DEBUG EXPORT [Programowe]: About to style program name cell B${currentRow} for program "${programName}"`);
        // Style program name cell
        styleProgramNameCell(programNameCell, worksheet.getCell(`A${currentRow}`), "Programowe");

        currentRow++;

        // Add action rows with data
        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${programCounter}.${actionIdx + 1}`;

          console.log(`📋 DEBUG EXPORT [Programowe]: Processing action "${actionName}" at row ${currentRow} (index: ${actionIndex})`);

          // Column A: nr (e.g., 1.1, 1.2)
          worksheet.getCell(`A${currentRow}`).value = actionIndex;

          // Kopia: Column G nr (e.g., 1.1, 1.2)
          worksheet.getCell(`G${currentRow}`).value = actionIndex;

          // Column B: nazwa działania
          worksheet.getCell(`B${currentRow}`).value = actionName;

          console.log(`🎨 DEBUG EXPORT [Programowe]: About to style action name cell B${currentRow} for action "${actionName}"`);
            styleProgramNameCell(worksheet.getCell(`B${currentRow}`), worksheet.getCell(`A${currentRow}`), "Programowe");


          if (actionName === "Wizytacja") {
            // Column D: liczba wizytacji
            worksheet.getCell(`D${currentRow}`).value = actionData.actionNumber;
          } else {
            // Column C: liczba działań
            worksheet.getCell(`C${currentRow}`).value = actionData.actionNumber;
          }

          // Column H: liczba odbiorców
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

        console.log(`📋 DEBUG EXPORT [Nieprogramowe]: Processing program #${programCounter}: "${programName}" at row ${currentRow}`);

        // Add program name row (no data, just name)
        worksheet.getCell(`I${currentRow}`).value = `${programCounter}.`;
        
                // Column J: program name
        const programNameCellNie = worksheet.getCell(`J${currentRow}`);
        programNameCellNie.value = programName;

        console.log(`🎨 DEBUG EXPORT [Nieprogramowe]: About to style program name cell J${currentRow} for program "${programName}"`);
        // Style program name cell
        styleProgramNameCell(programNameCellNie, worksheet.getCell(`I${currentRow}`), "Nieprogramowe");

        currentRow++;

        // Add action rows with data
        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${programCounter}.${actionIdx + 1}`;

          console.log(`📋 DEBUG EXPORT [Nieprogramowe]: Processing action "${actionName}" at row ${currentRow} (index: ${actionIndex})`);

          // Column I: nr (e.g., 1.1, 1.2)
          worksheet.getCell(`I${currentRow}`).value = actionIndex;
          worksheet.getCell(`N${currentRow}`).value = actionIndex;
          // Column J: nazwa działania
          worksheet.getCell(`J${currentRow}`).value = actionName;
          // Column K: liczba działań
          worksheet.getCell(`K${currentRow}`).value = actionData.actionNumber;
          // Column L: liczba odbiorców
          worksheet.getCell(`O${currentRow}`).value = actionData.people;

          console.log(`🎨 DEBUG EXPORT [Nieprogramowe]: About to style action name cell J${currentRow} for action "${actionName}"`);
          styleProgramNameCell(worksheet.getCell(`J${currentRow}`), worksheet.getCell(`I${currentRow}`), "Nieprogramowe");

          currentRow++;
        });
      });
    });

    // Generate filename with current date
    const currentDate = moment().format("DD-MM-YYYY");
    const fileName = `${customFileName || `zalnr1 ${currentDate}`}.xlsx`;

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

    console.log(`✅ DEBUG EXPORT: Template export completed successfully. File: ${fileName}`);

    return true;
  } catch (error) {
    console.error("Error exporting to template:", error);
    return false;
  }
};

/**
 * Exports aggregated data to the zalnr2.xlsx template (cumulative/narastający)
 * Fills in "Programowe" section (A7:D94) and "Nieprogramowe" section (I7:L?)
 */
export const exportToCumulativeTemplate = async (data: AggregatedData, customFileName?: string): Promise<boolean> => {
  try {
    console.log(`🚀 DEBUG EXPORT [CUMULATIVE]: Starting cumulative template export with ${Object.keys(data.aggregated || {}).length} program types`);
    console.log(`📊 DEBUG EXPORT [CUMULATIVE]: Total people: ${data.allPeople}, Total actions: ${data.allActions}`);

    if (!data.aggregated || Object.keys(data.aggregated).length === 0) {
      console.warn("No data provided for cumulative template export.");
      return false;
    }

    // Load the cumulative template
    const response = await fetch("/generate-templates/zalnr2.xlsx");
    if (!response.ok) {
      throw new Error("Failed to load cumulative template file (zalnr2.xlsx)");
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Cumulative template worksheet not found");
    }

    // Separate programowe and nieprogramowe data
    const programoweData: ProgramsData = {};
    const nieprogramoweData: ProgramsData = {};

    Object.entries(data.aggregated).forEach(([programType, programData]) => {
      // Check if programType contains "nieprogramowe" (case-insensitive)
      if (programType.toLowerCase().includes("nieprogramowe")) {
        nieprogramoweData[programType] = programData;
      } else {
        programoweData[programType] = programData;
      }
    });

    // Fill in Programowe section (A7:D94)
    let currentRow = 7;
    let programCounter = 0;

    Object.entries(programoweData).forEach(([programType, programData]) => {
      Object.entries(programData).forEach(([programName, actions]) => {
        programCounter++;

        console.log(`📋 DEBUG EXPORT [CUMULATIVE-Programowe]: Processing program #${programCounter}: "${programName}" at row ${currentRow}`);

        // Add program name row (no data, just name)
        worksheet.getCell(`A${currentRow}`).value = `${programCounter}.`;
        // Copy of program counter to column G
        worksheet.getCell(`G${currentRow}`).value = `${programCounter}.`;

        // Column B: nazwa programu
        const programNameCell = worksheet.getCell(`B${currentRow}`);
        programNameCell.value = programName;

        console.log(`🎨 DEBUG EXPORT [CUMULATIVE-Programowe]: About to style program name cell B${currentRow} for program "${programName}"`);
        // Style program name cell
        styleProgramNameCell(programNameCell, worksheet.getCell(`A${currentRow}`), "Cumulative-Programowe");

        currentRow++;

        // Add action rows with data
        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${programCounter}.${actionIdx + 1}`;

          console.log(`📋 DEBUG EXPORT [CUMULATIVE-Programowe]: Processing action "${actionName}" at row ${currentRow} (index: ${actionIndex})`);

          // Column A: nr (e.g., 1.1, 1.2)
          worksheet.getCell(`A${currentRow}`).value = actionIndex;

          // Kopia: Column G nr (e.g., 1.1, 1.2)
          worksheet.getCell(`G${currentRow}`).value = actionIndex;

          // Column B: nazwa działania
          worksheet.getCell(`B${currentRow}`).value = actionName;

          console.log(`🎨 DEBUG EXPORT [CUMULATIVE-Programowe]: About to style action name cell B${currentRow} for action "${actionName}"`);
            styleProgramNameCell(worksheet.getCell(`B${currentRow}`), worksheet.getCell(`A${currentRow}`), "Cumulative-Programowe");


          if (actionName === "Wizytacja") {
            // Column D: liczba wizytacji
            worksheet.getCell(`D${currentRow}`).value = actionData.actionNumber;
          } else {
            // Column C: liczba działań
            worksheet.getCell(`C${currentRow}`).value = actionData.actionNumber;
          }

          // Column H: liczba odbiorców
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

        console.log(`📋 DEBUG EXPORT [CUMULATIVE-Nieprogramowe]: Processing program #${programCounter}: "${programName}" at row ${currentRow}`);

        // Add program name row (no data, just name)
        worksheet.getCell(`I${currentRow}`).value = `${programCounter}.`;
        
                // Column J: program name
        const programNameCellNie = worksheet.getCell(`J${currentRow}`);
        programNameCellNie.value = programName;

        console.log(`🎨 DEBUG EXPORT [CUMULATIVE-Nieprogramowe]: About to style program name cell J${currentRow} for program "${programName}"`);
        // Style program name cell
        styleProgramNameCell(programNameCellNie, worksheet.getCell(`I${currentRow}`), "Cumulative-Nieprogramowe");

        currentRow++;

        // Add action rows with data
        Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
          const actionIndex = `${programCounter}.${actionIdx + 1}`;

          console.log(`📋 DEBUG EXPORT [CUMULATIVE-Nieprogramowe]: Processing action "${actionName}" at row ${currentRow} (index: ${actionIndex})`);

          // Column I: nr (e.g., 1.1, 1.2)
          worksheet.getCell(`I${currentRow}`).value = actionIndex;
          worksheet.getCell(`N${currentRow}`).value = actionIndex;
          // Column J: nazwa działania
          worksheet.getCell(`J${currentRow}`).value = actionName;
          // Column K: liczba działań
          worksheet.getCell(`K${currentRow}`).value = actionData.actionNumber;
          // Column L: liczba odbiorców
          worksheet.getCell(`O${currentRow}`).value = actionData.people;

          console.log(`🎨 DEBUG EXPORT [CUMULATIVE-Nieprogramowe]: About to style action name cell J${currentRow} for action "${actionName}"`);
          styleProgramNameCell(worksheet.getCell(`J${currentRow}`), worksheet.getCell(`I${currentRow}`), "Cumulative-Nieprogramowe");

          currentRow++;
        });
      });
    });

    // Generate filename with current date
    const currentDate = moment().format("DD-MM-YYYY");
    const fileName = `${customFileName || `zalnr2 ${currentDate}`}.xlsx`;

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

    console.log(`✅ DEBUG EXPORT [CUMULATIVE]: Cumulative template export completed successfully. File: ${fileName}`);

    return true;
  } catch (error) {
    console.error("Error exporting to cumulative template:", error);
    return false;
  }
};
