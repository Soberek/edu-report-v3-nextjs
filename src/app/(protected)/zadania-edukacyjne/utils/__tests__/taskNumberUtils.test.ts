import { describe, it, expect } from "vitest";
import type { EducationalTask } from "@/types";
import {
  parseTaskNumber,
  isValidTaskNumberFormat,
  getUsedTaskNumbers,
  suggestNextTaskNumber,
  validateTaskNumber,
} from "../taskNumberUtils";

const makeTask = (taskNumber: string, id: string, date = "2025-01-01"): EducationalTask => ({
  id,
  title: "t",
  programName: "p",
  date,
  schoolId: "s",
  taskNumber,
  referenceNumber: "ref",
  activities: [],
  createdBy: "u",
  createdAt: date,
});

describe("taskNumberUtils", () => {
  it("parseTaskNumber extracts number and year", () => {
    expect(parseTaskNumber("45/2025")).toEqual({ number: 45, year: 2025 });
    expect(parseTaskNumber("001/2024")).toEqual({ number: 1, year: 2024 });
    expect(parseTaskNumber("bad")).toBeNull();
  });

  it("isValidTaskNumberFormat checks basic shape nnnn/yyyy", () => {
    expect(isValidTaskNumberFormat("1/2025")).toBe(true);
    expect(isValidTaskNumberFormat("001/2025")).toBe(true);
    expect(isValidTaskNumberFormat("1-2025")).toBe(false);
    expect(isValidTaskNumberFormat("abc/2025")).toBe(false);
    expect(isValidTaskNumberFormat("1/25")).toBe(false);
  });

  it("getUsedTaskNumbers returns numbers used in a year (excludes edit id)", () => {
    const tasks = [makeTask("1/2025", "a"), makeTask("2/2025", "b"), makeTask("5/2024", "c")];
    expect(Array.from(getUsedTaskNumbers(tasks, 2025)).sort()).toEqual([1, 2]);
    expect(Array.from(getUsedTaskNumbers(tasks, 2024)).sort()).toEqual([5]);
    // exclude id
    expect(Array.from(getUsedTaskNumbers(tasks, 2025, "a")).sort()).toEqual([2]);
  });

  it("suggestNextTaskNumber suggests the first free increment for current year", () => {
    const tasks = [makeTask("1/2025", "a"), makeTask("2/2025", "b")];
    expect(suggestNextTaskNumber(tasks, 2025)).toBe("3/2025");
    expect(suggestNextTaskNumber([], 2025)).toBe("1/2025");
  });

  it("validateTaskNumber flags duplicates and accepts available numbers", () => {
    const tasks = [makeTask("1/2025", "a"), makeTask("2/2025", "b")];
    // duplicate
    const dup = validateTaskNumber("1/2025", tasks);
    expect(dup.isValid).toBe(false);
    expect(dup.errorMessage).toBeTruthy();
    // free
    const ok = validateTaskNumber("3/2025", tasks);
    expect(ok.isValid).toBe(true);
  });
});
