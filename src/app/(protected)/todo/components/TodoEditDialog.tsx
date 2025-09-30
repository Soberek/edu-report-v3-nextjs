import { useState, useEffect } from "react";
import { EditDialog, FormField, FormSection } from "@/components/shared";
import { Todo } from "../types";
import { Chip, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface TodoEditDialogProps {
  open: boolean;
  onClose: () => void;
  todo: Todo | null;
  onSave: (todo: Todo | null, updates: Partial<Todo>) => void;
  mode?: "create" | "edit";
}

export const TodoEditDialog = ({ open, onClose, todo, onSave, mode = "edit" }: TodoEditDialogProps) => {
  const [formData, setFormData] = useState<{
    text: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    category: string;
    tags: string;
    estimatedTime: number;
    reminder: string;
    recurringType: "daily" | "weekly" | "monthly" | "yearly" | "none";
    recurringInterval: number;
    recurringEndDate: string;
  }>({
    text: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "",
    tags: "",
    estimatedTime: 0,
    reminder: "",
    recurringType: "none",
    recurringInterval: 1,
    recurringEndDate: "",
  });

  useEffect(() => {
    if (mode === "create") {
      // Reset form for create mode
      setFormData({
        text: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0], // Today's date
        priority: "medium",
        category: "",
        tags: "",
        estimatedTime: 0,
        reminder: "",
        recurringType: "none",
        recurringInterval: 1,
        recurringEndDate: "",
      });
    } else if (todo) {
      // Populate form for edit mode
      setFormData({
        text: todo.text,
        description: todo.description || "",
        dueDate: todo.dueDate,
        priority: todo.priority,
        category: todo.category,
        tags: todo.tags.join(", "),
        estimatedTime: todo.estimatedTime || 0,
        reminder: todo.reminder || "",
        recurringType: todo.recurring?.type || "none",
        recurringInterval: todo.recurring?.interval || 1,
        recurringEndDate: todo.recurring?.endDate || "",
      });
    }
  }, [todo, mode]);

  const handleSave = () => {
    if (formData.text.trim()) {
      const updates: Partial<Todo> = {
        text: formData.text,
        description: formData.description || undefined,
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category || "Ogólne",
        tags: formData.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag),
        estimatedTime: formData.estimatedTime || undefined,
        reminder: formData.reminder || undefined,
        recurring:
          formData.recurringType !== "none"
            ? {
                type: formData.recurringType,
                interval: formData.recurringInterval,
                endDate: formData.recurringEndDate || undefined,
              }
            : undefined,
      };
      onSave(todo, updates);
      onClose();
    }
  };

  if (mode === "edit" && !todo) return null;

  return (
    <EditDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Dodaj nowe zadanie" : "Edytuj zadanie"}
      onSave={handleSave}
      maxWidth="md"
      mode={mode}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Basic Information */}
        <FormSection title="Podstawowe informacje">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Tytuł zadania"
              value={formData.text}
              onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
              variant="outlined"
              required
            />

            <TextField
              fullWidth
              label="Opis"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              variant="outlined"
              multiline
              rows={3}
            />
          </Box>
        </FormSection>

        {/* Date and Priority */}
        <FormSection title="Termin i priorytet">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              fullWidth
              label="Termin"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel>Priorytet</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))}
                label="Priorytet"
              >
                <MenuItem value="low">Niski</MenuItem>
                <MenuItem value="medium">Średni</MenuItem>
                <MenuItem value="high">Wysoki</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </FormSection>

        {/* Category and Time */}
        <FormSection title="Kategoria i czas">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              fullWidth
              label="Kategoria"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Szacowany czas (minuty)"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
              variant="outlined"
              inputProps={{ min: 0 }}
            />
          </Box>
        </FormSection>

        {/* Tags */}
        <FormSection title="Tagi">
          <TextField
            fullWidth
            label="Tagi (oddzielone przecinkami)"
            value={formData.tags}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            variant="outlined"
            helperText="Wprowadź tagi oddzielone przecinkami"
          />
          {formData.tags && (
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {formData.tags.split(",").map((tag: string, index: number) => (
                <Chip key={index} label={tag.trim()} size="small" color="primary" variant="outlined" />
              ))}
            </Box>
          )}
        </FormSection>

        {/* Reminder */}
        <FormSection title="Przypomnienia">
          <TextField
            fullWidth
            label="Przypomnienie"
            type="datetime-local"
            value={formData.reminder}
            onChange={(e) => setFormData((prev) => ({ ...prev, reminder: e.target.value }))}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </FormSection>

        {/* Recurring Settings */}
        <FormSection title="Powtarzanie">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Powtarzanie</InputLabel>
              <Select
                value={formData.recurringType}
                onChange={(e) => setFormData((prev) => ({ ...prev, recurringType: e.target.value as any }))}
                label="Powtarzanie"
              >
                <MenuItem value="none">Bez powtórzeń</MenuItem>
                <MenuItem value="daily">Codziennie</MenuItem>
                <MenuItem value="weekly">Tygodniowo</MenuItem>
                <MenuItem value="monthly">Miesięcznie</MenuItem>
                <MenuItem value="yearly">Rocznie</MenuItem>
              </Select>
            </FormControl>

            {formData.recurringType !== "none" && (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Interwał"
                  type="number"
                  value={formData.recurringInterval}
                  onChange={(e) => setFormData((prev) => ({ ...prev, recurringInterval: parseInt(e.target.value) || 1 }))}
                  variant="outlined"
                  inputProps={{ min: 1 }}
                />

                <TextField
                  fullWidth
                  label="Data zakończenia powtórzeń"
                  type="date"
                  value={formData.recurringEndDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, recurringEndDate: e.target.value }))}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}
          </Box>
        </FormSection>
      </Box>
    </EditDialog>
  );
};
