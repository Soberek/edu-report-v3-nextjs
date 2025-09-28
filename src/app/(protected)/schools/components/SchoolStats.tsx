import React from "react";
import { Box, Card, CardContent, Typography, Grid, useTheme } from "@mui/material";
import { School, TrendingUp, Assessment } from "@mui/icons-material";

interface SchoolStatsProps {
  totalSchools: number;
  typeStats: { type: string; count: number }[];
}

export const SchoolStats: React.FC<SchoolStatsProps> = ({ totalSchools, typeStats }) => {
  const theme = useTheme();

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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#1976d2" }}>
        📊 Statystyki szkół
      </Typography>
      
      <Grid container spacing={2}>
        {/* Total Schools Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              borderRadius: 2,
              boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 30px ${theme.palette.primary.main}40`,
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <School sx={{ fontSize: "2.5rem", mb: 1, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {totalSchools}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.9rem" }}>
                Łącznie szkół
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Type Stats Cards */}
        {typeStats.slice(0, 5).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.type}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${getTypeColor(index)} 0%, ${getTypeColor(index)}dd 100%)`,
                color: "white",
                borderRadius: 2,
                boxShadow: `0 4px 20px ${getTypeColor(index)}30`,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 30px ${getTypeColor(index)}40`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" sx={{ mb: 1, fontSize: "2rem" }}>
                  {getTypeIcon(stat.type)}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {stat.count}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9, 
                    fontSize: "0.8rem",
                    lineHeight: 1.2,
                    height: "2.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {stat.type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Stats Row */}
      {typeStats.length > 5 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {typeStats.slice(5).map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.type}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${getTypeColor(index + 5)} 0%, ${getTypeColor(index + 5)}dd 100%)`,
                  color: "white",
                  borderRadius: 2,
                  boxShadow: `0 4px 20px ${getTypeColor(index + 5)}30`,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 30px ${getTypeColor(index + 5)}40`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2.5 }}>
                  <Typography variant="h3" sx={{ mb: 1, fontSize: "1.8rem" }}>
                    {getTypeIcon(stat.type)}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {stat.count}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.9, 
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                      height: "2.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
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
    </Box>
  );
};
