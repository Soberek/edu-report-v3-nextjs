import moment from "moment";
import type { ExcelRow } from "../types";

import type { Month } from "../components/forms/month-buttons";

export interface ProgramsData {
  [key: string]: {
    [key: string]: {
      [key: string]: { people: number; actionNumber: number };
    };
  };
}

export const aggregateData = (data: ExcelRow[], months: Month[]) => {
  let allPeople = 0;
  let allActions = 0;

  // Move selectedMonths calculation outside reduce
  const selectedMonths = months.filter((month) => month.selected === true).map((month) => month.monthNumber);

  try {
    const aggregated = data.reduce((acc, item, index) => {
      const programType = item["Typ programu"];
      const programName = item["Nazwa programu"];
      const programAction = item["Działanie"];
      const peopleCount = Number(item["Liczba ludzi"]);
      const actionCount = Number(item["Liczba działań"]);
      const date = moment(item["Data"], "YYYY-MM-DD");
      const month = date.month() + 1; // moment months are 0-indexed

      if (!programType) {
        throw new Error("Brak wartości w kolumnie 'Typ programu'. Sprawdź swój plik excel.");
      }
      if (!programName) {
        throw new Error("Brak wartości w kolumnie 'Nazwa programu'. Sprawdź swój plik excel.");
      }
      if (!programAction) {
        throw new Error("Brak wartości w kolumnie 'Działanie'. Sprawdź swój plik excel.");
      }
      if (isNaN(peopleCount)) {
        throw new Error(`Napotkano na nieprawidłową liczbę w kolumnie 'Liczba ludzi': ${item["Liczba ludzi"]}. Sprawdź swój plik excel.`);
      }
      if (isNaN(actionCount)) {
        throw new Error(
          `Napotkano na nieprawidłową liczbę w kolumnie 'Liczba działań': ${item["Liczba działań"]}. Sprawdź swój plik excel.`
        );
      }

      // Check for selected months
      if (selectedMonths.length > 0 && !selectedMonths.includes(month)) {
        return acc;
      }

      // Initialize nested objects if they don't exist
      if (!acc[programType]) {
        acc[programType] = {};
      }

      if (!acc[programType][programName]) {
        acc[programType][programName] = {};
      }

      if (!acc[programType][programName][programAction]) {
        acc[programType][programName][programAction] = {
          people: 0,
          actionNumber: 0,
        };
      }

      // Accumulate values
      acc[programType][programName][programAction].actionNumber += actionCount;
      acc[programType][programName][programAction].people += peopleCount;

      allPeople += peopleCount;
      allActions += actionCount;

      return acc;
    }, {} as ProgramsData);

    return { aggregated, allPeople, allActions };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Błąd podczas przetwarzania danych Excel";
    throw new Error(errorMessage);
  }
};
