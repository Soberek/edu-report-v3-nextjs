import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import { Refresh, Download, Share, Favorite, Edit, Image as ImageIcon } from "@mui/icons-material";
import { EducationalPostCardProps } from "../types";
import { getTemplateStyle } from "../utils";

/**
 * Component for displaying an educational post with an image
 */
export function EducationalPostCard({
  post,
  imageUrl,
  imageId,
  onRefetchImage,
  onEdit,
  onPreview,
  onToggleFavorite,
}: EducationalPostCardProps) {
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
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    },
  };

  const titleStyle = {
    margin: "0 0 8px 0",
    fontWeight: "bold",
  };

  const descStyle = {
    margin: 0,
    color: "#666",
    lineHeight: 1.6,
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Chip label={post.platform} size="small" color="primary" variant="outlined" />
          <Box>
            <IconButton
              size="small"
              onClick={() => onToggleFavorite(post.id)}
              color={post.isFavorite ? "error" : "default"}
            >
              <Favorite />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(post)}>
              <Edit />
            </IconButton>
            <IconButton size="small" onClick={() => onPreview(post)}>
              <ImageIcon />
            </IconButton>
          </Box>
        </Box>

        {localImageUrl && (
          <Box sx={{ position: "relative", mb: 2 }}>
            <img
              src={`${localImageUrl}?w=400&h=200`}
              alt={post.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {post.textOverlay.enabled && (
              <Box
                sx={{
                  position: "absolute",
                  [post.textOverlay.position]: "16px",
                  left: "16px",
                  right: "16px",
                  textAlign: "center",
                  color: post.textOverlay.color,
                  fontSize: post.textOverlay.fontSize,
                  fontWeight: post.textOverlay.fontWeight,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {post.textOverlay.text}
              </Box>
            )}
          </Box>
        )}

        <Typography variant="h6" sx={titleStyle}>
          {post.title}
        </Typography>
        <Typography variant="body2" sx={descStyle} paragraph>
          {post.description}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
          {post.content}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button size="small" startIcon={<Refresh />} onClick={handleRefetch} variant="outlined">
            Nowe zdjęcie
          </Button>
          <Button size="small" startIcon={<Download />} variant="outlined">
            Pobierz
          </Button>
          <Button size="small" startIcon={<Share />} variant="outlined">
            Udostępnij
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
