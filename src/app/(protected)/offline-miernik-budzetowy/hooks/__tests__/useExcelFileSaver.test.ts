import saveExcelToFile from "../useExcelFileSaver";

// Mock XLSX
vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: vi.fn(),
    book_new: vi.fn(),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

import * as XLSX from "xlsx";

const mockJsonToSheet = XLSX.utils.json_to_sheet as jest.MockedFunction<typeof XLSX.utils.json_to_sheet>;
const mockBookNew = XLSX.utils.book_new as jest.MockedFunction<typeof XLSX.utils.book_new>;
const mockBookAppendSheet = XLSX.utils.book_append_sheet as jest.MockedFunction<typeof XLSX.utils.book_append_sheet>;
const mockWriteFile = XLSX.writeFile as jest.MockedFunction<typeof XLSX.writeFile>;

describe("saveExcelToFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle empty data", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    saveExcelToFile({});

    expect(consoleSpy).toHaveBeenCalledWith("No data provided for Excel export.");
    expect(mockJsonToSheet).not.toHaveBeenCalled();
    expect(mockBookNew).not.toHaveBeenCalled();
    expect(mockBookAppendSheet).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle null data", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    saveExcelToFile(null as unknown as Parameters<typeof saveExcelToFile>[0]);

    expect(consoleSpy).toHaveBeenCalledWith("No data provided for Excel export.");
    expect(mockJsonToSheet).not.toHaveBeenCalled();
    expect(mockBookNew).not.toHaveBeenCalled();
    expect(mockBookAppendSheet).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle undefined data", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    saveExcelToFile(undefined as unknown as Parameters<typeof saveExcelToFile>[0]);

    expect(consoleSpy).toHaveBeenCalledWith("No data provided for Excel export.");
    expect(mockJsonToSheet).not.toHaveBeenCalled();
    expect(mockBookNew).not.toHaveBeenCalled();
    expect(mockBookAppendSheet).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should export data successfully", () => {
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

    const mockWorksheet = {};
    const mockWorkbook = {};

    mockJsonToSheet.mockReturnValue(mockWorksheet);
    mockBookNew.mockReturnValue(mockWorkbook);

    saveExcelToFile(mockData);

    // Verify that the data was processed correctly
    expect(mockJsonToSheet).toHaveBeenCalledWith([
      ["Program Type 1"],
      ["1", "Program 1", { "Action 1": { people: 10, actionNumber: 5 }, "Action 2": { people: 15, actionNumber: 3 } }],
      ["1.1", "Action 1", 10, 5],
      ["1.2", "Action 2", 15, 3],
      ["2", "Program 2", { "Action 3": { people: 20, actionNumber: 2 } }],
      ["2.1", "Action 3", 20, 2],
      ["Program Type 2"],
      ["1", "Program 3", { "Action 4": { people: 25, actionNumber: 4 } }],
      ["1.1", "Action 4", 25, 4],
    ]);

    expect(mockBookNew).toHaveBeenCalled();
    expect(mockBookAppendSheet).toHaveBeenCalledWith(mockWorkbook, mockWorksheet, "Miernik");
    expect(mockWriteFile).toHaveBeenCalledWith(mockWorkbook, "miernik.xlsx");
  });

  it("should handle single program type", () => {
    const mockData = {
      "Single Program Type": {
        "Single Program": {
          "Single Action": { people: 5, actionNumber: 1 },
        },
      },
    };

    const mockWorksheet = {};
    const mockWorkbook = {};

    mockJsonToSheet.mockReturnValue(mockWorksheet);
    mockBookNew.mockReturnValue(mockWorkbook);

    saveExcelToFile(mockData);

    expect(mockJsonToSheet).toHaveBeenCalledWith([
      ["Single Program Type"],
      ["1", "Single Program", { "Single Action": { people: 5, actionNumber: 1 } }],
      ["1.1", "Single Action", 5, 1],
    ]);

    expect(mockBookNew).toHaveBeenCalled();
    expect(mockBookAppendSheet).toHaveBeenCalledWith(mockWorkbook, mockWorksheet, "Miernik");
    expect(mockWriteFile).toHaveBeenCalledWith(mockWorkbook, "miernik.xlsx");
  });

  it("should handle program with no actions", () => {
    const mockData = {
      "Program Type": {
        "Empty Program": {},
      },
    };

    const mockWorksheet = {};
    const mockWorkbook = {};

    mockJsonToSheet.mockReturnValue(mockWorksheet);
    mockBookNew.mockReturnValue(mockWorkbook);

    saveExcelToFile(mockData);

    expect(mockJsonToSheet).toHaveBeenCalledWith([["Program Type"], ["1", "Empty Program", {}]]);

    expect(mockBookNew).toHaveBeenCalled();
    expect(mockBookAppendSheet).toHaveBeenCalledWith(mockWorkbook, mockWorksheet, "Miernik");
    expect(mockWriteFile).toHaveBeenCalledWith(mockWorkbook, "miernik.xlsx");
  });

  it("should handle complex nested data structure", () => {
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

    const mockWorksheet = {};
    const mockWorkbook = {};

    mockJsonToSheet.mockReturnValue(mockWorksheet);
    mockBookNew.mockReturnValue(mockWorkbook);

    saveExcelToFile(mockData);

    // Verify the data structure is flattened correctly
    expect(mockJsonToSheet).toHaveBeenCalledWith([
      ["Type A"],
      ["1", "Program A1", { "Action A1.1": { people: 10, actionNumber: 2 }, "Action A1.2": { people: 15, actionNumber: 3 } }],
      ["1.1", "Action A1.1", 10, 2],
      ["1.2", "Action A1.2", 15, 3],
      ["2", "Program A2", { "Action A2.1": { people: 20, actionNumber: 1 } }],
      ["2.1", "Action A2.1", 20, 1],
      ["Type B"],
      [
        "1",
        "Program B1",
        {
          "Action B1.1": { people: 25, actionNumber: 4 },
          "Action B1.2": { people: 30, actionNumber: 5 },
          "Action B1.3": { people: 35, actionNumber: 6 },
        },
      ],
      ["1.1", "Action B1.1", 25, 4],
      ["1.2", "Action B1.2", 30, 5],
      ["1.3", "Action B1.3", 35, 6],
    ]);

    expect(mockBookNew).toHaveBeenCalled();
    expect(mockBookAppendSheet).toHaveBeenCalledWith(mockWorkbook, mockWorksheet, "Miernik");
    expect(mockWriteFile).toHaveBeenCalledWith(mockWorkbook, "miernik.xlsx");
  });

  it("should handle XLSX utility errors gracefully", () => {
    const mockData = {
      "Program Type": {
        Program: {
          Action: { people: 10, actionNumber: 5 },
        },
      },
    };

    mockJsonToSheet.mockImplementation(() => {
      throw new Error("XLSX error");
    });

    // Should throw error since XLSX utility throws
    expect(() => saveExcelToFile(mockData)).toThrow("XLSX error");
  });

  it("should use correct filename and sheet name", () => {
    const mockData = {
      "Test Type": {
        "Test Program": {
          "Test Action": { people: 1, actionNumber: 1 },
        },
      },
    };

    const mockWorksheet = {};
    const mockWorkbook = {};

    mockJsonToSheet.mockReturnValue(mockWorksheet);
    mockBookNew.mockReturnValue(mockWorkbook);

    saveExcelToFile(mockData);

    expect(mockBookAppendSheet).toHaveBeenCalledWith(mockWorkbook, mockWorksheet, "Miernik");
    expect(mockWriteFile).toHaveBeenCalledWith(mockWorkbook, "miernik.xlsx");
  });
});
