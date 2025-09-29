import React from "react";
import { Box, Typography, Card, CardContent, Chip, Grid, Avatar } from "@mui/material";
import { School, AccessTime, Group, Book } from "@mui/icons-material";
import { LESSON_CONSTANTS } from "../constants";

interface LessonHeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly estimatedDuration?: number;
  readonly targetAudience?: string;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title = LESSON_CONSTANTS.TITLE,
  subtitle = LESSON_CONSTANTS.SUBTITLE,
  estimatedDuration = LESSON_CONSTANTS.ESTIMATED_DURATION,
  targetAudience = LESSON_CONSTANTS.TARGET_AUDIENCE,
}) => {
  return (
    <Card
      sx={{
        mb: 4,
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)",
        color: "white",
        borderRadius: 4,
        boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              backgroundColor: "rgba(255,255,255,0.25)",
              mr: 2,
              width: 70,
              height: 70,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <School sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}>
              {title}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500, textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTime sx={{ mr: 1, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Czas trwania
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {estimatedDuration} min
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Group sx={{ mr: 1, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Grupa docelowa
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {targetAudience}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Book sx={{ mr: 1, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Poziom
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Podstawowy
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <Chip
                label="Edukacja zdrowotna"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.25)",
                  color: "white",
                  fontWeight: 700,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
