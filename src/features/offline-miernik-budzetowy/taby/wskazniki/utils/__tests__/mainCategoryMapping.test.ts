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
    it("should map 'Podstępne WZW' to Szczepienia", () => {
      const row = { "Nazwa programu": "Podstępne WZW" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should map 'Profilaktyka grypy' to Szczepienia", () => {
      const row = { "Nazwa programu": "Profilaktyka grypy" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should map 'Promocja szczepień ochronnych' to Szczepienia", () => {
      const row = { "Nazwa programu": "Promocja szczepień ochronnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should map 'Europejski Tydzień Szczepień' to Szczepienia", () => {
      const row = { "Nazwa programu": "Europejski Tydzień Szczepień" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should map 'Profilaktyka chorób odkleszczowych' to Szczepienia", () => {
      const row = { "Nazwa programu": "Profilaktyka chorób odkleszczowych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should map 'Profilaktyka chorób zakaźnych' to Szczepienia", () => {
      const row = { "Nazwa programu": "Profilaktyka chorób zakaźnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    // Zapobieganie otyłości tests
    it("should map 'Skąd się biorą ekologiczne produkty' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Skąd się biorą ekologiczne produkty" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Trzymaj formę' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Trzymaj formę" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Profilaktyka cukrzycy' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Profilaktyka cukrzycy" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Promocja zdrowego stylu życia' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Promocja zdrowego stylu życia" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Promocja zdrowego stylu życia - inne' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Promocja zdrowego stylu życia - inne" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should map 'Kampania EFSA' to Zapobieganie otyłości", () => {
      const row = { "Nazwa programu": "Kampania EFSA" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    // Profilaktyka uzależnień tests
    it("should map 'Bieg po zdrowie' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Bieg po zdrowie" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Czyste powietrze wokół nas' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Czyste powietrze wokół nas" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Porozmawiajmy o zdrowiu i nowych zagrożeniach' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Porozmawiajmy o zdrowiu i nowych zagrożeniach" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Ars - czyli jak dbać o miłość' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Ars - czyli jak dbać o miłość" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Profilaktyka palenia tytoniu' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Profilaktyka palenia tytoniu" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Światowy Dzień Rzucania Palenia' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Światowy Dzień Rzucania Palenia" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Profilaktyka używania napojów energetycznych' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Profilaktyka używania napojów energetycznych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Nowe narkotyki' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Nowe narkotyki" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    it("should map 'Światowy Dzień bez Tytoniu' to Profilaktyka uzależnień", () => {
      const row = { "Nazwa programu": "Światowy Dzień bez Tytoniu" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.PROFILAKTYKA_UZALEZNIENIA);
    });

    // HIV/AIDS tests
    it("should map 'HIV/AIDS' to HIV/AIDS", () => {
      const row = { "Nazwa programu": "HIV/AIDS" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });

    it("should map 'Światowy Dzień AIDS' to HIV/AIDS", () => {
      const row = { "Nazwa programu": "Światowy Dzień AIDS" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });

    // Inne tests
    it("should map 'Zdrowe zęby mamy, marchewkę zajadamy' to Inne", () => {
      const row = { "Nazwa programu": "Zdrowe zęby mamy, marchewkę zajadamy" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Higiena naszą tarczą' to Inne", () => {
      const row = { "Nazwa programu": "Higiena naszą tarczą" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Bezpieczne ferie' to Inne", () => {
      const row = { "Nazwa programu": "Bezpieczne ferie" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Radon' to Inne", () => {
      const row = { "Nazwa programu": "Radon" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Moja szkoła, zdrowa szkoła' to Inne", () => {
      const row = { "Nazwa programu": "Moja szkoła, zdrowa szkoła" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Profilaktyka wad postawy' to Inne", () => {
      const row = { "Nazwa programu": "Profilaktyka wad postawy" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Znamię, znam je' to Inne", () => {
      const row = { "Nazwa programu": "Znamię, znam je" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Światowy Dzień Wody' to Inne", () => {
      const row = { "Nazwa programu": "Światowy Dzień Wody" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Światowy Dzień Zdrowia' to Inne", () => {
      const row = { "Nazwa programu": "Światowy Dzień Zdrowia" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Bezpieczne Wakacje' to Inne", () => {
      const row = { "Nazwa programu": "Bezpieczne Wakacje" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Profilaktyka nowotworowa' to Inne", () => {
      const row = { "Nazwa programu": "Profilaktyka nowotworowa" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Profilaktyka nowotworowa - Profilaktyka raka piersi' to Inne", () => {
      const row = { "Nazwa programu": "Profilaktyka nowotworowa - Profilaktyka raka piersi" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Profilaktyka nowotworowa - Profilaktyka raka jąder' to Inne", () => {
      const row = { "Nazwa programu": "Profilaktyka nowotworowa - Profilaktyka raka jąder" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Cyberprzemoc' to Inne", () => {
      const row = { "Nazwa programu": "Cyberprzemoc" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should map 'Power Ukraina' to Inne", () => {
      const row = { "Nazwa programu": "Power Ukraina" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should default unknown programs to Inne", () => {
      // This is problematic behavior!
      // Unknown programs from Excel should ideally either:
      // 1. Return undefined/error
      // 2. Be logged as unknown
      // 3. Be excluded from indicators
      // Currently they're silently mapped to "Inne"
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

    it("should map program with special characters to correct category", () => {
      const row = { "Nazwa programu": "Profilaktyki chorób układu pokarmowego, w tym zatruć pokarmowych – salmonella, grzyby i inne" };
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
      const row = { "Nazwa programu": "  Podstępne WZW  " };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle complex row data", () => {
      const row = {
        "Typ programu": "Edukacja",
        "Nazwa programu": "Profilaktyka grypy",
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
      const row = { "Nazwa programu": "Promocja zdrowego stylu życia – inne" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.ZAPOBIEGANIE_OTYLOSCI);
    });

    it("should handle program name with non-breaking spaces", () => {
      const row = { "Nazwa programu": "Promocja\u00A0szczepień\u00A0ochronnych" };
      expect(getMainCategoryFromRow(row)).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle program name with mixed special characters", () => {
      const row = { "Nazwa programu": "Profilaktyka\u00A0grypy" };
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
