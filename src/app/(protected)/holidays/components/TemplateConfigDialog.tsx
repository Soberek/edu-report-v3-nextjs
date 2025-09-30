"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { TEMPLATE_CONFIG, TEMPLATE_PRESETS } from "../config/templateConfig";
import { TemplateUpload } from "./TemplateUpload";
import { TemplatePreview } from "./TemplatePreview";
import { postImagesUploadService, type PostImagesUploadResult } from "@/services/postImagesUploadService";

interface TemplateConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export const TemplateConfigDialog: React.FC<TemplateConfigDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState(TEMPLATE_CONFIG);
  const [uploadedTemplate, setUploadedTemplate] = useState<string | null>(null);
  const [uploadingToPostImages, setUploadingToPostImages] = useState(false);
  const [postImagesResult, setPostImagesResult] = useState<PostImagesUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePresetChange = (presetName: keyof typeof TEMPLATE_PRESETS) => {
        setConfig(TEMPLATE_PRESETS[presetName] as any);
  };

  const handleTemplateUpload = (file: File) => {
    // Store the uploaded file as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedTemplate(dataUrl);
      // Update config with the uploaded template
      setConfig(prev => ({ ...prev, templateImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadToPostImages = async () => {
    if (!uploadedTemplate) {
      setError("No template uploaded to send to PostImages");
      return;
    }

    setUploadingToPostImages(true);
    setError(null);

    try {
      const result = await postImagesUploadService.uploadImage(
        uploadedTemplate,
        "template_image",
        "Template image for holiday graphics generation"
      );

      if (result) {
        setPostImagesResult(result);
        // Update config with PostImages URL
        setConfig(prev => ({ ...prev, postImagesUrl: result.url }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload to PostImages");
    } finally {
      setUploadingToPostImages(false);
    }
  };

  const handleTemplateRemove = () => {
    setUploadedTemplate(null);
    setPostImagesResult(null);
    setConfig(prev => ({ ...prev, templateImageUrl: '', postImagesUrl: '' }));
  };

  const handleSave = () => {
    const finalConfig = {
      ...config,
      templateImageUrl: uploadedTemplate || config.templateImageUrl,
      postImagesUrl: postImagesResult?.url || (config as any).postImagesUrl
    };
    onSave(finalConfig);
    onClose();
  };

  const handleReset = () => {
    setConfig(TEMPLATE_CONFIG);
    setUploadedTemplate(null);
    setPostImagesResult(null);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Template Configuration</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Upload your template image and configure text positioning. You can upload a file or use a URL from the public folder.
        </Alert>

        <Grid container spacing={3}>
          {/* Template Upload */}
          <Grid size={12}>
            <TemplateUpload
              onUpload={handleTemplateUpload}
              onRemove={handleTemplateRemove}
              currentTemplate={uploadedTemplate || undefined}
            />
          </Grid>

          {/* PostImages Upload Section */}
          {uploadedTemplate && (
            <Grid size={12}>
              <Box sx={{ p: 2, border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Upload to PostImages
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload your template to PostImages to get a public URL for sharing and backup.
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleUploadToPostImages}
                    disabled={uploadingToPostImages}
                    startIcon={uploadingToPostImages ? <CircularProgress size={20} /> : <CloudUpload />}
                  >
                    {uploadingToPostImages ? "Uploading..." : "Upload to PostImages"}
                  </Button>
                  
                  {postImagesResult && (
                    <Button
                      variant="outlined"
                      onClick={() => navigator.clipboard.writeText(postImagesResult.url)}
                    >
                      Copy URL
                    </Button>
                  )}
                </Box>

                {postImagesResult && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>PostImages URL:</strong>
                    </Typography>
                    <Box sx={{
                      backgroundColor: "grey.100",
                      p: 1,
                      borderRadius: 1,
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      fontSize: "0.875rem"
                    }}>
                      {postImagesResult.url}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Size: {postImagesResult.size} • Dimensions: {postImagesResult.width}x{postImagesResult.height}
                    </Typography>
                  </Box>
                )}

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>
            </Grid>
          )}

          <Grid size={12}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Grid>

          {/* Template Image URL */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Template Image URL"
              value={config.templateImageUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, templateImageUrl: e.target.value }))}
              placeholder="/templates/holiday-template.png"
              helperText="Path to your template image in the public folder (leave empty for default overlays)"
              disabled={!!uploadedTemplate}
            />
          </Grid>

          {/* Presets */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Quick Presets
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePresetChange('default')}
              >
                Default
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePresetChange('centered')}
              >
                Centered
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePresetChange('rightAligned')}
              >
                Right Aligned
              </Button>
            </Box>
          </Grid>

          {/* Date Position */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Date Text Position
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="X Position"
              type="number"
              value={config.datePosition.x}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                datePosition: { ...prev.datePosition, x: parseInt(e.target.value) || 0 }
              }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Y Position"
              type="number"
              value={config.datePosition.y}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                datePosition: { ...prev.datePosition, y: parseInt(e.target.value) || 0 }
              }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Font Size"
              type="number"
              value={config.datePosition.fontSize}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                datePosition: { ...prev.datePosition, fontSize: parseInt(e.target.value) || 12 }
              }))}
            />
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel>Text Align</InputLabel>
              <Select
                value={config.datePosition.textAlign}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  datePosition: { ...prev.datePosition, textAlign: e.target.value as any }
                }))}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Text Color"
              value={config.datePosition.color}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                datePosition: { ...prev.datePosition, color: e.target.value }
              }))}
              placeholder="#FFFFFF"
            />
          </Grid>

          {/* Title Position */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Title Text Position
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="X Position"
              type="number"
              value={config.titlePosition.x}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                titlePosition: { ...prev.titlePosition, x: parseInt(e.target.value) || 0 }
              }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Y Position"
              type="number"
              value={config.titlePosition.y}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                titlePosition: { ...prev.titlePosition, y: parseInt(e.target.value) || 0 }
              }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Font Size"
              type="number"
              value={config.titlePosition.fontSize}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                titlePosition: { ...prev.titlePosition, fontSize: parseInt(e.target.value) || 12 }
              }))}
            />
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel>Text Align</InputLabel>
              <Select
                value={config.titlePosition.textAlign}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  titlePosition: { ...prev.titlePosition, textAlign: e.target.value as any }
                }))}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Text Color"
              value={config.titlePosition.color}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                titlePosition: { ...prev.titlePosition, color: e.target.value }
              }))}
              placeholder="#FFFFFF"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Max Width"
              type="number"
              value={config.titlePosition.maxWidth}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                titlePosition: { ...prev.titlePosition, maxWidth: parseInt(e.target.value) || 600 }
              }))}
              helperText="Maximum width for text wrapping"
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Line Height"
              type="number"
              value={config.titlePosition.lineHeight || 1.2}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                titlePosition: { ...prev.titlePosition, lineHeight: parseFloat(e.target.value) || 1.2 }
              }))}
              helperText="Line spacing multiplier (1.0 = normal, 1.2 = 20% more)"
              inputProps={{ step: 0.1, min: 0.5, max: 3.0 }}
            />
          </Grid>

          {/* Image Placeholder Position */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Image Placeholder Position
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure the circular area where Unsplash images will be placed
            </Typography>
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Center X"
              type="number"
              value={config.imagePlaceholder.x}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                imagePlaceholder: { ...prev.imagePlaceholder, x: parseInt(e.target.value) || 0 }
              }))}
              helperText="X position of circle center"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Center Y"
              type="number"
              value={config.imagePlaceholder.y}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                imagePlaceholder: { ...prev.imagePlaceholder, y: parseInt(e.target.value) || 0 }
              }))}
              helperText="Y position of circle center"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Radius"
              type="number"
              value={config.imagePlaceholder.radius}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                imagePlaceholder: { ...prev.imagePlaceholder, radius: parseInt(e.target.value) || 100 }
              }))}
              helperText="Circle radius in pixels"
            />
          </Grid>
        </Grid>

        {/* Template Preview */}
        <Box sx={{ mt: 3 }}>
          <TemplatePreview templateConfig={config} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
