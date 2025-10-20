"use client";
import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { ParticipationView, NonParticipationView } from "@/features/szkoly-w-programie";
import { SchoolParticipationProvider } from "@/features/szkoly-w-programie/context/SchoolParticipationContext";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SzkolyWProgramiePage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <SchoolParticipationProvider>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange} aria-label="school participation tabs">
            <Tab label="Zarządzaj uczestnictwem" {...a11yProps(0)} />
            <Tab label="Szkoły nieuczestniczące" {...a11yProps(1)} />
          </Tabs>
        </Paper>
        <Box sx={{ pt: 2 }}>
          {value === 0 && <ParticipationView />}
          {value === 1 && <NonParticipationView />}
        </Box>
      </Box>
    </SchoolParticipationProvider>
  );
}
