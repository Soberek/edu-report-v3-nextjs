"use client";
import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CheckCircle,
  Error,
  Upload,
} from "@mui/icons-material";
import { postImagesUploadService, type PostImagesUploadResult } from "@/services/postImagesUploadService";

interface UploadedTemplate {
  id: string;
  file: File;
  preview: string;
  postImagesResult?: PostImagesUploadResult;
  error?: string;
  uploading: boolean;
}

interface BulkTemplateUploadProps {
  onTemplatesUploaded?: (templates: PostImagesUploadResult[]) => void;
  onClose?: () => void;
}

export const BulkTemplateUpload: React.FC<BulkTemplateUploadProps> = ({
  onTemplatesUploaded,
  onClose,
}) => {
  const [templates, setTemplates] = useState<UploadedTemplate[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newTemplates: UploadedTemplate[] = [];
    
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const template: UploadedTemplate = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          uploading: false,
        };
        
        setTemplates(prev => [...prev, template]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const uploadTemplate = async (template: UploadedTemplate) => {
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, uploading: true, error: undefined } : t
    ));

    try {
      const result = await postImagesUploadService.uploadImage(
        template.file,
        template.file.name.split('.')[0],
        `Template: ${template.file.name}`
      );

      setTemplates(prev => prev.map(t => 
        t.id === template.id 
          ? { ...t, postImagesResult: result, uploading: false }
          : t
      ));
    } catch (error) {
      setTemplates(prev => prev.map(t => 
        t.id === template.id 
          ? { ...t, error: error instanceof Error ? error.message : 'Upload failed', uploading: false }
          : t
      ));
    }
  };

  const uploadAllTemplates = async () => {
    setUploading(true);
    setError(null);

    try {
      // Upload all templates in parallel
      const uploadPromises = templates.map(template => uploadTemplate(template));
      await Promise.all(uploadPromises);

      const successfulUploads = templates
        .filter(t => t.postImagesResult)
        .map(t => t.postImagesResult!);

      if (successfulUploads.length > 0) {
        setShowResults(true);
        onTemplatesUploaded?.(successfulUploads);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bulk upload failed');
    } finally {
      setUploading(false);
    }
  };

  const successfulUploads = templates.filter(t => t.postImagesResult);
  const failedUploads = templates.filter(t => t.error);
  const pendingUploads = templates.filter(t => !t.postImagesResult && !t.error && !t.uploading);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Bulk Template Upload
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload multiple template images to PostImages at once. Drag and drop files or click to browse.
      </Typography>

      {/* Upload Area */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: "center",
          border: "2px dashed #ccc",
          backgroundColor: "background.paper",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: "none" }}
        />

        <CloudUploadIcon
          sx={{
            fontSize: 64,
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography variant="h6" gutterBottom>
          Upload Template Images
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drag and drop your template images here, or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supports PNG, JPG, JPEG (max 10MB each)
        </Typography>
      </Paper>

      {/* Templates List */}
      {templates.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              Templates ({templates.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={uploadAllTemplates}
                disabled={uploading || templates.length === 0}
              >
                {uploading ? "Uploading..." : `Upload All (${templates.length})`}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setTemplates([])}
                disabled={uploading}
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {templates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={template.preview}
                    alt={template.file.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" noWrap>
                      {template.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(template.file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>

                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      {template.uploading && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LinearProgress size={20} />
                          <Typography variant="caption">Uploading...</Typography>
                        </Box>
                      )}
                      
                      {template.postImagesResult && (
                        <Chip
                          icon={<CheckCircle />}
                          label="Uploaded"
                          color="success"
                          size="small"
                        />
                      )}
                      
                      {template.error && (
                        <Chip
                          icon={<Error />}
                          label="Failed"
                          color="error"
                          size="small"
                        />
                      )}
                      
                      {!template.uploading && !template.postImagesResult && !template.error && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => uploadTemplate(template)}
                        >
                          Upload
                        </Button>
                      )}
                    </Box>

                    {template.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                        {template.error}
                      </Typography>
                    )}

                    <IconButton
                      size="small"
                      onClick={() => removeTemplate(template.id)}
                      disabled={template.uploading}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Upload Summary */}
          {templates.length > 0 && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Upload Summary
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`Total: ${templates.length}`}
                  variant="outlined"
                />
                <Chip
                  label={`Successful: ${successfulUploads.length}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`Failed: ${failedUploads.length}`}
                  color="error"
                  variant="outlined"
                />
                <Chip
                  label={`Pending: ${pendingUploads.length}`}
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results Dialog */}
      <Dialog
        open={showResults}
        onClose={() => setShowResults(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Results</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Successfully uploaded {successfulUploads.length} out of {templates.length} templates.
          </Typography>
          
          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            {successfulUploads.map((template, index) => (
              <Box key={template.id} sx={{ mb: 2, p: 2, border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {template.file.name}
                </Typography>
                <Box sx={{
                  backgroundColor: "grey.100",
                  p: 1,
                  borderRadius: 1,
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  fontSize: "0.875rem"
                }}>
                  {template.postImagesResult?.url}
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowResults(false);
              setTemplates([]);
              onClose?.();
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
