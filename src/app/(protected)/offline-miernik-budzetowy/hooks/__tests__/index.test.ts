import { useTabManager } from "../useTabManager";
import { useMonthSelection } from "../useMonthSelection";
import { useBudgetMeter } from "../useBudgetMeter";
import useExcelFileReader from "../useExcelFileReader";
import useExcelFileSaver from "../useExcelFileSaver";

// Mock dependencies
vi.mock("../../utils/fileUtils");
vi.mock("../../utils/dataProcessing");
vi.mock("xlsx");

describe("Hooks Index", () => {
  it("should export useTabManager", () => {
    expect(useTabManager).toBeDefined();
    expect(typeof useTabManager).toBe("function");
  });

  it("should export useMonthSelection", () => {
    expect(useMonthSelection).toBeDefined();
    expect(typeof useMonthSelection).toBe("function");
  });

  it("should export useBudgetMeter", () => {
    expect(useBudgetMeter).toBeDefined();
    expect(typeof useBudgetMeter).toBe("function");
  });

  it("should export useExcelFileReader", () => {
    expect(useExcelFileReader).toBeDefined();
    expect(typeof useExcelFileReader).toBe("function");
  });

  it("should export useExcelFileSaver", () => {
    expect(useExcelFileSaver).toBeDefined();
    expect(typeof useExcelFileSaver).toBe("function");
  });
});
