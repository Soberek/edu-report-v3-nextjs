import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";
import { PostPreviewDialogProps } from "../types";

/**
 * Component for previewing posts
 */
export function PostPreviewDialog({ open, post, onClose, onDownload }: PostPreviewDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Podgląd posta</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          {post.imageUrl && (
            <img
              src={`${post.imageUrl}?w=400&h=400`}
              alt={post.title}
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
          )}
          <Typography variant="h5" sx={{ mb: 1 }}>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {post.description}
          </Typography>
          <Typography variant="body2">{post.content}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
        <Button variant="contained" startIcon={<Download />} onClick={onDownload}>
          Pobierz
        </Button>
      </DialogActions>
    </Dialog>
  );
}
