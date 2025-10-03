"use client";

import React from "react";
import { Container } from "@mui/material";
import HealthInspectionAggregator from "./components/HealthInspectionAggregator";

export default function OchronaZdrowiaPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <HealthInspectionAggregator />
    </Container>
  );
}
