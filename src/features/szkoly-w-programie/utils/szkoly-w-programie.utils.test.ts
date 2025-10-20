
import { describe, it, expect } from "vitest";
import { filterBySchoolYear, filterByProgram, createSchoolParticipationsMap } from "./szkoly-w-programie.utils";
import type { SchoolProgramParticipation } from "@/types";

// --- Mock Data ---
const mockParticipations: SchoolProgramParticipation[] = [
  {
    id: "p1",
    schoolId: "s1",
    programId: "prog1",
    schoolYear: "2024/2025",
    studentCount: 100,
    coordinatorId: "coord1",
    createdAt: "2024-01-01T00:00:00.000Z",
    userId: "user1",
  },
  {
    id: "p2",
    schoolId: "s2",
    programId: "prog2",
    schoolYear: "2024/2025",
    studentCount: 150,
    coordinatorId: "coord2",
    createdAt: "2024-01-02T00:00:00.000Z",
    userId: "user2",
  },
  {
    id: "p3",
    schoolId: "s1",
    programId: "prog2",
    schoolYear: "2025/2026",
    studentCount: 120,
    coordinatorId: "coord1",
    createdAt: "2025-01-01T00:00:00.000Z",
    userId: "user1",
  },
  {
    id: "p4",
    schoolId: "s3",
    programId: "prog3",
    schoolYear: "2025/2026",
    studentCount: 200,
    coordinatorId: "coord3",
    createdAt: "2025-01-02T00:00:00.000Z",
    userId: "user3",
  },
];

// --- Tests ---

describe("szkoly-w-programie.utils", () => {

  // Test for filterBySchoolYear
  describe("filterBySchoolYear", () => {
    it("should return all participations when schoolYear is 'all'", () => {
      const result = filterBySchoolYear(mockParticipations, "all");
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockParticipations);
    });

    it("should return only participations for the specified school year", () => {
      const result = filterBySchoolYear(mockParticipations, "2024/2025");
      expect(result).toHaveLength(2);
      expect(result.every(p => p.schoolYear === "2024/2025")).toBe(true);
      expect(result.map(p => p.id)).toEqual(["p1", "p2"]);
    });

    it("should return an empty array if no participations match the school year", () => {
      const result = filterBySchoolYear(mockParticipations, "2023/2024");
      expect(result).toHaveLength(0);
    });
  });

  // Test for filterByProgram
  describe("filterByProgram", () => {
    it("should return all participations when programId is 'all'", () => {
      const result = filterByProgram(mockParticipations, "all");
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockParticipations);
    });

    it("should return only participations for the specified program", () => {
      const result = filterByProgram(mockParticipations, "prog2");
      expect(result).toHaveLength(2);
      expect(result.every(p => p.programId === "prog2")).toBe(true);
      expect(result.map(p => p.id)).toEqual(["p2", "p3"]);
    });

    it("should return an empty array if no participations match the program", () => {
      const result = filterByProgram(mockParticipations, "prog4");
      expect(result).toHaveLength(0);
    });
  });

  // Test for createSchoolParticipationsMap
  describe("createSchoolParticipationsMap", () => {
    it("should create a map of schoolId to an array of programIds", () => {
      const result = createSchoolParticipationsMap(mockParticipations);
      expect(result).toEqual({
        s1: ["prog1", "prog2"],
        s2: ["prog2"],
        s3: ["prog3"],
      });
    });

    it("should return an empty object if given no participations", () => {
      const result = createSchoolParticipationsMap([]);
      expect(result).toEqual({});
    });

    it("should handle participations with missing properties gracefully", () => {
      const incompleteData: Partial<SchoolProgramParticipation>[] = [
        { id: "p1", schoolId: "s1", programId: "prog1" },
        { id: "p2", schoolId: "s1" }, // Missing programId
        { id: "p3", programId: "prog2" }, // Missing schoolId
      ];
      const result = createSchoolParticipationsMap(incompleteData as unknown as SchoolProgramParticipation[]);
      expect(result).toEqual({ s1: ["prog1", undefined] });
    });
  });
});
