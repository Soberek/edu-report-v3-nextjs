"use client";

import React from "react";
import { Container } from "@mui/material";
import { HealthInspectionAggregator } from "@/features/sprawozdanie-z-tytoniu";

export default function OchronaZdrowiaPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <HealthInspectionAggregator />
    </Container>
  );
}
