import { describe, it, expect } from "vitest";
import { readExcelFile, aggregateHealthData } from "../fileProcessing";
import * as fs from "fs";
import * as path from "path";

describe("Real Excel File Test", () => {
  it("should correctly read and aggregate data from test-file.xlsx", async () => {
    // Read the actual test file
    const testFilePath = path.join(__dirname, "test-file.xlsx");

    // Check if file exists
    if (!fs.existsSync(testFilePath)) {
      console.log("Test file not found at:", testFilePath);
      return;
    }

    // Read file as File object
    const fileBuffer = fs.readFileSync(testFilePath);
    const file = new File([fileBuffer], "test-file.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Process the file
    const fileData = await readExcelFile(file);

    console.log("\n=== FILE DATA ===");
    console.log("File name:", fileData.fileName);
    console.log("Number of rows:", fileData.data.length);
    console.log("\n=== RAW DATA ===");
    fileData.data.forEach((row, index) => {
      const rowWithNum = row as typeof row & { __rowNum__?: number };
      console.log(`Row ${index} (Excel row ${rowWithNum.__rowNum__}):`);
      console.log("All keys:", Object.keys(row));
      console.log("Full row data:", row);
    });

    // Aggregate the data
    const aggregated = aggregateHealthData([fileData]);

    console.log("\n=== AGGREGATED RESULTS ===");
    console.log(JSON.stringify(aggregated, null, 2));

    // Expected results based on your data:
    // Each facility type should have: skontrolowane=1, realizowane=2, zWykorzystaniemPalarni=3
    const expectedFacilityTypes = [
      "przedsiębiorstwa podmiotów leczniczych",
      "jednostki organizacyjne systemu oświaty",
      "jednostki organizacyjne pomocy społecznej",
      "uczelnie wyższe",
      "zakłady pracy",
      "obiekty kultury i wypoczynku",
      "lokale gastronomiczno-rozrywkowe",
      "obiekty służące obsłudze podróżnych",
      "pomieszczenia obiektów sportowych",
      "inne pomieszczenia użytku publicznego",
    ];

    // Verify each facility type
    expectedFacilityTypes.forEach((facilityType) => {
      expect(aggregated[facilityType]).toBeDefined();
      console.log(`\nChecking ${facilityType}:`, aggregated[facilityType]);

      // Based on your data: 1, 2, 3 for each row
      expect(aggregated[facilityType].skontrolowane).toBe(1);
      expect(aggregated[facilityType].realizowane).toBe(2);
      expect(aggregated[facilityType].zWykorzystaniemPalarni).toBe(3);
    });

    // Verify totals
    const totals = Object.values(aggregated).reduce(
      (acc, curr) => ({
        skontrolowane: acc.skontrolowane + curr.skontrolowane,
        realizowane: acc.realizowane + curr.realizowane,
        zWykorzystaniemPalarni: acc.zWykorzystaniemPalarni + curr.zWykorzystaniemPalarni,
      }),
      { skontrolowane: 0, realizowane: 0, zWykorzystaniemPalarni: 0 }
    );

    console.log("\n=== TOTALS ===");
    console.log("Total skontrolowane:", totals.skontrolowane, "(expected: 10)");
    console.log("Total realizowane:", totals.realizowane, "(expected: 20)");
    console.log("Total zWykorzystaniemPalarni:", totals.zWykorzystaniemPalarni, "(expected: 30)");

    // 10 facility types * 1 each = 10
    expect(totals.skontrolowane).toBe(10);
    // 10 facility types * 2 each = 20
    expect(totals.realizowane).toBe(20);
    // 10 facility types * 3 each = 30
    expect(totals.zWykorzystaniemPalarni).toBe(30);
  });

  it("should correctly aggregate data from multiple Excel files (test-file.xlsx, test-file-2.xlsx, test-file-3.xlsx)", async () => {
    const testFiles = ["test-file.xlsx", "test-file-2.xlsx", "test-file-3.xlsx"];
    const filesData = [];

    console.log("\n=== MULTI-FILE AGGREGATION TEST ===");

    // Read all test files
    for (const fileName of testFiles) {
      const testFilePath = path.join(__dirname, fileName);

      if (!fs.existsSync(testFilePath)) {
        console.log(`⚠️  Test file not found: ${fileName}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(testFilePath);
      const file = new File([fileBuffer], fileName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileData = await readExcelFile(file);
      filesData.push(fileData);

      console.log(`\n✓ Loaded ${fileName}: ${fileData.data.length} rows`);
    }

    expect(filesData.length).toBeGreaterThan(0);
    console.log(`\nTotal files loaded: ${filesData.length}`);

    // Aggregate data from all files
    const aggregated = aggregateHealthData(filesData);

    console.log("\n=== AGGREGATED RESULTS FROM ALL FILES ===");
    console.log(JSON.stringify(aggregated, null, 2));

    // Expected results:
    // If each file has the same data (1, 2, 3 for each facility type)
    // and we have 3 files, each facility type should have:
    // skontrolowane = 1 * 3 = 3
    // realizowane = 2 * 3 = 6
    // zWykorzystaniemPalarni = 3 * 3 = 9

    const expectedFacilityTypes = [
      "przedsiębiorstwa podmiotów leczniczych",
      "jednostki organizacyjne systemu oświaty",
      "jednostki organizacyjne pomocy społecznej",
      "uczelnie wyższe",
      "zakłady pracy",
      "obiekty kultury i wypoczynku",
      "lokale gastronomiczno-rozrywkowe",
      "obiekty służące obsłudze podróżnych",
      "pomieszczenia obiektów sportowych",
      "inne pomieszczenia użytku publicznego",
    ];

    console.log("\n=== FACILITY TYPE VERIFICATION ===");
    expectedFacilityTypes.forEach((facilityType) => {
      expect(aggregated[facilityType]).toBeDefined();
      console.log(`${facilityType}:`, aggregated[facilityType]);

      // Assuming each file has 1, 2, 3 for each facility type
      const expectedSkontrolowane = 1 * filesData.length;
      const expectedRealizowane = 2 * filesData.length;
      const expectedZWykorzystaniemPalarni = 3 * filesData.length;

      expect(aggregated[facilityType].skontrolowane).toBe(expectedSkontrolowane);
      expect(aggregated[facilityType].realizowane).toBe(expectedRealizowane);
      expect(aggregated[facilityType].zWykorzystaniemPalarni).toBe(expectedZWykorzystaniemPalarni);
    });

    // Verify grand totals
    const totals = Object.values(aggregated).reduce(
      (acc, curr) => ({
        skontrolowane: acc.skontrolowane + curr.skontrolowane,
        realizowane: acc.realizowane + curr.realizowane,
        zWykorzystaniemPalarni: acc.zWykorzystaniemPalarni + curr.zWykorzystaniemPalarni,
      }),
      { skontrolowane: 0, realizowane: 0, zWykorzystaniemPalarni: 0 }
    );

    console.log("\n=== GRAND TOTALS ===");
    console.log(`Total skontrolowane: ${totals.skontrolowane} (expected: ${10 * filesData.length})`);
    console.log(`Total realizowane: ${totals.realizowane} (expected: ${20 * filesData.length})`);
    console.log(`Total zWykorzystaniemPalarni: ${totals.zWykorzystaniemPalarni} (expected: ${30 * filesData.length})`);

    // 10 facility types * 1 each * number of files
    expect(totals.skontrolowane).toBe(10 * filesData.length);
    // 10 facility types * 2 each * number of files
    expect(totals.realizowane).toBe(20 * filesData.length);
    // 10 facility types * 3 each * number of files
    expect(totals.zWykorzystaniemPalarni).toBe(30 * filesData.length);

    console.log("\n✅ Multi-file aggregation test PASSED!");
  });
});
