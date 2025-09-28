import React from "react";
import { Box, Card, CardContent, Typography, Grid, useTheme, Chip, Fade } from "@mui/material";
import { School, TrendingUp, Assessment, BarChart } from "@mui/icons-material";

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
      {/* Header with icon and description */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2, 
        mb: 3,
        p: 2,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 2px 10px ${theme.palette.primary.main}10`
      }}>
        <Box sx={{
          p: 1.5,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <BarChart sx={{ fontSize: "1.5rem" }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 0.5 }}>
            Statystyki szkół
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
            Przegląd typów szkół w systemie
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Total Schools Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={600}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                borderRadius: 3,
                boxShadow: `0 8px 32px ${theme.palette.primary.main}25`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                },
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: `0 16px 48px ${theme.palette.primary.main}35`,
                  "&::before": {
                    opacity: 1,
                  },
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4, position: "relative", zIndex: 1 }}>
                <Box sx={{
                  display: "inline-flex",
                  p: 2,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  mb: 2,
                  backdropFilter: "blur(10px)",
                }}>
                  <School sx={{ fontSize: "2.5rem", opacity: 0.95 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                  {totalSchools}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.95, fontSize: "1rem", fontWeight: 500 }}>
                  Łącznie szkół
                </Typography>
                <Chip 
                  label="Główna statystyka" 
                  size="small" 
                  sx={{ 
                    mt: 2, 
                    background: "rgba(255,255,255,0.2)", 
                    color: "white",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)"
                  }} 
                />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Type Stats Cards */}
        {typeStats.slice(0, 5).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.type}>
            <Fade in timeout={800 + index * 100}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${getTypeColor(index)} 0%, ${getTypeColor(index)}dd 100%)`,
                  color: "white",
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${getTypeColor(index)}25`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: `0 16px 48px ${getTypeColor(index)}35`,
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 3.5, position: "relative", zIndex: 1 }}>
                  <Box sx={{
                    display: "inline-flex",
                    p: 1.5,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    mb: 2,
                    backdropFilter: "blur(10px)",
                  }}>
                    <Typography variant="h4" sx={{ fontSize: "2rem", lineHeight: 1 }}>
                      {getTypeIcon(stat.type)}
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    {stat.count}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.95,
                      fontSize: "0.85rem",
                      lineHeight: 1.3,
                      height: "2.6rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                    }}
                  >
                    {stat.type}
                  </Typography>
                  <Chip 
                    label={`#${index + 1}`} 
                    size="small" 
                    sx={{ 
                      mt: 1.5, 
                      background: "rgba(255,255,255,0.2)", 
                      color: "white",
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                      fontSize: "0.7rem"
                    }} 
                  />
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Additional Stats Row */}
      {typeStats.length > 5 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {typeStats.slice(5).map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.type}>
              <Fade in timeout={1000 + index * 100}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${getTypeColor(index + 5)} 0%, ${getTypeColor(index + 5)}dd 100%)`,
                    color: "white",
                    borderRadius: 3,
                    boxShadow: `0 6px 24px ${getTypeColor(index + 5)}20`,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(45deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.01)",
                      boxShadow: `0 12px 36px ${getTypeColor(index + 5)}30`,
                      "&::before": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3, position: "relative", zIndex: 1 }}>
                    <Box sx={{
                      display: "inline-flex",
                      p: 1,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      mb: 1.5,
                      backdropFilter: "blur(8px)",
                    }}>
                      <Typography variant="h5" sx={{ fontSize: "1.5rem", lineHeight: 1 }}>
                        {getTypeIcon(stat.type)}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
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
                        justifyContent: "center",
                        fontWeight: 500,
                      }}
                    >
                      {stat.type}
                    </Typography>
                    <Chip 
                      label={`#${index + 6}`} 
                      size="small" 
                      sx={{ 
                        mt: 1, 
                        background: "rgba(255,255,255,0.15)", 
                        color: "white",
                        fontWeight: 600,
                        backdropFilter: "blur(8px)",
                        fontSize: "0.65rem",
                        height: 20
                      }} 
                    />
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
