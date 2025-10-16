import { renderHook, act, waitFor } from "@testing-library/react";
import useExcelFileReader from "../useExcelFileReader";

// Mock ExcelJS
const mockLoad = vi.fn();
const mockGetRow = vi.fn();
const mockEachRow = vi.fn();
const mockEachCell = vi.fn();

// Store the last created workbook instance
let lastWorkbookInstance: {
  xlsx: { load: typeof mockLoad };
  worksheets: unknown[];
} | null = null;

const createMockWorksheet = (headers: string[], rows: unknown[][]) => ({
  getRow: (rowNumber: number) => {
    if (rowNumber === 1) {
      return {
        eachCell: (options: { includeEmpty?: boolean }, callback: (cell: unknown, colNumber: number) => void) => {
          headers.forEach((header, index) => {
            callback({ value: header, text: header }, index + 1);
          });
        },
      };
    }
    return { eachCell: vi.fn() };
  },
  eachRow: (options: { includeEmpty?: boolean }, callback: (row: unknown, rowNumber: number) => void) => {
    // First call for header row
    callback(
      {
        getCell: (colIndex: number) => ({
          value: headers[colIndex - 1],
          text: headers[colIndex - 1] ?? "",
        }),
        eachCell: (opts: { includeEmpty?: boolean }, cb: (cell: unknown, colNumber: number) => void) => {
          headers.forEach((header, index) => {
            cb({ value: header, text: header }, index + 1);
          });
        },
      },
      1
    );

    // Then data rows
    rows.forEach((rowData, index) => {
      callback(
        {
          getCell: (colIndex: number) => ({
            value: rowData[colIndex - 1],
            text: String(rowData[colIndex - 1] ?? ""),
          }),
        },
        index + 2 // Skip header row
      );
    });
  },
});

vi.mock("exceljs", () => ({
  default: {
    Workbook: vi.fn().mockImplementation(() => {
      const workbookInstance: {
        xlsx: { load: typeof mockLoad };
        worksheets: unknown[];
      } = {
        xlsx: {
          load: mockLoad,
        },
        worksheets: [],
      };
      
      // Store reference to this instance
      lastWorkbookInstance = workbookInstance;
      
      return workbookInstance;
    }),
  },
}));

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

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const headers = ["Data", "Liczba działań", "Liczba ludzi"];
      const rowsData = [["2024-01-01", 5, 10]];
      const mockWorksheet = createMockWorksheet(headers, rowsData);

      // Mock the load to set worksheets on the instance
      mockLoad.mockImplementation(async () => {
        if (lastWorkbookInstance) {
          lastWorkbookInstance.worksheets = [mockWorksheet];
        }
        return Promise.resolve();
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
      });

      expect(result.current.fileName).toBe("test.xlsx");
      expect(result.current.rawData).toEqual([
        { Data: "2024-01-01", "Liczba działań": 5, "Liczba ludzi": 10 },
      ]);
      expect(result.current.error).toBeNull();
    });

    it("should handle file reading error", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      mockLoad.mockRejectedValue(new Error("File reading error"));

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
      });

      expect(result.current.fileName).toBe("");
      expect(result.current.rawData).toEqual([]);
      expect(result.current.error).toBe("File reading error");
    });

    it("should handle missing sheet", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Mock empty worksheets array
      mockLoad.mockImplementation(async function (this: { worksheets: unknown[] }) {
        this.worksheets = [];
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
      });

      expect(result.current.error).toBe("Brak arkusza w pliku");
      expect(result.current.fileName).toBe("");
      expect(result.current.rawData).toEqual([]);
    });

    it("should handle empty sheet data", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const headers = ["Data", "Liczba działań"];
      const rowsData: never[] = [];
      const mockWorksheet = createMockWorksheet(headers, rowsData);

      mockLoad.mockImplementation(async () => {
        if (lastWorkbookInstance) {
          lastWorkbookInstance.worksheets = [mockWorksheet];
        }
        return Promise.resolve();
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
      });

      expect(result.current.rawData).toEqual([]);
      expect(result.current.fileName).toBe("test.xlsx");
      expect(result.current.error).toBeNull();
    });

    it("should set loading state during file reading", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const headers = ["Data", "Liczba działań", "Liczba ludzi"];
      const rowsData = [["2024-01-01", 5, 10]];
      const mockWorksheet = createMockWorksheet(headers, rowsData);

      mockLoad.mockImplementation(async function (this: { worksheets: unknown[] }) {
        this.worksheets = [mockWorksheet];
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
      });

      // After completion, loading should be false
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("resetState", () => {
    it("should reset state to initial values", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      // First modify some state by uploading a file
      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const headers = ["test"];
      const rowsData = [["data"]];
      const mockWorksheet = createMockWorksheet(headers, rowsData);

      mockLoad.mockImplementation(async function (this: { worksheets: unknown[] }) {
        this.worksheets = [mockWorksheet];
      });

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
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

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      mockLoad.mockRejectedValue("String error");

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
      });

      expect(result.current.error).toBe("Failed to process Excel file");
    });

    it("should handle null/undefined errors", async () => {
      const { result } = renderHook(() => useExcelFileReader());

      const mockFile = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      mockLoad.mockRejectedValue(null);

      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        result.current.handleFileUpload(mockEvent);
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 3000 }
        );
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
        const mockFile = new File(["test"], testCase.name, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const headers = ["test"];
        const rowsData = [["data"]];
        const mockWorksheet = createMockWorksheet(headers, rowsData);

        mockLoad.mockImplementation(async () => {
          if (lastWorkbookInstance) {
            lastWorkbookInstance.worksheets = [mockWorksheet];
          }
          return Promise.resolve();
        });

        const mockEvent = {
          target: { files: [mockFile] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        await act(async () => {
          result.current.handleFileUpload(mockEvent);
          await waitFor(
            () => {
              expect(result.current.isLoading).toBe(false);
            },
            { timeout: 3000 }
          );
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
