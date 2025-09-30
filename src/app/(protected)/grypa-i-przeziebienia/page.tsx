"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { LessonHeader, TabbedInterface } from "./components";

/**
 * Main page component for Flu and Cold Education Module
 * Refactored with tabbed interface for better organization
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

      {/* Tabbed Interface */}
      <TabbedInterface />

      {/* Footer */}
      <Box sx={{ mt: 6, p: 3, backgroundColor: "grey.100", borderRadius: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Materiał edukacyjny przygotowany na podstawie aktualnych wytycznych medycznych. W przypadku wątpliwości skonsultuj się z lekarzem.
        </Typography>
      </Box>
    </Container>
  );
}
