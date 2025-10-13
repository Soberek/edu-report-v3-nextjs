import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTaskNumberManager } from "../useTaskNumberManager";
import type { EducationalTask } from "@/types";

// Mock the taskNumberUtils
vi.mock("../../utils/taskNumberUtils", () => ({
  parseTaskNumber: vi.fn((taskNumber: string) => {
    if (taskNumber === "1/2025") return { number: 1, year: 2025 };
    if (taskNumber === "2/2025") return { number: 2, year: 2025 };
    if (taskNumber === "5/2024") return { number: 5, year: 2024 };
    return null;
  }),
  suggestNextTaskNumber: vi.fn(() => "3/2025"),
  getSuggestionsForYear: vi.fn(() => ["3/2025", "4/2025", "5/2025"]),
  generateTaskNumberSuggestions: vi.fn(() => ["3/2025", "4/2025", "5/2025"]),
  validateTaskNumber: vi.fn((taskNumber: string, tasks: EducationalTask[], editTaskId?: string) => {
    // If editing and task number matches the task being edited, it should be valid
    if (editTaskId && taskNumber === "1/2025") {
      return { isValid: true, errorMessage: undefined };
    }
    // Otherwise, 1/2025 is taken
    return {
      isValid: taskNumber !== "1/2025",
      errorMessage: taskNumber === "1/2025" ? "Numer już istnieje" : undefined,
    };
  }),
  getCurrentYear: vi.fn(() => 2025),
  isValidTaskNumberFormat: vi.fn((taskNumber: string) => /^\d+\/\d{4}$/.test(taskNumber)),
}));

const mockTasks: EducationalTask[] = [
  {
    id: "task-1",
    title: "Test Task 1",
    programName: "Test Program",
    date: "2025-01-15",
    schoolId: "school-1",
    taskNumber: "1/2025",
    referenceNumber: "TEST.001.2025",
    activities: [],
    createdBy: "user-1",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "task-2",
    title: "Test Task 2",
    programName: "Test Program",
    date: "2025-01-16",
    schoolId: "school-2",
    taskNumber: "2/2025",
    referenceNumber: "TEST.002.2025",
    activities: [],
    createdBy: "user-1",
    createdAt: "2025-01-16T10:00:00Z",
  },
];

describe("useTaskNumberManager", () => {
  it("should initialize with current task number", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "1/2025",
      })
    );

    expect(result.current.year).toBe(2025);
    expect(result.current.isValid).toBe(false); // 1/2025 is taken
    expect(result.current.errorMessage).toBe("Numer już istnieje");
  });

  it("should initialize with initial year when no current task number", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "",
        initialYear: 2024,
      })
    );

    expect(result.current.year).toBe(2024);
  });

  it("should provide suggestions for the current year", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "3/2025",
      })
    );

    expect(result.current.suggestions).toEqual(["3/2025", "4/2025", "5/2025"]);
  });

  it("should validate task numbers correctly", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "3/2025",
      })
    );

    // Test valid number
    const validResult = result.current.validateNumber("3/2025");
    expect(validResult.isValid).toBe(true);
    expect(validResult.errorMessage).toBeUndefined();

    // Test taken number
    const takenResult = result.current.validateNumber("1/2025");
    expect(takenResult.isValid).toBe(false);
    expect(takenResult.errorMessage).toBe("Numer już istnieje");
  });

  it("should get next suggestion", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "3/2025",
      })
    );

    const nextSuggestion = result.current.getNextSuggestion();
    expect(nextSuggestion).toBe("3/2025");
  });

  it("should handle edit mode by excluding current task", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "1/2025",
        editTaskId: "task-1", // Editing task-1
      })
    );

    // Should be valid now because we're editing the same task
    expect(result.current.isValid).toBe(true);
  });

  it("should validate empty task number", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "",
      })
    );

    const emptyResult = result.current.validateNumber("");
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errorMessage).toBe("Numer zadania jest wymagany");
  });

  it("should validate invalid format", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "invalid",
      })
    );

    const invalidResult = result.current.validateNumber("invalid");
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errorMessage).toBe("Numer zadania musi mieć format: liczba/rok (np. 45/2025)");
  });

  it("should update validation when currentTaskNumber changes", () => {
    const { result, rerender } = renderHook(
      ({ currentTaskNumber }) =>
        useTaskNumberManager({
          tasks: mockTasks,
          currentTaskNumber,
        }),
      {
        initialProps: { currentTaskNumber: "1/2025" },
      }
    );

    expect(result.current.isValid).toBe(false);

    // Change to available number
    rerender({ currentTaskNumber: "3/2025" });
    expect(result.current.isValid).toBe(true);
  });

  it("should handle year extraction from task number", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "5/2024",
        initialYear: 2025, // Should be overridden by task number year
      })
    );

    expect(result.current.year).toBe(2024);
  });

  it("should provide error message for taken numbers", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "1/2025",
      })
    );

    expect(result.current.errorMessage).toBe("Numer już istnieje");
  });

  it("should not show error for available numbers", () => {
    const { result } = renderHook(() =>
      useTaskNumberManager({
        tasks: mockTasks,
        currentTaskNumber: "3/2025",
      })
    );

    expect(result.current.errorMessage).toBeUndefined();
  });
});
