export function formatDate(date: string) {
  // from date: 2023-01-01 to string
  // 01.01. <new line>
  // 2025

  if (typeof date !== "string") {
    throw new Error("Invalid date format. Expected date format: YYYY-MM-DD");
  }

  const parts = date.split("-");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    throw new Error("Date must be in 'YYYY-MM-DD' format");
  }

  const dayAndMonth = parts.slice(1).reverse().join(".");
  const year = parts[0];
  return `${dayAndMonth}.${year}`;
}
