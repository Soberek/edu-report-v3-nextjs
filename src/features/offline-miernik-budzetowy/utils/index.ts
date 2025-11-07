/**
 * Utilities Barrel Export
 * Pure functions for data processing and validation
 *
 * Note: Indicators-related utilities (indicatorsConfig, indicatorCalculation, aggregateByIndicators, mainCategoryMapping)
 * are located in taby/wskazniki/utils/ as they're specific to the indicators tab
 */

// File processing utilities
export * from "./fileUtils";

// Error handling utilities
export * from "./errorHandler";

// Excel parsing and normalization
export * from "./excelParser";
export * from "./cellNormalizer";

// Core data processing utilities
export { validateExcelData, aggregateData, exportToExcel } from "./dataProcessing";

// Excel-specific data processing utilities (with renamed export to avoid conflicts)
export { aggregateData as processExcelData } from "./processExcelData";

// Business logic helper utilities
export * from "./dataProcessingUtils";

// Data filtering utilities
export * from "./dataFiltering";

// Export strategy pattern
export { exportData, getAvailableExportFormats, getExportStrategy, type ExportFormat, type ExportStrategy } from "./exportStrategies";
