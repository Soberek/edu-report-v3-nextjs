import saveExcelToFile from "../useExcelFileSaver";

// Mock ExcelJS
const mockAddRow = vi.fn();
const mockWriteBuffer = vi.fn();
const mockAddWorksheet = vi.fn();

// Store the last created worksheet
let lastWorksheetInstance: {
  columns: { width: number }[];
  addRow: typeof mockAddRow;
} | null = null;

vi.mock("exceljs", () => ({
  default: {
    Workbook: vi.fn().mockImplementation(() => ({
      addWorksheet: vi.fn((name: string) => {
        const worksheet = {
          columns: [],
          addRow: mockAddRow,
        };
        lastWorksheetInstance = worksheet;
        mockAddWorksheet(name); // Track the call
        return worksheet;
      }),
      xlsx: {
        writeBuffer: mockWriteBuffer,
      },
    })),
  },
}));

// Mock URL and document for download testing
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();
const mockRemoveChild = vi.fn();
const mockAppendChild = vi.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

Object.defineProperty(document, "createElement", {
  writable: true,
  value: vi.fn().mockReturnValue({
    href: "",
    download: "",
    click: mockClick,
  }),
});

Object.defineProperty(document.body, "appendChild", {
  writable: true,
  value: mockAppendChild,
});

Object.defineProperty(document.body, "removeChild", {
  writable: true,
  value: mockRemoveChild,
});

