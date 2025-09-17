export function formatDate(date: string) {
  // from date: 2023-01-01 to string
  // 01.01. <new line>
  // 2025

  if (typeof date !== "string") {
    throw new Error("Invalid date format");
  }

  const dayAndMonth = date.split("-").slice(1).reverse().join(".");
  const year = date.split("-")[0];
  return `${dayAndMonth}.${year}`;
}
