/**
 * Constants for the Budget Meter module
 */

// Tab Configuration
export const TABS = {
  ADVANCED_STATS: 0,
  BAR_CHARTS: 1,
  DATA_TABLE: 2,
  MAIN_CATEGORIES: 3,
} as const;

export const DEFAULT_ACTIVE_TAB = TABS.DATA_TABLE;

// Tab Metadata
export const TAB_CONFIG = [
    {
    id: TABS.DATA_TABLE,
    label: "Miernik budżetowy",
    icon: "TableChart",
    testId: "data-table-tab",
  },
    {
    id: TABS.MAIN_CATEGORIES,
    label: "Wskaźniki ",
    icon: "Category",
    testId: "main-categories-tab",
  },
  {
    id: TABS.ADVANCED_STATS,
    label: "Zaawansowane statystyki",
    icon: "Assessment",
    testId: "advanced-stats-tab",
  },
  {
    id: TABS.BAR_CHARTS,
    label: "Wykresy",
    icon: "BarChart",
    testId: "bar-charts-tab",
  },


] as const;

// UI Constants
export const UI_CONFIG = {
  CONTAINER_MAX_WIDTH: "xl",
  HEADER_SPACING: 6,
  SECTION_SPACING: 4,
  CARD_SPACING: 3,
  MIN_TAB_HEIGHT: 60,
  STATS_GRID_BREAKPOINT: "center",
} as const;

// Auto-processing Configuration
export const AUTO_PROCESSING = {
  ENABLED: true,
  DELAY_MS: 0, // Immediate processing
} as const;

// Component Size Limits (for development guidelines)
export const COMPONENT_LIMITS = {
  MAX_LINES: 200,
  MAX_FUNCTION_LINES: 20,
  MAX_PROPS: 8,
} as const;

export type TabId = (typeof TABS)[keyof typeof TABS];
