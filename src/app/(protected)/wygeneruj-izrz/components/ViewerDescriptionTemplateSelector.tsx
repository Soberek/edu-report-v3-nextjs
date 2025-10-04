import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { viewerDescriptionTemplates } from "../schemas/izrzSchemas";

interface Props {
  onSelect: (description: string) => void;
}

export const TaskDescriptionTemplateSelector: React.FC<Props> = ({ onSelect }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Wstaw opis zadania z szablonu:
    </Typography>
    <Stack direction="row" spacing={0} flexWrap="wrap" sx={{ gap: 1 }}>
      {viewerDescriptionTemplates.map((tpl) => (
        <Button key={tpl.key} variant="outlined" size="small" onClick={() => onSelect(tpl.description)} sx={{ minWidth: 120 }}>
          {tpl.label}
        </Button>
      ))}
    </Stack>
  </Box>
);
