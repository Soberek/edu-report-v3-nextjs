"use client";

import React, { useState, useCallback } from "react";
import { Box, Tabs, Tab, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import { PresentationViewer } from "./PresentationViewer";
import { InteractiveQuiz } from "./InteractiveQuiz";
import {
  SymptomComparisonTable,
  DetailedSymptomGuide,
  RedFlagsSection,
  PreventionTips,
  TreatmentMethods,
  VaccinationInfo,
  MythsAndFacts,
  CommonMistakes,
  GoldenRules,
  ResourcesAndReferences,
} from "./index";
import { TAB_CONFIG } from "../constants/presentationData";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

export const TabbedInterface: React.FC = () => {
  const [value, setValue] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);

  const handleFullscreenChange = useCallback((fullscreen: boolean) => {
    setIsFullscreen(fullscreen);
  }, []);

  const tabs = [
    {
      label: TAB_CONFIG.PRESENTATION.label,
      icon: TAB_CONFIG.PRESENTATION.icon,
      description: TAB_CONFIG.PRESENTATION.description,
      content: <PresentationViewer onFullscreen={handleFullscreenChange} />,
    },
    {
      label: TAB_CONFIG.QUIZ.label,
      icon: TAB_CONFIG.QUIZ.icon,
      description: TAB_CONFIG.QUIZ.description,
      content: <InteractiveQuiz />,
    },
    {
      label: TAB_CONFIG.COMPARISON.label,
      icon: TAB_CONFIG.COMPARISON.icon,
      description: TAB_CONFIG.COMPARISON.description,
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <SymptomComparisonTable />
          <DetailedSymptomGuide />
          <RedFlagsSection />
        </Box>
      ),
    },
    {
      label: TAB_CONFIG.RESOURCES.label,
      icon: TAB_CONFIG.RESOURCES.icon,
      description: TAB_CONFIG.RESOURCES.description,
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <TreatmentMethods />
          <PreventionTips />
          <VaccinationInfo />
          <MythsAndFacts />
          <CommonMistakes />
          <GoldenRules />
          <ResourcesAndReferences />
        </Box>
      ),
    },
  ];

  if (isFullscreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.modal,
          backgroundColor: "background.default",
          p: 2,
        }}
      >
        <PresentationViewer onFullscreen={handleFullscreenChange} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              minHeight: 48,
              fontSize: "0.9rem",
              fontWeight: 500,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Box>
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Description */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: "grey.50" }}>
        <Typography variant="body2" color="text.secondary">
          {tabs[value].description}
        </Typography>
      </Paper>

      {/* Tab Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};
