import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { MdOutlineDownload, MdOutlineUpload, MdInsertDriveFile } from "react-icons/md";
import type { ProgramsData } from "../../types";

interface Props {
  fileName: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveToExcelFile: (data: ProgramsData) => void;
  error: string;
  data: ProgramsData | undefined;
}

const ExcelUploaderUploadButtons: React.FC<Props> = ({ fileName, handleFileUpload, saveToExcelFile, error, data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
        mx: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          startIcon={<MdOutlineUpload />}
          variant="contained"
          component="label"
          size="large"
          sx={{
            minWidth: 160,
            py: 1.5,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Wgraj plik excel
          <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
        </Button>

        <Button
          startIcon={<MdOutlineDownload />}
          disabled={!fileName || error.length > 0}
          variant="outlined"
          size="large"
          onClick={() => data && saveToExcelFile(data)}
          sx={{
            minWidth: 160,
            py: 1.5,
            "&:not(:disabled)": {
              borderColor: "success.main",
              "&:hover": {
                bgcolor: "success.main",
                borderColor: "success.dark",
              },
            },
          }}
        >
          Zapisz miernik
        </Button>
      </Box>

      {/* File name display */}
      {fileName && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <MdInsertDriveFile color="#4caf50" size={20} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {fileName}
          </Typography>
          <Chip label="Gotowy" size="small" color="success" variant="outlined" />
        </Box>
      )}
    </Box>
  );
};

export default ExcelUploaderUploadButtons;
