import React, { useRef, useState } from "react";
import ExcelJS from "exceljs";
import { Button, CircularProgress } from "@mui/material";

interface ExcelPasteButtonProps {
  aggregatedData: any;
}

const ExcelPasteButton: React.FC<ExcelPasteButtonProps> = ({ aggregatedData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const [month, setMonth] = useState("");

  // Default title logic
  const getDefaultTitle = () => {
    const m = month || new Date().toLocaleString("pl-PL", { month: "long", year: "numeric" });
    return `Załacznik nr 1 - Tabela sprawozdawcza tytoń ${m}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) throw new Error("No worksheet found");
      const types = Object.keys(aggregatedData);
      types.forEach((type, i) => {
        const rowNum = i + 7;
        const cCell = worksheet.getCell(`C${rowNum}`);
        const dCell = worksheet.getCell(`D${rowNum}`);
        const eCell = worksheet.getCell(`E${rowNum}`);
        if (cCell && cCell.value !== null && cCell.value !== undefined) {
          cCell.value = aggregatedData[type].skontrolowane;
        }
        if (dCell && dCell.value !== null && dCell.value !== undefined) {
          dCell.value = aggregatedData[type].realizowane;
        }
        if (eCell && eCell.value !== null && eCell.value !== undefined) {
          eCell.value = aggregatedData[type].zWykorzystaniemPalarni;
        }
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileTitle || getDefaultTitle()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error updating Excel file:", error);
      alert("Błąd podczas aktualizacji pliku Excel");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 24 }}>
        <input
          type="text"
          placeholder="Tytuł pliku (opcjonalnie)"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
          style={{ minWidth: 320, padding: 8, fontSize: 16 }}
        />
        <input
          type="text"
          placeholder="Miesiąc (np. sierpień 2025)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ minWidth: 180, padding: 8, fontSize: 16 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 0 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isProcessing ? "Przetwarzanie..." : "Export Raport"}
        </Button>
      </div>
    </>
  );
};

export default ExcelPasteButton;
