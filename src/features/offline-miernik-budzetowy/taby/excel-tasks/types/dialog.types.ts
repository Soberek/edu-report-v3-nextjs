import type { ExcelRow } from "../../../types";
import type { GenerateDocumentFormData } from "../schemas";

/**
 * Dialog props interface
 * Defines the contract for GenerateDocumentDialog component
 */
export interface GenerateDocumentDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly rowData: ExcelRow;
  readonly rowIndex: number;
  readonly onSubmit: (data: GenerateDocumentFormData) => Promise<void>;
  readonly isLoading?: boolean;
}
