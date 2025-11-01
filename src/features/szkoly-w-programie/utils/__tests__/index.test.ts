import { describe, it, expect, vi } from "vitest";
import {
  createSchoolOptions,
  createContactOptions,
  createProgramOptions,
  createSchoolYearOptions,
  isValidStudentCount,
  getCurrentSchoolYear,
  isValidSchoolYear,
  createDefaultFormValues,
  mapParticipationsForDisplay,
} from "../index";
import type { School, Contact, Program } from "@/types";
import type { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";

describe("createSchoolOptions", () => {
  it("should transform schools to select options", () => {
    const schools: School[] = [
      {
        id: "1",
        name: "School A",
        address: "Address 1",
        city: "City 1",
        postalCode: "00-000",
        municipality: "Municipality 1",
        email: "school1@example.com",
        type: ["Szkoła podstawowa"],
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        name: "School B",
        address: "Address 2",
        city: "City 2",
        postalCode: "00-000",
        municipality: "Municipality 2",
        email: "school2@example.com",
        type: ["Liceum"],
        createdAt: "2024-01-01",
      },
    ];

    const result = createSchoolOptions(schools);

    expect(result).toEqual([
      { id: "1", name: "School A" },
      { id: "2", name: "School B" },
    ]);
  });

  it("should return empty array for empty schools", () => {
    const result = createSchoolOptions([]);
    expect(result).toEqual([]);
  });
});

describe("createContactOptions", () => {
  it("should transform contacts to select options", () => {
    const contacts: Contact[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-789",
        createdAt: "2024-01-01",
        userId: "user1",
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "987-654-321",
        createdAt: "2024-01-01",
        userId: "user1",
      },
    ];

    const result = createContactOptions(contacts);

    expect(result).toEqual([
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
    ]);
  });

  it("should return empty array for empty contacts", () => {
    const result = createContactOptions([]);
    expect(result).toEqual([]);
  });
});

describe("createProgramOptions", () => {
  it("should transform programs to select options", () => {
    const programs: Program[] = [
      {
        id: "1",
        name: "Program A",
        code: "PA",
        programType: "programowy",
        description: "Description A",
      },
      {
        id: "2",
        name: "Program B",
        code: "PB",
        programType: "nieprogramowy",
        description: "Description B",
      },
    ];

    const result = createProgramOptions(programs);

    expect(result).toEqual([
      { id: "1", name: "Program A" },
      { id: "2", name: "Program B" },
    ]);
  });

  it("should return empty array for empty programs", () => {
    const result = createProgramOptions([]);
    expect(result).toEqual([]);
  });
});

describe("createSchoolYearOptions", () => {
  it("should transform school years to select options", () => {
    const schoolYears = ["2024/2025", "2025/2026"];

    const result = createSchoolYearOptions(schoolYears);

    expect(result).toEqual([
      { id: "2024/2025", name: "2024/2025" },
      { id: "2025/2026", name: "2025/2026" },
    ]);
  });

  it("should return empty array for empty school years", () => {
    const result = createSchoolYearOptions([]);
    expect(result).toEqual([]);
  });
});

describe("isValidStudentCount", () => {
  it("should validate valid student counts", () => {
    expect(isValidStudentCount(0)).toBe(true);
    expect(isValidStudentCount(100)).toBe(true);
    expect(isValidStudentCount(10000)).toBe(true);
  });

  it("should reject invalid student counts", () => {
    expect(isValidStudentCount(-1)).toBe(false);
    expect(isValidStudentCount(10001)).toBe(false);
    expect(isValidStudentCount(1.5)).toBe(false);
  });
});

describe("getCurrentSchoolYear", () => {
  it("should return current school year", () => {
    // Mock current date to September 2024
    const mockDate = new Date("2024-09-01");
    vi.setSystemTime(mockDate);

    const result = getCurrentSchoolYear();
    expect(result).toBe("2024/2025");

    vi.restoreAllMocks();
  });

  it("should return previous school year when before September", () => {
    // Mock current date to January 2025
    const mockDate = new Date("2025-01-01");
    vi.setSystemTime(mockDate);

    const result = getCurrentSchoolYear();
    expect(result).toBe("2024/2025");

    vi.restoreAllMocks();
  });
});

describe("isValidSchoolYear", () => {
  it("should validate valid school years", () => {
    expect(isValidSchoolYear("2024/2025")).toBe(true);
    expect(isValidSchoolYear("2025/2026")).toBe(true);
    expect(isValidSchoolYear("2026/2027")).toBe(true);
    expect(isValidSchoolYear("2027/2028")).toBe(true);
  });

  it("should reject invalid school years", () => {
    expect(isValidSchoolYear("2023/2024")).toBe(false);
    expect(isValidSchoolYear("invalid")).toBe(false);
    expect(isValidSchoolYear("")).toBe(false);
  });
});

describe("createDefaultFormValues", () => {
  it("should create default form values", () => {
    const result = createDefaultFormValues();

    expect(result).toEqual({
      id: "",
      schoolId: "",
      programId: "",
      coordinatorId: "",
      previousCoordinatorId: "",
      schoolYear: expect.any(String),
      studentCount: 0,
      notes: "",
      createdAt: "",
      userId: "",
      reportSubmitted: false,
    });
    expect(["2024/2025", "2025/2026", "2026/2027", "2027/2028"]).toContain(result.schoolYear);
  });
});

describe("mapParticipationsForDisplay", () => {
  it("should map participations for display with coordinator contact info", () => {
    const participations: SchoolProgramParticipation[] = [
      {
        id: "1",
        schoolId: "school1",
        programId: "program1",
        coordinatorId: "coord1",
        schoolYear: "2024/2025",
        studentCount: 100,
        notes: "Test notes",
        createdAt: "2024-01-01",
        userId: "user1",
        reportSubmitted: false,
      },
    ];

    const schoolsMap = {
      school1: { id: "school1", name: "Test School" } as School,
    };

    const programsMap = {
      program1: { id: "program1", name: "Test Program" } as Program,
    };

    const contactsMap = {
      coord1: {
        id: "coord1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-789",
      } as Contact,
    };

    const result = mapParticipationsForDisplay(participations, schoolsMap, contactsMap, programsMap);

    expect(result).toEqual([
      {
        ...participations[0],
        schoolName: "Test School",
        programName: "Test Program",
        coordinatorName: "John Doe",
        coordinatorEmail: "john@example.com",
        coordinatorPhone: "123-456-789",
      },
    ]);
  });

  it("should handle missing coordinator data", () => {
    const participations: SchoolProgramParticipation[] = [
      {
        id: "1",
        schoolId: "school1",
        programId: "program1",
        coordinatorId: "coord1",
        schoolYear: "2024/2025",
        studentCount: 100,
        notes: "Test notes",
        createdAt: "2024-01-01",
        userId: "user1",
        reportSubmitted: false,
      },
    ];

    const schoolsMap = {
      school1: { id: "school1", name: "Test School" } as School,
    };

    const programsMap = {
      program1: { id: "program1", name: "Test Program" } as Program,
    };

    const contactsMap = {}; // Empty contacts map

    const result = mapParticipationsForDisplay(participations, schoolsMap, contactsMap, programsMap);

    expect(result).toEqual([
      {
        ...participations[0],
        schoolName: "Test School",
        programName: "Test Program",
        coordinatorName: "N/A",
        coordinatorEmail: undefined,
        coordinatorPhone: undefined,
      },
    ]);
  });
});
