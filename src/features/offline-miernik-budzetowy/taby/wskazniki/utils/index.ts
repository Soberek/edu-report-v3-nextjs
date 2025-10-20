/**
 * Indicators utilities - central configuration and aggregation functions
 */

export {
  MAIN_CATEGORIES,
  PROGRAM_TYPES,
  ACTION_TYPES,
  PROGRAM_CATEGORY_MAPPING,
  INDICATORS_CONFIG,
  type MainCategory,
  type ProgramType,
  type ActionType,
  type IndicatorDefinition,
  type IndicatorGroup,
} from "./indicatorsConfig";
export { normalizeProgramName, getMainCategoryFromRow, getAllMainCategories } from "./mainCategoryMapping";
export { calculateIndicator, calculateIndicators, calculateAllIndicators, type IndicatorResult } from "./indicatorCalculation";
export { aggregateByIndicators, type IndicatorAggregatedData, type IndicatorCategoryData } from "./aggregateByIndicators";
