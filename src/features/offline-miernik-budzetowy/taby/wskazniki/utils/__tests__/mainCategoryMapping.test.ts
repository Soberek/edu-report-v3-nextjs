import { describe, it, expect } from "vitest";
import { MAIN_CATEGORIES, getMainCategoryFromRow, getAllMainCategories, normalizeProgramName } from "../mainCategoryMapping";

describe("mainCategoryMapping", () => {
  describe("normalizeProgramName", () => {
    it("should normalize em-dash to hyphen", () => {
      expect(normalizeProgramName("Program – test")).toBe("Program - test");
    });

    it("should normalize non-breaking spaces", () => {
      expect(normalizeProgramName("Program\u00A0test")).toBe("Program test");
    });

    it("should trim whitespace", () => {
      expect(normalizeProgramName("  Program test  ")).toBe("Program test");
    });

    it("should handle multiple spaces", () => {
      expect(normalizeProgramName("Program   test")).toBe("Program test");
    });

    it("should handle mixed special characters", () => {
      expect(normalizeProgramName("Promocja\u00A0zdrowego\u00A0stylu\u00A0życia\u00A0–\u00A0inne")).toBe(
        "Promocja zdrowego stylu życia - inne"
      );
    });

    it("should keep normal names unchanged", () => {
      expect(normalizeProgramName("Profilaktyka grypy")).toBe("Profilaktyka grypy");
    });
  });

  describe("getMainCategoryFromRow", () => {
    // Szczepienia tests
    it("should map 'Promocja szczepień ochronnych' to Szczepienia", () => {
      const row = { "Nazwa programu": "Promocja szczepień ochronnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    // Zapobieganie otyłości tests
    it("should map 'Trzymaj Formę' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Trzymaj Formę" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Promocja zdrowego stylu życia, aktywności fizycznej i prawidłowego odżywiania' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Promocja zdrowego stylu życia, aktywności fizycznej i prawidłowego odżywiania" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Zdrowe zęby mamy, marchewkę zajadamy' to Inne", () => {
      const row = { "Nazwa programu": "Zdrowe zęby mamy, marchewkę zajadamy" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    // Profilaktyka uzależnień tests
    it("should map 'Profilaktyka używania substancji psychoaktywnych (NSP, nikotyna i światowe dni związane z nikotyną, alkohol)' to Profilaktyka uzależnień", () => {
      const row = {
        "Nazwa programu": "Profilaktyka używania substancji psychoaktywnych (NSP, nikotyna i światowe dni związane z nikotyną, alkohol)",
      };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    // HIV/AIDS tests
    it("should map 'Krajowy Program Zapobiegania Zakażeniom HIV i Zwalczania AIDS' to HIV/AIDS", () => {
      const row = { "Nazwa programu": "Krajowy Program Zapobiegania Zakażeniom HIV i Zwalczania AIDS" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });

    // Inne tests
    it("should map 'Higiena naszą tarczą ochroną' to Inne", () => {
      const row = { "Nazwa programu": "Higiena naszą tarczą ochroną" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Porozmawiajmy o zdrowiu i nowych zagrożeniach' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Porozmawiajmy o zdrowiu i nowych zagrożeniach" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Profilaktyka chorób zakaźnych' to Inne", () => {
      const row = { "Nazwa programu": "Profilaktyka chorób zakaźnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Profilaktyka chorób nowotworowych' to Inne", () => {
      const row = { "Nazwa programu": "Profilaktyka chorób nowotworowych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Promocja bezpiecznego grzybobrania i profilaktyka zatruć grzybami' to Inne", () => {
      const row = { "Nazwa programu": "Promocja bezpiecznego grzybobrania i profilaktyka zatruć grzybami" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Światowy Dzień Zdrowia' to Inne", () => {
      const row = { "Nazwa programu": "Światowy Dzień Zdrowia" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Europejski i Światowy Dzień Wiedzy o Antybiotykach' to Inne", () => {
      const row = { "Nazwa programu": "Europejski i Światowy Dzień Wiedzy o Antybiotykach" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Bezpieczeństwo dzieci podczas wypoczynku letniego i zimowego (bezpieczne ferie i wakacje)' to Inne", () => {
      const row = { "Nazwa programu": "Bezpieczeństwo dzieci podczas wypoczynku letniego i zimowego (bezpieczne ferie i wakacje)" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Seniorzy' to Inne", () => {
      const row = { "Nazwa programu": "Seniorzy" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Promocja zdrowia psychicznego' to Inne", () => {
      const row = { "Nazwa programu": "Promocja zdrowia psychicznego" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Wpływ czynników środowiskowych na zdrowie' to Inne", () => {
      const row = { "Nazwa programu": "Wpływ czynników środowiskowych na zdrowie" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should default unknown programs to Inne", () => {
      const row = { "Nazwa programu": "Zupełnie nowy program XYZ" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should default empty program name to Inne", () => {
      const row = { "Nazwa programu": "" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should default missing program name to Inne", () => {
      const row = {};
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    // Edge cases
    it("should return INNE when no program name exists", () => {
      const row = { "Other Key": "Other Value" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should return INNE when program name is empty", () => {
      const row = { "Nazwa programu": "" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should return INNE when program name is unknown", () => {
      const row = { "Nazwa programu": "Unknown Program" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with whitespace in program name", () => {
      const row = { "Nazwa programu": "  Promocja szczepień ochronnych  " };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle complex row data", () => {
      const row = {
        "Typ programu": "Edukacja",
        "Nazwa programu": "Promocja szczepień ochronnych",
        Działanie: "Warsztaty",
        "Liczba ludzi": 50,
        "Liczba działań": 10,
        Data: "2024-01-15",
      };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle row with null program name", () => {
      const row: Record<string, unknown> = {
        "Nazwa programu": null,
        "Other Key": "Value",
      };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with undefined program name", () => {
      const row: Record<string, unknown> = {
        "Nazwa programu": undefined,
        "Other Key": "Value",
      };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle empty object", () => {
      expect(getMainCategoryFromRow({})).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle program name with em-dash (–) instead of hyphen (-)", () => {
      const row = { "Nazwa programu": "Promocja zdrowego stylu życia, aktywności fizycznej i prawidłowego odżywiania" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should handle program name with non-breaking spaces", () => {
      const row = { "Nazwa programu": "Promocja\u00A0szczepień\u00A0ochronnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle program name with mixed special characters", () => {
      const row = { "Nazwa programu": "Promocja\u00A0szczepień\u00A0ochronnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });
  });

  describe("getAllMainCategories", () => {
    it("should return all main category values", () => {
      const categories = getAllMainCategories();

      expect(categories).toContain(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
      expect(categories).toContain(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(categories).toContain(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
      expect(categories).toContain(MAIN_CATEGORIES.HIV_AIDS);
      expect(categories).toContain(MAIN_CATEGORIES.INNE);
    });

    it("should return exactly 5 categories", () => {
      const categories = getAllMainCategories();
      expect(categories).toHaveLength(5);
    });

    it("should return array with no duplicates", () => {
      const categories = getAllMainCategories();
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
    });

    it("should return an array", () => {
      const categories = getAllMainCategories();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe("MAIN_CATEGORIES constant", () => {
    it("should have all expected category keys", () => {
      expect(MAIN_CATEGORIES).toHaveProperty("ZAPOBIEGANIE_OTYLOSCI");
      expect(MAIN_CATEGORIES).toHaveProperty("SZCZEPIENIA");
      expect(MAIN_CATEGORIES).toHaveProperty("PROFILAKTYKA_UZALEZNIENIA");
      expect(MAIN_CATEGORIES).toHaveProperty("HIV_AIDS");
      expect(MAIN_CATEGORIES).toHaveProperty("INNE");
    });

    it("should have correct Polish values", () => {
      expect(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI).toBe("Zapobieganie otyłości");
      expect(MAIN_CATEGORIES.SZCZEPIENIA).toBe("Szczepienia");
      expect(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA).toBe("Profilaktyka uzależnień");
      expect(MAIN_CATEGORIES.HIV_AIDS).toBe("HIV/AIDS");
      expect(MAIN_CATEGORIES.INNE).toBe("Inne");
    });
  });
});
