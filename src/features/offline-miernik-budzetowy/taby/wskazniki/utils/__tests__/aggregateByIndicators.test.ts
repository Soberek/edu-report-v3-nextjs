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

  it("should skip NIEPROGRAMOWE + wizytacja rows", () => {
    const dataWithNonProgramVisits: ExcelRow[] = [
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Warsztaty",
        "Liczba ludzi": 30,
        "Liczba działań": 5,
        Data: "2024-01-15",
      },
      {
        "Typ programu": "Nieprogramowe",
        "Nazwa programu": "Wizyta 1",
        Działanie: "Wizytacja", // This should be skipped
        "Liczba ludzi": 10,
        "Liczba działań": 2,
        Data: "2024-01-20",
      },
      {
        "Typ programu": "Nieprogramowe",
        "Nazwa programu": "Konsultacja",
        Działanie: "Konsultacja", // This should be included
        "Liczba ludzi": 5,
        "Liczba działań": 1,
        Data: "2024-01-25",
      },
    ];

    const result = aggregateByIndicators(dataWithNonProgramVisits);

    // Should only include: Profilaktyka grypy (30 people) + Konsultacja (5 people) = 35 people
    // NOT including Wizytacja (10 people)
    expect(result.totalPeople).toBe(35); // 30 + 5, NOT 45
    expect(result.totalActions).toBe(6); // 5 + 1, NOT 8
  });

  it("should handle multiple NIEPROGRAMOWE + wizytacja rows", () => {
    const dataWithMultipleVisits: ExcelRow[] = [
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Warsztaty",
        "Liczba ludzi": 30,
        "Liczba działań": 5,
        Data: "2024-01-15",
      },
      {
        "Typ programu": "Nieprogramowe",
        "Nazwa programu": "Wizyta 1",
        Działanie: "Wizytacja",
        "Liczba ludzi": 5,
        "Liczba działań": 1,
        Data: "2024-01-20",
      },
      {
        "Typ programu": "Nieprogramowe",
        "Nazwa programu": "Wizyta 2",
        Działanie: "Wizytacja",
        "Liczba ludzi": 8,
        "Liczba działań": 2,
        Data: "2024-02-10",
      },
      {
        "Typ programu": "Nieprogramowe",
        "Nazwa programu": "Wizyta 3",
        Działanie: "Wizytacja",
        "Liczba ludzi": 3,
        "Liczba działań": 1,
        Data: "2024-03-05",
      },
    ];

    const result = aggregateByIndicators(dataWithMultipleVisits);

    // Should only include Profilaktyka grypy (30 people)
    // All three wizytacja rows should be skipped (5+8+3=16 people)
    expect(result.totalPeople).toBe(30); // Only from Profilaktyka grypy
    expect(result.totalActions).toBe(5); // Only from Profilaktyka grypy
  });

  it("should be case-insensitive for wizytacja in indicators", () => {
    const dataWithCases: ExcelRow[] = [
      {
        "Typ programu": "PROGRAMOWE",
        "Nazwa programu": "Profilaktyka grypy",
        Działanie: "Warsztaty",
        "Liczba ludzi": 30,
        "Liczba działań": 5,
        Data: "2024-01-15",
      },
      {
        "Typ programu": "NIEPROGRAMOWE",
        "Nazwa programu": "Wizyta 1",
        Działanie: "WIZYTACJA", // Different case
        "Liczba ludzi": 10,
        "Liczba działań": 2,
        Data: "2024-01-20",
      },
    ];

    const result = aggregateByIndicators(dataWithCases);

    // Should skip the WIZYTACJA row regardless of case
    expect(result.totalPeople).toBe(30);
    expect(result.totalActions).toBe(5);
  });
});
