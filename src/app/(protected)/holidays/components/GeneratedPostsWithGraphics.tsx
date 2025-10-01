"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, Download as DownloadIcon, Share as ShareIcon, FileDownload, CloudUpload, Refresh } from "@mui/icons-material";
import { LoadingSpinner } from "@/components/shared";
import { exportPostsWithGraphicsToCSV, validatePostsWithGraphicsForExport } from "../utils/exportUtils";
import { generatedImagePostImagesService, type GeneratedImagePostImagesResult } from "@/services/generatedImagePostImagesService";

interface GeneratedPostWithGraphics {
  id: number;
  title: string;
  description: string;
  query: string;
  literalDate: string;
  dateForThisYear: string;
  text: string;
  imageUrl: string;
  generatedImageUrl: string;
  tags: string;
  postingTime: string;
}

interface GeneratedPostsWithGraphicsProps {
  posts: GeneratedPostWithGraphics[];
  loading: boolean;
  error: string | null;
  onError: (error: string) => void;
  onPostImagesResultsChange?: (results: GeneratedImagePostImagesResult[]) => void;
  onPostUpdate?: (updatedPost: GeneratedPostWithGraphics) => void;
  templateConfig?: any;
}

export const GeneratedPostsWithGraphics: React.FC<GeneratedPostsWithGraphicsProps> = ({
  posts,
  loading,
  error,
  onError,
  onPostImagesResultsChange,
  onPostUpdate,
  templateConfig,
}) => {
  const [selectedPost, setSelectedPost] = React.useState<GeneratedPostWithGraphics | null>(null);
  const [imageLoading, setImageLoading] = React.useState<Set<number>>(new Set());
  const [uploadingToPostImages, setUploadingToPostImages] = React.useState<Set<number>>(new Set());
  const [postImagesResults, setPostImagesResults] = React.useState<GeneratedImagePostImagesResult[]>([]);
  const [showPostImagesUrls, setShowPostImagesUrls] = React.useState(false);
  const [regeneratingImage, setRegeneratingImage] = React.useState<Set<number>>(new Set());

  // Notify parent when postImagesResults change
  React.useEffect(() => {
    if (onPostImagesResultsChange) {
      onPostImagesResultsChange(postImagesResults);
    }
  }, [postImagesResults, onPostImagesResultsChange]);

  const handleImageLoad = (postId: number) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const handleImageError = (postId: number) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    onError(`Failed to load image for post ${postId}`);
  };

  const handleDownloadImage = async (post: GeneratedPostWithGraphics) => {
    try {
      const response = await fetch(post.generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${post.title.replace(/[^a-zA-Z0-9]/g, '_')}_post.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      onError("Failed to download image");
    }
  };

  const handleExportToCSV = async () => {
    try {
      if (!validatePostsWithGraphicsForExport(posts)) {
        onError("Invalid posts data for CSV export");
        return;
      }
      
      // Check if all posts have been uploaded to PostImages
      const postsNotUploaded = posts.filter(post => 
        !postImagesResults.some(result => result.originalPost.id === post.id)
      );
      
      if (postsNotUploaded.length > 0) {
        // Upload remaining posts to PostImages first
        onError(`Please upload all posts to PostImages first. ${postsNotUploaded.length} posts still need to be uploaded.`);
        return;
      }
      
      // Create posts with PostImages URLs
      const postsWithPostImagesUrls = posts.map(post => {
        const postImagesResult = postImagesResults.find(result => result.originalPost.id === post.id);
        return {
          ...post,
          // Use PostImages URL (should be available since we checked above)
          imageUrl: postImagesResult?.postImagesResult?.url || post.generatedImageUrl,
          // Keep original Unsplash URL for reference
          originalImageUrl: post.imageUrl
        };
      });
      
      exportPostsWithGraphicsToCSV(postsWithPostImagesUrls);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to export CSV");
    }
  };

  const handleSharePost = async (post: GeneratedPostWithGraphics) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.text,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${post.title}\n\n${post.text}`);
        onError("Post text copied to clipboard");
      } catch (error) {
        onError("Failed to copy post text");
      }
    }
  };

  const handleUploadToPostImages = async (post: GeneratedPostWithGraphics) => {
    setUploadingToPostImages(prev => new Set(prev).add(post.id));

    try {
      const postImagesResult = await generatedImagePostImagesService.uploadGeneratedImageToPostImages(
        post.generatedImageUrl,
        post.title,
        post.description
      );

      if (postImagesResult) {
        setPostImagesResults(prev => [...prev, { originalPost: post, postImagesResult }]);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to upload to PostImages");
    } finally {
      setUploadingToPostImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  };

  const handleUploadAllToPostImages = async () => {
    setUploadingToPostImages(new Set(posts.map(p => p.id)));

    try {
      const results = await generatedImagePostImagesService.uploadMultipleGeneratedImagesToPostImages(
        posts
      );

      setPostImagesResults(prev => [...prev, ...results]);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to upload to PostImages");
    } finally {
      setUploadingToPostImages(new Set());
    }
  };

  const handleUploadAllAndExport = async () => {
    try {
      // First upload all posts to PostImages
      await handleUploadAllToPostImages();
      
      // Wait a moment for state to update
      setTimeout(() => {
        // Then export to CSV
        handleExportToCSV();
      }, 1000);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to upload and export");
    }
  };

  const handleRegenerateImage = async (post: GeneratedPostWithGraphics) => {
    console.log("Starting image regeneration for post:", post.id, post.title);
    setRegeneratingImage(prev => new Set(prev).add(post.id));

    try {
      // Call the API to get a new Unsplash image for this post
      // Add timestamp to query to get different images
      const queryWithTimestamp = `${post.query} ${Date.now()}`;
      console.log("Fetching new image for query:", queryWithTimestamp);
      const response = await fetch("/api/unsplash-photo-by-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: queryWithTimestamp }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch new image");
      }

      const data = await response.json();
      console.log("Unsplash API response:", data);
      const newImageUrl = Array.isArray(data) && data.length > 0 ? data[0].urls?.regular : "";

      if (!newImageUrl) {
        throw new Error("No image URL received from Unsplash API");
      }

      console.log("New image URL:", newImageUrl);

      // Regenerate the graphics with the new image using current template config
      console.log("Regenerating graphics with template config:", templateConfig);
      const { graphicsGenerator } = await import("@/utils/graphicsGenerator");
      const newGeneratedImageUrl = await graphicsGenerator.generateHolidayPost({
        title: post.title,
        date: post.literalDate,
        backgroundImageUrl: newImageUrl,
        templateImageUrl: templateConfig?.templateImageUrl || "",
        datePosition: templateConfig?.datePosition,
        titlePosition: templateConfig?.titlePosition,
        imagePlaceholder: templateConfig?.imagePlaceholder
      });

      console.log("New generated image URL:", newGeneratedImageUrl);

      // Update the post in the parent component
      const updatedPost = {
        ...post,
        imageUrl: newImageUrl,
        generatedImageUrl: newGeneratedImageUrl
      };

      console.log("Updating post with:", updatedPost);
      if (onPostUpdate) {
        onPostUpdate(updatedPost);
        console.log("Post update called successfully");
      } else {
        console.warn("onPostUpdate callback not provided");
      }
      
    } catch (error) {
      console.error("Error regenerating image:", error);
      onError(error instanceof Error ? error.message : "Failed to regenerate image");
    } finally {
      setRegeneratingImage(prev => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No posts generated yet. Generate posts with graphics to see them here.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Wygenerowane Posty z Grafikami ({posts.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUploadAllToPostImages}
            disabled={uploadingToPostImages.size > 0}
            sx={{ px: 3, py: 1.5 }}
          >
            {uploadingToPostImages.size > 0 ? "Uploading..." : "Upload All to PostImages"}
          </Button>
          {postImagesResults.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => setShowPostImagesUrls(true)}
              sx={{ px: 3, py: 1.5 }}
            >
              View PostImages URLs ({postImagesResults.length})
            </Button>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }}  key={post.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ position: "relative" }}>
                {imageLoading.has(post.id) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      zIndex: 1,
                    }}
                  >
                    <LoadingSpinner />
                  </Box>
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={post.generatedImageUrl}
                  alt={post.title}
                  onLoad={() => handleImageLoad(post.id)}
                  onError={() => handleImageError(post.id)}
                  sx={{ objectFit: "cover" }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {post.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Data:</strong> {post.literalDate}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Czas publikacji:</strong> {post.postingTime}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Treść posta:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    backgroundColor: "grey.100", 
                    p: 1, 
                    borderRadius: 1,
                    fontStyle: "italic"
                  }}>
                    {post.text}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tagi:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {post.tags.split(", ").map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", gap: 1, mt: "auto", flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadImage(post)}
                    sx={{ flex: 1, minWidth: "120px" }}
                  >
                    Pobierz
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CloudUpload />}
                    onClick={() => handleUploadToPostImages(post)}
                    disabled={uploadingToPostImages.has(post.id)}
                    sx={{ flex: 1, minWidth: "120px" }}
                  >
                    {uploadingToPostImages.has(post.id) ? "Uploading..." : "Upload to PostImages"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={() => handleRegenerateImage(post)}
                    disabled={regeneratingImage.has(post.id)}
                    sx={{ flex: 1, minWidth: "120px" }}
                  >
                    {regeneratingImage.has(post.id) ? "Regenerating..." : "New Image"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={() => handleSharePost(post)}
                    sx={{ flex: 1, minWidth: "120px" }}
                  >
                    Udostępnij
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for viewing full-size image */}
      <Dialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {selectedPost?.title}
          <IconButton onClick={() => setSelectedPost(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedPost.generatedImageUrl}
                  alt={selectedPost.title}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Treść posta:</strong>
              </Typography>
              <Typography variant="body2" sx={{ 
                backgroundColor: "grey.100", 
                p: 2, 
                borderRadius: 1,
                fontStyle: "italic",
                mb: 2
              }}>
                {selectedPost.text}
              </Typography>
              
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadImage(selectedPost)}
                >
                  Pobierz Obraz
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => handleUploadToPostImages(selectedPost)}
                  disabled={uploadingToPostImages.has(selectedPost.id)}
                >
                  {uploadingToPostImages.has(selectedPost.id) ? "Uploading..." : "Upload to PostImages"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => handleRegenerateImage(selectedPost)}
                  disabled={regeneratingImage.has(selectedPost.id)}
                >
                  {regeneratingImage.has(selectedPost.id) ? "Regenerating..." : "New Image"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => handleSharePost(selectedPost)}
                >
                  Udostępnij Post
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing PostImages URLs */}
      <Dialog
        open={showPostImagesUrls}
        onClose={() => setShowPostImagesUrls(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          PostImages URLs ({postImagesResults.length})
          <IconButton onClick={() => setShowPostImagesUrls(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {postImagesResults.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No images uploaded to PostImages yet.
            </Typography>
          ) : (
            <Box>
              {postImagesResults.map((result, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {result.originalPost.title}
                  </Typography>
                  {result.postImagesResult ? (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>PostImages URL:</strong>
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: "grey.100", 
                        p: 1, 
                        borderRadius: 1,
                        mb: 1,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        fontSize: "0.875rem"
                      }}>
                        {result.postImagesResult.url}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Size: {result.postImagesResult.size} • Dimensions: {result.postImagesResult.width}x{result.postImagesResult.height}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      Upload failed: {result.error}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
