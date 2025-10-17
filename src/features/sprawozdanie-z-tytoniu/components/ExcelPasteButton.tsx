import React, { useState } from "react";
import ExcelJS from "exceljs";
import { Button, CircularProgress, Box, TextField } from "@mui/material";

interface AggregatedDataType {
  [key: string]: {
    skontrolowane: number;
    realizowane: number;
    zWykorzystaniemPalarni: number;
  };
}

interface ExcelPasteButtonProps {
  aggregatedData: AggregatedDataType;
}

const ExcelPasteButton: React.FC<ExcelPasteButtonProps> = ({ aggregatedData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const [month, setMonth] = useState("");

  // Default title logic
  const getDefaultTitle = () => {
    const m = month || new Date().toLocaleString("pl-PL", { month: "long", year: "numeric" });
    return `Załacznik nr 1 - Tabela sprawozdawcza tytoń ${m}`;
  };

  const handleExportReport = async () => {
    setIsProcessing(true);
    try {
      // Validate aggregated data
      if (!aggregatedData || Object.keys(aggregatedData).length === 0) {
        alert("Brak danych do eksportu!");
        setIsProcessing(false);
        return;
      }

      console.log("Starting export with data:", aggregatedData);

      // Load template from public folder
      const response = await fetch("/tyton/tyton.xlsx");
      if (!response.ok) throw new Error("Failed to load template file");
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) throw new Error("No worksheet found in template");
      
      console.log("Template loaded successfully");

      // Update cells with aggregated data (rows 7-16 for 10 facility types)
      const types = Object.keys(aggregatedData);
      console.log("Updating", types.length, "facility types");

      types.forEach((type, i) => {
        const rowNum = i + 7;
        console.log(`Writing row ${rowNum}: ${type} - skontrolowane: ${aggregatedData[type].skontrolowane}, realizowane: ${aggregatedData[type].realizowane}, z palarni: ${aggregatedData[type].zWykorzystaniemPalarni}`);
        
        // Always write values to cells
        worksheet.getCell(`C${rowNum}`).value = aggregatedData[type].skontrolowane;
        worksheet.getCell(`D${rowNum}`).value = aggregatedData[type].realizowane;
        worksheet.getCell(`E${rowNum}`).value = aggregatedData[type].zWykorzystaniemPalarni;
      });
      
      console.log("Data written to worksheet");

      // Generate and download file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = fileTitle?.trim() ? `${fileTitle.trim()}.xlsx` : `${getDefaultTitle()}.xlsx`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("File exported successfully as:", fileName);
      alert("Raport został pomyślnie wyeksportowany!");
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      alert("Błąd podczas eksportu pliku: " + (error instanceof Error ? error.message : "Nieznany błąd"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap", mt: 3 }}>
      <TextField
        label="Tytuł pliku (opcjonalnie)"
        placeholder="np. Załacznik nr 1"
        value={fileTitle}
        onChange={(e) => setFileTitle(e.target.value)}
        size="small"
        disabled={isProcessing}
        sx={{ minWidth: 300 }}
      />
      <TextField
        label="Miesiąc (opcjonalnie)"
        placeholder="np. sierpień 2025"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        size="small"
        disabled={isProcessing}
        sx={{ minWidth: 200 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleExportReport}
        disabled={isProcessing}
        startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ height: 40 }}
      >
        {isProcessing ? "Eksportowanie..." : "Export Raport"}
      </Button>
    </Box>
  );
};

export default ExcelPasteButton;
