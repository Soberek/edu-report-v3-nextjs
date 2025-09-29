import React, { useCallback } from "react";
import { Box, Button, Typography, Paper, Stack, Alert, CircularProgress } from "@mui/material";
import { Description, CheckCircle, Error } from "@mui/icons-material";
import type { TemplateSelectorProps } from "../types";
import { useTemplateManager } from "../hooks/useTemplateManager";
import { TEMPLATE_CONSTANTS, STYLE_CONSTANTS, MESSAGES } from "../constants";

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplate,
  loading: externalLoading = false,
  error: externalError = null,
}) => {
  const { loading: internalLoading, error: internalError, choosePredefinedTemplate } = useTemplateManager({ onTemplateSelect });

  const isLoading = externalLoading || internalLoading;
  const error = externalError || internalError;

  const handleTemplateSelect = useCallback(
    async (templateName: string): Promise<void> => {
      try {
        await choosePredefinedTemplate(templateName);
      } catch (error) {
        console.error("Failed to load template:", error);
      }
    },
    [choosePredefinedTemplate]
  );

  const isTemplateSelected = useCallback(
    (templateName: string): boolean => {
      return selectedTemplate?.name === templateName;
    },
    [selectedTemplate?.name]
  );

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.SMALL,
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          elevation: 2,
          borderColor: STYLE_CONSTANTS.COLORS.PRIMARY,
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          color: STYLE_CONSTANTS.COLORS.PRIMARY,
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

        {/* Error Display */}
        {error && (
          <Alert severity="error" icon={<Error />} sx={{ fontSize: "0.85rem" }}>
            {error}
          </Alert>
        )}

        {/* Template Buttons */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {TEMPLATE_CONSTANTS.PREDEFINED_TEMPLATES.map((template) => (
            <Button
              key={template.name}
              variant={isTemplateSelected(template.name) ? "contained" : "outlined"}
              onClick={() => handleTemplateSelect(template.name)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={14} /> : <Description sx={{ fontSize: "1rem" }} />}
              size="small"
              sx={{
                minWidth: 120,
                borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.SMALL,
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

        {/* Selected Template Display */}
        {selectedTemplate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              backgroundColor: "#e8f5e8",
              borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.SMALL,
              border: "1px solid #4caf50",
            }}
          >
            <CheckCircle sx={{ color: STYLE_CONSTANTS.COLORS.SUCCESS, fontSize: "1.1rem" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#2e7d32",
                fontWeight: "medium",
                fontSize: "0.85rem",
              }}
            >
              Wybrany szablon: {selectedTemplate.name}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
