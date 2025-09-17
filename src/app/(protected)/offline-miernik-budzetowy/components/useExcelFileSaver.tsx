import * as XLSX from "xlsx";
import type { ProgramsData } from "./processExcelData";

export default function saveExcelToFile(data: ProgramsData) {
  if (!data || Object.keys(data).length === 0) {
    console.warn("No data provided for Excel export.");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataArray: any[] = [];

  Object.entries(data).forEach(([programType, programData]) => {
    dataArray.push([programType]);
    Object.entries(programData).forEach(([programName, actions], idx) => {
      dataArray.push([`${++idx}`, programName, actions]);

      Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
        const { people, actionNumber: action_number } = actionData;
        dataArray.push([
          `${idx}.${++actionIdx}`,
          actionName,
          people,
          action_number,
        ]);
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(dataArray);

  // Basic styling is limited with xlsx library
  // You can set column widths:
  worksheet["!cols"] = [
    { wch: 15 }, // Column A width
    { wch: 40 }, // Column B width
    { wch: 5 }, // Column C width
    { wch: 5 }, // Column D width
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Miernik");

  XLSX.writeFile(workbook, "miernik.xlsx");
}
