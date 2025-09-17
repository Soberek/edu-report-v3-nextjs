"use client";
import { useForm } from "react-hook-form";
import { Alert, Box, MenuItem, Select } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import type { CaseRecord } from "@/types";
import { ActForm } from "./components/form";
import { ActCaseRecordsTable } from "./components/table";
import { ActRecordsPdfPreview } from "./components/pdf-preview";
import { WYKAZ_AKT } from "@/constants/acts";
import { useAct } from "@/hooks/useAct";

const DEFAULT_VALUES: Omit<CaseRecord, "id" | "createdAt" | "userId"> = {
  code: "",
  referenceNumber: "OZiPZ.966",
  date: new Date().toISOString().split("T")[0],
  title: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  comments: "OZ",
  sender: "-",
  notes: "",
};

const INITIAL_SELECTED_CODE = {
  code: "0442",
  title: "Sprawozdawczość statystyczna",
};

export default function Acts() {
  const [selectedCode, setSelectedCode] = useState(INITIAL_SELECTED_CODE);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CaseRecord>({
    defaultValues: DEFAULT_VALUES,
  });

  const {
    actRecords,
    actRecordsError,
    addActRecord,
    actRecordsLoading,
    // updateActRecord,
    removeActRecord,
  } = useAct();
  const actsOptions = useMemo(() => {
    return Object.values(WYKAZ_AKT).reduce<{ code: string; name: string }[]>((acc, akt) => {
      acc.push({ code: akt.code, name: akt.name });

      if (akt.subCategories) {
        acc.push(
          ...Object.values(akt.subCategories).map((sub) => ({
            code: sub.code,
            name: sub.name,
          }))
        );
      }

      return acc;
    }, []);
  }, []);

  const sortedCaseRecords = useMemo(() => {
    return actRecords
      .filter((record) => record.code === selectedCode.code)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [actRecords, selectedCode.code]);

  const handleCodeChange = useCallback(
    (code: string) => {
      const option = actsOptions.find((opt) => opt.code === code);
      setSelectedCode({
        code,
        title: option?.name || "",
      });
    },
    [actsOptions]
  );

  const renderErrors = () => {
    if (!actRecordsError) return null;

    const errors = Array.isArray(actRecordsError) ? actRecordsError : [actRecordsError];

    return errors.map((error, index) => (
      <Alert key={index} severity="error">
        {error}
      </Alert>
    ));
  };

  const renderCodeSelect = () => (
    <Box sx={{ mb: 2, display: "flex", gap: 2, mx: 2 }}>
      <Select
        value={selectedCode.code}
        onChange={(event) => handleCodeChange(event.target.value)}
        displayEmpty
        inputProps={{ "aria-label": "Choose code" }}
      >
        <MenuItem value="" disabled>
          <em>Choose code</em>
        </MenuItem>
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {actsOptions.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.code} - {option.name}
          </MenuItem>
        ))}
      </Select>

      <ActRecordsPdfPreview
        caseRecords={sortedCaseRecords}
        selectedCode={selectedCode.code}
        title={selectedCode.title}
        year="2025"
      />
    </Box>
  );

  return (
    <>
      {renderErrors()}

      <ActForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={addActRecord}
        errors={errors}
        actsOptions={actsOptions.map((option) => option.code)}
      />

      {renderCodeSelect()}

      <ActCaseRecordsTable caseRecords={actRecords} loading={actRecordsLoading} deleteCaseRecord={removeActRecord} />
    </>
  );
}
