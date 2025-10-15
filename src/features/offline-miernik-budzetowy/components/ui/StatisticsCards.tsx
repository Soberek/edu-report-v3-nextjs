import React from "react";
import { Box } from "@mui/material";
import { StatsCard } from "@/components/shared";
import { UI_CONFIG } from "../../constants";
import type { AggregatedData } from "../../types";

interface StatisticsCardsProps {
  readonly data: AggregatedData;
  readonly show: boolean;
}

/**
 * Statistics cards section component
 * Displays key metrics in a responsive grid layout
 */
export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data, show }) => {
  if (!show) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: UI_CONFIG.CARD_SPACING,
        flexWrap: "wrap",
        justifyContent: UI_CONFIG.STATS_GRID_BREAKPOINT,
        mb: UI_CONFIG.SECTION_SPACING,
      }}
    >
      <StatsCard title="Ogólna liczba działań" value={data.allActions} color="primary" />
      <StatsCard title="Ogólna liczba odbiorców" value={data.allPeople} color="success" />
    </Box>
  );
};
