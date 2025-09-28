import * as XLSX from "xlsx";
import type { Post, CsvRow, EducationalHolidayWithQuery } from "../types";

/**
 * Export posts to CSV file and trigger download
 */
export const exportPostsToCSV = (posts: Post[], filename?: string): string[][] => {
  try {
    const csvRows: string[][] = [];

    // Header
    csvRows.push(["Text", "Image URL", "Tags", "Posting Time"]);

    // Data rows
    for (const post of posts) {
      csvRows.push([post.text, post.imageUrl, post.tags, post.postingTime]);
    }

    // Convert to CSV string
    const csvOutput = csvRows.map((row) => row.map((item) => `"${item.replace(/"/g, '""')}"`).join(",")).join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename || `health_holidays_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return csvRows;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw new Error("Failed to export CSV file");
  }
};

/**
 * Export holidays to Excel file
 */
export const exportHolidaysToExcel = (holidays: EducationalHolidayWithQuery[], filename?: string): void => {
  try {
    if (!Array.isArray(holidays) || holidays.length === 0) {
      throw new Error("No holidays to export");
    }

    // Map the array returned by OpenAI into rows for Excel
    const csvRows: CsvRow[] = holidays.map((h) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      query: h.query,
      date: h.dateForThisYear,
      name: h.title,
    }));

    // Create Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(csvRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Health Holidays Posts");

    // Download file
    XLSX.writeFile(workbook, filename || "health_holidays_posts.xlsx");
  } catch (error) {
    console.error("Error exporting Excel:", error);
    throw new Error("Failed to export Excel file");
  }
};

/**
 * Validate posts data before export
 */
export const validatePostsForExport = (posts: Post[]): boolean => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return false;
  }

  return posts.every(
    (post) =>
      typeof post.text === "string" &&
      typeof post.imageUrl === "string" &&
      typeof post.tags === "string" &&
      typeof post.postingTime === "string"
  );
};

/**
 * Validate holidays data before export
 */
export const validateHolidaysForExport = (holidays: EducationalHolidayWithQuery[]): boolean => {
  if (!Array.isArray(holidays) || holidays.length === 0) {
    return false;
  }

  return holidays.every(
    (holiday) =>
      typeof holiday.id === "number" &&
      typeof holiday.title === "string" &&
      typeof holiday.description === "string" &&
      typeof holiday.query === "string" &&
      typeof holiday.literalDate === "string" &&
      typeof holiday.dateForThisYear === "string"
  );
};
