import { describe, it, expect, vi } from "vitest";
import {
  transformSchoolsToOptions,
  transformContactsToOptions,
  transformProgramsToOptions,
  transformSchoolYearsToOptions,
  validateStudentCount,
  formatStudentCount,
  getCurrentSchoolYear,
  isValidSchoolYear,
  formatParticipationForSubmission,
  createDefaultFormValues,
} from "../index";
import type { School, Contact, Program } from "@/types";

describe("transformSchoolsToOptions", () => {
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

    const result = transformSchoolsToOptions(schools);

    expect(result).toEqual([
      { id: "1", name: "School A" },
      { id: "2", name: "School B" },
    ]);
  });

  it("should return empty array for empty schools", () => {
    const result = transformSchoolsToOptions([]);
    expect(result).toEqual([]);
  });
});

describe("transformContactsToOptions", () => {
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

    const result = transformContactsToOptions(contacts);

    expect(result).toEqual([
      { id: "1", name: "John Doe", firstName: "John", lastName: "Doe" },
      { id: "2", name: "Jane Smith", firstName: "Jane", lastName: "Smith" },
    ]);
  });

  it("should return empty array for empty contacts", () => {
    const result = transformContactsToOptions([]);
    expect(result).toEqual([]);
  });
});

describe("transformProgramsToOptions", () => {
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

    const result = transformProgramsToOptions(programs);

    expect(result).toEqual([
      { id: "1", name: "Program A", code: "PA" },
      { id: "2", name: "Program B", code: "PB" },
    ]);
  });

  it("should return empty array for empty programs", () => {
    const result = transformProgramsToOptions([]);
    expect(result).toEqual([]);
  });
});

describe("transformSchoolYearsToOptions", () => {
  it("should transform school years to select options", () => {
    const schoolYears = ["2024/2025", "2025/2026"];

    const result = transformSchoolYearsToOptions(schoolYears);

    expect(result).toEqual([
      { id: "2024/2025", name: "2024/2025" },
      { id: "2025/2026", name: "2025/2026" },
    ]);
  });

  it("should return empty array for empty school years", () => {
    const result = transformSchoolYearsToOptions([]);
    expect(result).toEqual([]);
  });
});

describe("validateStudentCount", () => {
  it("should validate valid student counts", () => {
    expect(validateStudentCount(0)).toBe(true);
    expect(validateStudentCount(100)).toBe(true);
    expect(validateStudentCount(10000)).toBe(true);
  });

  it("should reject invalid student counts", () => {
    expect(validateStudentCount(-1)).toBe(false);
    expect(validateStudentCount(10001)).toBe(false);
    expect(validateStudentCount(1.5)).toBe(false);
  });
});

describe("formatStudentCount", () => {
  it("should format student counts correctly", () => {
    expect(formatStudentCount(0)).toBe("Brak uczniów");
    expect(formatStudentCount(1)).toBe("1 uczeń");
    expect(formatStudentCount(2)).toBe("2 uczniów");
    expect(formatStudentCount(5)).toBe("5 uczniów");
    expect(formatStudentCount(25)).toBe("25 uczniów");
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

describe("formatParticipationForSubmission", () => {
  it("should format participation data for submission", () => {
    const data = {
      schoolId: "school1",
      programId: "program1",
      coordinatorId: "coord1",
      schoolYear: "2024/2025" as const,
      studentCount: 100,
      notes: "Test notes",
    };
    const userId = "user123";

    const result = formatParticipationForSubmission(data, userId);

    expect(result).toEqual({
      ...data,
      id: "",
      createdAt: expect.any(String),
      userId: "user123",
      reportSubmitted: false,
    });
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("should throw error for invalid data", () => {
    expect(() => formatParticipationForSubmission(null, "user123")).toThrow("Invalid participation data provided");
    expect(() => formatParticipationForSubmission({}, "")).toThrow("User ID is required");
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
