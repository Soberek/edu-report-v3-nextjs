import React, { useState, useEffect } from "react";
import { Card, CardContent, Box, Typography, Chip, IconButton, Button } from "@mui/material";
import { Refresh, Download, Share, Favorite, Edit, Image as ImageIcon } from "@mui/icons-material";
import { EducationalPostCardProps } from "../types";
import { getTemplateStyle } from "../utils";

/**
 * Component for displaying an educational post with an image
 */
export function EducationalPostCard({ post, imageUrl, onRefetchImage, onEdit, onPreview, onToggleFavorite }: EducationalPostCardProps) {
  // Local state for the image URL to enable individual updates
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);

  // Handler for refetching a specific image
  const handleRefetch = () => {
    onRefetchImage(post.id.toString(), post.tag, (newUrl: string) => {
      setLocalImageUrl(newUrl);
    });
  };

  // Update local state when props change
  useEffect(() => {
    setLocalImageUrl(imageUrl);
  }, [imageUrl]);

  const cardStyle = {
    borderRadius: 3,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      border: "1px solid rgba(25, 118, 210, 0.3)",
    },
  };

  const titleStyle = {
    margin: "0 0 12px 0",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "1.25rem",
  };

  const descStyle = {
    margin: 0,
    color: "#666",
    lineHeight: 1.6,
    fontSize: "0.95rem",
  };

  return (
    <Card
      sx={{
        ...cardStyle,
        ...getTemplateStyle(post.template),
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)",
            border: "1px solid rgba(25, 118, 210, 0.1)",
          }}
        >
          <Chip
            label={post.platform}
            size="small"
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            }}
          />
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onToggleFavorite(post.id)}
              sx={{
                color: post.isFavorite ? "#e91e63" : "#666",
                "&:hover": {
                  background: post.isFavorite ? "rgba(233, 30, 99, 0.1)" : "rgba(0,0,0,0.04)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <Favorite />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onEdit(post)}
              sx={{
                "&:hover": {
                  background: "rgba(25, 118, 210, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onPreview(post)}
              sx={{
                "&:hover": {
                  background: "rgba(76, 175, 80, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <ImageIcon />
            </IconButton>
          </Box>
        </Box>

        {localImageUrl && (
          <Box
            sx={{
              position: "relative",
              mb: 3,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={`${localImageUrl}?w=400&h=220`}
              alt={post.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            {post.textOverlay.enabled && (
              <Box
                sx={{
                  position: "absolute",
                  [post.textOverlay.position]: "20px",
                  left: "20px",
                  right: "20px",
                  textAlign: "center",
                  color: post.textOverlay.color,
                  fontSize: post.textOverlay.fontSize,
                  fontWeight: post.textOverlay.fontWeight,
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                {post.textOverlay.text}
              </Box>
            )}
            {/* Gradient overlay for better text readability */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
              }}
            />
          </Box>
        )}

        <Typography variant="h6" sx={titleStyle}>
          {post.title}
        </Typography>
        <Typography variant="body2" sx={descStyle} paragraph>
          {post.description}
        </Typography>
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "#495057",
            }}
          >
            {post.content}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={handleRefetch}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg, #ff9800, #ffc107)",
                color: "white",
                border: "none",
              },
            }}
          >
            Nowe zdjęcie
          </Button>
          <Button
            size="small"
            startIcon={<Download />}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg, #4caf50, #8bc34a)",
                color: "white",
                border: "none",
              },
            }}
          >
            Pobierz
          </Button>
          <Button
            size="small"
            startIcon={<Share />}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg, #2196f3, #03a9f4)",
                color: "white",
                border: "none",
              },
            }}
          >
            Udostępnij
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
