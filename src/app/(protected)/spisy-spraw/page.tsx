"use client";

import { useForm } from "react-hook-form";
import { Container, Alert, Snackbar, Box } from "@mui/material";
import { useCallback, useMemo, useReducer, useRef } from "react";

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

// Reducer types and actions
interface SpisySprawState {
  selectedCode: { code: string; title: string };
  editingCaseRecord: CaseRecord | null;
  editDialogOpen: boolean;
  dialogLoading: boolean;
  snackbar: {
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  };
}

type SpisySprawAction =
  | { type: "SET_SELECTED_CODE"; payload: { code: string; title: string } }
  | { type: "START_EDIT"; payload: CaseRecord }
  | { type: "CLOSE_EDIT_DIALOG" }
  | { type: "SET_DIALOG_LOADING"; payload: boolean }
  | { type: "SHOW_SNACKBAR"; payload: { type: "success" | "error" | "info" | "warning"; message: string } }
  | { type: "CLOSE_SNACKBAR" }
  | { type: "RESET_FORM" };

const initialState: SpisySprawState = {
  selectedCode: INITIAL_SELECTED_CODE,
  editingCaseRecord: null,
  editDialogOpen: false,
  dialogLoading: false,
  snackbar: {
    open: false,
    type: "success",
    message: "",
  },
};

function spisySprawReducer(state: SpisySprawState, action: SpisySprawAction): SpisySprawState {
  switch (action.type) {
    case "SET_SELECTED_CODE":
      return {
        ...state,
        selectedCode: action.payload,
      };

    case "START_EDIT":
      return {
        ...state,
        editingCaseRecord: action.payload,
        editDialogOpen: true,
      };

    case "CLOSE_EDIT_DIALOG":
      return {
        ...state,
        editDialogOpen: false,
        editingCaseRecord: null,
        dialogLoading: false,
      };

    case "SET_DIALOG_LOADING":
      return {
        ...state,
        dialogLoading: action.payload,
      };

    case "SHOW_SNACKBAR":
      return {
        ...state,
        snackbar: {
          open: true,
          type: action.payload.type,
          message: action.payload.message,
        },
      };

    case "CLOSE_SNACKBAR":
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false,
        },
      };

    case "RESET_FORM":
      return {
        ...state,
        editingCaseRecord: null,
        editDialogOpen: false,
        dialogLoading: false,
      };

    default:
      return state;
  }
}

export default function Acts() {
  // Organized state management with useReducer
  const [state, dispatch] = useReducer(spisySprawReducer, initialState);
  const formRef = useRef<any>(null);

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
      .filter((record) => record.code === state.selectedCode.code)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [actRecords, state.selectedCode.code]);

  const handleCodeChange = useCallback(
    (code: string) => {
      const option = actsOptions.find((opt) => opt.code === code);
      dispatch({
        type: "SET_SELECTED_CODE",
        payload: {
          code,
          title: option?.name || "",
        },
      });
    },
    [actsOptions]
  );

  const handleAddActRecord = async (data: CaseRecord) => {
    try {
      await addActRecord(data);
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "success",
          message: "Akt sprawy został dodany pomyślnie.",
        },
      });
      reset();
    } catch (error) {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message: "Wystąpił błąd podczas zapisywania danych.",
        },
      });
    }
  };

  const handleDeleteCaseRecord = async (caseId: string) => {
    try {
      await removeActRecord(caseId);
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "success",
          message: "Akt sprawy został usunięty pomyślnie.",
        },
      });
    } catch (error) {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          type: "error",
          message: "Wystąpił błąd podczas usuwania danych.",
        },
      });
    }
  };

  const handleEditCaseRecord = (caseRecord: CaseRecord) => {
    dispatch({ type: "START_EDIT", payload: caseRecord });
  };

  const handleSaveCaseRecord = async () => {
    if (formRef.current && formRef.current.submit) {
      await formRef.current.submit();
    }
  };

  const handleFormSubmit = async (data: CaseRecord) => {
    if (state.editingCaseRecord) {
      dispatch({ type: "SET_DIALOG_LOADING", payload: true });
      try {
        await updateActRecord(data);
        dispatch({
          type: "SHOW_SNACKBAR",
          payload: {
            type: "success",
            message: "Akt sprawy został zaktualizowany pomyślnie.",
          },
        });
        dispatch({ type: "CLOSE_EDIT_DIALOG" });
      } catch (error) {
        dispatch({
          type: "SHOW_SNACKBAR",
          payload: {
            type: "error",
            message: "Wystąpił błąd podczas aktualizacji danych.",
          },
        });
      } finally {
        dispatch({ type: "SET_DIALOG_LOADING", payload: false });
      }
    }
  };

  const handleCloseEditDialog = () => {
    dispatch({ type: "CLOSE_EDIT_DIALOG" });
  };

  const handleCloseSnackbar = () => {
    dispatch({ type: "CLOSE_SNACKBAR" });
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
        selectedCode={state.selectedCode}
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
        open={state.snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={state.snackbar.type} sx={{ width: "100%" }}>
          {state.snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit Dialog */}
      <EditDialog
        open={state.editDialogOpen}
        onClose={handleCloseEditDialog}
        title="Edytuj akt sprawy"
        onSave={handleSaveCaseRecord}
        loading={state.dialogLoading}
        maxWidth="lg"
      >
        <EditActForm ref={formRef} caseRecord={state.editingCaseRecord} actsOptions={actCodesOptions} onSubmit={handleFormSubmit} />
      </EditDialog>
    </Container>
  );
}
