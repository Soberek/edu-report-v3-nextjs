import React from "react";
import { Box, Typography, List, ListItem, Link, Paper } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import type { Holiday } from "../types";

interface HolidaysListProps {
  holidays: Holiday[];
  loading?: boolean;
}

export const HolidaysList: React.FC<HolidaysListProps> = ({ holidays, loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ mt: 2, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Ładowanie...
        </Typography>
      </Box>
    );
  }

  if (holidays.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <CalendarToday color="primary" />
        <Typography variant="h6" color="primary" fontWeight="bold">
          Liczba świąt: {holidays.length}
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 2, maxHeight: 400, overflow: "auto" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
          Pobrane święta:
        </Typography>

        <List dense>
          {holidays.map((holiday, index) => (
            <ListItem key={`${holiday.date}-${index}`} sx={{ px: 0 }}>
              <Link
                href={holiday.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CalendarToday fontSize="small" />
                <Typography variant="body2">
                  {holiday.date} - {holiday.name}
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
