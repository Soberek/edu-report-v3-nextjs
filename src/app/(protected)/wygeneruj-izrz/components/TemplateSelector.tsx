import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Description, Upload, CheckCircle } from "@mui/icons-material";
import type { TemplateSelectorProps } from "../types";
import { useTemplateManager } from "../hooks/useTemplateManager";

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplate,
}) => {
  const { loading, choosePredefinedTemplate } = useTemplateManager({
    onTemplateSelect,
  });

  const predefinedTemplates: { name: string; label: string }[] = [
    { name: "izrz.docx", label: "IZRZ Template" },
    { name: "lista_obecnosci.docx", label: "Lista Obecności" },
  ];

  const handleTemplateSelect = async (templateName: string) => {
    try {
      await choosePredefinedTemplate(templateName);
    } catch (error) {
      console.error("Failed to load template:", error);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Description />
        Wybierz szablon
      </Typography>

      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Wybierz jeden z dostępnych szablonów lub prześlij własny plik:
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {predefinedTemplates.map((template) => (
            <Button
              key={template.name}
              variant={selectedTemplate?.name === template.name ? "contained" : "outlined"}
              onClick={() => handleTemplateSelect(template.name)}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Description />}
              sx={{
                minWidth: 150,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "medium",
              }}
            >
              {template.label}
            </Button>
          ))}
        </Box>

        {selectedTemplate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              backgroundColor: "#e8f5e8",
              borderRadius: 2,
              border: "1px solid #4caf50",
            }}
          >
            <CheckCircle sx={{ color: "#4caf50" }} />
            <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: "medium" }}>
              Wybrany szablon: {selectedTemplate.name}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
