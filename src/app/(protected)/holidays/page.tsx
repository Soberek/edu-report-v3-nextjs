"use client";
import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { PageHeader, ErrorDisplay } from "@/components/shared";
import { useHolidays } from "./hooks";
import { UrlInput, HolidaysList, ActionSection, ResultsSection, ExportSection } from "./components";

// Main component
export default function Holidays() {
  const [url, setUrl] = useState("https://www.kalbi.pl/kalendarz-swiat-nietypowych-pazdziernik");

  const { state, aiLoading, fetchHolidays, extractHealthHolidays, generatePosts, clearError } = useHolidays();

  // Handler functions
  const handleFetchHolidays = () => fetchHolidays(url);
  const handleExtractHealthHolidays = () => extractHealthHolidays();
  const handleGeneratePosts = () => generatePosts();

  // Error handling
  if (state.error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <ErrorDisplay error={state.error} onRetry={clearError} retryText="Spróbuj ponownie" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Nietypowe Święta"
        subtitle="Pobierz, przetwórz i wygeneruj posty na social media dla świąt związanych ze zdrowiem"
      />

      {/* URL Input */}
      <Box sx={{ mb: 4 }}>
        <UrlInput url={url} onUrlChange={setUrl} disabled={state.loading} />
      </Box>

      {/* Action Section */}
      <ActionSection
        onFetchHolidays={handleFetchHolidays}
        onExtractHealthHolidays={handleExtractHealthHolidays}
        onGeneratePosts={handleGeneratePosts}
        loading={state.loading}
        aiLoading={aiLoading}
        hasHolidays={state.holidays.length > 0}
        hasHealthHolidays={state.separatedHolidaysFromOpenAi.length > 0}
      />

      {/* Holidays List */}
      <HolidaysList holidays={state.holidays} loading={state.loading} />

      {/* Results Section */}
      <ResultsSection healthHolidays={state.separatedHolidaysFromOpenAi} posts={state.posts} />

      {/* Export Section */}
      <ExportSection
        posts={state.posts}
        holidays={state.separatedHolidaysFromOpenAi}
        onError={(error) => console.error("Export error:", error)}
      />
    </Container>
  );
}
