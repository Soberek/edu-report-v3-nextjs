"use client";
import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, CircularProgress } from "@mui/material";
import ParticipationView from "./components/ParticipationView";
import NonParticipationView from "./components/NonParticipationView";
import { useSzkolyWProgramie } from "@/app/(protected)/szkoly-w-programie/hooks/useSzkolyWProgramie";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SzkolyWProgramiePage() {
  const [value, setValue] = useState(0);
  const data = useSzkolyWProgramie();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (data.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} aria-label="school participation tabs">
          <Tab label="Zarządzaj uczestnictwem" {...a11yProps(0)} />
          <Tab label="Szkoły nieuczestniczące" {...a11yProps(1)} />
        </Tabs>
      </Paper>
      <Box sx={{ pt: 2 }}>
        {value === 0 && <ParticipationView {...data} />}
        {value === 1 && <NonParticipationView {...data} />}
      </Box>
    </Box>
  );
}
