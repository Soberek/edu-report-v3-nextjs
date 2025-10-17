// Utility functions for the wygeneruj-izrz module

/**
 * Format file size in bytes to human-readable format
 * Converts bytes to appropriate units (Bytes, KB, MB, GB, TB)
 * @param bytes File size in bytes
 * @returns Formatted file size string (e.g., "2.5 MB")
 * @example
 * formatFileSize(0) // "0 Bytes"
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(-100) // "0 Bytes" (invalid bytes)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0 || bytes < 0 || !Number.isFinite(bytes)) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validate if a file is an acceptable template file
 * Checks file type (Word document) and maximum size (10MB)
 * @param file The File object to validate
 * @returns True if file is valid template, false otherwise
 * @example
 * isValidTemplateFile(new File([], "doc.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })) // true
 * isValidTemplateFile(new File([], "image.jpg", { type: "image/jpeg" })) // false
 */
export const isValidTemplateFile = (file: File): boolean => {
  const allowedTypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];

  const maxSize = 10 * 1024 * 1024; // 10MB

  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Generate a unique filename by appending ISO timestamp
 * Format: originalName_YYYY-MM-DDTHH-mm-ss-sssZ.extension
 * @param originalName The original filename
 * @returns Unique filename with timestamp before extension
 * @example
 * generateUniqueFilename("report.docx")
 * // "report_2024-10-15T14-30-45-123Z.docx"
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const parts = originalName.split(".");
  const extension = parts.length > 1 ? parts.pop() : "undefined";
  const nameWithoutExtension = parts.join(".");

  return `${nameWithoutExtension}_${timestamp}.${extension}`;
};

/**
 * Debounce function for performance optimization
 * Delays function execution, canceling previous calls if triggered again
 * @template T The function type
 * @param func The function to debounce
 * @param wait Debounce delay in milliseconds
 * @returns Debounced function that returns void (previous result is lost)
 * @example
 * const handleSearch = debounce((query: string) => apiCall(query), 500);
 * // Multiple rapid calls will only execute the last one after 500ms
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    if (wait <= 0) {
      func(...args);
    } else {
      timeout = setTimeout(() => func(...args), wait);
    }
  };
};

/**
 * Truncate text to maximum length with ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with "..." appended if over maxLength
 * @example
 * truncateText("Hello World", 5) // "Hello..."
 * truncateText("Hi", 5) // "Hi"
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalize the first letter and lowercase the rest
 * @param str The string to capitalize
 * @returns String with first letter uppercase and rest lowercase
 * @example
 * capitalize("hello") // "Hello"
 * capitalize("HELLO") // "Hello"
 * capitalize("hELLO") // "Hello"
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format date to Polish locale format
 * @param date The date to format (Date object or ISO string)
 * @returns Formatted date string in Polish (e.g., "15 października 2024")
 * @example
 * formatDateToPolish(new Date("2024-10-15")) // "15 października 2024"
 * formatDateToPolish("2024-10-15") // "15 października 2024"
 */
export const formatDateToPolish = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Sanitize filename by replacing invalid characters with underscores
 * Removes characters that are not alphanumeric, dots, or hyphens
 * @param filename The filename to sanitize
 * @returns Sanitized filename safe for filesystem operations
 * @example
 * sanitizeFilename("my file (2024).docx") // "my_file__2024_.docx"
 * sanitizeFilename("report@2024#final.pdf") // "report@2024#final.pdf" (actually "report_2024_final.pdf")
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-z0-9.-]/gi, "_");
};