import React from "react";
import { Box, TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { TextFields, Save } from "@mui/icons-material";
import { NewPostFormProps } from "../types";

/**
 * Component for creating new posts with AI content generation
 */
export function NewPostForm({
  newPostTopic,
  generatedContent,
  aiLoading,
  onTopicChange,
  onGenerateContent,
  onCreatePost,
}: NewPostFormProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Stwórz nowy post edukacyjny
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Temat posta"
          value={newPostTopic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="np. Zdrowy styl życia, Ekologia, Edukacja..."
        />
        <Button
          variant="contained"
          onClick={onGenerateContent}
          disabled={!newPostTopic.trim() || aiLoading}
          startIcon={<TextFields />}
        >
          {aiLoading ? "Generuję..." : "Generuj treść"}
        </Button>
      </Box>

      {generatedContent && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Wygenerowana treść:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
              {generatedContent}
            </Typography>
            <Button variant="contained" onClick={onCreatePost} startIcon={<Save />}>
              Stwórz post
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
