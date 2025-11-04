/**
 * Indicators Configuration & Constants
 * Central place for all indicator definitions, program mappings, categories, and types
 * This is the single source of truth for the offline budget meter
 */

// ============================================================================
// ENUMS AND TYPES
// ============================================================================

/**
 * Main health categories for program classification
 */
export const MAIN_CATEGORIES = {
  SZCZEPIENIA: "Szczepienia",
  ZAPOBIEGANIE_OTYLOSCI: "Zapobieganie otyłości",
  PROFILAKTYKA_UZALEZNIENIA: "Profilaktyka uzależnień",
  HIV_AIDS: "HIV/AIDS",
  INNE: "Inne",
} as const;

export type MainCategory = (typeof MAIN_CATEGORIES)[keyof typeof MAIN_CATEGORIES];

/**
 * Program types - only two valid values in the system
 */
export const PROGRAM_TYPES = {
  PROGRAMOWE: "PROGRAMOWE",
  NIEPROGRAMOWE: "NIEPROGRAMOWE",
} as const;

export type ProgramType = (typeof PROGRAM_TYPES)[keyof typeof PROGRAM_TYPES];

/**
 * Action types - all possible activities/actions that can be performed in programs
 * These represent the main types of actions recorded in Excel data
 */
export const ACTION_TYPES = {
  LIST_INTENCYJNY: "List intencyjny",
  ROZMOWA_INDYWIDUALNA: "Rozmowa indywidualna (instruktaż)",
  PORADNICTWO: "Poradnictwo",
  NARADA: "Narada",
  SZKOLENIE: "Szkolenie",
  PRELEKCJA_WARSZTAT: "Prelekcja (warsztat)",
  WYKLAD: "Wykład",
  KONFERENCJA: "Konferencja",
  STOISKO_EDUKACYJNO_INFORMACYJNE: "Stoisko edukacyjno-informacyjne",
  HAPPENING: "Happening (przemarsz, gra, event)",
  KONKURS: "Konkurs (quiz)",
  DYSTRYBUCJA: "Dystrybucja",
  WIZYTACJA: "Wizytacja",
  SPRAWOZDANIE: "Sprawozdanie (z programu, miernik, tytoń)",
  WYWIAD_DO_MEDIOW: "Wywiad do mediów",
  // Publikacja media subcategories
  PUBLIKACJA_MEDIA_PORTAL_X: "Publikacja media (Portal X)",
  PUBLIKACJA_MEDIA_FACEBOOK: "Publikacja media (Facebook)",
  PUBLIKACJA_MEDIA_STRONA: "Publikacja media (Strona)",
} as const;

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

/**
 * Individual indicator definition
 * Supports multiple filtering strategies to specify which programs are summed
 *
 * Priority order (first matching criterion is used):
 * 1. specificPrograms - if defined, ONLY these exact programs are included
 * 2. programGroups - named groups of programs from different categories
 * 3. mainCategories - groups programs by health category
 * 4. If none is defined, indicator is considered invalid
 */
export interface IndicatorDefinition {
  id: string;
  name: string;
  description: string;

  /**
   * OPTION 1: Select specific programs
   * If defined, ONLY these exact programs are counted (highest priority)
   * Example: ["Profilaktyka grypy", "Promocja szczepień ochronnych"]
   */
  specificPrograms?: string[];

  /**
   * OPTION 2: Define custom program groups
   * Allows grouping programs from different categories together
   * Useful for creating custom combinations that don't fit category boundaries
   */
  programGroups?: {
    [groupName: string]: string[]; // groupName -> array of program names
  };

  /**
   * OPTION 3: Group by main health categories
   * If defined and other options not used, all programs in these categories are counted
   * Example: ["Szczepienia", "Zapobieganie otyłości"]
   */
  mainCategories?: MainCategory[];

  /**
   * Additional program type filters (applied on top of category/program selection)
   * Useful to exclude or include only certain program types
   */
  programTypes?: {
    /** If specified, only these program types are counted */
    include?: ProgramType[];
    /** If specified, these program types are excluded */
    exclude?: ProgramType[];
  };

  /** Whether non-program visits (NIEPROGRAMOWE) should be included */
  includeNonProgram?: boolean;
}

/**
 * Indicator group - groups related indicators together
 */
export interface IndicatorGroup {
  name: string;
  indicators: IndicatorDefinition[];
}

// ============================================================================
// PROGRAM CATEGORY MAPPING - ALL PROGRAMS
// ============================================================================

/**
 * Program name to main category mapping
 * Maps all specific program names to their main health categories
 * This is the definitive list of all programs in the system
 *
 * Categories distribution:
 * - Szczepienia: 1 program
 * - Zapobieganie otyłości: 3 programs
 * - Profilaktyka uzależnień: 1 program
 * - HIV/AIDS: 1 program
 * - Inne: 11 programs
 * Total: 17 programs
 */
