import { describe, it, expect, beforeEach } from "vitest";
import { aggregateByIndicators } from "../aggregateByIndicators";
import type { ExcelRow } from "../../../../types";

describe("aggregateByIndicators", () => {
  let testData: ExcelRow[];

  beforeEach(() => {
    testData = [
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Warsztaty",
        "Liczba ludzi": 30,
        "Liczba działań": 5,
        Data: "2024-01-15",
      },
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Promocja szczepień ochronnych",
        Działanie: "Prelekcja",
        "Liczba ludzi": 50,
        "Liczba działań": 3,
        Data: "2024-02-20",
      },
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Konsultacje",
        "Liczba ludzi": 20,
        "Liczba działań": 2,
        Data: "2024-03-10",
      },
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Trzymaj formę",
        Działanie: "Zajęcia",
        "Liczba ludzi": 25,
        "Liczba działań": 4,
        Data: "2024-01-25",
      },
    ];
  });

  it("should aggregate data by main categories", () => {
    const result = aggregateByIndicators(testData);

    expect(result.byCategory).toBeDefined();
    expect(Object.keys(result.byCategory).length).toBeGreaterThan(0);
  });

  it("should calculate correct totals", () => {
    const result = aggregateByIndicators(testData);

    expect(result.totalPeople).toBe(125); // 30 + 50 + 20 + 25
    expect(result.totalActions).toBe(14); // 5 + 3 + 2 + 4
  });

  it("should group data by main category", () => {
    const result = aggregateByIndicators(testData);

    // Should have Szczepienia (from Profilaktyka grypy, Szczepienia)
    // and Zapobieganie otyłości (from Trzymaj formę)
    const categories = Object.keys(result.byCategory);
    expect(categories).toContain("Szczepienia");
    expect(categories).toContain("Zapobieganie otyłości");
  });

  it("should calculate category totals correctly", () => {
    const result = aggregateByIndicators(testData);

    const szczepieniaTotal = result.categoryTotals["Szczepienia"];
    const otyloscTotal = result.categoryTotals["Zapobieganie otyłości"];

    expect(szczepieniaTotal).toBeDefined();
    // Szczepienia: Profilaktyka grypy (30+20=50) + Promocja szczepień ochronnych (50) = 100
    expect(szczepieniaTotal.people).toBe(100);
    expect(szczepieniaTotal.actions).toBe(10); // 5 + 2 + 3

    expect(otyloscTotal).toBeDefined();
    expect(otyloscTotal.people).toBe(25);
    expect(otyloscTotal.actions).toBe(4);
  });

  it("should handle empty data", () => {
    const result = aggregateByIndicators([]);

    expect(result.byCategory).toEqual({});
    expect(result.totalPeople).toBe(0);
    expect(result.totalActions).toBe(0);
    expect(result.categoryTotals).toEqual({});
  });

  it("should filter by selected months", () => {
    const result = aggregateByIndicators(testData, [1]); // Only January

    // Should only include data from 2024-01-15 and 2024-01-25
    expect(result.totalPeople).toBe(55); // 30 + 25
    expect(result.totalActions).toBe(9); // 5 + 4
  });

  it("should handle multiple actions per program", () => {
    const result = aggregateByIndicators(testData);

    // Profilaktyka grypy should have two actions: Warsztaty and Konsultacje
    const szczepienia = result.byCategory["Szczepienia"];
    const profilakykaGrypy = szczepienia["PROGRAMOWE"]["Profilaktyka grypy"];

    expect(profilakykaGrypy).toBeDefined();
    expect(Object.keys(profilakykaGrypy).length).toBe(2); // Warsztaty and Konsultacje
    expect(profilakykaGrypy["Warsztaty"]).toBeDefined();
    expect(profilakykaGrypy["Warsztaty"].people).toBe(30);
    expect(profilakykaGrypy["Warsztaty"].actionNumber).toBe(5);
    expect(profilakykaGrypy["Konsultacje"]).toBeDefined();
    expect(profilakykaGrypy["Konsultacje"].people).toBe(20);
    expect(profilakykaGrypy["Konsultacje"].actionNumber).toBe(2);
  });

  it("should accumulate duplicate entries", () => {
    const dataWithDuplicates: ExcelRow[] = [
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Warsztaty",
        "Liczba ludzi": 20,
        "Liczba działań": 2,
        Data: "2024-01-15",
      },
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Warsztaty",
        "Liczba ludzi": 15,
        "Liczba działań": 3,
        Data: "2024-01-20",
      },
    ];

    const result = aggregateByIndicators(dataWithDuplicates);

    const szczepienia = result.byCategory["Szczepienia"];
    const warsztaty = szczepienia["PROGRAMOWE"]["Profilaktyka grypy"]["Warsztaty"];

    expect(warsztaty.people).toBe(35); // 20 + 15
    expect(warsztaty.actionNumber).toBe(5); // 2 + 3
  });
});