describe("saveExcelToFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteBuffer.mockResolvedValue(new ArrayBuffer(8));
    mockCreateObjectURL.mockReturnValue("blob:mock-url");
  });

  it("should handle empty data", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await saveExcelToFile({});

    expect(consoleSpy).toHaveBeenCalledWith("No data provided for Excel export.");
    expect(mockAddWorksheet).not.toHaveBeenCalled();
    expect(mockWriteBuffer).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle null data", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await saveExcelToFile(null as unknown as Parameters<typeof saveExcelToFile>[0]);

    expect(consoleSpy).toHaveBeenCalledWith("No data provided for Excel export.");
    expect(mockAddWorksheet).not.toHaveBeenCalled();
    expect(mockWriteBuffer).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle undefined data", async () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await saveExcelToFile(undefined as unknown as Parameters<typeof saveExcelToFile>[0]);

    expect(consoleSpy).toHaveBeenCalledWith("No data provided for Excel export.");
    expect(mockAddWorksheet).not.toHaveBeenCalled();
    expect(mockWriteBuffer).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should export data successfully", async () => {
    const mockData = {
      "Program Type 1": {
        "Program 1": {
          "Action 1": { people: 10, actionNumber: 5 },
          "Action 2": { people: 15, actionNumber: 3 },
        },
        "Program 2": {
          "Action 3": { people: 20, actionNumber: 2 },
        },
      },
      "Program Type 2": {
        "Program 3": {
          "Action 4": { people: 25, actionNumber: 4 },
        },
      },
    };

    await saveExcelToFile(mockData);

    // Verify worksheet was created
    expect(mockAddWorksheet).toHaveBeenCalledWith("Miernik");

    // Verify data rows were added
    expect(mockAddRow).toHaveBeenCalled();

    // Check some specific row additions
    const calls = mockAddRow.mock.calls;
    expect(calls).toContainEqual([["Program Type 1", null, null, null]]);
    expect(calls).toContainEqual([["1", "Program 1", null, null]]);
    expect(calls).toContainEqual([["1.1", "Action 1", 10, 5]]);
    expect(calls).toContainEqual([["1.2", "Action 2", 15, 3]]);
    expect(calls).toContainEqual([["2", "Program 2", null, null]]);
    expect(calls).toContainEqual([["2.1", "Action 3", 20, 2]]);
    expect(calls).toContainEqual([["Program Type 2", null, null, null]]);
    expect(calls).toContainEqual([["1", "Program 3", null, null]]);
    expect(calls).toContainEqual([["1.1", "Action 4", 25, 4]]);

    // Verify buffer was written
    expect(mockWriteBuffer).toHaveBeenCalled();

    // Verify download was triggered
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("should handle single program type", async () => {
    const mockData = {
      "Single Program Type": {
        "Single Program": {
          "Single Action": { people: 5, actionNumber: 1 },
        },
      },
    };

    await saveExcelToFile(mockData);

    expect(mockAddWorksheet).toHaveBeenCalledWith("Miernik");

    const calls = mockAddRow.mock.calls;
    expect(calls).toContainEqual([["Single Program Type", null, null, null]]);
    expect(calls).toContainEqual([["1", "Single Program", null, null]]);
    expect(calls).toContainEqual([["1.1", "Single Action", 5, 1]]);

    expect(mockWriteBuffer).toHaveBeenCalled();
  });

  it("should handle program with no actions", async () => {
    const mockData = {
      "Program Type": {
        "Empty Program": {},
      },
    };

    await saveExcelToFile(mockData);

    expect(mockAddWorksheet).toHaveBeenCalledWith("Miernik");

    const calls = mockAddRow.mock.calls;
    expect(calls).toContainEqual([["Program Type", null, null, null]]);
    expect(calls).toContainEqual([["1", "Empty Program", null, null]]);

    expect(mockWriteBuffer).toHaveBeenCalled();
  });

  it("should handle complex nested data structure", async () => {
    const mockData = {
      "Type A": {
        "Program A1": {
          "Action A1.1": { people: 10, actionNumber: 2 },
          "Action A1.2": { people: 15, actionNumber: 3 },
        },
        "Program A2": {
          "Action A2.1": { people: 20, actionNumber: 1 },
        },
      },
      "Type B": {
        "Program B1": {
          "Action B1.1": { people: 25, actionNumber: 4 },
          "Action B1.2": { people: 30, actionNumber: 5 },
          "Action B1.3": { people: 35, actionNumber: 6 },
        },
      },
    };

    await saveExcelToFile(mockData);

    expect(mockAddWorksheet).toHaveBeenCalledWith("Miernik");

    const calls = mockAddRow.mock.calls;

    // Verify Type A structure
    expect(calls).toContainEqual([["Type A", null, null, null]]);
    expect(calls).toContainEqual([["1", "Program A1", null, null]]);
    expect(calls).toContainEqual([["1.1", "Action A1.1", 10, 2]]);
    expect(calls).toContainEqual([["1.2", "Action A1.2", 15, 3]]);
    expect(calls).toContainEqual([["2", "Program A2", null, null]]);
    expect(calls).toContainEqual([["2.1", "Action A2.1", 20, 1]]);

    // Verify Type B structure
    expect(calls).toContainEqual([["Type B", null, null, null]]);
    expect(calls).toContainEqual([["1", "Program B1", null, null]]);
    expect(calls).toContainEqual([["1.1", "Action B1.1", 25, 4]]);
    expect(calls).toContainEqual([["1.2", "Action B1.2", 30, 5]]);
    expect(calls).toContainEqual([["1.3", "Action B1.3", 35, 6]]);

    expect(mockWriteBuffer).toHaveBeenCalled();
  });

  it("should handle ExcelJS errors gracefully", async () => {
    const mockData = {
      "Program Type": {
        Program: {
          Action: { people: 10, actionNumber: 5 },
        },
      },
    };

    mockWriteBuffer.mockRejectedValue(new Error("ExcelJS error"));

    await expect(saveExcelToFile(mockData)).rejects.toThrow("ExcelJS error");
  });

  it("should use correct filename and sheet name", async () => {
    const mockData = {
      "Test Type": {
        "Test Program": {
          "Test Action": { people: 1, actionNumber: 1 },
        },
      },
    };

    await saveExcelToFile(mockData);

    expect(mockAddWorksheet).toHaveBeenCalledWith("Miernik");
    expect(mockWriteBuffer).toHaveBeenCalled();

    // Verify the created link element would have correct download attribute
    const createElementCalls = (document.createElement as ReturnType<typeof vi.fn>).mock.results;
    if (createElementCalls.length > 0) {
      const linkElement = createElementCalls[0].value;
      expect(linkElement.download).toBe("miernik.xlsx");
    }
  });

  it("should set correct column widths", async () => {
    const mockData = {
      "Test Type": {
        "Test Program": {
          "Test Action": { people: 1, actionNumber: 1 },
        },
      },
    };

    await saveExcelToFile(mockData);

    // Check the last created worksheet instance
    expect(lastWorksheetInstance).not.toBeNull();
    expect(lastWorksheetInstance!.columns).toEqual([
      { width: 15 },
      { width: 40 },
      { width: 10 },
      { width: 10 },
    ]);
  });
});
