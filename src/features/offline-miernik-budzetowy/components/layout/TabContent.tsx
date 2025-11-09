import React from "react";
import { Box } from "@mui/material";
import { TABS, type TabId } from "../../constants";
import { AdvancedStats } from "../../taby/statystyki";
import { BarCharts } from "../../taby/wykresy";
import { DataTable } from "../../taby/miernik-budzetowy";
import { IndicatorsView } from "../../taby/wskazniki/components";
import { ExcelTasksTable } from "../../taby/excel-tasks";
import { filterDataBySelectedMonths } from "../../utils/dataFiltering";
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

      case TABS.INDICATORS:
        return <IndicatorsView rawData={rawData} selectedMonths={selectedMonths} />;

      case TABS.EXCEL_TASKS:
        // Filter data to show only rows from selected months
        const filteredData = filterDataBySelectedMonths(rawData, selectedMonths);
        return <ExcelTasksTable rawData={filteredData} />;

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
