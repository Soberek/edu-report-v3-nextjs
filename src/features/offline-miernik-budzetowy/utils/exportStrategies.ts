/**
 * Export Strategies for different Excel export formats
 * Implements the Strategy pattern for extensible export handling
 */

import type { AggregatedData } from "../types";
import { exportToExcel, exportToTemplate, exportToCumulativeTemplate } from "./dataProcessing";

/**
 * Export format type
 */
export type ExportFormat = "excel" | "template" | "cumulative";

/**
 * Export strategy configuration
 */
export interface ExportStrategy {
  format: ExportFormat;
  label: string;
  description: string;
  defaultFileName: string;
  execute: (data: AggregatedData, customFileName?: string) => Promise<boolean>;
}

/**
 * Export strategies registry
 * Centralized configuration for all export formats
 */
const strategies: Record<ExportFormat, ExportStrategy> = {
  excel: {
    format: "excel",
    label: "Excel (Miernik Budżetowy)",
    description: "Export w tradycyjnym formacie Excel",
    defaultFileName: "miernik-budzetowy",
    execute: (data, customFileName) => exportToExcel(data, customFileName),
  },
  template: {
    format: "template",
    label: "Szablon Raportu",
    description: "Export do szablonu raportu (Zalacznik Nr 1)",
    defaultFileName: "zalacznik-nr-1",
    execute: (data, customFileName) => exportToTemplate(data, customFileName),
  },
  cumulative: {
    format: "cumulative",
    label: "Raport Skumulowany",
    description: "Export do szablonu skumulowanego raportu (Zalacznik Nr 2)",
    defaultFileName: "zalacznik-nr-2-narastajacy",
    execute: (data, customFileName) => exportToCumulativeTemplate(data, customFileName),
  },
};

/**
 * Export data in specified format
 * @param data Aggregated data to export
 * @param format Export format type (defaults to 'excel')
 * @param customFileName Optional custom filename
 * @returns Promise<boolean> true if export was successful
 * @throws Error if format is unknown
 */
export async function exportData(data: AggregatedData, format: ExportFormat = "excel", customFileName?: string): Promise<boolean> {
  const strategy = strategies[format];

  if (!strategy) {
    throw new Error(`Unknown export format: ${format}`);
  }

  try {
    return await strategy.execute(data, customFileName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Export failed";
    throw new Error(`Failed to export as ${format}: ${errorMessage}`);
  }
}

/**
 * Get all available export strategies
 * @returns Array of export strategy metadata
 */
export function getAvailableExportFormats(): ExportStrategy[] {
  return Object.values(strategies);
}

/**
 * Get strategy for specific format
 * @param format Export format type
 * @returns Export strategy or undefined if not found
 */
export function getExportStrategy(format: ExportFormat): ExportStrategy | undefined {
  return strategies[format];
}
