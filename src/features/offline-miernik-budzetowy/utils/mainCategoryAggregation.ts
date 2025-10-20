import moment from "moment";
import { ExcelRow } from "../types";
import { getMainCategoryFromRow, MainCategory, getAllMainCategories } from "./mainCategoryMapping";
import { filterExcelData } from "./dataFiltering";

/**
 * Data structure for a single action item
 */
export interface ActionData {
  actionName: string;
  people: number;
  actionNumber: number;
}

/**
 * Monthly breakdown data
 */
export interface MonthlyData {
  month: number;
  monthName: string;
  people: number;
  actions: number;
}

/**
 * Data structure for a sub-category within a program
 * @deprecated - No longer used in new grouping strategy
 */
export interface SubCategoryData {
  subCategoryName: string;
  totalPeople: number;
  totalActions: number;
  examplePrograms: string[]; // Up to 3 example program names
  totalProgramCount: number; // Total number of unique programs in this sub-category
  actions: ActionData[];
}

/**
 * Data structure for a single program within a category
 * Can represent either a regular program or a sub-category grouping
 */
export interface CategoryProgramData {
  programName: string; // If it's a sub-category, this will be the sub-category name
  programType: string;
  totalPeople: number;
  totalActions: number;
  isSubCategoryGroup: boolean; // True if this represents aggregated sub-category data
  examplePrograms: string[]; // Program names that belong to this sub-category (up to 3)
  totalProgramCount: number; // Total number of unique programs in this group
  actions: ActionData[];
  monthlyBreakdown: MonthlyData[]; // Monthly breakdown of data
}

/**
 * Data structure for aggregated category data
 */
export interface MainCategoryData {
  category: MainCategory;
  totalPeople: number;
  totalActions: number;
  programs: CategoryProgramData[];
  monthlyBreakdown: MonthlyData[]; // Monthly breakdown for the entire category
}

/**
 * Complete aggregated data by main categories
 */
export interface MainCategoryAggregatedData {
  categories: MainCategoryData[];
  grandTotalPeople: number;
  grandTotalActions: number;
  monthlyBreakdown: MonthlyData[]; // Grand total monthly breakdown
}

const MONTH_NAMES = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

/**
 * Aggregates Excel data by main categories
 * Groups items by sub-category when present, showing example program names
 * Now includes monthly breakdown for selected months
 */
