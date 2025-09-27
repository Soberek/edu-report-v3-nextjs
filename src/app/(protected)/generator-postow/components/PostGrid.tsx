import React from "react";
import { Box, Typography } from "@mui/material";
import { EducationalPost } from "../types";
import { EducationalPostCard } from "./EducationalPostCard";

interface PostGridProps {
  posts: EducationalPost[];
  title: string;
  emptyMessage: string;
  onRefetchImage: (postId: string, tag: string, updateImageUrl: (url: string) => void) => void;
  onEdit: (post: EducationalPost) => void;
  onPreview: (post: EducationalPost) => void;
  onToggleFavorite: (postId: number) => void;
}

/**
 * Component for displaying a grid of posts
 */
export function PostGrid({
  posts,
  title,
  emptyMessage,
  onRefetchImage,
  onEdit,
  onPreview,
  onToggleFavorite,
}: PostGridProps) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {title} ({posts.length})
      </Typography>
      {posts.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
          {posts.map((post) => (
            <Box key={post.id}>
              <EducationalPostCard
                post={post}
                imageId={post.id.toString()}
                imageUrl={post.imageUrl}
                onRefetchImage={onRefetchImage}
                onEdit={onEdit}
                onPreview={onPreview}
                onToggleFavorite={onToggleFavorite}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
