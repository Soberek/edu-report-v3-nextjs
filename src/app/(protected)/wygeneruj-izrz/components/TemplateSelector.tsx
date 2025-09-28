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
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 1.5,
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          elevation: 2,
          borderColor: "#1976d2",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.95rem",
        }}
      >
        <Description sx={{ fontSize: "1.1rem" }} />
        Wybierz szablon
      </Typography>

      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
          Wybierz jeden z dostępnych szablonów:
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {predefinedTemplates.map((template) => (
            <Button
              key={template.name}
              variant={selectedTemplate?.name === template.name ? "contained" : "outlined"}
              onClick={() => handleTemplateSelect(template.name)}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} /> : <Description sx={{ fontSize: "1rem" }} />}
              size="small"
              sx={{
                minWidth: 120,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "0.85rem",
                py: 0.5,
                px: 2,
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
              p: 1.5,
              backgroundColor: "#e8f5e8",
              borderRadius: 1.5,
              border: "1px solid #4caf50",
            }}
          >
            <CheckCircle sx={{ color: "#4caf50", fontSize: "1.1rem" }} />
            <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: "medium", fontSize: "0.85rem" }}>
              Wybrany szablon: {selectedTemplate.name}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
