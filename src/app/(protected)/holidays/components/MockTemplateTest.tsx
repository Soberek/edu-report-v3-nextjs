"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { CloudUpload, Download, Close, Image as ImageIcon, AutoAwesome } from "@mui/icons-material";
import { generatedImagePostImagesService, type GeneratedImagePostImagesResult } from "@/services/generatedImagePostImagesService";
import { type PostImagesUploadResult } from "@/services/postImagesUploadService";
import { GeneratedPostWithGraphics } from "./GeneratedPostsWithGraphics";

// Mock generated post data for testing
const mockGeneratedPosts = [
  {
    id: 1,
    title: "Światowy Dzień Zdrowia",
    description: "Promocja zdrowia i profilaktyki",
    query: "health wellness",
    literalDate: "7 kwietnia 2024",
    dateForThisYear: "2024-04-07",
    text: "🌍 Dzisiaj obchodzimy Światowy Dzień Zdrowia! To doskonała okazja, aby przypomnieć sobie o znaczeniu dbania o nasze zdrowie. Regularne badania, aktywność fizyczna i zdrowe odżywianie to klucz do długiego i szczęśliwego życia. #Zdrowie #Profilaktyka #ŚwiatowyDzieńZdrowia",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    generatedImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop", // Mock URL
    tags: "zdrowie, profilaktyka, wellness",
    postingTime: "09:00",
  },
  {
    id: 2,
    title: "Dzień Walki z Cukrzycą",
    description: "Świadomość cukrzycy i jej zapobieganie",
    query: "diabetes health",
    literalDate: "14 listopada 2024",
    dateForThisYear: "2024-11-14",
    text: "🩺 Dzień Walki z Cukrzycą to ważny moment edukacji o tej chorobie. Cukrzyca dotyka miliony ludzi na świecie, ale odpowiednia wiedza i profilaktyka mogą znacznie zmniejszyć ryzyko. Regularne badania poziomu cukru, zdrowa dieta i aktywność fizyczna to nasze najlepsze narzędzia. #Cukrzyca #Zdrowie #Profilaktyka",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    generatedImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop", // Mock URL
    tags: "cukrzyca, zdrowie, profilaktyka",
    postingTime: "09:00",
  },
  {
    id: 3,
    title: "Światowy Dzień Serca",
    description: "Kardiologia i zdrowie serca",
    query: "heart health cardiology",
    literalDate: "29 września 2024",
    dateForThisYear: "2024-09-29",
    text: "❤️ Światowy Dzień Serca przypomina nam o znaczeniu dbania o nasze serce. Choroby sercowo-naczyniowe są główną przyczyną zgonów na świecie, ale większość z nich można zapobiec. Regularne ćwiczenia, zdrowa dieta, unikanie palenia i stresu to kluczowe elementy profilaktyki. #Serce #Kardiologia #Zdrowie",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop",
    generatedImageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop", // Mock URL
    tags: "serce, kardiologia, zdrowie",
    postingTime: "09:00",
  },
];

