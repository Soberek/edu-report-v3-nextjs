"use client";

import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import {
  LessonHeader,
  SymptomComparisonTable,
  DetailedSymptomGuide,
  RedFlagsSection,
  PreventionTips,
  TreatmentMethods,
  VaccinationInfo,
  MythsAndFacts,
  CommonMistakes,
  InteractiveQuiz,
  GoldenRules,
  ResourcesAndReferences,
} from "./components";

/**
 * Main page component for Flu and Cold Education Module
 * Comprehensive educational resource with interactive components
 */
export default function GrypaIPrzeziebieniaPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Lesson Header */}
      <LessonHeader />

      {/* Introduction */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: 800, mx: "auto" }}>
          Kompleksowy przewodnik edukacyjny o infekcjach wirusowych górnych dróg oddechowych. Materiał przygotowany specjalnie do
          prowadzenia lekcji z nastolatkami i młodzieżą.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Section 1: Symptom Comparison */}
      <SymptomComparisonTable />

      <Divider sx={{ my: 4 }} />

      {/* Section 2: Detailed Symptom Guide */}
      <DetailedSymptomGuide />

      <Divider sx={{ my: 4 }} />

      {/* Section 3: Red Flags */}
      <RedFlagsSection />

      <Divider sx={{ my: 4 }} />

      {/* Section 4: Treatment Methods */}
      <TreatmentMethods />

      <Divider sx={{ my: 4 }} />

      {/* Section 5: Prevention Tips */}
      <PreventionTips />

      <Divider sx={{ my: 4 }} />

      {/* Section 6: Vaccination Information */}
      <VaccinationInfo />

      <Divider sx={{ my: 4 }} />

      {/* Section 7: Myths and Facts */}
      <MythsAndFacts />

      <Divider sx={{ my: 4 }} />

      {/* Section 8: Common Mistakes */}
      <CommonMistakes />

      <Divider sx={{ my: 4 }} />

      {/* Section 9: Interactive Quiz */}
      <InteractiveQuiz />

      <Divider sx={{ my: 4 }} />

      {/* Section 10: Golden Rules */}
      <GoldenRules />

      <Divider sx={{ my: 4 }} />

      {/* Section 11: Resources and References */}
      <ResourcesAndReferences />

      {/* Footer */}
      <Box sx={{ mt: 6, p: 3, backgroundColor: "grey.100", borderRadius: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Materiał edukacyjny przygotowany na podstawie aktualnych wytycznych medycznych. W przypadku wątpliwości skonsultuj się z lekarzem.
        </Typography>
      </Box>
    </Container>
  );
}
