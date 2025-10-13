import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip, Grid } from "@mui/material";
import { ExpandMore, CheckCircle, Cancel } from "@mui/icons-material";
import { MYTHS_AND_FACTS } from "../constants";
import type { MythFact } from "../types";

interface MythsAndFactsProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const MythsAndFacts: React.FC<MythsAndFactsProps> = ({ title = "🧪 Fakty vs Mity", showTitle = true }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={2}>
        {MYTHS_AND_FACTS.map((item, index) => (
          <Grid size={{ xs: 12 }} key={item.id}>
            <Accordion
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
              sx={{
                borderRadius: 2,
                "&:before": { display: "none" },
                boxShadow: 2,
                "&.Mui-expanded": {
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: "grey.50",
                  borderRadius: "8px 8px 0 0",
                  "&.Mui-expanded": {
                    borderRadius: "8px 8px 0 0",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    <Cancel sx={{ color: "error.main", mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "error.main" }}>
                      MIT:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                    {item.myth}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
                      FAKT:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                    {item.fact}
                  </Typography>
                </Box>

                <Card variant="outlined" sx={{ backgroundColor: "info.light", opacity: 0.1 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {item.explanation}
                    </Typography>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