export const PROGRAM_CATEGORY_MAPPING: Record<string, MainCategory> = {
  // ========================================
  // SZCZEPIENIA (Vaccinations) - 1 program
  // ========================================
  "Promocja szczepień ochronnych": MAIN_CATEGORIES.SZCZEPIENIA,

  // ================================================
  // ZAPOBIEGANIE OTYŁOŚCI (Obesity Prevention) - 3 programs
  // ================================================
  "Trzymaj Formę": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
  "Promocja zdrowego stylu życia, aktywności fizycznej i prawidłowego odżywiania": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,

  // =====================================================
  // PROFILAKTYKA UZALEŻNIEŃ (Addiction Prevention) - 1 program
  // =====================================================
  "Profilaktyka używania substancji psychoaktywnych (NSP, nikotyna i światowe dni związane z nikotyną, alkohol)":
    MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Porozmawiajmy o zdrowiu i nowych zagrożeniach": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,

  // ====================
  // HIV/AIDS - 1 program
  // ====================
  "Krajowy Program Zapobiegania Zakażeniom HIV i Zwalczania AIDS": MAIN_CATEGORIES.HIV_AIDS,

  // ================================
  // INNE (Other) - 11 programs
  // ================================
  "Zdrowe zęby mamy, marchewkę zajadamy": MAIN_CATEGORIES.INNE,
  "Higiena naszą tarczą ochroną": MAIN_CATEGORIES.INNE,
  "Profilaktyka chorób zakaźnych": MAIN_CATEGORIES.INNE,
  "Profilaktyka chorób nowotworowych": MAIN_CATEGORIES.INNE,
  "Promocja bezpiecznego grzybobrania i profilaktyka zatruć grzybami": MAIN_CATEGORIES.INNE,
  "Światowy Dzień Zdrowia": MAIN_CATEGORIES.INNE,
  "Europejski i Światowy Dzień Wiedzy o Antybiotykach": MAIN_CATEGORIES.INNE,
  "Bezpieczeństwo dzieci podczas wypoczynku letniego i zimowego (bezpieczne ferie i wakacje)": MAIN_CATEGORIES.INNE,
  Seniorzy: MAIN_CATEGORIES.INNE,
  "Promocja zdrowia psychicznego": MAIN_CATEGORIES.INNE,
  "Wpływ czynników środowiskowych na zdrowie": MAIN_CATEGORIES.INNE,
};

// ============================================================================
// INDICATORS CONFIGURATION
// ============================================================================
export const INDICATORS_CONFIG: IndicatorGroup[] = [
  {
    name: "Zdrowotne",
    indicators: [
      {
        id: "szczepienia",
        name: "Szczepienia",
        description: "Program szczepień ochronnych",
        mainCategories: [MAIN_CATEGORIES.SZCZEPIENIA],
      },
      {
        id: "otylosc",
        name: "Zapobieganie otyłości",
        description: "Program profilaktyki otyłości i zdrowego stylu życia",
        mainCategories: [MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI],
      },
      {
        id: "uzaleznienia",
        name: "Profilaktyka uzależnień",
        description: "Program profilaktyki narkomanii, alkoholizmu i substancji psychoaktywnych",
        mainCategories: [MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA],
      },
      {
        id: "hiv_aids",
        name: "HIV/AIDS",
        description: "Program edukacji w zakresie HIV/AIDS",
        mainCategories: [MAIN_CATEGORIES.HIV_AIDS],
      },
      {
        id: "profilaktyka_substancji",
        name: "Profilaktyka używania substancji psychoaktywnych",
        description: "NSP, nikotyna, światowe dni związane z nikotyną, alkohol",
        specificPrograms: ["Profilaktyka używania substancji psychoaktywnych (NSP, nikotyna i światowe dni związane z nikotyną, alkohol)"],
      },
      {
        id: "zdrowy_styl_zycia",
        name: "Promocja zdrowego stylu życia",
        description: "Aktywność fizyczna i prawidłowe odżywianie",
        specificPrograms: ["Promocja zdrowego stylu życia, aktywności fizycznej i prawidłowego odżywiania"],
      },
      {
        id: "choroby_zakazne",
        name: "Profilaktyka chorób zakaźnych",
        description: "Program profilaktyki chorób zakaźnych",
        specificPrograms: ["Profilaktyka chorób zakaźnych"],
      },
      {
        id: "choroby_nowotworowe",
        name: "Profilaktyka chorób nowotworowych",
        description: "Program profilaktyki chorób nowotworowych",
        specificPrograms: ["Profilaktyka chorób nowotworowych"],
      },
      {
        id: "bezpieczenstwo_dzieci",
        name: "Bezpieczeństwo dzieci",
        description: "Bezpieczeństwo podczas wypoczynku letniego i zimowego",
        specificPrograms: ["Bezpieczeństwo dzieci podczas wypoczynku letniego i zimowego (bezpieczne ferie i wakacje)"],
      },
      {
        id: "zdrowie_psychiczne",
        name: "Promocja zdrowia psychicznego",
        description: "Program promocji zdrowia psychicznego",
        specificPrograms: ["Promocja zdrowia psychicznego"],
      },
    ],
  },
  {
    name: "Ogólne",
    indicators: [
      {
        id: "wszystkie_programy",
        name: "Wszystkie programy",
        description: "Wszystkie programy edukacyjne (bez wizyt nieprogramowych)",
        mainCategories: [
          MAIN_CATEGORIES.SZCZEPIENIA,
          MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
          MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
          MAIN_CATEGORIES.HIV_AIDS,
          MAIN_CATEGORIES.INNE,
        ],
        includeNonProgram: false,
      },
      {
        id: "wszystkie_razem",
        name: "Wszystko razem",
        description: "Wszystkie programy i wizytacje (włącznie z nieprogramowymi)",
        mainCategories: [
          MAIN_CATEGORIES.SZCZEPIENIA,
          MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
          MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
          MAIN_CATEGORIES.HIV_AIDS,
          MAIN_CATEGORIES.INNE,
        ],
        includeNonProgram: true,
      },
    ],
  },
];

