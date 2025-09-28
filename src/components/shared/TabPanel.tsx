import React from "react";
import { Box, Typography } from "@mui/material";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: object;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, sx = {}, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
};

// Tab panel with animation
export const AnimatedTabPanel: React.FC<TabPanelProps> = ({ children, value, index, sx = {}, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`animated-tabpanel-${index}`} aria-labelledby={`animated-tab-${index}`} {...other}>
      {value === index && (
        <Box
          sx={{
            p: 3,
            animation: "fadeIn 0.3s ease-in-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            ...sx,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};
