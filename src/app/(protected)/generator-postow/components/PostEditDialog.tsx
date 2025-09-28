import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PostEditDialogProps, EducationalPost } from "../types";
import { postTemplates } from "../constants";

/**
 * Component for editing posts
 */
export function PostEditDialog({ open, post, onClose, onSave }: PostEditDialogProps) {
  if (!post) return null;

  const [editedPost, setEditedPost] = React.useState(post);

  React.useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const handleSave = () => {
    onSave(editedPost);
    onClose();
  };

  const handleFieldChange = (field: keyof EducationalPost, value: EducationalPost[keyof EducationalPost]) => {
    setEditedPost((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edytuj post</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Tytuł"
            value={editedPost.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Opis"
            value={editedPost.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Treść"
            value={editedPost.content}
            onChange={(e) => handleFieldChange("content", e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Szablon</InputLabel>
            <Select
              value={editedPost.template}
              label="Szablon"
              onChange={(e) => handleFieldChange("template", e.target.value)}
            >
              {postTemplates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="contained" onClick={handleSave}>
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}