export function aggregateByMainCategories(rawData: ExcelRow[], selectedMonths?: number[]): MainCategoryAggregatedData {
  console.log("🔄 Starting aggregation by main categories...");
  console.log(`📊 Total rows to process: ${rawData.length}`);
  if (selectedMonths && selectedMonths.length > 0) {
    console.log(`📅 Filtering by months: ${selectedMonths.join(", ")}`);
  }

  // Use centralized filtering to get clean data (removes empty rows and non-program visits)
  const validData = filterExcelData(rawData);

  // Initialize category map - now keyed by sub-category or program
  const categoryMap = new Map<MainCategory, Map<string, CategoryProgramData>>();

  // Track monthly data at different levels
  const grandMonthlyMap = new Map<number, { people: number; actions: number }>();
  const categoryMonthlyMaps = new Map<MainCategory, Map<number, { people: number; actions: number }>>();

  let grandTotalPeople = 0;
  let grandTotalActions = 0;

  // Track for logging
  const connectionLog = new Map<string, { count: number; programs: Set<string> }>();

  // Process each row
  validData.forEach((row, index) => {
    // Extract month from date
    const dateStr = String(row["Data"] || "");
    const date = moment(dateStr, "YYYY-MM-DD");
    const month = date.isValid() ? date.month() + 1 : 0; // moment months are 0-indexed

    // Filter by selected months if provided
    if (selectedMonths && selectedMonths.length > 0 && month > 0 && !selectedMonths.includes(month)) {
      return; // Skip this row
    }

    const mainCategory = getMainCategoryFromRow(row);
    const programType = String(row["Typ programu"] || "").trim();
    const programName = String(row["Nazwa programu"] || "");
    const subCategoryRaw = String(row["Sub Category"] || row["Podkategoria"] || "").trim();
    // Ignore sub-category if it's "0" or empty
    const subCategory = subCategoryRaw && subCategoryRaw !== "0" ? subCategoryRaw : "";
    const actionName = String(row["Działanie"] || "");
    const people = Number(row["Liczba ludzi"] || 0);
    const actionNumber = Number(row["Liczba działań"] || 0);

    // Get or create category map
    if (!categoryMap.has(mainCategory)) {
      categoryMap.set(mainCategory, new Map());
    }
    const itemsMap = categoryMap.get(mainCategory)!;

    // Determine the key: use sub-category if present, otherwise use program name
    const itemKey = subCategory || `NO_SUB::${programType}::${programName}`;
    const isSubCategoryItem = !!subCategory;

    // Log tracking
    if (!connectionLog.has(itemKey)) {
      connectionLog.set(itemKey, { count: 0, programs: new Set() });
      if (isSubCategoryItem) {
        console.log(`\n🔗 New Sub-Category Group [Row ${index + 1}]:`);
        console.log(`  📁 Main Category: ${mainCategory}`);
        console.log(`  📦 Sub-Category: "${subCategory}"`);
      } else {
        console.log(`\n✨ New Program (No Sub-Category) [Row ${index + 1}]:`);
        console.log(`  📁 Main Category: ${mainCategory}`);
        console.log(`  📝 Program Name: ${programName}`);
      }
    }

    const logEntry = connectionLog.get(itemKey)!;
    logEntry.count++;
    if (isSubCategoryItem) {
      if (!logEntry.programs.has(programName)) {
        console.log(`  ├─ Program: "${programName}" (Row ${index + 1})`);
        logEntry.programs.add(programName);
      }
    }

    // Get or create item data
    if (!itemsMap.has(itemKey)) {
      itemsMap.set(itemKey, {
        programName: isSubCategoryItem ? subCategory : programName,
        programType: programType,
        totalPeople: 0,
        totalActions: 0,
        isSubCategoryGroup: isSubCategoryItem,
        examplePrograms: [],
        totalProgramCount: 0,
        actions: [],
        monthlyBreakdown: [],
      });
    }

    const itemData = itemsMap.get(itemKey)!;

    // Update monthly data for this program
    if (month > 0) {
      const monthlyMap = new Map<number, { people: number; actions: number }>();
      itemData.monthlyBreakdown.forEach((m) => monthlyMap.set(m.month, { people: m.people, actions: m.actions }));

      const monthData = monthlyMap.get(month) || { people: 0, actions: 0 };
      monthData.people += people;
      monthData.actions += actionNumber;
      monthlyMap.set(month, monthData);

      itemData.monthlyBreakdown = Array.from(monthlyMap.entries())
        .map(([m, data]) => ({
          month: m,
          monthName: MONTH_NAMES[m - 1],
          people: data.people,
          actions: data.actions,
        }))
        .sort((a, b) => a.month - b.month);
    }

    // Track unique programs for sub-category groups
    if (isSubCategoryItem && !itemData.examplePrograms.includes(programName)) {
      if (itemData.examplePrograms.length < 3) {
        itemData.examplePrograms.push(programName);
      }
      itemData.totalProgramCount++;
    }

    // Aggregate actions by name (merge duplicate action names)
    const existingAction = itemData.actions.find((a) => a.actionName === actionName);
    if (existingAction) {
      // Action already exists, add to counts
      existingAction.people += people;
      existingAction.actionNumber += actionNumber;
    } else {
      // New action, add to array
      itemData.actions.push({
        actionName,
        people,
        actionNumber,
      });
    }

    // Update totals
    itemData.totalPeople += people;
    itemData.totalActions += actionNumber;
    grandTotalPeople += people;
    grandTotalActions += actionNumber;

    // Update grand monthly totals
    if (month > 0) {
      const grandMonthData = grandMonthlyMap.get(month) || { people: 0, actions: 0 };
      grandMonthData.people += people;
      grandMonthData.actions += actionNumber;
      grandMonthlyMap.set(month, grandMonthData);

      // Update category monthly totals
      if (!categoryMonthlyMaps.has(mainCategory)) {
        categoryMonthlyMaps.set(mainCategory, new Map());
      }
      const catMonthlyMap = categoryMonthlyMaps.get(mainCategory)!;
      const catMonthData = catMonthlyMap.get(month) || { people: 0, actions: 0 };
      catMonthData.people += people;
      catMonthData.actions += actionNumber;
      catMonthlyMap.set(month, catMonthData);
    }
  });

  // Convert to array structure
  const categories: MainCategoryData[] = getAllMainCategories().map((category) => {
    const itemsMap = categoryMap.get(category);
    const programs = itemsMap ? Array.from(itemsMap.values()) : [];

    const totalPeople = programs.reduce((sum, p) => sum + p.totalPeople, 0);
    const totalActions = programs.reduce((sum, p) => sum + p.totalActions, 0);

    // Get monthly breakdown for this category
    const catMonthlyMap = categoryMonthlyMaps.get(category) || new Map();
    const monthlyBreakdown: MonthlyData[] = Array.from(catMonthlyMap.entries())
      .map(([month, data]) => ({
        month,
        monthName: MONTH_NAMES[month - 1],
        people: data.people,
        actions: data.actions,
      }))
      .sort((a, b) => a.month - b.month);

    return {
      category,
      totalPeople,
      totalActions,
      programs,
      monthlyBreakdown,
    };
  });

  // Log summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 AGGREGATION SUMMARY");
  console.log("=".repeat(60));

  connectionLog.forEach((log, itemKey) => {
    const isSubCat = !itemKey.startsWith("NO_SUB::");
    if (isSubCat) {
      console.log(`\n� Sub-Category: "${itemKey}"`);
      console.log(`   ├─ Total rows: ${log.count}`);
      console.log(`   ├─ Programs aggregated: ${log.programs.size}`);
      const programsArray = Array.from(log.programs);
      programsArray.forEach((prog, idx) => {
        const symbol = idx === programsArray.length - 1 ? "└" : "├";
        console.log(`   │  ${symbol}─ "${prog}"`);
      });
    } else {
      const parts = itemKey.split("::");
      const programName = parts[2];
      const programType = parts[1];
      console.log(`\n📌 ${programName} (${programType})`);
      console.log(`   └─ Total rows: ${log.count}`);
    }
  });

  console.log("\n" + "=".repeat(60));
  console.log("📊 GRAND TOTALS");
  console.log("=".repeat(60));
  console.log(`👥 Total People: ${grandTotalPeople.toLocaleString("pl-PL")}`);
  console.log(`🎯 Total Actions: ${grandTotalActions.toLocaleString("pl-PL")}`);
  console.log(`📁 Total Items: ${connectionLog.size}`);
  console.log(`🏷️  Total Categories: ${categories.filter((c) => c.programs.length > 0).length}`);
  console.log("=".repeat(60) + "\n");

  // Create grand monthly breakdown
  const monthlyBreakdown: MonthlyData[] = Array.from(grandMonthlyMap.entries())
    .map(([month, data]) => ({
      month,
      monthName: MONTH_NAMES[month - 1],
      people: data.people,
      actions: data.actions,
    }))
    .sort((a, b) => a.month - b.month);

  return {
    categories,
    grandTotalPeople,
    grandTotalActions,
    monthlyBreakdown,
  };
}
