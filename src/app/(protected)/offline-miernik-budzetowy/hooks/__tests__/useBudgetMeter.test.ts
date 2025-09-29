import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useBudgetMeter } from "../useBudgetMeter";
import { initialBudgetMeterState } from "../../reducers/budgetMeterReducer";

// Mock the utility functions
vi.mock("../../utils/fileUtils", () => ({
  validateExcelFile: vi.fn(),
  readExcelFile: vi.fn(),
}));

vi.mock("../../utils/dataProcessing", () => ({
  validateExcelData: vi.fn(),
  aggregateData: vi.fn(),
  exportToExcel: vi.fn(),
}));

import { validateExcelFile, readExcelFile } from "../../utils/fileUtils";
import { validateExcelData, aggregateData, exportToExcel } from "../../utils/dataProcessing";

const mockValidateExcelFile = validateExcelFile as ReturnType<typeof vi.fn>;
const mockReadExcelFile = readExcelFile as ReturnType<typeof vi.fn>;
const mockValidateExcelData = validateExcelData as ReturnType<typeof vi.fn>;
const mockAggregateData = aggregateData as ReturnType<typeof vi.fn>;
const mockExportToExcel = exportToExcel as ReturnType<typeof vi.fn>;

describe("useBudgetMeter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useBudgetMeter());

    expect(result.current.state).toEqual(initialBudgetMeterState);
    expect(result.current.handleFileUpload).toBeInstanceOf(Function);
    expect(result.current.handleMonthToggle).toBeInstanceOf(Function);
    expect(result.current.handleMonthSelectAll).toBeInstanceOf(Function);
    expect(result.current.handleMonthDeselectAll).toBeInstanceOf(Function);
    expect(result.current.processData).toBeInstanceOf(Function);
    expect(result.current.handleExportToExcel).toBeInstanceOf(Function);
    expect(result.current.resetState).toBeInstanceOf(Function);
  });

  describe("handleFileUpload", () => {
    it("should handle no file selected", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockEvent = {
        target: { files: null },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.state.fileError).toBe("Nie wybrano pliku");
    });

    it("should handle invalid file type", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockFile = new File(["test"], "test.txt", { type: "text/plain" });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      mockValidateExcelFile.mockReturnValue({
        isValid: false,
        error: "Invalid file type",
      });

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(mockValidateExcelFile).toHaveBeenCalledWith(mockFile);
      expect(result.current.state.fileError).toBe("Invalid file type");
    });

    it("should handle successful file upload", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      const mockData = [{ Data: "2024-01-01", "Liczba działań": 5, "Liczba ludzi": 10 }];

      mockValidateExcelFile.mockReturnValue({ isValid: true });
      mockReadExcelFile.mockResolvedValue({
        fileName: "test.xlsx",
        data: mockData,
      });
      mockValidateExcelData.mockReturnValue({ isValid: true });

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(mockValidateExcelFile).toHaveBeenCalledWith(mockFile);
      expect(mockReadExcelFile).toHaveBeenCalledWith(mockFile);
      expect(mockValidateExcelData).toHaveBeenCalledWith(mockData);
      expect(result.current.state.fileName).toBe("test.xlsx");
      expect(result.current.state.rawData).toEqual(mockData);
      expect(result.current.state.fileError).toBeNull();
    });

    it("should handle file read error", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      mockValidateExcelFile.mockReturnValue({ isValid: true });
      mockReadExcelFile.mockRejectedValue(new Error("File read error"));

      await act(async () => {
        await result.current.handleFileUpload(mockEvent);
      });

      expect(result.current.state.fileError).toBe("File read error");
    });
  });

  describe("handleMonthToggle", () => {
    it("should toggle month selection", () => {
      const { result } = renderHook(() => useBudgetMeter());

      act(() => {
        result.current.handleMonthToggle(1);
      });

      expect(result.current.state.selectedMonths[0].selected).toBe(true);
    });

    it("should not toggle when month error exists", () => {
      const { result } = renderHook(() => useBudgetMeter());

      // First set a month error
      act(() => {
        result.current.state.monthError = "Test error";
      });

      act(() => {
        result.current.handleMonthToggle(1);
      });

      // Should not change selection
      expect(result.current.state.selectedMonths[0].selected).toBe(false);
    });
  });

  describe("handleMonthSelectAll", () => {
    it("should select all months", () => {
      const { result } = renderHook(() => useBudgetMeter());

      act(() => {
        result.current.handleMonthSelectAll();
      });

      expect(result.current.state.selectedMonths.every((month) => month.selected)).toBe(true);
    });
  });

  describe("handleMonthDeselectAll", () => {
    it("should deselect all months", () => {
      const { result } = renderHook(() => useBudgetMeter());

      // First select all months
      act(() => {
        result.current.handleMonthSelectAll();
      });

      // Then deselect all
      act(() => {
        result.current.handleMonthDeselectAll();
      });

      expect(result.current.state.selectedMonths.every((month) => !month.selected)).toBe(true);
    });
  });

  describe("processData", () => {
    it("should process data successfully", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockData = [{ Data: "2024-01-01", "Liczba działań": 5, "Liczba ludzi": 10 }];
      const mockAggregated = {
        aggregated: {},
        allActions: 5,
        allPeople: 10,
      };

      // Set up state
      act(() => {
        result.current.state.rawData = mockData;
        result.current.state.selectedMonths[0].selected = true;
      });

      mockAggregateData.mockReturnValue(mockAggregated);

      await act(async () => {
        await result.current.processData();
      });

      expect(mockAggregateData).toHaveBeenCalledWith(mockData, result.current.state.selectedMonths);
      expect(result.current.state.aggregatedData).toEqual(mockAggregated);
      expect(result.current.state.processingError).toBeNull();
    });

    it("should handle processing error", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockData = [{ Data: "2024-01-01", "Liczba działań": 5, "Liczba ludzi": 10 }];

      // Set up state
      act(() => {
        result.current.state.rawData = mockData;
        result.current.state.selectedMonths[0].selected = true;
      });

      mockAggregateData.mockImplementation(() => {
        throw new Error("Processing error");
      });

      await act(async () => {
        await result.current.processData();
      });

      expect(result.current.state.processingError).toBe("Processing error");
    });
  });

  describe("handleExportToExcel", () => {
    it("should export data successfully", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockAggregated = {
        aggregated: {},
        allActions: 5,
        allPeople: 10,
      };

      // Set up state
      act(() => {
        result.current.state.aggregatedData = mockAggregated;
      });

      mockExportToExcel.mockResolvedValue(undefined);

      await act(async () => {
        await result.current.handleExportToExcel();
      });

      expect(mockExportToExcel).toHaveBeenCalledWith(mockAggregated);
    });

    it("should handle export error", async () => {
      const { result } = renderHook(() => useBudgetMeter());

      const mockAggregated = {
        aggregated: {},
        allActions: 5,
        allPeople: 10,
      };

      // Set up state
      act(() => {
        result.current.state.aggregatedData = mockAggregated;
      });

      mockExportToExcel.mockRejectedValue(new Error("Export error"));

      await act(async () => {
        await result.current.handleExportToExcel();
      });

      // Should not crash, error handling is internal
      expect(mockExportToExcel).toHaveBeenCalled();
    });
  });

  describe("resetState", () => {
    it("should reset state to initial values", () => {
      const { result } = renderHook(() => useBudgetMeter());

      // First modify some state
      act(() => {
        result.current.state.fileName = "test.xlsx";
        result.current.state.selectedMonths[0].selected = true;
      });

      // Then reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.state).toEqual(initialBudgetMeterState);
    });
  });
});
