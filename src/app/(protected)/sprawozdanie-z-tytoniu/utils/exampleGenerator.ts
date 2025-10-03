import * as XLSX from "xlsx";

/**
 * Generates an example Excel file for testing
 * This creates a file matching the expected structure
 */
export const generateExampleExcelFile = (month: string = "sierpień 2025"): void => {
  const data = [
    [],
    [],
    ["Aktualna sytuacja w zakresie realizacji ustawy o ochronie zdrowia przed następstwami używania tytoniu i wyrobów tytoniowych"],
    [`w województwie zachodniopomorskim, w miesiącu: ${month}`],
    [],
    ["Lp.", "RODZAJ OBIEKTU", "LICZBA SKONTROLOWANYCH OBIEKTÓW", "LICZBA OBIEKTÓW, W KTÓRYCH USTAWA JEST REALIZOWANA", ""],
    ["", "", "", "OGÓŁEM", "W TYM Z WYKORZYSTANIEM PALARNI"],
    ["1", "przedsiębiorstwa podmiotów leczniczych", "16", "16", "0"],
    ["2", "jednostki organizacyjne systemu oświaty", "5", "5", "1"],
    ["3", "jednostki organizacyjne pomocy społecznej", "3", "3", "0"],
    ["4", "uczelnie wyższe", "2", "2", "0"],
    ["5", "zakłady pracy", "10", "10", "2"],
    ["6", "obiekty kultury i wypoczynku", "7", "7", "1"],
    ["7", "lokale gastronomiczno-rozrywkowe", "15", "15", "3"],
    ["8", "obiekty służące obsłudze podróżnych", "4", "4", "0"],
    ["9", "pomieszczenia obiektów sportowych", "8", "8", "1"],
    ["10", "inne pomieszczenia użytku publicznego", "6", "6", "0"],
    ["RAZEM:", "", "76", "76", "8"],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Merge cells
  worksheet["!merges"] = [
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Title
    { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } }, // Subtitle
    { s: { r: 5, c: 3 }, e: { r: 5, c: 4 } }, // Header
    { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } }, // Lp.
    { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } }, // RODZAJ OBIEKTU
    { s: { r: 5, c: 2 }, e: { r: 6, c: 2 } }, // LICZBA SKONTROLOWANYCH
  ];

  // Set column widths
  worksheet["!cols"] = [{ wch: 5 }, { wch: 45 }, { wch: 30 }, { wch: 15 }, { wch: 30 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ochrona Zdrowia");

  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `przykladowy_raport_${month.replace(/\s+/g, "_")}_${timestamp}.xlsx`);
};

/**
 * Generates multiple example files for testing aggregation
 */
export const generateMultipleExampleFiles = (count: number = 3): void => {
  const months = [
    "styczeń 2025",
    "luty 2025",
    "marzec 2025",
    "kwiecień 2025",
    "maj 2025",
    "czerwiec 2025",
    "lipiec 2025",
    "sierpień 2025",
    "wrzesień 2025",
    "październik 2025",
  ];

  for (let i = 0; i < Math.min(count, months.length); i++) {
    // Generate with slightly different random values
    const randomData = [
      [],
      [],
      ["Aktualna sytuacja w zakresie realizacji ustawy o ochronie zdrowia przed następstwami używania tytoniu i wyrobów tytoniowych"],
      [`w województwie zachodniopomorskim, w miesiącu: ${months[i]}`],
      [],
      ["Lp.", "RODZAJ OBIEKTU", "LICZBA SKONTROLOWANYCH OBIEKTÓW", "LICZBA OBIEKTÓW, W KTÓRYCH USTAWA JEST REALIZOWANA", ""],
      ["", "", "", "OGÓŁEM", "W TYM Z WYKORZYSTANIEM PALARNI"],
      [
        "1",
        "przedsiębiorstwa podmiotów leczniczych",
        Math.floor(Math.random() * 20).toString(),
        Math.floor(Math.random() * 20).toString(),
        Math.floor(Math.random() * 3).toString(),
      ],
      [
        "2",
        "jednostki organizacyjne systemu oświaty",
        Math.floor(Math.random() * 15).toString(),
        Math.floor(Math.random() * 15).toString(),
        Math.floor(Math.random() * 5).toString(),
      ],
      [
        "3",
        "jednostki organizacyjne pomocy społecznej",
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 2).toString(),
      ],
      [
        "4",
        "uczelnie wyższe",
        Math.floor(Math.random() * 5).toString(),
        Math.floor(Math.random() * 5).toString(),
        Math.floor(Math.random() * 2).toString(),
      ],
      [
        "5",
        "zakłady pracy",
        Math.floor(Math.random() * 25).toString(),
        Math.floor(Math.random() * 25).toString(),
        Math.floor(Math.random() * 5).toString(),
      ],
      [
        "6",
        "obiekty kultury i wypoczynku",
        Math.floor(Math.random() * 12).toString(),
        Math.floor(Math.random() * 12).toString(),
        Math.floor(Math.random() * 3).toString(),
      ],
      [
        "7",
        "lokale gastronomiczno-rozrywkowe",
        Math.floor(Math.random() * 30).toString(),
        Math.floor(Math.random() * 30).toString(),
        Math.floor(Math.random() * 8).toString(),
      ],
      [
        "8",
        "obiekty służące obsłudze podróżnych",
        Math.floor(Math.random() * 8).toString(),
        Math.floor(Math.random() * 8).toString(),
        Math.floor(Math.random() * 2).toString(),
      ],
      [
        "9",
        "pomieszczenia obiektów sportowych",
        Math.floor(Math.random() * 15).toString(),
        Math.floor(Math.random() * 15).toString(),
        Math.floor(Math.random() * 3).toString(),
      ],
      [
        "10",
        "inne pomieszczenia użytku publicznego",
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 2).toString(),
      ],
    ];

    // Calculate totals
    const totals = randomData.slice(7, 17).reduce(
      (acc, row) => ({
        skontrolowane: acc.skontrolowane + parseInt(row[2] as string),
        realizowane: acc.realizowane + parseInt(row[3] as string),
        palarnie: acc.palarnie + parseInt(row[4] as string),
      }),
      { skontrolowane: 0, realizowane: 0, palarnie: 0 }
    );

    randomData.push(["RAZEM:", "", totals.skontrolowane.toString(), totals.realizowane.toString(), totals.palarnie.toString()]);

    const worksheet = XLSX.utils.aoa_to_sheet(randomData);

    worksheet["!merges"] = [
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } },
      { s: { r: 5, c: 3 }, e: { r: 5, c: 4 } },
      { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } },
      { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } },
      { s: { r: 5, c: 2 }, e: { r: 6, c: 2 } },
    ];

    worksheet["!cols"] = [{ wch: 5 }, { wch: 45 }, { wch: 30 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ochrona Zdrowia");

    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `przyklad_${i + 1}_${months[i].replace(/\s+/g, "_")}_${timestamp}.xlsx`);
  }

  console.log(`Generated ${count} example files`);
};
