import { describe, it, expect } from "vitest";
import { createProgramSchema, editProgramSchema } from "../programSchemas";

describe("programSchemas", () => {
  describe("createProgramSchema", () => {
    it("validates a valid program", () => {
      const validData = {
        code: "PROG-2024-001",
        name: "Program Edukacyjny",
        programType: "programowy" as const,
        description: "Opis programu edukacyjnego",
      };

      const result = createProgramSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects missing code", () => {
      const invalidData = {
        code: "",
        name: "Program Edukacyjny",
        programType: "programowy" as const,
        description: "Opis programu edukacyjnego",
      };

      const result = createProgramSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("rejects missing name", () => {
      const invalidData = {
        code: "PROG-2024-001",
        name: "",
        programType: "programowy" as const,
        description: "Opis programu edukacyjnego",
      };

      const result = createProgramSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("rejects invalid programType", () => {
      const invalidData = {
        code: "PROG-2024-001",
        name: "Program Edukacyjny",
        programType: "invalid" as any,
        description: "Opis programu edukacyjnego",
      };

      const result = createProgramSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("accepts 'programowy' as programType", () => {
      const validData = {
        code: "PROG-2024-001",
        name: "Program Edukacyjny",
        programType: "programowy" as const,
        description: "Opis programu edukacyjnego",
      };

      const result = createProgramSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts 'nieprogramowy' as programType", () => {
      const validData = {
        code: "PROG-2024-001",
        name: "Program Edukacyjny",
        programType: "nieprogramowy" as const,
        description: "Opis programu edukacyjnego",
      };

      const result = createProgramSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects missing description", () => {
      const invalidData = {
        code: "PROG-2024-001",
        name: "Program Edukacyjny",
        programType: "programowy" as const,
        description: "",
      };

      const result = createProgramSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("editProgramSchema", () => {
    it("allows updating a program with id and all fields", () => {
      const validData = {
        id: "123",
        code: "PROG-2024-001",
        name: "Updated Program",
        programType: "programowy" as const,
        description: "Updated description",
      };

      const result = editProgramSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("requires id field", () => {
      const dataWithoutId = {
        code: "PROG-2024-001",
        name: "Program Edukacyjny",
        programType: "programowy" as const,
        description: "Opis programu edukacyjnego",
      };

      const result = editProgramSchema.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
    });

    it("validates fields when provided", () => {
      const dataWithInvalidType = {
        id: "123",
        programType: "invalid" as any,
      };

      const result = editProgramSchema.safeParse(dataWithInvalidType);
      expect(result.success).toBe(false);
    });
  });
});
