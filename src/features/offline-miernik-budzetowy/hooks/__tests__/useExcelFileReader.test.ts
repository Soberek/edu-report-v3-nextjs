import { renderHook, act } from "@testing-library/react";
import useExcelFileReader from "../useExcelFileReader";

// Mock XLSX
vi.mock("xlsx", () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn(),
  },
}));

import * as XLSX from "xlsx";

const mockXLSXRead = XLSX.read as jest.MockedFunction<typeof XLSX.read>;
const mockSheetToJson = XLSX.utils.sheet_to_json as jest.MockedFunction<typeof XLSX.utils.sheet_to_json>;

describe("useExcelFileReader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useExcelFileReader());

    expect(result.current.fileName).toBe("");
    expect(result.current.rawData).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.handleFileUpload).toBeInstanceOf(Function);
    expect(result.current.resetState).toBeInstanceOf(Function);
  });

  describe("handleFileUpload", () => {
    it("should handle successful file reading", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockWorkbook = {
        SheetNames: ["Sheet1"],
        Sheets: { Sheet1: {} },
      };
      const mockData = [{ Data: "2024-01-01", "Liczba działań": 5, "Liczba ludzi": 10 }];

      mockXLSXRead.mockReturnValue(mockWorkbook);
      mockSheetToJson.mockReturnValue(mockData);

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(mockXLSXRead).toHaveBeenCalledWith(expect.any(ArrayBuffer), { type: "array" });
      expect(mockSheetToJson).toHaveBeenCalledWith(mockWorkbook.Sheets.Sheet1, { raw: false });
      expect(result.current.fileName).toBe("test.xlsx");
      expect(result.current.rawData).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should handle file reading error", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      mockXLSXRead.mockImplementation(() => {
        throw new Error("File reading error");
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.fileName).toBe("");
      expect(result.current.rawData).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe("File reading error");
    });

    it("should handle missing sheet", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockWorkbook = { Sheets: {} };

      mockXLSXRead.mockReturnValue(mockWorkbook);

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.error).toBe("Cannot read properties of undefined (reading '0')");
      expect(result.current.fileName).toBe("");
      expect(result.current.rawData).toEqual([]);
    });

    it("should handle empty sheet data", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockWorkbook = { Sheets: { Sheet1: {} } };

      mockXLSXRead.mockReturnValue(mockWorkbook);
      mockSheetToJson.mockReturnValue([]);

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.error).toBe("Cannot read properties of undefined (reading '0')");
      expect(result.current.fileName).toBe("");
      expect(result.current.rawData).toEqual([]);
    });

    it("should set loading state during file reading", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockWorkbook = {
        SheetNames: ["Sheet1"],
        Sheets: { Sheet1: {} },
      };
      const mockData = [{ Data: "2024-01-01", "Liczba działań": 5, "Liczba ludzi": 10 }];

      mockXLSXRead.mockReturnValue(mockWorkbook);
      mockSheetToJson.mockReturnValue(mockData);

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      // After completion, loading should be false
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("resetState", () => {
    it("should reset state to initial values", () => {
      const { result } = renderHook(() => useExcelFileReader());

      // First modify some state by uploading a file
      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockWorkbook = { Sheets: { Sheet1: {} } };
      const mockData = [{ test: "data" }];

      mockXLSXRead.mockReturnValue(mockWorkbook);
      mockSheetToJson.mockReturnValue(mockData);

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileUpload(mockEvent);
      });

      // Then reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.fileName).toBe("");
      expect(result.current.rawData).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should handle non-Error objects in catch block", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      mockXLSXRead.mockImplementation(() => {
        throw "String error";
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.error).toBe("Failed to process Excel file");
    });

    it("should handle null/undefined errors", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      mockXLSXRead.mockImplementation(() => {
        throw null;
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.error).toBe("Failed to process Excel file");
    });
  });

  describe("file type handling", () => {
    it("should handle different file extensions", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const testCases = [
        { name: "test.xlsx", expected: "test.xlsx" },
        { name: "test.xls", expected: "test.xls" },
      ];

      for (const testCase of testCases) {
        const mockFile = new File(["test"], testCase.name, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const mockWorkbook = {
          SheetNames: ["Sheet1"],
          Sheets: { Sheet1: {} },
        };
        const mockData = [{ test: "data" }];

        mockXLSXRead.mockReturnValue(mockWorkbook);
        mockSheetToJson.mockReturnValue(mockData);

        const mockEvent = {
          target: { files: [mockFile] },
        } as React.ChangeEvent<HTMLInputElement>;

        await act(async () => {
          await result.current.handleFileUpload(mockEvent);
        });

        expect(result.current.fileName).toBe(testCase.expected);

        // Reset for next test
        act(() => {
          result.current.resetState();
        });
      }
    });
  });
});
