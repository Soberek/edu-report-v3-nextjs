import React from "react";
import { Box } from "@mui/material";
import { TABS, type TabId } from "../../constants";
import { AdvancedStats } from "../data-visualization/AdvancedStats";
import { BarCharts } from "../data-visualization/BarCharts";
import { DataTable } from "../data-visualization/DataTable";
import type { AggregatedData, ExcelRow, Month } from "../../types";

interface TabContentProps {
  readonly activeTab: TabId;
  readonly aggregatedData: AggregatedData;
  readonly selectedMonths: Month[];
  readonly rawData: ExcelRow[];
}

/**
 * Renders content for the active tab
 * Encapsulates tab switching logic and prop passing
 */
export const TabContent: React.FC<TabContentProps> = ({ activeTab, aggregatedData, selectedMonths, rawData }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.ADVANCED_STATS:
        return <AdvancedStats data={aggregatedData} selectedMonths={selectedMonths} rawData={rawData} />;

      case TABS.BAR_CHARTS:
        return <BarCharts rawData={rawData} selectedMonths={selectedMonths} />;

      case TABS.DATA_TABLE:
        return <DataTable data={aggregatedData.aggregated} allActions={aggregatedData.allActions} allPeople={aggregatedData.allPeople} />;

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 3 }} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
      {renderTabContent()}
    </Box>
  );
};