/**
 * Gets indicator definition by ID
 * @param indicatorId ID of the indicator to find
 * @returns Indicator definition or undefined if not found
 */
export function getIndicatorById(indicatorId: string): IndicatorDefinition | undefined {
  for (const group of INDICATORS_CONFIG) {
    const indicator = group.indicators.find((ind) => ind.id === indicatorId);
    if (indicator) return indicator;
  }
  return undefined;
}

/**
 * Gets all indicators as a flat list
 * @returns Array of all indicators
 */
export function getAllIndicators(): IndicatorDefinition[] {
  return INDICATORS_CONFIG.flatMap((group) => group.indicators);
}

/**
 * Gets indicators grouped by category
 * @returns Array of indicator groups
 */
export function getIndicatorGroups(): IndicatorGroup[] {
  return INDICATORS_CONFIG;
}

/**
 * Gets main category for a program name
 * Uses the PROGRAM_CATEGORY_MAPPING to determine which category a program belongs to
 * @param programName Name of the program
 * @returns Main category or "Inne" if not found
 */
export function getCategoryForProgram(programName: string): MainCategory {
  return PROGRAM_CATEGORY_MAPPING[programName] || "Inne";
}

/**
 * Checks if a row should be included in a specific indicator
 * Applies filters in priority order:
 * 1. specificPrograms - if defined, ONLY these programs are counted
 * 2. programGroups - checks if program belongs to any defined group
 * 3. mainCategories - groups by health category
 * 4. programTypes - additional include/exclude filters
 *
 * @param mainCategory Main category of the row
 * @param programType Program type of the row
 * @param programName Name of the program
 * @param indicator Indicator definition with filter criteria
 * @returns true if the row matches the indicator's criteria
 */
export function matchesIndicator(mainCategory: string, programType: string, programName: string, indicator: IndicatorDefinition): boolean {
  // STEP 1: Match program selection criteria (highest priority first)
  if (indicator.specificPrograms && indicator.specificPrograms.length > 0) {
    // If specific programs defined, ONLY these are included
    if (!indicator.specificPrograms.includes(programName)) {
      return false;
    }
  } else if (indicator.programGroups) {
    // Check if program belongs to any defined group
    let foundInGroup = false;
    for (const groupPrograms of Object.values(indicator.programGroups)) {
      if (groupPrograms.includes(programName)) {
        foundInGroup = true;
        break;
      }
    }
    if (!foundInGroup) {
      return false;
    }
  } else if (indicator.mainCategories && indicator.mainCategories.length > 0) {
    // Otherwise check main categories
    if (!indicator.mainCategories.includes(mainCategory as MainCategory)) {
      return false;
    }
  } else {
    // If none of the selection criteria is defined, this indicator is invalid
    return false;
  }

  // STEP 2: Apply program type filters (if specified)
  if (indicator.programTypes) {
    // Check include filter - if specified, programType MUST be in this list
    if (indicator.programTypes.include && indicator.programTypes.include.length > 0) {
      if (!indicator.programTypes.include.includes(programType as ProgramType)) {
        return false;
      }
    }
    // Check exclude filter - if specified, programType MUST NOT be in this list
    if (indicator.programTypes.exclude && indicator.programTypes.exclude.length > 0) {
      if (indicator.programTypes.exclude.includes(programType as ProgramType)) {
        return false;
      }
    }
  }

  return true;
}
