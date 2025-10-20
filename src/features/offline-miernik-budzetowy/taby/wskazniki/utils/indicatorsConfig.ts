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
  STOISKO_EDUKACYJNO_INFORMACYJNE: "Stoisko edukacyjno-informacyjne",
  SPRAWOZDANIE: "Sprawozdanie",
  SPRAWOZDANIE_MIESIEACZNE: "Sprawozdanie miesięczne",
  PRELEKCJA: "Prelekcja",
  WYKLAD: "Wykład",
  PUBLIKACJA_MEDIA: "Publikacja media",
  KONKURS: "Konkurs",
  LIST_INTENCYJNE: "List intencyjne",
  WIZYTACJA: "Wizytacja",
  GRY_I_ZABAWY: "Gry i zabawy",
  INSTRUKTAZ: "Instruktaż",
  DYSTRYBUCJA: "Dystrybucja",
  INSTRUKTAZ_INDYWIDUALNY: "Instruktaż indywidualny",
  NARADA: "Narada",
  SZKOLENIE: "Szkolenie",
  HAPPENING_ULICZNY: "Happening uliczny",
  KONFERENCJA: "Konferencja",
  WARSZTATY: "Warsztaty",
  PORADNICTWO: "Poradnictwo",
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
// PROGRAM CATEGORY MAPPING - ALL 47 PROGRAMS
// ============================================================================

/**
 * Program name to main category mapping
 * Maps all 47 specific program names to their main health categories
 * This is the definitive list of all programs in the system
 *
 * Categories distribution:
 * - Szczepienia: 6 programs
 * - Zapobieganie otyłości: 6 programs
 * - Profilaktyka uzależnień: 9 programs
 * - HIV/AIDS: 2 programs
 * - Inne: 24 programs
 * Total: 47 programs
 */
export const PROGRAM_CATEGORY_MAPPING: Record<string, MainCategory> = {
  // ========================================
  // SZCZEPIENIA (Vaccinations) - 6 programs
  // ========================================
  "Podstępne WZW": MAIN_CATEGORIES.SZCZEPIENIA,
  "Profilaktyka grypy": MAIN_CATEGORIES.SZCZEPIENIA,
  "Promocja szczepień ochronnych": MAIN_CATEGORIES.SZCZEPIENIA,
  "Europejski Tydzień Szczepień": MAIN_CATEGORIES.SZCZEPIENIA,
  "Profilaktyka chorób odkleszczowych": MAIN_CATEGORIES.SZCZEPIENIA,
  "Profilaktyka chorób zakaźnych": MAIN_CATEGORIES.SZCZEPIENIA,

  // ================================================
  // ZAPOBIEGANIE OTYŁOŚCI (Obesity Prevention) - 6 programs
  // ================================================
  "Skąd się biorą ekologiczne produkty": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
  "Trzymaj formę": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
  "Profilaktyka cukrzycy": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
  "Promocja zdrowego stylu życia": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
  "Promocja zdrowego stylu życia - inne": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,
  "Kampania EFSA": MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI,

  // =====================================================
  // PROFILAKTYKA UZALEŻNIEŃ (Addiction Prevention) - 9 programs
  // =====================================================
  "Bieg po zdrowie": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Czyste powietrze wokół nas": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Porozmawiajmy o zdrowiu i nowych zagrożeniach": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Ars - czyli jak dbać o miłość": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Profilaktyka palenia tytoniu": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Światowy Dzień Rzucania Palenia": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Profilaktyka używania napojów energetycznych": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Nowe narkotyki": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,
  "Światowy Dzień bez Tytoniu": MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA,

  // ====================
  // HIV/AIDS - 2 programs
  // ====================
  "HIV/AIDS": MAIN_CATEGORIES.HIV_AIDS,
  "Światowy Dzień AIDS": MAIN_CATEGORIES.HIV_AIDS,

  // ================================
  // INNE (Other) - 24 programs
  // ================================
  "Zdrowe zęby mamy, marchewkę zajadamy": MAIN_CATEGORIES.INNE,
  "Higiena naszą tarczą": MAIN_CATEGORIES.INNE,
  "Bezpieczne ferie": MAIN_CATEGORIES.INNE,
  Radon: MAIN_CATEGORIES.INNE,
  "Moja szkoła, zdrowa szkoła": MAIN_CATEGORIES.INNE,
  "Profilaktyka wad postawy": MAIN_CATEGORIES.INNE,
  "Znamię, znam je": MAIN_CATEGORIES.INNE,
  "Światowy Dzień Wody": MAIN_CATEGORIES.INNE,
  "Światowy Dzień Zdrowia": MAIN_CATEGORIES.INNE,
  "Bezpieczne Wakacje": MAIN_CATEGORIES.INNE,
  "Profilaktyka nowotworowa": MAIN_CATEGORIES.INNE,
  "Profilaktyka nowotworowa - Profilaktyka raka piersi": MAIN_CATEGORIES.INNE,
  "Profilaktyka nowotworowa - Profilaktyka raka jąder": MAIN_CATEGORIES.INNE,
  Cyberprzemoc: MAIN_CATEGORIES.INNE,
  "Power Ukraina": MAIN_CATEGORIES.INNE,
  "Profilaktyki chorób układu pokarmowego, w tym zatruć pokarmowych – salmonella, grzyby i inne": MAIN_CATEGORIES.INNE,
};

