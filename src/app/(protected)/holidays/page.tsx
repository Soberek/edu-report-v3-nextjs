"use client";
import React, { useState } from "react";
import { AdminOnly } from "@/components/auth";
import { Container, Box } from "@mui/material";
import { PageHeader, ErrorDisplay } from "@/components/shared";
import { useHolidays } from "./hooks";
import { useHolidayGraphics } from "./hooks/useHolidayGraphics";
import { UrlInput, HolidaysList, ActionSection, ResultsSection, ExportSection, MockTemplateTest } from "./components";
import { GeneratedPostsWithGraphics } from "./components/GeneratedPostsWithGraphics";
import type { GeneratedImagePostImagesResult } from "@/services/generatedImagePostImagesService";
import type { HolidayTemplateConfig, GeneratedPostWithGraphics } from "./types";

// Main component
export default function Holidays() {
  return (
    <AdminOnly>
      <HolidaysContent />
    </AdminOnly>
  );
}

function HolidaysContent() {
  const [url, setUrl] = useState("https://www.kalbi.pl/kalendarz-swiat-nietypowych-pazdziernik");
  const [postImagesResults, setPostImagesResults] = useState<GeneratedImagePostImagesResult<GeneratedPostWithGraphics>[]>([]);

  const { state, aiLoading, fetchHolidays, extractHealthHolidays, generatePosts, clearError } = useHolidays();
  const {
    state: graphicsState,
    generatePostsWithGraphics,
    refreshGraphics,
    clearError: clearGraphicsError,
    setTemplateConfig,
    updatePost,
    templateConfig,
  } = useHolidayGraphics();

  // Handler functions
  const handleFetchHolidays = () => fetchHolidays(url);
  const handleExtractHealthHolidays = () => extractHealthHolidays();
  const handleGeneratePosts = () => generatePosts();
  const handleGeneratePostsWithGraphics = () => generatePostsWithGraphics(state.separatedHolidaysFromOpenAi);
  const handleRefreshGraphics = () => refreshGraphics();
  const handleTemplateConfigUpdate = (config: HolidayTemplateConfig) => {
    setTemplateConfig(config);
  };

  const handlePostUpdate = (updatedPost: GeneratedPostWithGraphics) => {
    updatePost(updatedPost);
  };

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
        onGeneratePostsWithGraphics={handleGeneratePostsWithGraphics}
        onRefreshGraphics={handleRefreshGraphics}
        onTemplateConfigUpdate={handleTemplateConfigUpdate}
        loading={state.loading}
        aiLoading={aiLoading}
        graphicsLoading={graphicsState.loading}
        hasHolidays={state.holidays.length > 0}
        hasHealthHolidays={state.separatedHolidaysFromOpenAi.length > 0}
        hasGeneratedPosts={graphicsState.posts.length > 0}
      />

      {/* Holidays List */}
      <HolidaysList holidays={state.holidays} loading={state.loading} />

      {/* Results Section */}
      <ResultsSection healthHolidays={state.separatedHolidaysFromOpenAi} posts={state.posts} />

      {/* Generated Posts with Graphics */}
      <Box sx={{ mb: 4 }}>
        <GeneratedPostsWithGraphics
          posts={graphicsState.posts}
          loading={graphicsState.loading}
          error={graphicsState.error}
          onError={clearGraphicsError}
          onPostImagesResultsChange={setPostImagesResults}
          onPostUpdate={handlePostUpdate}
          templateConfig={templateConfig}
        />
      </Box>

      {/* Export Section */}
      <ExportSection
        posts={state.posts}
        holidays={state.separatedHolidaysFromOpenAi}
        generatedPostsWithGraphics={graphicsState.posts}
        postImagesResults={postImagesResults}
        onError={(error) => console.error("Export error:", error)}
      />

      {/* Mock Template Test Section */}
      <Box sx={{ mt: 6 }}>
        <MockTemplateTest />
      </Box>
    </Container>
  );
}
