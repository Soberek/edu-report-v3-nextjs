"use client";

import { useForm } from "react-hook-form";
import { Container, Alert, Snackbar, Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import type { CaseRecord } from "@/types";
import { ActForm } from "./components/form";
import { ActCaseRecordsTable } from "./components/table";
import { FilterSection } from "./components/filter-section";
import { PageHeader, LoadingSpinner, EmptyState } from "./components";
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
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaseRecord>({
    defaultValues: DEFAULT_VALUES,
  });

  const {
    actRecords,
    actRecordsError,
    addActRecord,
    actRecordsLoading,
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

  const handleAddActRecord = async (data: CaseRecord) => {
    try {
      await addActRecord(data);
      setSnackbar({
        open: true,
        type: "success",
        message: "Akt sprawy został dodany pomyślnie.",
      });
      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Wystąpił błąd podczas zapisywania danych.",
      });
    }
  };

  const handleDeleteCaseRecord = async (caseId: string) => {
    try {
      await removeActRecord(caseId);
      setSnackbar({
        open: true,
        type: "success",
        message: "Akt sprawy został usunięty pomyślnie.",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Wystąpił błąd podczas usuwania danych.",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render error messages
  const renderErrors = () => {
    if (!actRecordsError) return null;

    const errors = Array.isArray(actRecordsError) ? actRecordsError : [actRecordsError];

    return (
      <Box sx={{ mb: 3 }}>
        {errors.map((error, index) => (
          <Alert key={index} severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        ))}
      </Box>
    );
  };

  const actCodesOptions = useMemo(
    () => actsOptions.map((option) => option.code),
    [actsOptions]
  );

  if (actRecordsLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner
          size={48}
          message="Ładowanie danych..."
          sx={{ minHeight: 400 }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <PageHeader
        title="Spisy Spraw"
        subtitle="Zarządzaj aktami spraw administracyjnych"
      />

      {/* Error Alert */}
      {renderErrors()}

      {/* Add New Act Section */}
      <ActForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={handleAddActRecord}
        errors={errors}
        actsOptions={actCodesOptions}
      />

      {/* Filter and Export Section */}
      <FilterSection
        selectedCode={selectedCode}
        actsOptions={actsOptions}
        sortedCaseRecords={sortedCaseRecords}
        onCodeChange={handleCodeChange}
      />

      {/* Cases Table */}
      <ActCaseRecordsTable
        caseRecords={actRecords}
        loading={actRecordsLoading}
        deleteCaseRecord={handleDeleteCaseRecord}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}