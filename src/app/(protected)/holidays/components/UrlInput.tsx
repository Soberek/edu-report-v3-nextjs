import React from "react";
import { TextField, Box } from "@mui/material";

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  disabled?: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, onUrlChange, disabled = false }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="URL do scrapowania"
        placeholder="Wprowadź URL do scrapowania"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        disabled={disabled}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};
