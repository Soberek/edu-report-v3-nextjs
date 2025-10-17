import { describe, it, expect } from "vitest";
import { createSchoolSchema, editSchoolSchema } from "../schoolSchemas";

describe("schoolSchemas", () => {
  describe("createSchoolSchema", () => {
    it("validates a valid school", () => {
      const validData = {
        name: "Szkoła Podstawowa Nr. 1",
        email: "school@example.com",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00-001",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects missing name", () => {
      const invalidData = {
        name: "",
        email: "school@example.com",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00-001",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const invalidData = {
        name: "Szkoła Podstawowa Nr. 1",
        email: "invalid-email",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00-001",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid postal code format", () => {
      const invalidData = {
        name: "Szkoła Podstawowa Nr. 1",
        email: "school@example.com",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "invalid",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("rejects postal code without hyphen", () => {
      const invalidData = {
        name: "Szkoła Podstawowa Nr. 1",
        email: "school@example.com",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00001",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("rejects empty school type array", () => {
      const invalidData = {
        name: "Szkoła Podstawowa Nr. 1",
        email: "school@example.com",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00-001",
        municipality: "Warszawa",
        type: [],
      };

      const result = createSchoolSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("trims whitespace from string fields", () => {
      const dataWithWhitespace = {
        name: "  Szkoła Podstawowa Nr. 1  ",
        email: "  school@example.com  ",
        address: "  ul. Główna 1  ",
        city: "  Warszawa  ",
        postalCode: "  00-001  ",
        municipality: "  Warszawa  ",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Szkoła Podstawowa Nr. 1");
        expect(result.data.email).toBe("school@example.com");
      }
    });

    it("converts email to lowercase", () => {
      const dataWithUppercaseEmail = {
        name: "Szkoła Podstawowa Nr. 1",
        email: "SCHOOL@EXAMPLE.COM",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00-001",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(dataWithUppercaseEmail);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("school@example.com");
      }
    });

    it("enforces maximum field lengths", () => {
      const tooLongName = {
        name: "A".repeat(256),
        email: "school@example.com",
        address: "ul. Główna 1",
        city: "Warszawa",
        postalCode: "00-001",
        municipality: "Warszawa",
        type: ["Szkoła podstawowa"],
      };

      const result = createSchoolSchema.safeParse(tooLongName);
      expect(result.success).toBe(false);
    });
  });

  describe("editSchoolSchema", () => {
    it("allows partial updates", () => {
      const partialData = {
        name: "Updated School Name",
      };

      const result = editSchoolSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("validates all fields when provided", () => {
      const completeData = {
        name: "Updated School",
        email: "updated@example.com",
        address: "ul. Nowa 2",
        city: "Kraków",
        postalCode: "31-001",
        municipality: "Kraków",
        type: ["Szkoła podstawowa"],
      };

      const result = editSchoolSchema.safeParse(completeData);
      expect(result.success).toBe(true);
    });
  });
});