// ============================================================================
// INDICATORS CONFIGURATION
// ============================================================================
export const INDICATORS_CONFIG: IndicatorGroup[] = [
  {
    name: "Zdrowotne",
    indicators: [
      // {
      //   id: "szczepienia",
      //   name: "Szczepienia",
      //   description: "Program szczepień ochronnych",
      //   mainCategories: ["Szczepienia"],
      // },
      // {
      //   id: "otylosc",
      //   name: "Zapobieganie otyłości",
      //   description: "Program profilaktyki otyłości i zdrowego stylu życia",
      //   mainCategories: ["Zapobieganie otyłości"],
      // },
      // {
      //   id: "uzaleznienia",
      //   name: "Profilaktyka uzależnień",
      //   description: "Program profilaktyki narkomanii, alkoholizmu i papierosów",
      //   mainCategories: ["Profilaktyka uzależnień"],
      // },
      // {
      //   id: "hiv_aids",
      //   name: "HIV/AIDS",
      //   description: "Program edukacji w zakresie HIV/AIDS",
      //   mainCategories: ["HIV/AIDS"],
      // },
      {
        id: "palenie_tytoniu",
        name: "Światowe dni bez tytoniu",
        description: "Pogrupowanie świadomościowych dni dotyczących palenia tytoniu",
        programGroups: {
          "Światowy Dzień Rzucania Palenia": ["Światowy Dzień Rzucania Palenia", "Światowy Dzień bez Tytoniu", "Profilaktyka palenia tytoniu"],
        },
      },
      {
        id: "zdrowy_styl_zycia",
        name: "Promocja zdrowego stylu życia",
        description: "Zgrupowane programy promocji zdrowego stylu życia",
        programGroups: {
          "Promocja zdrowego stylu życia": [
            "Promocja zdrowego stylu życia",
            "Promocja zdrowego stylu życia - inne",
          ],
        },
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
        mainCategories: ["Szczepienia", "Zapobieganie otyłości", "Profilaktyka uzależnień", "HIV/AIDS", "Inne"],
        includeNonProgram: false,
      },
      {
        id: "wszystkie_razem",
        name: "Wszystko razem",
        description: "Wszystkie programy i wizytacje (włącznie z nieprogramowymi)",
        mainCategories: ["Szczepienia", "Zapobieganie otyłości", "Profilaktyka uzależnień", "HIV/AIDS", "Inne"],
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
