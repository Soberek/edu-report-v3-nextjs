import { VALID_FILE_EXTENSIONS, MAX_FILE_SIZE, ERROR_MESSAGES, type ExcelRow } from "../types";

/**
 * Validates if a file is a valid Excel file
 */
export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file extension
  const hasValidExtension = VALID_FILE_EXTENSIONS.some((ext) => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }
  
  return { isValid: true };
};

/**
 * Reads Excel file and returns parsed data
 */
export const readExcelFile = (file: File): Promise<{ fileName: string; data: ExcelRow[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          throw new Error(ERROR_MESSAGES.FILE_READ_ERROR);
        }
        
        // Dynamic import to avoid bundling XLSX in the main bundle
        import("xlsx").then((XLSX) => {
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          
          resolve({
            fileName: file.name,
            data,
          });
        }).catch(reject);
      } catch (error) {
        reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
