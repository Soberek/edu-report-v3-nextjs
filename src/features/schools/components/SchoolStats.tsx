import React, { useState } from "react";
import { Box, Typography, useTheme, Button, Collapse } from "@mui/material";
import { BarChart, ExpandMore, ExpandLess } from "@mui/icons-material";

interface SchoolStatsProps {
  totalSchools: number;
  typeStats: { type: string; count: number }[];
}

export const SchoolStats: React.FC<SchoolStatsProps> = ({ totalSchools, typeStats }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // const getTypeIcon = (type: string) => {
  //   if (type.includes("podstawowa")) return "🏫";
  //   if (type.includes("liceum")) return "🎓";
  //   if (type.includes("technikum")) return "⚙️";
  //   if (type.includes("przedszkole")) return "🧸";
  //   if (type.includes("żłobek")) return "👶";
  //   if (type.includes("branżowa")) return "🔧";
  //   if (type.includes("specjalna")) return "♿";
  //   return "📚";
  // };

  const getTypeGradient = (index: number) => {
    const gradients = [
      `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
      `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
      `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
      `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
      `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
      `linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)`,
      `linear-gradient(135deg, #ff9800 0%, #f57c00 100%)`,
      `linear-gradient(135deg, #4caf50 0%, #388e3c 100%)`,
      `linear-gradient(135deg, #2196f3 0%, #1976d2 100%)`,
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Compact Toggle Button */}
      <Button
        variant="outlined"
        onClick={() => setIsExpanded(!isExpanded)}
        startIcon={<BarChart />}
        endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
        sx={{
          mb: 2,
          px: 3,
          py: 1,
          borderRadius: 2,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "0.9rem",
          "&:hover": {
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.main,
            color: "white",
          },
        }}
      >
        Statystyki szkół ({totalSchools} szkół)
      </Button>

      {/* Collapsible Stats Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            p: 2,
            background: theme.palette.grey[50],
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Total Schools - Ultra Compact */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              background: getTypeGradient(0),
              color: "white",
              borderRadius: 2,
              minWidth: "fit-content",
              boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              {totalSchools}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
              szkół
            </Typography>
          </Box>

          {/* Type Stats - Ultra Compact */}
          {typeStats.map((stat, index) => (
            <Box
              key={stat.type}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                background: getTypeGradient(index + 1),
                color: "white",
                borderRadius: 2,
                minWidth: "fit-content",
                boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
                {stat.count}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.7rem", maxWidth: "80px" }}>
                {stat.type}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
