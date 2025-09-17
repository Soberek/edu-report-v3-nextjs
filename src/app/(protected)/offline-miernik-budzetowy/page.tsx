"use client";
import React, { useMemo, useCallback } from "react";
import { Box, Typography, Alert } from "@mui/material";

import ExcelUploaderUploadButtons from "./components/upload-buttons";
import ExcelUploaderMonthsButtons from "./components/buttons";
import saveExcelToFile from "./components/useExcelFileSaver";
import ExcelTable from "./components/table";
import { aggregateData } from "./components/processExcelData";
import useExcelFileReader from "./components/useExcelFileReader";
import { useMonthSelection } from "./components/useMonthSelection";

// Memoized components
const MemoizedExcelUploaderMonths = React.memo(ExcelUploaderMonthsButtons);
const MemoizedExcelUploaderUploadButtons = React.memo(ExcelUploaderUploadButtons);
const MemoizedExcelUploaderTable = React.memo(ExcelTable);

// Stats card component
const StatsCard: React.FC<{
  icon: string;
  label: string;
  value: number | undefined;
}> = React.memo(({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      padding: 1.5,
      backgroundColor: "primary.light",
      borderRadius: 1,
      minWidth: 200,
    }}
  >
    <Typography variant="h6" component="span">
      {icon}
    </Typography>
    <Typography variant="body1" fontWeight="medium">
      {label}: {value ?? 0}
    </Typography>
  </Box>
));

const OfflineMiernik: React.FC = () => {
  const { rawData, fileName, handleFileUpload } = useExcelFileReader();
  const { selectedMonths, handleMonthSelect, error } = useMonthSelection();

  const aggregatedData = useMemo(() => aggregateData(rawData, selectedMonths), [rawData, selectedMonths]);

  const handleSaveToExcel = useCallback(() => {
    console.log("Saving to Excel...");
    if (aggregatedData?.aggregated) {
      return saveExcelToFile(aggregatedData.aggregated);
    }
    return false;
  }, [aggregatedData?.aggregated]);

  const hasValidData = aggregatedData && Object.keys(aggregatedData).length > 0;

  return (
    <Box>
      <MemoizedExcelUploaderMonths months={selectedMonths} handleMonthSelect={handleMonthSelect} />

      <MemoizedExcelUploaderUploadButtons
        fileName={fileName}
        handleFileUpload={handleFileUpload}
        saveToExcelFile={handleSaveToExcel}
        error={error}
        data={aggregatedData?.aggregated}
      />

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          marginBottom: 3,
          padding: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          mx: 2,
          mt: 2,
        }}
      >
        <StatsCard icon="👩‍🏫" label="Ogólna liczba działań" value={aggregatedData?.allActions} />
        <StatsCard icon="👨‍👩‍👧‍👦" label="Ogólna liczba odbiorców" value={aggregatedData?.allPeople} />
      </Box>

      {/* Data Table or Error */}
      {error ? (
        <Alert severity="error" sx={{ mx: 2 }}>
          {error}
        </Alert>
      ) : hasValidData ? (
        <MemoizedExcelUploaderTable {...aggregatedData.aggregated} />
      ) : null}
    </Box>
  );
};

export default OfflineMiernik;
