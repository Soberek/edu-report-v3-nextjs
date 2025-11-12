import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debugLogger } from "../debugLogger";

describe("debugLogger", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
  };

  beforeEach(() => {
    // Mock console methods
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
    console.debug = vi.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
  });

  describe("in development mode", () => {
    it("should log info messages", () => {
      debugLogger.info("Test message");
      expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 BudgetMeter Test message/));
    });

    it("should log debug messages", () => {
      debugLogger.debug("Debug message");
      expect(console.debug).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 BudgetMeter Debug message/));
    });

    it("should log warn messages", () => {
      debugLogger.warn("Warning message");
      expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 BudgetMeter Warning message/));
    });

    it("should log error messages", () => {
      const error = new Error("Test error");
      debugLogger.error("Error occurred", error);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 BudgetMeter Error occurred/),
        error
      );
    });

    it("should log file upload events", () => {
      debugLogger.fileUpload("test.xlsx", "start");
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 FileUpload 📁 Reading file: test\.xlsx/)
      );
    });

    it("should log file upload with metadata", () => {
      debugLogger.fileUpload("test.xlsx", "success", { size: 1024, type: "application/xlsx" });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 FileUpload ✅ File loaded successfully: test\.xlsx/),
        expect.objectContaining({ size: 1024, type: "application/xlsx" })
      );
    });

    it("should log excel parsing events", () => {
      debugLogger.excelParsing("headers");
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 ExcelParsing 📋 Excel parsing: headers/)
      );
    });

    it("should log excel parsing with metadata", () => {
      debugLogger.excelParsing("complete", { rows: 100 });
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 ExcelParsing ✅ Excel parsing: complete/),
        expect.objectContaining({ rows: 100 })
      );
    });

    it("should log data processing events", () => {
      debugLogger.dataProcessing("aggregating");
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 DataProcessing 📦 Data processing: aggregating/)
      );
    });

    it("should log data processing with metadata", () => {
      debugLogger.dataProcessing("filtering", { months: ["2024-01", "2024-02"] });
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 DataProcessing 🔍 Data processing: filtering/),
        expect.objectContaining({ months: ["2024-01", "2024-02"] })
      );
    });

    it("should log performance with timing", () => {
      debugLogger.performance("Operation X", 1234);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 Performance ⏱️ Operation X: 1234ms/)
      );
    });

    it("should handle custom context", () => {
      debugLogger.info("Message", undefined, "CustomContext");
      expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 CustomContext Message/));
    });

    it("should handle errors with custom context", () => {
      const error = new Error("Custom error");
      debugLogger.error("Failed", error, "FileUpload");
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 FileUpload Failed/), error);
    });

    it("should handle undefined metadata", () => {
      debugLogger.fileUpload("test.xlsx", "start", undefined);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 FileUpload 📁 Reading file: test\.xlsx/)
      );
    });

    it("should handle null values in metadata", () => {
      debugLogger.excelParsing("test", { value: null });
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 ExcelParsing → Excel parsing: test/),
        expect.objectContaining({ value: null })
      );
    });

    it("should handle complex nested metadata", () => {
      const metadata = {
        file: { name: "test.xlsx", size: 1024 },
        sheets: ["Sheet1", "Sheet2"],
        rows: [{ id: 1 }, { id: 2 }],
      };
      debugLogger.excelParsing("complex", metadata);
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 ExcelParsing → Excel parsing: complex/),
        expect.objectContaining(metadata)
      );
    });
  });

  describe("utility methods", () => {
    it("should report if debug mode is enabled", () => {
      // In test environment (browser), debug is always enabled
      expect(debugLogger.isEnabled()).toBe(true);
    });

    it("should handle custom context", () => {
      debugLogger.info("Test message", undefined, "CustomContext");
      expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 CustomContext Test message/));
    });

    it("should handle errors with custom context", () => {
      const error = new Error("test");
      debugLogger.error("Error occurred", error, "ErrorHandler");
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 ErrorHandler Error occurred/),
        error
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings", () => {
      debugLogger.info("");
      expect(console.info).toHaveBeenCalled();
    });

    it("should handle very long messages", () => {
      const longMessage = "a".repeat(10000);
      debugLogger.info(longMessage);
      expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 BudgetMeter/));
    });

    it("should handle special characters in messages", () => {
      debugLogger.info("Special: 日本語 ąćęłńóśźż 🚀");
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 BudgetMeter Special: 日本語 ąćęłńóśźż 🚀/)
      );
    });

    it("should handle errors with circular references", () => {
      const circularError: Error & { self?: unknown } = new Error("Circular");
      circularError.self = circularError;

      expect(() => {
        debugLogger.error("Circular error", circularError);
      }).not.toThrow();
    });

    it("should handle errors without message", () => {
      const error = new Error();
      debugLogger.error("Empty error", error);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle non-Error objects as errors", () => {
      const notAnError = { message: "Not an error object" };
      debugLogger.error("Not error", notAnError as Error);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle zero timing", () => {
      debugLogger.performance("Instant", 0);
      expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 Performance ⏱️ Instant: 0ms/));
    });

    it("should handle negative timing", () => {
      debugLogger.performance("Negative", -100);
      expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 Performance ⏱️ Negative: -100ms/));
    });

    it("should handle very large timing values", () => {
      debugLogger.performance("Long operation", 999999999);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{1,2}:\d{2}:\d{2} [AP]M\] 📊 Performance ⏱️ Long operation: 999999999ms/)
      );
    });
  });
});