export const MockTemplateTest: React.FC = () => {
  const [postImagesResults, setPostImagesResults] = useState<GeneratedImagePostImagesResult<GeneratedPostWithGraphics>[]>([]);
  const [uploadingToPostImages, setUploadingToPostImages] = useState<Set<number>>(new Set());
  const [showPostImagesUrls, setShowPostImagesUrls] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingSinglePost, setGeneratingSinglePost] = useState(false);
  const [singleGeneratedPost, setSingleGeneratedPost] = useState<GeneratedPostWithGraphics | null>(null);

  const handleUploadToPostImages = async (post: (typeof mockGeneratedPosts)[0]) => {
    setUploadingToPostImages((prev) => new Set(prev).add(post.id));
    setError(null);

    try {
      const postImagesResult = await generatedImagePostImagesService.uploadGeneratedImageToPostImages(
        post.generatedImageUrl,
        post.title,
        post.description
      );

      if (postImagesResult) {
        setPostImagesResults((prev) => [...prev, { originalPost: post, postImagesResult }]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload to PostImages");
    } finally {
      setUploadingToPostImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  };

  const handleUploadAllToPostImages = async () => {
    setUploadingToPostImages(new Set(mockGeneratedPosts.map((p) => p.id)));
    setError(null);

    try {
      const results = await generatedImagePostImagesService.uploadMultipleGeneratedImagesToPostImages(mockGeneratedPosts);

      setPostImagesResults((prev) => [...prev, ...results]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload to PostImages");
    } finally {
      setUploadingToPostImages(new Set());
    }
  };

  const handleDownloadImage = async (post: (typeof mockGeneratedPosts)[0]) => {
    try {
      const response = await fetch(post.generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${post.title.replace(/[^a-zA-Z0-9]/g, "_")}_mock.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to download image");
    }
  };

  const handleGenerateSinglePost = async () => {
    setGeneratingSinglePost(true);
    setError(null);

    try {
      // Call the generate-holiday-graphics API to generate a single post
      const response = await fetch("/api/generate-holiday-graphics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          holidays: [
            {
              id: 1,
              title: "Światowy Dzień Zdrowia",
              description: "Promocja zdrowia i profilaktyki",
              query: "health wellness",
              literalDate: "7 kwietnia 2024",
              dateForThisYear: "2024-04-07",
            },
          ],
          count: 1, // Generate only 1 post
          useTemplate: true,
          templateConfig: {
            templateImageUrl: "/templates/holiday-template.png",
            datePosition: { x: 50, y: 100, fontSize: 24, color: "#ffffff", fontFamily: "Arial", textAlign: "left" as const },
            titlePosition: {
              x: 50,
              y: 150,
              fontSize: 32,
              color: "#ffffff",
              fontFamily: "Arial",
              textAlign: "left" as const,
              maxWidth: 400,
              lineHeight: 1.2,
            },
            canvasSize: { width: 940, height: 788 },
            imagePlaceholder: { x: 0, y: 0, width: 940, height: 788 },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.posts && result.posts.length > 0) {
        setSingleGeneratedPost(result.posts[0]);
      } else {
        throw new Error(result.error || "Failed to generate post");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate single post");
    } finally {
      setGeneratingSinglePost(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mock Template Upload Test
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This is a test component with mock generated post templates. You can test the upload functionality by uploading these mock images to
        Firebase Storage and getting URLs.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoAwesome />}
          onClick={handleGenerateSinglePost}
          disabled={generatingSinglePost}
        >
          {generatingSinglePost ? "Generating..." : "Generate Single Post with Graphics"}
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={handleUploadAllToPostImages}
          disabled={uploadingToPostImages.size > 0}
        >
          {uploadingToPostImages.size > 0 ? "Uploading..." : "Upload All to PostImages"}
        </Button>
        {postImagesResults.length > 0 && (
          <Button variant="outlined" onClick={() => setShowPostImagesUrls(true)}>
            View PostImages URLs ({postImagesResults.length})
          </Button>
        )}
      </Box>

      {/* Single Generated Post */}
      {singleGeneratedPost && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Post with Graphics
          </Typography>
          <Card sx={{ maxWidth: 400, mx: "auto" }}>
            <CardMedia
              component="img"
              height="300"
              image={singleGeneratedPost.generatedImageUrl}
              alt={singleGeneratedPost.title}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {singleGeneratedPost.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {singleGeneratedPost.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Data:</strong> {singleGeneratedPost.literalDate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Treść posta:</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "grey.100",
                  p: 1,
                  borderRadius: 1,
                  fontStyle: "italic",
                  mb: 2,
                }}
              >
                {singleGeneratedPost.text}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {singleGeneratedPost.tags.split(", ").map((tag: string, index: number) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleDownloadImage(singleGeneratedPost)}
                  sx={{ flex: 1 }}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => handleUploadToPostImages(singleGeneratedPost)}
                  disabled={uploadingToPostImages.has(singleGeneratedPost.id)}
                  sx={{ flex: 1 }}
                >
                  {uploadingToPostImages.has(singleGeneratedPost.id) ? "Uploading..." : "Upload to PostImages"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      <Grid container spacing={3}>
        {mockGeneratedPosts.map((post) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia component="img" height="200" image={post.generatedImageUrl} alt={post.title} sx={{ objectFit: "cover" }} />
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" gutterBottom>
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
                    <strong>Tagi:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {post.tags.split(", ").map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    onClick={() => handleDownloadImage(post)}
                    sx={{ flex: 1 }}
                  >
                    Download
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CloudUpload />}
                    onClick={() => handleUploadToPostImages(post)}
                    disabled={uploadingToPostImages.has(post.id)}
                    sx={{ flex: 1 }}
                  >
                    {uploadingToPostImages.has(post.id) ? "Uploading..." : "Upload to PostImages"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for viewing PostImages URLs */}
      <Dialog open={showPostImagesUrls} onClose={() => setShowPostImagesUrls(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          PostImages URLs ({postImagesResults.length})
          <IconButton onClick={() => setShowPostImagesUrls(false)}>
            <Close />
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
                      <Box
                        sx={{
                          backgroundColor: "grey.100",
                          p: 1,
                          borderRadius: 1,
                          mb: 1,
                          wordBreak: "break-all",
                          fontFamily: "monospace",
                          fontSize: "0.875rem",
                        }}
                      >
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
        <DialogActions>
          <Button onClick={() => setShowPostImagesUrls(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
