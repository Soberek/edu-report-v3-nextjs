"use client";

import { useForm } from "react-hook-form";
import { Container, Alert, Snackbar, Box } from "@mui/material";
import { useCallback, useMemo, useState, useRef } from "react";

import type { CaseRecord } from "@/types";
import { ActForm } from "./components/form";
import { ActCaseRecordsTable } from "./components/table";
import { FilterSection } from "./components/filter-section";
import { EditActForm } from "./components/EditActForm";
import { PageHeader, LoadingSpinner, EmptyState, EditDialog } from "./components";
import { WYKAZ_AKT } from "@/constants/acts";
import { useAct } from "@/hooks/useAct";
import { getTodayForInput } from "@/utils/shared/dayjsUtils";

const DEFAULT_VALUES: Omit<CaseRecord, "id" | "createdAt" | "userId"> = {
  code: "",
  referenceNumber: "OZiPZ.966",
  date: getTodayForInput(),
  title: "",
  startDate: getTodayForInput(),
  endDate: getTodayForInput(),
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
  const [editingCaseRecord, setEditingCaseRecord] = useState<CaseRecord | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const formRef = useRef<any>(null);

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

  const { actRecords, actRecordsError, addActRecord, actRecordsLoading, removeActRecord, updateActRecord } = useAct();

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

  const handleEditCaseRecord = (caseRecord: CaseRecord) => {
    setEditingCaseRecord(caseRecord);
    setEditDialogOpen(true);
  };

  const handleSaveCaseRecord = async () => {
    if (formRef.current && formRef.current.submit) {
      await formRef.current.submit();
    }
  };

  const handleFormSubmit = async (data: CaseRecord) => {
    if (editingCaseRecord) {
      setDialogLoading(true);
      try {
        await updateActRecord(data);
        setSnackbar({
          open: true,
          type: "success",
          message: "Akt sprawy został zaktualizowany pomyślnie.",
        });
        setEditDialogOpen(false);
        setEditingCaseRecord(null);
      } catch (error) {
        setSnackbar({
          open: true,
          type: "error",
          message: "Wystąpił błąd podczas aktualizacji danych.",
        });
      } finally {
        setDialogLoading(false);
      }
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCaseRecord(null);
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

  const actCodesOptions = useMemo(() => actsOptions.map((option) => option.code), [actsOptions]);

  if (actRecordsLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner size={48} message="Ładowanie danych..." sx={{ minHeight: 400 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <PageHeader title="Spisy Spraw" subtitle="Zarządzanie aktami spraw administracyjnych" />

      {/* Error Alert */}
      {renderErrors()}

      {/* Add New Act Section */}
      <ActForm control={control} handleSubmit={handleSubmit} onSubmit={handleAddActRecord} errors={errors} actsOptions={actCodesOptions} />

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
        editCaseRecord={handleEditCaseRecord}
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

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        title="Edytuj akt sprawy"
        onSave={handleSaveCaseRecord}
        loading={dialogLoading}
        maxWidth="lg"
      >
        <EditActForm ref={formRef} caseRecord={editingCaseRecord} actsOptions={actCodesOptions} onSubmit={handleFormSubmit} />
      </EditDialog>
    </Container>
  );
}
