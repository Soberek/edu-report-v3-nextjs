import React from "react";
import { Card, CardContent, Box, Avatar, Typography, Grid, useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";

export interface SkeletonCardProps {
  variant?: "stats" | "content" | "list" | "grid";
  count?: number;
  showAvatar?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showActions?: boolean;
  columns?: number;
  sx?: object;
}

/**
 * Generic skeleton loading component
 * Supports multiple variants for different content types
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = "content",
  count = 1,
  showAvatar = false,
  showTitle = true,
  showSubtitle = true,
  showActions = false,
  columns = 1,
  sx = {},
}) => {
  const theme = useTheme();

  const renderSkeletonContent = () => {
    switch (variant) {
      case "stats":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {showAvatar && (
              <Skeleton variant="circular" width={56} height={56} />
            )}
            <Box sx={{ flex: 1 }}>
              {showTitle && <Skeleton variant="text" width="60%" height={32} />}
              {showSubtitle && <Skeleton variant="text" width="40%" height={20} />}
            </Box>
          </Box>
        );

      case "content":
        return (
          <Box>
            {showAvatar && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={24} />
                  <Skeleton variant="text" width="50%" height={16} />
                </Box>
              </Box>
            )}
            {showTitle && <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />}
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
            {showActions && (
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" width={80} height={32} />
                <Skeleton variant="rectangular" width={80} height={32} />
              </Box>
            )}
          </Box>
        );

      case "list":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} />
              {showSubtitle && <Skeleton variant="text" width="50%" height={16} />}
            </Box>
            {showActions && <Skeleton variant="rectangular" width={60} height={32} />}
          </Box>
        );

      case "grid":
        return (
          <Box>
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 2 }} />
            {showTitle && <Skeleton variant="text" width="80%" height={24} />}
            {showSubtitle && <Skeleton variant="text" width="60%" height={16} />}
          </Box>
        );

      default:
        return <Skeleton variant="rectangular" width="100%" height={100} />;
    }
  };

  const renderSkeletonCard = (key: number) => (
    <Card
      key={key}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        animation: "pulse 2s infinite",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {renderSkeletonContent()}
      </CardContent>
    </Card>
  );

  if (variant === "stats" && columns > 1) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 12 / columns }} key={index}>
            {renderSkeletonCard(index)}
          </Grid>
        ))}
      </Grid>
    );
  }

  if (count === 1) {
    return renderSkeletonCard(0);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => renderSkeletonCard(index))}
    </Box>
  );
};

// Specialized skeleton variants
export const StatsSkeleton: React.FC<{ count?: number; columns?: number }> = ({ 
  count = 4, 
  columns = 4 
}) => (
  <SkeletonCard
    variant="stats"
    count={count}
    columns={columns}
    showAvatar={true}
    showTitle={true}
    showSubtitle={true}
  />
);

export const ContentSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <SkeletonCard
    variant="content"
    count={count}
    showAvatar={true}
    showTitle={true}
    showSubtitle={true}
    showActions={true}
  />
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <SkeletonCard
    variant="list"
    count={count}
    showAvatar={true}
    showTitle={true}
    showSubtitle={true}
    showActions={true}
  />
);

export const GridSkeleton: React.FC<{ count?: number; columns?: number }> = ({ 
  count = 6, 
  columns = 3 
}) => (
  <SkeletonCard
    variant="grid"
    count={count}
    columns={columns}
    showTitle={true}
    showSubtitle={true}
  />
);
