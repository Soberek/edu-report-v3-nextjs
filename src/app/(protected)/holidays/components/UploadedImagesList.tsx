"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ContentCopy, Delete, Visibility, Search, CloudUpload, Refresh } from "@mui/icons-material";
import { type PostImagesUploadResult } from "@/services/postImagesUploadService";

interface UploadedImage {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  size: string;
  width: string;
  height: string;
  uploadedAt: string;
  description?: string;
}

interface UploadedImagesListProps {
  images: UploadedImage[];
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  onBulkUpload?: (files: File[]) => void;
  loading?: boolean;
}

export const UploadedImagesList: React.FC<UploadedImagesListProps> = ({ images, onDelete, onRefresh, onBulkUpload, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) || image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handlePreview = (image: UploadedImage) => {
    setSelectedImage(image);
    setShowPreview(true);
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && onBulkUpload) {
      onBulkUpload(files);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Uploaded Images ({images.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {onBulkUpload && (
            <Button variant="outlined" startIcon={<CloudUpload />} component="label" disabled={loading}>
              Bulk Upload
              <input type="file" multiple accept="image/*" hidden onChange={handleBulkUpload} />
            </Button>
          )}
          {onRefresh && (
            <Button variant="outlined" startIcon={<Refresh />} onClick={onRefresh} disabled={loading}>
              Refresh
            </Button>
          )}
        </Box>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search images..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <Alert severity="info">{searchTerm ? "No images match your search." : "No images uploaded yet."}</Alert>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
          {filteredImages.map((image) => (
            <Box key={image.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, mr: 1 }}>
                      {image.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handlePreview(image)} title="Preview">
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyUrl(image.url)}
                        title="Copy URL"
                        color={copiedUrl === image.url ? "success" : "default"}
                      >
                        <ContentCopy />
                      </IconButton>
                      {onDelete && (
                        <IconButton size="small" onClick={() => onDelete(image.id)} title="Delete" color="error">
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {image.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {image.description}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                    <Chip label={`${image.width}x${image.height}`} size="small" variant="outlined" />
                    <Chip label={image.size} size="small" variant="outlined" />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "grey.100",
                      p: 1,
                      borderRadius: 1,
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      mb: 1,
                    }}
                  >
                    {image.url}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {selectedImage?.title}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() => selectedImage && handleCopyUrl(selectedImage.url)}
              size="small"
            >
              Copy URL
            </Button>
            {onDelete && selectedImage && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  onDelete(selectedImage.id);
                  setShowPreview(false);
                }}
                size="small"
              >
                Delete
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box>
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </Box>

              {selectedImage.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedImage.description}
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip label={`${selectedImage.width}x${selectedImage.height}`} />
                <Chip label={selectedImage.size} />
                <Chip label={new Date(selectedImage.uploadedAt).toLocaleDateString()} />
              </Box>

              <Box
                sx={{
                  backgroundColor: "grey.100",
                  p: 2,
                  borderRadius: 1,
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                {selectedImage.url}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
