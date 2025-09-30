"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { graphicsGenerator } from "@/utils/graphicsGenerator";

interface TemplatePreviewProps {
  templateConfig: any;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateConfig,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = async () => {
    setLoading(true);
    setError(null);

    try {
      const imageUrl = await graphicsGenerator.generateHolidayPost({
        title: "EXAMPLE TITLE",
        date: "EXAMPLE DATE",
        backgroundImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1080&h=1080&fit=crop", // Use sample image for preview
        templateImageUrl: templateConfig.templateImageUrl,
        datePosition: templateConfig.datePosition,
        titlePosition: templateConfig.titlePosition,
        imagePlaceholder: templateConfig.imagePlaceholder,
      });

      setPreviewImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate preview when template config changes
  useEffect(() => {
    if (templateConfig.templateImageUrl || templateConfig.datePosition || templateConfig.titlePosition) {
      generatePreview();
    }
  }, [templateConfig]);

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">
          Template Preview
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={generatePreview}
          disabled={loading}
        >
          {loading ? "Generating..." : "Refresh Preview"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ textAlign: "center" }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Generating preview...
            </Typography>
          </Box>
        ) : previewImage ? (
          <Box>
            <img
              src={previewImage}
              alt="Template preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Preview with example text
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.100",
              borderRadius: 1,
              border: "2px dashed #ccc",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Configure your template to see a preview
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
