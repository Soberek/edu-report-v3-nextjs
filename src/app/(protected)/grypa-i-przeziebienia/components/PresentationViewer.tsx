"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Slide as MuiSlide,
  Zoom,
  Grow,
  Avatar,
  Grid,
  Container,
} from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  Speed,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import { PRESENTATION_DATA, type Slide } from "../constants/presentationData";

interface PresentationViewerProps {
  onFullscreen?: (isFullscreen: boolean) => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ onFullscreen }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000);
  const [isMuted, setIsMuted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const slides = PRESENTATION_DATA.slides;
  const totalSlides = slides.length;

  const progress = useMemo(() => ((currentSlide + 1) / totalSlides) * 100, [currentSlide, totalSlides]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentSlide < totalSlides - 1) {
          setSlideDirection("right");
          setCurrentSlide((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, autoPlaySpeed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentSlide, totalSlides, autoPlaySpeed]);

  const handlePrevious = useCallback(() => {
    setSlideDirection("left");
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setSlideDirection("right");
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  const handleSlideSelect = useCallback(
    (slideIndex: number) => {
      setSlideDirection(slideIndex > currentSlide ? "right" : "left");
      setCurrentSlide(slideIndex);
    },
    [currentSlide]
  );

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    onFullscreen?.(newFullscreen);
  }, [isFullscreen, onFullscreen]);

  const getSlideTypeColor = useCallback((type: Slide["type"]) => {
    const colors = {
      introduction: "primary",
      definition: "secondary",
      transmission: "warning",
      symptoms: "error",
      comparison: "info",
      complications: "error",
      treatment: "success",
      homeRemedies: "success",
      prevention: "info",
      medical: "warning",
      summary: "primary",
    } as const;
    return colors[type] || "default";
  }, []);

  const getSlideTypeLabel = useCallback((type: Slide["type"]) => {
    const labels = {
      introduction: "Wprowadzenie",
      definition: "Definicja",
      transmission: "Zakażenie",
      symptoms: "Objawy",
      comparison: "Porównanie",
      complications: "Powikłania",
      treatment: "Leczenie",
      homeRemedies: "Domowe sposoby",
      prevention: "Profilaktyka",
      medical: "Lekarz",
      summary: "Podsumowanie",
    };
    return labels[type] || type;
  }, []);

  const getSlideTypeIcon = useCallback((type: Slide["type"]) => {
    const icons = {
      introduction: "🌡️",
      definition: "📖",
      transmission: "💨",
      symptoms: "🤒",
      comparison: "⚖️",
      complications: "⚠️",
      treatment: "💊",
      homeRemedies: "🏠",
      prevention: "🛡️",
      medical: "🏥",
      summary: "✅",
    };
    return icons[type] || "📄";
  }, []);

  const getSlideBackgroundGradient = useCallback((type: Slide["type"]) => {
    const gradients = {
      introduction: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      definition: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      transmission: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      symptoms: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      comparison: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      complications: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      treatment: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      homeRemedies: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      prevention: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
      medical: "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)",
      summary: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    };
    return gradients[type] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }, []);

  const renderSlideContent = useCallback(
    (slide: Slide) => {
      if (slide.type === "comparison" && slide.content[0].includes("|")) {
        // Render enhanced table for comparison slides
        const lines = slide.content;
        const [header, separator, ...rows] = lines;
        const headers = header
          .split("|")
          .map((h) => h.trim())
          .filter(Boolean);

        return (
          <Box
            sx={{
              overflow: "auto",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "1.1rem",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                    color: "white",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  const cells = row
                    .split("|")
                    .map((c) => c.trim())
                    .filter(Boolean);
                  return (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor: rowIndex % 2 === 0 ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.95)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {cells.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: "20px",
                            borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                            fontSize: "1.1rem",
                            fontWeight: "500",
                            color: "#2c3e50",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        );
      }

      // Render enhanced content with animations
      return (
        <Stack spacing={2}>
          {slide.content.map((item, index) => (
            <Fade in={true} timeout={300 + index * 100} key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(15px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {index + 1}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: "#ffffff",
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item}
                </Typography>
              </Box>
            </Fade>
          ))}
        </Stack>
      );
    },
    [theme.palette.grey]
  );

  const currentSlideData = slides[currentSlide];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Enhanced Header */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>{getSlideTypeIcon(currentSlideData.type)}</Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }}>
                {PRESENTATION_DATA.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {PRESENTATION_DATA.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={getSlideTypeLabel(currentSlideData.type)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: "bold",
              }}
              size="small"
            />
            <IconButton onClick={toggleFullscreen} size="small" sx={{ color: "white" }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "white",
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Slajd {currentSlide + 1} z {totalSlides}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={togglePlayPause} size="small" sx={{ color: "white" }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={() => setIsMuted(!isMuted)} size="small" sx={{ color: "white" }}>
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Enhanced Slide Navigation */}
        {!isMobile && (
          <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            {slides.map((slide, index) => (
              <Button
                key={index}
                variant={index === currentSlide ? "contained" : "outlined"}
                size="small"
                onClick={() => handleSlideSelect(index)}
                sx={{
                  minWidth: 48,
                  height: 48,
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                    {getSlideTypeIcon(slide.type)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                    {index + 1}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        )}

        {/* Enhanced Slide Content */}
        <MuiSlide direction={slideDirection} in={true} mountOnEnter unmountOnExit>
          <Card
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: getSlideBackgroundGradient(currentSlideData.type),
              position: "relative",
            }}
          >
            {/* Slide Header */}
            <Box
              sx={{
                p: 4,
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(15px)",
                borderBottom: "3px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                variant="h3"
                textAlign="center"
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textShadow: "3px 3px 6px rgba(0, 0, 0, 0.8)",
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  letterSpacing: "1px",
                }}
              >
                {currentSlideData.title}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    fontSize: "1rem",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {getSlideTypeIcon(currentSlideData.type)}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  {getSlideTypeLabel(currentSlideData.type)}
                </Typography>
              </Box>
            </Box>

            {/* Slide Content */}
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 4,
                overflow: "auto",
              }}
            >
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {renderSlideContent(currentSlideData)}
              </Box>
            </CardContent>
          </Card>
        </MuiSlide>

        {/* Enhanced Controls */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            variant="contained"
            startIcon={<NavigateBefore />}
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Poprzedni
          </Button>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={togglePlayPause}
                sx={{
                  backgroundColor: isPlaying ? "rgba(255, 0, 0, 0.1)" : "rgba(0, 255, 0, 0.1)",
                  color: isPlaying ? "red" : "green",
                  "&:hover": {
                    backgroundColor: isPlaying ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Box>

            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "bold" }}>
              {currentSlide + 1} / {totalSlides}
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<NavigateNext />}
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Następny
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
