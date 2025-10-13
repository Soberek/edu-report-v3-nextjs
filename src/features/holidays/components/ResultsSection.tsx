import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { ResponseDisplay } from "@/components/shared/response-display";
import type { EducationalHolidayWithQuery, Post } from "../types";

interface ResultsSectionProps {
  healthHolidays: EducationalHolidayWithQuery[];
  posts: Post[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ healthHolidays, posts }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Display separated holidays */}
      {healthHolidays.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Wyodrębnione święta zdrowotne
          </Typography>
          <ResponseDisplay response={healthHolidays} />
        </Paper>
      )}

      {/* Display generated posts */}
      {posts.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Wygenerowane posty
          </Typography>
          <ResponseDisplay response={posts} />
        </Paper>
      )}
    </Box>
  );
};
