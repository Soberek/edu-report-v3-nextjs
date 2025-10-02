import React, { useState } from "react";
import { Box, Button, Typography, Paper, Grid, Chip, Alert, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { CloudDownload, Psychology, PostAdd, Image, Settings, Refresh, CloudUpload, List } from "@mui/icons-material";
import { TemplateConfigDialog } from "./TemplateConfigDialog";
import { UploadedImagesList } from "./UploadedImagesList";
import { type PostImagesUploadResult } from "@/services/postImagesUploadService";
import type { HolidayTemplateConfig } from "../types";

interface ActionSectionProps {
  onFetchHolidays: () => void;
  onExtractHealthHolidays: () => void;
  onGeneratePosts: () => void;
  onGeneratePostsWithGraphics: () => void;
  onRefreshGraphics: () => void;
  onTemplateConfigUpdate?: (config: HolidayTemplateConfig) => void;
  loading: boolean;
  aiLoading: boolean;
  graphicsLoading: boolean;
  hasHolidays: boolean;
  hasHealthHolidays: boolean;
  hasGeneratedPosts: boolean;
  uploadedImages?: PostImagesUploadResult[];
  onBulkUpload?: (files: File[]) => void;
  onDeleteImage?: (id: string) => void;
  onRefreshImages?: () => void;
}

export const ActionSection: React.FC<ActionSectionProps> = ({
  onFetchHolidays,
  onExtractHealthHolidays,
  onGeneratePosts,
  onGeneratePostsWithGraphics,
  onRefreshGraphics,
  onTemplateConfigUpdate,
  loading,
  aiLoading,
  graphicsLoading,
  hasHolidays,
  hasHealthHolidays,
  hasGeneratedPosts,
  uploadedImages = [],
  onBulkUpload,
  onDeleteImage,
  onRefreshImages,
}) => {
  const [templateConfigOpen, setTemplateConfigOpen] = useState(false);
  const [showUploadedImages, setShowUploadedImages] = useState(false);

  const handleTemplateConfigSave = (config: HolidayTemplateConfig) => {
    // Save the config to localStorage
    localStorage.setItem("holidayTemplateConfig", JSON.stringify(config));
    console.log("Template configuration saved:", config);

    // Notify parent component if callback provided
    if (onTemplateConfigUpdate) {
      onTemplateConfigUpdate(config);
    }
  };
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
        Akcje
      </Typography>

      <Grid container spacing={3}>
        <Grid size={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <CloudDownload color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 1: Pobierz święta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Pobierz nietypowe święta z wybranego URL
            </Typography>
            <Button variant="contained" startIcon={<CloudDownload />} onClick={onFetchHolidays} disabled={loading} sx={{ px: 3, py: 1.5 }}>
              {loading ? "Ładowanie..." : "Pobierz święta"}
            </Button>
          </Paper>
        </Grid>

        <Grid size={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Psychology color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 2: Wyodrębnij święta zdrowotne
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Użyj AI do wyodrębnienia świąt związanych ze zdrowiem
            </Typography>
            <Button
              variant="contained"
              startIcon={<Psychology />}
              onClick={onExtractHealthHolidays}
              disabled={!hasHolidays || aiLoading}
              sx={{ px: 3, py: 1.5 }}
            >
              {aiLoading ? "Przetwarzanie..." : "Wyodrębnij święta"}
            </Button>
          </Paper>
        </Grid>

        <Grid size={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <PostAdd color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 3: Wygeneruj posty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Wygeneruj posty na social media dla świąt zdrowotnych
            </Typography>
            <Button
              variant="contained"
              startIcon={<PostAdd />}
              onClick={onGeneratePosts}
              disabled={!hasHealthHolidays || aiLoading}
              sx={{ px: 3, py: 1.5 }}
            >
              {aiLoading ? "Generowanie..." : "Wygeneruj posty"}
            </Button>
          </Paper>
        </Grid>

        <Grid size={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Image color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Krok 4: Wygeneruj z grafikami
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Wygeneruj posty z grafikami z Unsplash i szablonem
            </Typography>
            <Button
              variant="contained"
              startIcon={<Image />}
              onClick={onGeneratePostsWithGraphics}
              disabled={!hasHealthHolidays || graphicsLoading}
              sx={{ px: 3, py: 1.5 }}
            >
              {graphicsLoading ? "Generowanie..." : "Wygeneruj z grafikami"}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Template Configuration and Refresh Buttons */}
      <Box sx={{ mt: 3, textAlign: "center", display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
        <Button variant="outlined" startIcon={<Settings />} onClick={() => setTemplateConfigOpen(true)} sx={{ px: 3, py: 1.5 }}>
          Configure Template
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefreshGraphics}
          disabled={!hasGeneratedPosts || graphicsLoading}
          sx={{ px: 3, py: 1.5 }}
        >
          {graphicsLoading ? "Refreshing..." : "Refresh Graphics"}
        </Button>
        <Button variant="outlined" startIcon={<List />} onClick={() => setShowUploadedImages(true)} sx={{ px: 3, py: 1.5 }}>
          View Uploaded Images ({uploadedImages.length})
        </Button>
      </Box>

      {/* Uploaded Images Summary */}
      {uploadedImages.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>{uploadedImages.length}</strong> images uploaded to PostImages.
              <Button size="small" onClick={() => setShowUploadedImages(true)} sx={{ ml: 1 }}>
                View All
              </Button>
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {uploadedImages.slice(0, 5).map((image, index) => (
              <Chip
                key={index}
                label={image.title || `Image ${index + 1}`}
                size="small"
                variant="outlined"
                onClick={() => navigator.clipboard.writeText(image.url)}
                title="Click to copy URL"
              />
            ))}
            {uploadedImages.length > 5 && (
              <Chip
                label={`+${uploadedImages.length - 5} more`}
                size="small"
                variant="outlined"
                onClick={() => setShowUploadedImages(true)}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Template Configuration Dialog */}
      <TemplateConfigDialog open={templateConfigOpen} onClose={() => setTemplateConfigOpen(false)} onSave={handleTemplateConfigSave} />

      {/* Uploaded Images Dialog */}
      <Dialog open={showUploadedImages} onClose={() => setShowUploadedImages(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Uploaded Images</DialogTitle>
        <DialogContent>
          <UploadedImagesList
            images={uploadedImages.map((image, index) => ({
              id: image.id || `image-${index}`,
              title: image.title || `Image ${index + 1}`,
              url: image.url,
              thumbnailUrl: image.thumb?.url,
              size: image.size,
              width: image.width,
              height: image.height,
              uploadedAt: new Date().toISOString(),
              description: `Uploaded to PostImages`,
            }))}
            onDelete={onDeleteImage}
            onRefresh={onRefreshImages}
            onBulkUpload={onBulkUpload}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
