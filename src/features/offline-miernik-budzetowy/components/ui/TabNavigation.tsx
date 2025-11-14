import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Assessment, BarChart, TableChart, ListAlt } from "@mui/icons-material";
import { TAB_CONFIG, UI_CONFIG, type TabId } from "../../constants";

interface TabNavigationProps {
  readonly activeTab: TabId;
  readonly onTabChange: (tabId: TabId) => void;
  readonly disabled?: boolean;
}

/**
 * Tab navigation component for budget meter data visualization
 * Provides clean interface for switching between different data views
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, disabled = false }) => {
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabId) => {
    onTabChange(newValue);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Assessment":
        return <Assessment />;
      case "BarChart":
        return <BarChart />;
      case "TableChart":
        return <TableChart />;
      case "ListAlt":
        return <ListAlt />;
      default:
        return <Assessment />; // Fallback icon instead of null
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
          },
        }}
      >
        {TAB_CONFIG.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            icon={getIconComponent(tab.icon)}
            label={tab.label}
            iconPosition="start"
            disabled={disabled}
            data-testid={tab.testId}
            sx={{ minHeight: UI_CONFIG.MIN_TAB_HEIGHT }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
