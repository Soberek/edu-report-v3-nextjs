import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box, useTheme, Skeleton } from "@mui/material";
import { TrendingUp, TrendingDown, TrendingFlat } from "@mui/icons-material";

type ColorVariant = "primary" | "secondary" | "success" | "warning" | "error" | "info";

const GRADIENT_MAP: Record<ColorVariant, string> = {
  primary: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
  secondary: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)",
  success: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
  warning: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
  error: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
  info: "linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)",
};

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "flat";
    period?: string;
  };
  color?: ColorVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  sx?: object;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({
  title,
  value,
  subtitle,
  trend,
  color = "primary",
  icon,
  loading = false,
  sx = {},
}) => {
  const theme = useTheme();

  const getTrendIcon = useMemo(() => {
    if (!trend) return null;

    const iconProps = { sx: { fontSize: 16 } };
    switch (trend.direction) {
      case "up":
        return <TrendingUp {...iconProps} sx={{ ...iconProps.sx, color: "success.main" }} />;
      case "down":
        return <TrendingDown {...iconProps} sx={{ ...iconProps.sx, color: "error.main" }} />;
      default:
        return <TrendingFlat {...iconProps} sx={{ ...iconProps.sx, color: "text.secondary" }} />;
    }
  }, [trend]);

  const trendColor = useMemo(() => {
    if (!trend) return "text.secondary";

    switch (trend.direction) {
      case "up":
        return "success.main";
      case "down":
        return "error.main";
      default:
        return "text.secondary";
    }
  }, [trend]);

  const gradient = useMemo(() => GRADIENT_MAP[color], [color]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: theme.shadows[3],
        background: gradient,
        color: "white",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2, position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mt: 0.5,
                lineHeight: 1,
              }}
              aria-label={`${title}: ${value}`}
            >
              {loading ? <Skeleton width="60%" height={40} sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }} /> : value}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  mt: 1,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                opacity: 0.3,
                "& svg": {
                  fontSize: 48,
                },
              }}
              aria-hidden="true"
            >
              {icon}
            </Box>
          )}
        </Box>

        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5 }}>
            {getTrendIcon}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: trendColor,
              }}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </Typography>
            {trend.period && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  ml: 1,
                }}
              >
                {trend.period}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Decorative background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
    </Card>
  );
});

StatsCard.displayName = "StatsCard";

// Compact stats card variant
export const CompactStatsCard: React.FC<Omit<StatsCardProps, "subtitle" | "trend">> = React.memo((props) => <StatsCard {...props} />);

CompactStatsCard.displayName = "CompactStatsCard";
