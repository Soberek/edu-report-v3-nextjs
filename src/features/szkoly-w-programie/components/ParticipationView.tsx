 
"use client";
import React, { useMemo } from "react";
import { Alert, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { SchoolProgramParticipationTable } from "./table";
import { ParticipationForm } from "./ParticipationForm";
import { ProgramStatistics } from "./ProgramStatistics";

import { PageHeader, LoadingSpinner, SelectorWithCounts, NotificationSnackbar } from "@/components/shared";
import { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import type { SchoolYear } from "@/types";
import { createDefaultFormValues } from "../utils";
import { PAGE_CONSTANTS, STYLE_CONSTANTS, UI_CONSTANTS, MESSAGES } from "../constants";
import type { ParticipationFormProps } from "../types";
import { useSzkolyWProgramie } from "@/hooks/useSzkolyWProgramie";

type ParticipationViewProps = ReturnType<typeof useSzkolyWProgramie>;

export default function ParticipationView(props: ParticipationViewProps) {
  const {
    schools,
    contacts,
    programs,
    participations,
    selectedSchoolYear,
    setSelectedSchoolYear,
    availableSchoolYears,
    selectedProgram,
    setSelectedProgram,
    availablePrograms,
    isLoading,
    error,
    lookupMaps,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
    notification,
    closeNotification,
  } = props;

  // Form configuration
  const formMethods = useForm<SchoolProgramParticipationDTO>({
    defaultValues: createDefaultFormValues(),
  });

  const formProps: ParticipationFormProps = {
    schools,
    contacts,
    programs,
    loading: isLoading,
    onSubmit: handleSubmit,
    formMethods,
  };

  // Memoized data for performance
  const memoizedData = useMemo(
    () => ({
      schoolsMap: lookupMaps.schoolsMap,
      contactsMap: lookupMaps.contactsMap,
      programsMap: lookupMaps.programsMap,
    }),
    [lookupMaps]
  );

  const renderLoadingState = () => (
    <Box sx={{ py: 4, px: 2 }}>
      <LoadingSpinner size={48} message={MESSAGES.LOADING.LOADING_DATA} sx={{ minHeight: 400 }} />
    </Box>
  );

  const renderErrorAlert = () =>
    error && (
      <Alert severity="error" sx={{ mb: STYLE_CONSTANTS.SPACING.MEDIUM }}>
        {MESSAGES.ERROR.LOAD_FAILED}: {error}
      </Alert>
    );

  const renderHeader = () => <PageHeader title={PAGE_CONSTANTS.TITLE} subtitle={PAGE_CONSTANTS.SUBTITLE} />;

  const renderFormSection = () => <ParticipationForm {...formProps} />;

  const renderStatisticsSection = () => <ProgramStatistics participations={participations} programs={programs} />;

  const renderSchoolYearSelector = () => {
    const SCHOOL_YEARS: SchoolYear[] = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];
    const displayYears = SCHOOL_YEARS.filter((year) => availableSchoolYears.includes(year));
    const handleYearChange = (value: string) => {
      if (value === "all") {
        setSelectedSchoolYear("all");
        return;
      }
      if (SCHOOL_YEARS.includes(value as SchoolYear)) {
        setSelectedSchoolYear(value as SchoolYear);
      }
    };
    
    return (
      <SelectorWithCounts
        label="Rok szkolny"
        value={selectedSchoolYear}
        items={displayYears.map((year) => ({
          id: year,
          name: year,
          count: participations.filter((p) => p.schoolYear === year).length,
        }))}
        onChange={handleYearChange}
        showAllOption
        allOptionLabel="Wszystkie lata"
        showChipForSelected={true}
      />
    );
  };

  const renderProgramSelector = () => (
    <SelectorWithCounts
      label="Program"
      value={selectedProgram}
      items={availablePrograms.map((p) => ({
        id: p.id,
        name: p.name,
        count: p.participationCount,
      }))}
      onChange={setSelectedProgram}
      showAllOption
      allOptionLabel="Wszystkie programy"
    />
  );

  const renderTableSection = () => (
    <SchoolProgramParticipationTable
      participations={participations}
      schoolsMap={memoizedData.schoolsMap}
      contactsMap={memoizedData.contactsMap}
      programsMap={memoizedData.programsMap}
      errorMessage={error}
      loading={isLoading}
      schools={schools}
      contacts={contacts}
      programs={programs}
      onUpdate={handleUpdateParticipation}
      onDelete={handleDeleteParticipation}
      onAdd={handleSubmit}
    />
  );

  const renderSnackbar = () => (
    <NotificationSnackbar
      notification={notification}
      onClose={closeNotification}
      autoHideDuration={UI_CONSTANTS.SNACKBAR_DURATION}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    />
  );

  if (isLoading) {
    return renderLoadingState();
  }

  return (
    <Box sx={{ py: 4, px: 2 }}>
      {renderHeader()}
      {renderErrorAlert()}
      {renderStatisticsSection()}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {renderSchoolYearSelector()}
        {renderProgramSelector()}
      </Box>
      {renderFormSection()}
      {renderTableSection()}
      {renderSnackbar()}
    </Box>
  );
}
