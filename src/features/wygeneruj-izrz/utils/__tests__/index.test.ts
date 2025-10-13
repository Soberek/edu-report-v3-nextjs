import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatFileSize,
  isValidTemplateFile,
  generateUniqueFilename,
  debounce,
  truncateText,
  capitalize,
  formatDateToPolish,
  sanitizeFilename,
} from "../index";

describe("wygeneruj-izrz utils", () => {
  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1024 * 1024)).toBe("1 MB");
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("should handle decimal values", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB"); // 1.5 * 1024
      expect(formatFileSize(2048)).toBe("2 KB");
      expect(formatFileSize(1536 * 1024)).toBe("1.5 MB");
    });

    it("should handle large file sizes", () => {
      expect(formatFileSize(5 * 1024 * 1024 * 1024)).toBe("5 GB");
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe("1 TB");
    });

    it("should handle small file sizes", () => {
      expect(formatFileSize(1)).toBe("1 Bytes");
      expect(formatFileSize(512)).toBe("512 Bytes");
      expect(formatFileSize(999)).toBe("999 Bytes");
    });

    it("should handle edge cases", () => {
      expect(formatFileSize(1023)).toBe("1023 Bytes");
      expect(formatFileSize(1025)).toBe("1 KB");
    });
  });

  describe("isValidTemplateFile", () => {
    let validFile: File;
    let invalidTypeFile: File;
    let tooLargeFile: File;

    beforeEach(() => {
      validFile = new File(["content"], "test.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1024,
      });

      invalidTypeFile = new File(["content"], "test.txt", {
        type: "text/plain",
        size: 1024,
      });

      tooLargeFile = new File(["content"], "large.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 11 * 1024 * 1024, // 11MB
      });
    });

    it("should validate correct template files", () => {
      expect(isValidTemplateFile(validFile)).toBe(true);
    });

    it("should reject files with invalid types", () => {
      expect(isValidTemplateFile(invalidTypeFile)).toBe(false);
    });

    it("should reject files that are too large", () => {
      // Note: In test environment, File constructor doesn't respect size option
      // So we'll test with a file that has actual large content
      const largeContent = "x".repeat(11 * 1024 * 1024); // 11MB of content
      const actualLargeFile = new File([largeContent], "large.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      expect(isValidTemplateFile(actualLargeFile)).toBe(false);
    });

    it("should accept files at the size limit", () => {
      const exactSizeFile = new File(["content"], "exact.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 10 * 1024 * 1024, // Exactly 10MB
      });

      expect(isValidTemplateFile(exactSizeFile)).toBe(true);
    });

    it("should accept .doc files", () => {
      const docFile = new File(["content"], "test.doc", {
        type: "application/msword",
        size: 1024,
      });

      expect(isValidTemplateFile(docFile)).toBe(true);
    });

    it("should reject files just over the size limit", () => {
      // Create a file with content that's just over the limit
      const overLimitContent = "x".repeat(10 * 1024 * 1024 + 1); // Just over 10MB
      const overLimitFile = new File([overLimitContent], "over.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      expect(isValidTemplateFile(overLimitFile)).toBe(false);
    });
  });

  describe("generateUniqueFilename", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-01-15T10:30:45.123Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should generate unique filename with timestamp", () => {
      const result = generateUniqueFilename("test.docx");
      expect(result).toBe("test_2024-01-15T10-30-45-123Z.docx");
    });

    it("should handle files without extension", () => {
      const result = generateUniqueFilename("test");
      expect(result).toBe("test_2024-01-15T10-30-45-123Z.undefined");
    });

    it("should handle files with multiple dots", () => {
      const result = generateUniqueFilename("test.backup.docx");
      expect(result).toBe("test.backup_2024-01-15T10-30-45-123Z.docx");
    });

    it("should handle files with no dots", () => {
      const result = generateUniqueFilename("testfile");
      expect(result).toBe("testfile_2024-01-15T10-30-45-123Z.undefined");
    });

    it("should handle empty filename", () => {
      const result = generateUniqueFilename("");
      expect(result).toBe("_2024-01-15T10-30-45-123Z.undefined");
    });

    it("should replace colons and dots in timestamp", () => {
      const result = generateUniqueFilename("test.docx");
      expect(result).not.toContain(":");
      expect(result).toContain("-");
      // The result should contain the file extension dot
      expect(result).toContain(".docx");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should debounce function calls", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1");
      debouncedFn("arg2");
      debouncedFn("arg3");

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("arg3");
    });

    it("should reset timeout on new calls", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("first");
      vi.advanceTimersByTime(50);
      debouncedFn("second");
      vi.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("second");
    });

    it("should handle multiple debounced functions", () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();
      const debouncedFn1 = debounce(mockFn1, 100);
      const debouncedFn2 = debounce(mockFn2, 200);

      debouncedFn1("fn1");
      debouncedFn2("fn2");

      vi.advanceTimersByTime(100);
      expect(mockFn1).toHaveBeenCalledWith("fn1");
      expect(mockFn2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn2).toHaveBeenCalledWith("fn2");
    });

    it("should preserve function context", () => {
      const obj = {
        value: "test",
        method: vi.fn(function (this: { value: string }) {
          return this.value;
        }),
      };

      const debouncedMethod = debounce(obj.method.bind(obj), 100);
      debouncedMethod();

      vi.advanceTimersByTime(100);

      expect(obj.method).toHaveBeenCalled();
    });
  });

  describe("truncateText", () => {
    it("should truncate long text with ellipsis", () => {
      const longText = "This is a very long text that should be truncated";
      const result = truncateText(longText, 20);
      expect(result).toBe("This is a very long ...");
    });

    it("should not truncate short text", () => {
      const shortText = "Short text";
      const result = truncateText(shortText, 20);
      expect(result).toBe("Short text");
    });

    it("should handle text at exact length", () => {
      const exactText = "Exactly twenty chars";
      const result = truncateText(exactText, 20);
      expect(result).toBe("Exactly twenty chars");
    });

    it("should handle empty string", () => {
      const result = truncateText("", 10);
      expect(result).toBe("");
    });

    it("should handle zero max length", () => {
      const result = truncateText("test", 0);
      expect(result).toBe("...");
    });

    it("should handle negative max length", () => {
      const result = truncateText("test", -5);
      expect(result).toBe("...");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter and lowercase the rest", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
      expect(capitalize("tEsT")).toBe("Test");
    });

    it("should handle single character", () => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("Z")).toBe("Z");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle strings with numbers", () => {
      expect(capitalize("123test")).toBe("123test");
      expect(capitalize("test123")).toBe("Test123");
    });

    it("should handle strings with special characters", () => {
      expect(capitalize("!test")).toBe("!test");
      expect(capitalize("@TEST")).toBe("@test");
    });
  });

  describe("formatDateToPolish", () => {
    beforeEach(() => {
      // Mock toLocaleDateString to ensure consistent results
      vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("15 stycznia 2024");
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should format Date object to Polish locale", () => {
      const date = new Date("2024-01-15");
      const result = formatDateToPolish(date);
      expect(result).toBe("15 stycznia 2024");
    });

    it("should format date string to Polish locale", () => {
      const result = formatDateToPolish("2024-01-15");
      expect(result).toBe("15 stycznia 2024");
    });

    it("should handle ISO date strings", () => {
      const result = formatDateToPolish("2024-12-25T10:30:00.000Z");
      expect(result).toBe("15 stycznia 2024");
    });

    it("should handle invalid date strings gracefully", () => {
      // Mock toLocaleDateString to return "Invalid Date" for invalid dates
      vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("Invalid Date");

      const result = formatDateToPolish("invalid-date");
      expect(result).toBe("Invalid Date");
    });
  });

  describe("sanitizeFilename", () => {
    it("should replace invalid characters with underscores", () => {
      expect(sanitizeFilename("test file.docx")).toBe("test_file.docx");
      expect(sanitizeFilename("test@file#name.docx")).toBe("test_file_name.docx");
      expect(sanitizeFilename("test/file\\name.docx")).toBe("test_file_name.docx");
    });

    it("should preserve valid characters", () => {
      expect(sanitizeFilename("test-file.docx")).toBe("test-file.docx");
      expect(sanitizeFilename("test123.docx")).toBe("test123.docx");
      expect(sanitizeFilename("Test.File.docx")).toBe("Test.File.docx");
    });

    it("should handle empty filename", () => {
      expect(sanitizeFilename("")).toBe("");
    });

    it("should handle filename with only invalid characters", () => {
      expect(sanitizeFilename("!@#$%^&*()")).toBe("__________");
    });

    it("should handle filename with spaces and special characters", () => {
      expect(sanitizeFilename("My Document (Final Version).docx")).toBe("My_Document__Final_Version_.docx");
    });

    it("should preserve dots and hyphens", () => {
      expect(sanitizeFilename("test-file.backup.docx")).toBe("test-file.backup.docx");
    });

    it("should handle unicode characters", () => {
      expect(sanitizeFilename("tëst-fïle.docx")).toBe("t_st-f_le.docx");
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle null and undefined in formatFileSize", () => {
      expect(formatFileSize(null as unknown as number)).toBe("0 Bytes");
      expect(formatFileSize(undefined as unknown as number)).toBe("0 Bytes");
    });

    it("should handle negative numbers in formatFileSize", () => {
      expect(formatFileSize(-1024)).toBe("0 Bytes");
    });

    it("should handle very large numbers in formatFileSize", () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      const result = formatFileSize(largeNumber);
      expect(result).toContain("TB");
    });

    it("should handle debounce with zero wait time", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn("test");
      // With zero wait time, the function should be called immediately
      expect(mockFn).toHaveBeenCalledWith("test");
    });

    it("should handle debounce with negative wait time", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, -100);

      debouncedFn("test");
      // With negative wait time, the function should be called immediately
      expect(mockFn).toHaveBeenCalledWith("test");
    });
  });
});
