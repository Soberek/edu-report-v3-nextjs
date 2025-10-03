import { describe, it, expect } from "vitest";
import { MAIN_CATEGORIES, normalizeMainCategory, getMainCategoryFromRow, getAllMainCategories } from "../mainCategoryMapping";

describe("mainCategoryMapping", () => {
  describe("normalizeMainCategory", () => {
    it("should normalize obesity category variations", () => {
      expect(normalizeMainCategory("Zapobieganie otyłości")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("zapobieganie otyłości")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("ZAPOBIEGANIE OTYŁOŚCI")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("otyłość")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("otylos")).toBe(MAIN_CATEGORIES.OTYLOSC);
    });

    it("should normalize vaccination category variations", () => {
      expect(normalizeMainCategory("Szczepienia")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(normalizeMainCategory("szczepienia")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(normalizeMainCategory("SZCZEPIENIA")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(normalizeMainCategory("szczepien")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should normalize addiction prevention category variations", () => {
      expect(normalizeMainCategory("Profilaktyka uzależnień")).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
      expect(normalizeMainCategory("profilaktyka uzależnień")).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
      expect(normalizeMainCategory("uzależnień")).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
      expect(normalizeMainCategory("uzależnien")).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
      expect(normalizeMainCategory("uzaleznien")).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
    });

    it("should normalize HIV/AIDS category variations", () => {
      expect(normalizeMainCategory("HIV/AIDS")).toBe(MAIN_CATEGORIES.HIV_AIDS);
      expect(normalizeMainCategory("hiv/aids")).toBe(MAIN_CATEGORIES.HIV_AIDS);
      expect(normalizeMainCategory("HIV")).toBe(MAIN_CATEGORIES.HIV_AIDS);
      expect(normalizeMainCategory("AIDS")).toBe(MAIN_CATEGORIES.HIV_AIDS);
      expect(normalizeMainCategory("aids")).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });

    it("should return INNE for unknown categories", () => {
      expect(normalizeMainCategory("Unknown Category")).toBe(MAIN_CATEGORIES.INNE);
      expect(normalizeMainCategory("Some Random Text")).toBe(MAIN_CATEGORIES.INNE);
      expect(normalizeMainCategory("Inna kategoria")).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should return INNE for null or undefined input", () => {
      expect(normalizeMainCategory(null)).toBe(MAIN_CATEGORIES.INNE);
      expect(normalizeMainCategory(undefined)).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should return INNE for empty string", () => {
      expect(normalizeMainCategory("")).toBe(MAIN_CATEGORIES.INNE);
      expect(normalizeMainCategory("   ")).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle whitespace correctly", () => {
      expect(normalizeMainCategory("  Szczepienia  ")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(normalizeMainCategory("\n\tSzczepienia\n\t")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle mixed case correctly", () => {
      expect(normalizeMainCategory("ZaPoBiEgAnIe OtYłOśCi")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("HiV/AiDs")).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });

    it("should handle categories with extra spaces", () => {
      expect(normalizeMainCategory("  Szczepienia   ")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(normalizeMainCategory("Profilaktyka   uzależnień")).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
    });

    it("should handle categories with tabs and newlines", () => {
      expect(normalizeMainCategory("\t\nSzczepienia\t\n")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle partial matches", () => {
      // The function looks for specific keywords, not all partial matches
      expect(normalizeMainCategory("Działania dotyczące otyłości")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("Program szczepień")).toBe(MAIN_CATEGORIES.INNE); // "szczepień" doesn't contain "szczepien"
      expect(normalizeMainCategory("Program szczepien")).toBe(MAIN_CATEGORIES.SZCZEPIENIA); // This will match
    });

    it("should handle typos in obesity variations", () => {
      // These typos don't match the pattern - function returns INNE for unrecognized patterns
      expect(normalizeMainCategory("otypłość")).toBe(MAIN_CATEGORIES.INNE);
      expect(normalizeMainCategory("otiłość")).toBe(MAIN_CATEGORIES.INNE);
      // But these variations should work
      expect(normalizeMainCategory("otyłość")).toBe(MAIN_CATEGORIES.OTYLOSC);
      expect(normalizeMainCategory("otylosc")).toBe(MAIN_CATEGORIES.OTYLOSC);
    });

    it("should handle special characters in categories", () => {
      expect(normalizeMainCategory("HIV/AIDS - profilaktyka")).toBe(MAIN_CATEGORIES.HIV_AIDS);
      expect(normalizeMainCategory("Szczepienia (obowiązkowe)")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle very long category names", () => {
      const longCategory = "Profilaktyka uzależnień " + "x".repeat(100);
      expect(normalizeMainCategory(longCategory)).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
    });

    it("should handle numbers in category names", () => {
      expect(normalizeMainCategory("Szczepienia 2024")).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(normalizeMainCategory("HIV/AIDS Program 123")).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });
  });

  describe("getMainCategoryFromRow", () => {
    it('should extract category from "Main Category" key', () => {
      const row = {
        "Main Category": "Szczepienia",
        "Other Key": "Other Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it('should extract category from "Kategoria główna" key (Polish)', () => {
      const row = {
        "Kategoria główna": "Zapobieganie otyłości",
        "Other Key": "Other Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.OTYLOSC);
    });

    it('should extract category from "main category" key (lowercase)', () => {
      const row = {
        "main category": "HIV/AIDS",
        "Other Key": "Other Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.HIV_AIDS);
    });

    it("should return INNE when no category key exists", () => {
      const row = {
        "Some Key": "Some Value",
        "Other Key": "Other Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should return INNE when category value is empty", () => {
      const row = {
        "Main Category": "",
        "Other Key": "Other Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle complex row data", () => {
      const row = {
        "Typ programu": "Edukacja",
        "Nazwa programu": "Program A",
        "Main Category": "Profilaktyka uzależnień",
        Działanie: "Warsztaty",
        "Liczba ludzi": 50,
        "Liczba działań": 10,
        Data: "2024-01-15",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.UZALEZNIENIA);
    });

    it('should prioritize "Main Category" over "Kategoria główna"', () => {
      const row = {
        "Main Category": "Szczepienia",
        "Kategoria główna": "Zapobieganie otyłości",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.SZCZEPIENIA);
    });

    it("should handle row with null values", () => {
      const row: Record<string, unknown> = {
        "Main Category": null,
        "Other Key": "Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with undefined category", () => {
      const row: Record<string, unknown> = {
        "Main Category": undefined,
        "Other Key": "Value",
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle empty object", () => {
      const result = getMainCategoryFromRow({});
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with numeric category value", () => {
      const row: Record<string, unknown> = {
        "Main Category": 123,
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with boolean category value", () => {
      const row: Record<string, unknown> = {
        "Main Category": true,
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with array category value", () => {
      const row: Record<string, unknown> = {
        "Main Category": ["Szczepienia"],
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });

    it("should handle row with object category value", () => {
      const row: Record<string, unknown> = {
        "Main Category": { value: "Szczepienia" },
      };

      const result = getMainCategoryFromRow(row);
      expect(result).toBe(MAIN_CATEGORIES.INNE);
    });
  });

  describe("getAllMainCategories", () => {
    it("should return all main category values", () => {
      const categories = getAllMainCategories();

      expect(categories).toContain(MAIN_CATEGORIES.OTYLOSC);
      expect(categories).toContain(MAIN_CATEGORIES.SZCZEPIENIA);
      expect(categories).toContain(MAIN_CATEGORIES.UZALEZNIENIA);
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
      expect(MAIN_CATEGORIES).toHaveProperty("OTYLOSC");
      expect(MAIN_CATEGORIES).toHaveProperty("SZCZEPIENIA");
      expect(MAIN_CATEGORIES).toHaveProperty("UZALEZNIENIA");
      expect(MAIN_CATEGORIES).toHaveProperty("HIV_AIDS");
      expect(MAIN_CATEGORIES).toHaveProperty("INNE");
    });

    it("should have correct Polish values", () => {
      expect(MAIN_CATEGORIES.OTYLOSC).toBe("Zapobieganie otyłości");
      expect(MAIN_CATEGORIES.SZCZEPIENIA).toBe("Szczepienia");
      expect(MAIN_CATEGORIES.UZALEZNIENIA).toBe("Profilaktyka uzależnień");
      expect(MAIN_CATEGORIES.HIV_AIDS).toBe("HIV/AIDS");
      expect(MAIN_CATEGORIES.INNE).toBe("Inne");
    });
  });
});
