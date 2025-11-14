import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
  Theme,
} from "@mui/material";
import { Description, FileDownload } from "@mui/icons-material";
import type { ExcelRow } from "../../types";
import { useGenerateDocument } from "./hooks";
import { GenerateDocumentDialog } from "./components";
import type { GenerateDocumentFormData } from "./schemas";

interface ExcelTasksTableProps {
  rawData: ExcelRow[];
}

/**
 * Component that displays selected tasks from Excel file in a focused table
 * Shows specific columns: Data, Działanie, Liczba działań, Liczba ludzi, Nazwa programu, Osoba odpowiedzialna, Nr informacji, Typ programu
 */
export const ExcelTasksTable: React.FC<ExcelTasksTableProps> = React.memo(({ rawData }) => {
  const theme = useTheme();

  // Define specific columns to display
  const columns = React.useMemo(
    () => [
      "Nr informacji",
      "Działanie",
      "Data",
      "Liczba działań",
      "Liczba ludzi",
      "Nazwa programu",
      "Osoba odpowiedzialna",
      "Typ programu",
    ],
    []
  );

  // Format cell value for display
  const formatCellValue = (value: string | number | undefined, columnName?: string) => {
    if (value === undefined || value === null) return "-";
    if (value === "") return "-";

    // Special formatting for date column
    if (columnName === "Data") {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }
      } catch {
        // If date parsing fails, continue with normal formatting
      }
    }

    if (typeof value === "number") return value.toString();
    return value;
  };

  // Get cell styling based on content type
  const getCellStyle = (value: string | number | undefined, columnName: string) => {
    const baseStyle = {
      fontSize: "0.8rem",
      py: 1,
    };

    // Highlight numeric columns
    if (["Liczba działań", "Liczba ludzi"].includes(columnName)) {
      return {
        ...baseStyle,
        fontWeight: 600,
        color: theme.palette.primary.main,
        textAlign: "right" as const,
      };
    }

    // Style for key text columns
    if (["Typ programu", "Nazwa programu", "Działanie", "Osoba odpowiedzialna"].includes(columnName)) {
      return {
        ...baseStyle,
        fontWeight: 500,
        color: theme.palette.text.primary,
      };
    }

    return baseStyle;
  };

  if (rawData.length === 0) {
    return (
      <Box sx={{ mt: 3, textAlign: "center", py: 4 }}>
        <Description sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Brak danych do wyświetlenia
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sprawdź czy wybrałeś miesiące i wczytałeś plik Excel
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ fontSize: "0.95rem" }}>
          📋 Wszystkie zadania z pliku Excel
        </Typography>
        <Chip label={`${rawData.length} wierszy`} size="small" color="primary" variant="outlined" />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1.5,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          maxHeight: 600,
          overflow: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  py: 1.5,
                  color: "text.primary",
                  position: "sticky",
                  left: 0,
                  backgroundColor: theme.palette.grey[100],
                  zIndex: 2,
                  width: 60,
                }}
              >
                #
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    py: 1.5,
                    color: "text.primary",
                    minWidth: 120,
                  }}
                >
                  {column}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  py: 1.5,
                  color: "text.primary",
                  position: "sticky",
                  right: 0,
                  backgroundColor: theme.palette.grey[100],
                  zIndex: 2,
                  width: 50,
                  textAlign: "center",
                }}
              >
                Akcje
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...rawData].reverse().map((row, displayIndex) => {
              const originalIndex = rawData.length - 1 - displayIndex;
              return (
                <GenerateDocumentRow
                  key={originalIndex}
                  row={row}
                  index={originalIndex}
                  columns={columns}
                  theme={theme}
                  getCellStyle={getCellStyle}
                  formatCellValue={formatCellValue}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="caption" color="text.secondary">
          • Kolumny liczbowe (Liczba działań, Liczba ludzi) wyróżnione są na niebiesko
        </Typography>
        <Typography variant="caption" color="text.secondary">
          • Puste komórki oznaczone jako &quot;-&quot;
        </Typography>
        <Typography variant="caption" color="text.secondary">
          • Daty wyświetlane w formacie DD-MM-YYYY
        </Typography>
        <Typography variant="caption" color="text.secondary">
          • Wymagane kolumny Excel do generowania dokumentu: Nr informacji, Znak sprawy, Typ programu, Nazwa programu, Działanie, Data,
          Liczba ludzi, Liczba działań, Adres, Dodatkowe informacje
        </Typography>
      </Box>
    </Box>
  );
});

ExcelTasksTable.displayName = "ExcelTasksTable";

// Helper component for table row with generate document button
interface GenerateDocumentRowProps {
  row: ExcelRow;
  index: number;
  columns: string[];
  theme: Theme;
  getCellStyle: (value: string | number | undefined, columnName: string) => object;
  formatCellValue: (value: string | number | undefined, columnName?: string) => string;
}

const GenerateDocumentRow: React.FC<GenerateDocumentRowProps> = React.memo(
  ({ row, index, columns, theme, getCellStyle, formatCellValue }) => {
    const { isLoading, isDialogOpen, openDialog, closeDialog, generateDocument } = useGenerateDocument();

    const handleSubmit = async (formData: GenerateDocumentFormData) => {
      await generateDocument(formData);
    };

    return (
      <>
        <TableRow
          hover
          sx={{
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}04`,
            },
            "&:nth-of-type(even)": {
              backgroundColor: theme.palette.grey[50],
            },
          }}
        >
          <TableCell
            sx={{
              fontWeight: 600,
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              position: "sticky",
              left: 0,
              backgroundColor: "inherit",
              zIndex: 1,
            }}
          >
            {index + 1}
          </TableCell>
          {columns.map((column) => {
            const value = row[column];
            return (
              <TableCell key={column} sx={getCellStyle(value, column)}>
                {formatCellValue(value, column)}
              </TableCell>
            );
          })}
          <TableCell
            sx={{
              position: "sticky",
              right: 0,
              backgroundColor: "inherit",
              zIndex: 1,
              textAlign: "center",
              py: 0.5,
            }}
          >
            <Tooltip title="Generuj dokument Word">
              <span>
                <IconButton
                  size="small"
                  onClick={openDialog}
                  disabled={isLoading}
                  sx={{
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}10`,
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={20} /> : <FileDownload fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          </TableCell>
        </TableRow>

        {/* Dialog for editing document data before generation */}
        <GenerateDocumentDialog
          open={isDialogOpen}
          onClose={closeDialog}
          rowData={row}
          rowIndex={index}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </>
    );
  }
);

GenerateDocumentRow.displayName = "GenerateDocumentRow";
