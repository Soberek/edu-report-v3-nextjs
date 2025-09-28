import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid, useTheme, Chip, Fade, Button, Collapse } from "@mui/material";
import { School, TrendingUp, Assessment, BarChart, ExpandMore, ExpandLess } from "@mui/icons-material";

interface SchoolStatsProps {
  totalSchools: number;
  typeStats: { type: string; count: number }[];
}

export const SchoolStats: React.FC<SchoolStatsProps> = ({ totalSchools, typeStats }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type: string) => {
    if (type.includes("podstawowa")) return "🏫";
    if (type.includes("liceum")) return "🎓";
    if (type.includes("technikum")) return "⚙️";
    if (type.includes("przedszkole")) return "🧸";
    if (type.includes("żłobek")) return "👶";
    if (type.includes("branżowa")) return "🔧";
    if (type.includes("specjalna")) return "♿";
    return "📚";
  };

  const getTypeColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
    ];
    return colors[index % colors.length];
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

        <Grid container spacing={2}>
          {/* Total Schools Card - Compact */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                borderRadius: 2,
                boxShadow: `0 4px 16px ${theme.palette.primary.main}20`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <School sx={{ fontSize: "1.8rem", mb: 1, opacity: 0.9 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {totalSchools}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.85rem" }}>
                  Łącznie szkół
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Type Stats Cards - Compact */}
          {typeStats.slice(0, 5).map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.type}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${getTypeColor(index)} 0%, ${getTypeColor(index)}dd 100%)`,
                  color: "white",
                  borderRadius: 2,
                  boxShadow: `0 4px 16px ${getTypeColor(index)}20`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${getTypeColor(index)}30`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="h5" sx={{ mb: 1, fontSize: "1.5rem" }}>
                    {getTypeIcon(stat.type)}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.count}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontSize: "0.8rem",
                      lineHeight: 1.2,
                      height: "2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

        {/* Additional Stats Row - Compact */}
        {typeStats.length > 5 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {typeStats.slice(5).map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.type}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${getTypeColor(index + 5)} 0%, ${getTypeColor(index + 5)}dd 100%)`,
                    color: "white",
                    borderRadius: 2,
                    boxShadow: `0 4px 16px ${getTypeColor(index + 5)}20`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 24px ${getTypeColor(index + 5)}30`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontSize: "1.3rem" }}>
                      {getTypeIcon(stat.type)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.count}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                        height: "1.8rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.type}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Collapse>
    </Box>
  );
};
