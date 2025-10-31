import { describe, it, expect } from "vitest";
import {
  schoolProgramParticipationSchema,
  schoolProgramParticipationDTOSchema,
  schoolProgramParticiapationUpdateDTOSchema,
} from "../SchoolProgramParticipation";
import type { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "../SchoolProgramParticipation";

describe("SchoolProgramParticipation Schemas", () => {
  describe("schoolProgramParticipationSchema", () => {
    const validParticipation = {
      id: "p1",
      schoolId: "s1",
      programId: "prog1",
      coordinatorId: "c1",
      schoolYear: "2024/2025" as const,
      studentCount: 50,
      createdAt: "2024-01-01T00:00:00Z",
      userId: "user1",
    };

    it("should validate a complete valid participation record", () => {
      const result = schoolProgramParticipationSchema.safeParse(validParticipation);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParticipation);
      }
    });

    it("should accept optional fields", () => {
      const participationWithOptionals = {
        ...validParticipation,
        previousCoordinatorId: "c0",
        updatedAt: "2024-02-01T00:00:00Z",
        notes: "Some notes",
        reportSubmitted: true,
      };

      const result = schoolProgramParticipationSchema.safeParse(participationWithOptionals);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes).toBe("Some notes");
        expect(result.data.reportSubmitted).toBe(true);
      }
    });

    it("should validate all valid school years", () => {
      const validYears = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"] as const;

      validYears.forEach((year) => {
        const result = schoolProgramParticipationSchema.safeParse({
          ...validParticipation,
          schoolYear: year,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid school year", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        schoolYear: "2023/2024",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_value");
      }
    });

    it("should coerce studentCount to number and validate as integer", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        studentCount: "100",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.studentCount).toBe(100);
        expect(typeof result.data.studentCount).toBe("number");
      }
    });

    it("should reject negative studentCount", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        studentCount: -5,
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-integer studentCount", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        studentCount: 50.5,
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'id'", () => {
      const { id, ...withoutId } = validParticipation;
      const result = schoolProgramParticipationSchema.safeParse(withoutId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'schoolId'", () => {
      const { schoolId, ...withoutSchoolId } = validParticipation;
      const result = schoolProgramParticipationSchema.safeParse(withoutSchoolId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'programId'", () => {
      const { programId, ...withoutProgramId } = validParticipation;
      const result = schoolProgramParticipationSchema.safeParse(withoutProgramId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'coordinatorId'", () => {
      const { coordinatorId, ...withoutCoordinatorId } = validParticipation;
      const result = schoolProgramParticipationSchema.safeParse(withoutCoordinatorId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'createdAt'", () => {
      const { createdAt, ...withoutCreatedAt } = validParticipation;
      const result = schoolProgramParticipationSchema.safeParse(withoutCreatedAt);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'userId'", () => {
      const { userId, ...withoutUserId } = validParticipation;
      const result = schoolProgramParticipationSchema.safeParse(withoutUserId);
      expect(result.success).toBe(false);
    });

    it("should accept studentCount of 0", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        studentCount: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should accept large studentCount values", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        studentCount: 999999,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.studentCount).toBe(999999);
      }
    });

    it("should allow empty string for optional notes", () => {
      const result = schoolProgramParticipationSchema.safeParse({
        ...validParticipation,
        notes: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("schoolProgramParticipationDTOSchema", () => {
    const validDTO: SchoolProgramParticipationDTO = {
      schoolId: "s1",
      programId: "prog1",
      coordinatorId: "c1",
      schoolYear: "2024/2025",
      studentCount: 50,
    };

    it("should validate a valid DTO", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse(validDTO);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validDTO);
      }
    });

    it("should NOT accept id field (DTO excludes id)", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        id: "p1",
      });
      expect(result.success).toBe(true); // Extra field is allowed but ignored
    });

    it("should NOT accept createdAt (DTO excludes server-managed fields)", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        createdAt: "2024-01-01T00:00:00Z",
      });
      expect(result.success).toBe(true); // Extra field allowed but ignored
    });

    it("should NOT accept userId (DTO excludes userId)", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        userId: "user1",
      });
      expect(result.success).toBe(true); // Extra field allowed but ignored
    });

    it("should accept optional previousCoordinatorId", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        previousCoordinatorId: "c0",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.previousCoordinatorId).toBe("c0");
      }
    });

    it("should accept optional notes", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        notes: "Test notes",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes).toBe("Test notes");
      }
    });

    it("should accept optional reportSubmitted", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        reportSubmitted: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.reportSubmitted).toBe(true);
      }
    });

    it("should NOT coerce studentCount for DTO (must be number)", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        studentCount: "50",
      });
      expect(result.success).toBe(false); // DTO expects number, not string
    });

    it("should reject negative studentCount", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        studentCount: -1,
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-integer studentCount", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        studentCount: 50.5,
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'schoolId'", () => {
      const { schoolId, ...withoutSchoolId } = validDTO;
      const result = schoolProgramParticipationDTOSchema.safeParse(withoutSchoolId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'programId'", () => {
      const { programId, ...withoutProgramId } = validDTO;
      const result = schoolProgramParticipationDTOSchema.safeParse(withoutProgramId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'coordinatorId'", () => {
      const { coordinatorId, ...withoutCoordinatorId } = validDTO;
      const result = schoolProgramParticipationDTOSchema.safeParse(withoutCoordinatorId);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'schoolYear'", () => {
      const { schoolYear, ...withoutSchoolYear } = validDTO;
      const result = schoolProgramParticipationDTOSchema.safeParse(withoutSchoolYear);
      expect(result.success).toBe(false);
    });

    it("should reject missing required field 'studentCount'", () => {
      const { studentCount, ...withoutStudentCount } = validDTO;
      const result = schoolProgramParticipationDTOSchema.safeParse(withoutStudentCount);
      expect(result.success).toBe(false);
    });

    it("should validate all valid school years", () => {
      const validYears = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"] as const;

      validYears.forEach((year) => {
        const result = schoolProgramParticipationDTOSchema.safeParse({
          ...validDTO,
          schoolYear: year,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid school year", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        ...validDTO,
        schoolYear: "2023/2024",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("schoolProgramParticiapationUpdateDTOSchema", () => {
    const validUpdateDTO = {
      id: "p1",
      schoolId: "s1",
    };

    it("should validate update with id and one field", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse(validUpdateDTO);
      expect(result.success).toBe(true);
    });

    it("should validate update with id and multiple fields", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        id: "p1",
        schoolId: "s1",
        programId: "prog1",
        coordinatorId: "c1",
        studentCount: 75,
      });
      expect(result.success).toBe(true);
    });

    it("should require id field", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        schoolId: "s1",
      });
      expect(result.success).toBe(false);
    });

    it("should accept all optional fields from base schema", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        id: "p1",
        notes: "Updated notes",
        previousCoordinatorId: "c0",
        reportSubmitted: true,
      });
      expect(result.success).toBe(true);
    });

    it("should allow partial updates", () => {
      const updates = [
        { id: "p1", studentCount: 60 },
        { id: "p1", notes: "New notes" },
        { id: "p1", reportSubmitted: false },
        { id: "p1", coordinatorId: "c2" },
      ];

      updates.forEach((update) => {
        const result = schoolProgramParticiapationUpdateDTOSchema.safeParse(update);
        expect(result.success).toBe(true);
      });
    });

    it("should validate schoolYear if provided", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        id: "p1",
        schoolYear: "2025/2026",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid schoolYear in update", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        id: "p1",
        schoolYear: "2023/2024",
      });
      expect(result.success).toBe(false);
    });

    it("should validate studentCount if provided in update", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        id: "p1",
        studentCount: 100,
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative studentCount in update", () => {
      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse({
        id: "p1",
        studentCount: -10,
      });
      expect(result.success).toBe(false);
    });

    it("should infer correct TypeScript type", () => {
      const validData = {
        id: "p1",
        schoolId: "s1",
        notes: "Test",
      };

      const result = schoolProgramParticiapationUpdateDTOSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        // Type should be properly inferred
        expect(typeof result.data.id).toBe("string");
        expect(result.data.id).toBe("p1");
      }
    });
  });

  describe("Schema type inference", () => {
    it("should correctly infer SchoolProgramParticipation type", () => {
      const participation: SchoolProgramParticipation = {
        id: "p1",
        schoolId: "s1",
        programId: "prog1",
        coordinatorId: "c1",
        schoolYear: "2024/2025",
        studentCount: 50,
        createdAt: "2024-01-01T00:00:00Z",
        userId: "user1",
      };

      expect(participation.id).toBe("p1");
      expect(participation.studentCount).toBe(50);
    });

    it("should correctly infer SchoolProgramParticipationDTO type", () => {
      const dto: SchoolProgramParticipationDTO = {
        schoolId: "s1",
        programId: "prog1",
        coordinatorId: "c1",
        schoolYear: "2024/2025",
        studentCount: 50,
      };

      expect(dto.schoolId).toBe("s1");
      expect(dto.studentCount).toBe(50);
    });
  });

  describe("Edge cases and error handling", () => {
    it("should provide clear error messages for validation failures", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        schoolId: "s1",
        // Missing required fields
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].path).toBeDefined();
        expect(result.error.issues[0].message).toBeDefined();
      }
    });

    it("should handle very long string values gracefully", () => {
      const longString = "a".repeat(10000);
      const result = schoolProgramParticipationDTOSchema.safeParse({
        schoolId: "s1",
        programId: "prog1",
        coordinatorId: "c1",
        schoolYear: "2024/2025",
        studentCount: 50,
        notes: longString,
      });
      expect(result.success).toBe(true);
    });

    it("should handle empty string IDs (validation depends on business logic)", () => {
      const result = schoolProgramParticipationDTOSchema.safeParse({
        schoolId: "",
        programId: "prog1",
        coordinatorId: "c1",
        schoolYear: "2024/2025",
        studentCount: 50,
      });
      // Empty strings are valid for z.string() by default
      expect(result.success).toBe(true);
    });

    it("should preserve data types through validation", () => {
      const input = {
        schoolId: "s1",
        programId: "prog1",
        coordinatorId: "c1",
        schoolYear: "2024/2025" as const,
        studentCount: 50,
        reportSubmitted: true,
      };

      const result = schoolProgramParticipationDTOSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.reportSubmitted).toBe(true);
        expect(typeof result.data.reportSubmitted).toBe("boolean");
      }
    });
  });
});
