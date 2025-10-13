import { describe, it, expect, beforeEach } from "vitest";
import { izrzFormSchema, defaultFormValues, viewerDescriptionTemplates, type IzrzFormData } from "../izrzSchemas";

describe("izrzSchemas", () => {
  describe("izrzFormSchema", () => {
    let validFormData: IzrzFormData;

    beforeEach(() => {
      // Create a mock File object
      const mockFile = new File(["content"], "test.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      validFormData = {
        templateFile: mockFile,
        caseNumber: "123/2024",
        reportNumber: "RAP-001",
        programName: "Program Edukacyjny",
        taskType: "Prelekcja",
        address: "Szkoła Podstawowa nr 1",
        dateInput: "2024-01-15",
        viewerCount: 25,
        viewerCountDescription: "25 uczniów klasy VII",
        taskDescription: "Prelekcja o zdrowiu",
        additionalInfo: "Dodatkowe informacje",
        attendanceList: true,
        rozdzielnik: false,
      };
    });

    it("should validate correct form data", () => {
      const result = izrzFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validFormData);
      }
    });

    it("should require templateFile", () => {
      const invalidData = { ...validFormData, templateFile: undefined };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Szablon jest wymagany");
      }
    });

    it("should require caseNumber", () => {
      const invalidData = { ...validFormData, caseNumber: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Numer sprawy jest wymagany");
      }
    });

    it("should require reportNumber", () => {
      const invalidData = { ...validFormData, reportNumber: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Numer sprawozdania jest wymagany");
      }
    });

    it("should require programName", () => {
      const invalidData = { ...validFormData, programName: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nazwa programu jest wymagana");
      }
    });

    it("should require taskType", () => {
      const invalidData = { ...validFormData, taskType: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Typ zadania jest wymagany");
      }
    });

    it("should require address", () => {
      const invalidData = { ...validFormData, address: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Adres jest wymagany");
      }
    });

    it("should require dateInput", () => {
      const invalidData = { ...validFormData, dateInput: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Data jest wymagana");
      }
    });

    it("should require viewerCount to be greater than 0", () => {
      const invalidData = { ...validFormData, viewerCount: 0 };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Liczba widzów musi być większa niż 0");
      }
    });

    it("should require viewerCountDescription", () => {
      const invalidData = { ...validFormData, viewerCountDescription: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Opis liczby widzów jest wymagany");
      }
    });

    it("should require taskDescription", () => {
      const invalidData = { ...validFormData, taskDescription: "" };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Opis zadania jest wymagany");
      }
    });

    it("should allow optional additionalInfo", () => {
      const dataWithoutAdditionalInfo = { ...validFormData, additionalInfo: undefined };
      const result = izrzFormSchema.safeParse(dataWithoutAdditionalInfo);
      expect(result.success).toBe(true);
    });

    it("should allow optional attendanceList", () => {
      const dataWithoutAttendanceList = { ...validFormData, attendanceList: undefined };
      const result = izrzFormSchema.safeParse(dataWithoutAttendanceList);
      expect(result.success).toBe(true);
    });

    it("should allow optional rozdzielnik", () => {
      const dataWithoutRozdzielnik = { ...validFormData, rozdzielnik: undefined };
      const result = izrzFormSchema.safeParse(dataWithoutRozdzielnik);
      expect(result.success).toBe(true);
    });

    it("should handle negative viewerCount", () => {
      const invalidData = { ...validFormData, viewerCount: -5 };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Liczba widzów musi być większa niż 0");
      }
    });

    it("should handle multiple validation errors", () => {
      const invalidData = {
        templateFile: undefined,
        caseNumber: "",
        reportNumber: "",
        programName: "",
        taskType: "",
        address: "",
        dateInput: "",
        viewerCount: 0,
        viewerCountDescription: "",
        taskDescription: "",
      };
      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });

  describe("defaultFormValues", () => {
    it("should have correct default values", () => {
      expect(defaultFormValues).toEqual({
        caseNumber: "",
        reportNumber: "",
        programName: "",
        taskType: "",
        address: "",
        dateInput: "",
        viewerCount: 0,
        viewerCountDescription: "",
        taskDescription: "",
        additionalInfo: "",
        attendanceList: false,
        rozdzielnik: false,
      });
    });

    it("should not include templateFile in defaults", () => {
      expect(defaultFormValues).not.toHaveProperty("templateFile");
    });
  });

  describe("viewerDescriptionTemplates", () => {
    it("should have correct structure for all templates", () => {
      expect(Array.isArray(viewerDescriptionTemplates)).toBe(true);
      expect(viewerDescriptionTemplates.length).toBeGreaterThan(0);

      viewerDescriptionTemplates.forEach((template) => {
        expect(template).toHaveProperty("key");
        expect(template).toHaveProperty("label");
        expect(template).toHaveProperty("description");
        expect(typeof template.key).toBe("string");
        expect(typeof template.label).toBe("string");
        expect(typeof template.description).toBe("string");
        expect(template.key.length).toBeGreaterThan(0);
        expect(template.label.length).toBeGreaterThan(0);
        expect(template.description.length).toBeGreaterThan(0);
      });
    });

    it("should have unique keys", () => {
      const keys = viewerDescriptionTemplates.map((template) => template.key);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it("should have unique labels", () => {
      const labels = viewerDescriptionTemplates.map((template) => template.label);
      const uniqueLabels = new Set(labels);
      expect(labels.length).toBe(uniqueLabels.size);
    });

    it("should contain expected templates", () => {
      const templateKeys = viewerDescriptionTemplates.map((template) => template.key);
      expect(templateKeys).toContain("poz");
      expect(templateKeys).toContain("bezpieczne-wakacje");
      expect(templateKeys).toContain("higiena");
      expect(templateKeys).toContain("zdrowe-zeby");
      expect(templateKeys).toContain("swiatowy-dzien-bez-tytoniu");
    });

    it("should have meaningful descriptions", () => {
      viewerDescriptionTemplates.forEach((template) => {
        expect(template.description.length).toBeGreaterThan(50); // Descriptions should be substantial
        expect(template.description).toContain(" "); // Should contain spaces (not just one word)
      });
    });
  });
});
