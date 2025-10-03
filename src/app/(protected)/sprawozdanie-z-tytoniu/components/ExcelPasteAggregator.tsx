import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Box, Typography } from "@mui/material";
import { aggregateHealthData } from "../utils/fileProcessing";
import { HealthInspectionRow } from "../types";

const ExcelPasteAggregator: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("Processing...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // Parse data for aggregation
      const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, range: 4 });
      // Aggregate only rows 7-16
      const aggregated = aggregateHealthData([{ fileName: file.name, data: data as HealthInspectionRow[] }]);
      // Paste results back to same cells (C7–C16, D7–D16, E7–E16)
      const types = Object.keys(aggregated);
      types.forEach((type, i) => {
        worksheet[`C${i + 7}`] = { t: "n", v: aggregated[type].skontrolowane };
        worksheet[`D${i + 7}`] = { t: "n", v: aggregated[type].realizowane };
        worksheet[`E${i + 7}`] = { t: "n", v: aggregated[type].zWykorzystaniemPalarni };
      });
      XLSX.writeFile(workbook, `agregacja_${file.name}`);
      setStatus("Success! File updated and downloaded.");
    } catch {
      setStatus("Error processing file.");
    }
  };

  return (
    <Box>
      <Typography variant="h6">Wgraj plik Excel do agregacji</Typography>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        {fileName}
      </Typography>
      <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
        {status}
      </Typography>
    </Box>
  );
};

export default ExcelPasteAggregator;
