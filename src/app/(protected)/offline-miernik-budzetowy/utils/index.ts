/**
 * Utilities Barrel Export
 * Pure functions for data processing and validation
 */

// File processing utilities
export * from "./fileUtils";

// Core data processing utilities
export { validateExcelData, aggregateData, exportToExcel } from "./dataProcessing";

// Excel-specific data processing utilities (with renamed export to avoid conflicts)
export { aggregateData as processExcelData } from "./processExcelData";

// Business logic helper utilities
export * from "./dataProcessingUtils";

// Main category utilities
export * from "./mainCategoryMapping";
export * from "./mainCategoryAggregation";
