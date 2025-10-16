import ExcelJS from "exceljs";
import type { ProgramsData } from "../types";

const downloadBlob = (buffer: ArrayBuffer, fileName: string) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  if (window.navigator && "msSaveOrOpenBlob" in window.navigator) {
    // @ts-expect-error: msSaveOrOpenBlob is available in IE/Edge legacy
    window.navigator.msSaveOrOpenBlob(blob, fileName);
    return;
  }

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDataRows = (data: ProgramsData): (string | number | null)[][] => {
  const rows: (string | number | null)[][] = [];

  Object.entries(data).forEach(([programType, programData]) => {
    rows.push([programType, null, null, null]);

    Object.entries(programData).forEach(([programName, actions], idx) => {
      const programIndex = idx + 1;
      rows.push([`${programIndex}`, programName, null, null]);

      Object.entries(actions).forEach(([actionName, actionData], actionIdx) => {
        const actionIndex = `${programIndex}.${actionIdx + 1}`;
        rows.push([actionIndex, actionName, actionData.people, actionData.actionNumber]);
      });
    });
  });

  return rows;
};

export default async function saveExcelToFile(data: ProgramsData): Promise<void> {
  if (!data || Object.keys(data).length === 0) {
    console.warn("No data provided for Excel export.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Miernik");

  worksheet.columns = [
    { width: 15 },
    { width: 40 },
    { width: 10 },
    { width: 10 },
  ];

  const dataRows = formatDataRows(data);
  dataRows.forEach((row) => worksheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(buffer, "miernik.xlsx");
}
