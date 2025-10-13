import { GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { CalendarToday, Group, Email, Phone } from "@mui/icons-material";
import { AvatarWithText, Tag, InfoBadge, NotesCell, DateCell } from "@/components/shared";

export interface TableColumnConfig {
  field: string;
  headerName: string;
  flex: number;
  minWidth: number;
  align: "left" | "center" | "right";
  headerAlign: "left" | "center" | "right";
}

export const TABLE_COLUMNS: TableColumnConfig[] = [
  { field: "schoolName", headerName: "Szkoła", flex: 2.25, minWidth: 200, align: "center", headerAlign: "center" },
  { field: "programName", headerName: "Program", flex: 1.5, minWidth: 150, align: "center", headerAlign: "center" },
  { field: "coordinatorName", headerName: "Koordynator", flex: 1.8, minWidth: 180, align: "center", headerAlign: "center" },
  { field: "coordinatorEmail", headerName: "Email", flex: 1.8, minWidth: 180, align: "center", headerAlign: "center" },
  { field: "coordinatorPhone", headerName: "Telefon", flex: 1.4, minWidth: 140, align: "center", headerAlign: "center" },
  { field: "schoolYear", headerName: "Rok", flex: 1.4, minWidth: 120, align: "center", headerAlign: "center" },
  { field: "studentCount", headerName: "Uczniowie", flex: 1.2, minWidth: 100, align: "center", headerAlign: "center" },
  { field: "notes", headerName: "Notatki", flex: 2, minWidth: 150, align: "center", headerAlign: "center" },
  { field: "createdAt", headerName: "Data", flex: 1.2, minWidth: 100, align: "center", headerAlign: "center" },
];

export const CUSTOM_STYLES = {
  "& .MuiDataGrid-root": {
    border: "none",
    borderRadius: 3,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(224, 224, 224, 0.3)",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    minHeight: "auto !important",
    height: "auto !important",
    whiteSpace: "normal",
    wordBreak: "break-word",
  },
  "& .MuiDataGrid-columnHeaders": {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderBottom: "none",
    borderRadius: "12px 12px 0 0",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    fontSize: "0.8rem",
    whiteSpace: "normal",
    wordBreak: "break-word",
  },
  "& .MuiDataGrid-columnHeader": {
    borderRight: "1px solid rgba(255,255,255,0.2)",
    "&:last-child": {
      borderRight: "none",
    },
    minHeight: "auto !important",
    height: "auto !important",
    padding: "12px 8px",
  },
  "& .MuiDataGrid-row": {
    minHeight: "auto !important",
    height: "auto !important",
    "&:hover": {
      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    "&:nth-of-type(even)": {
      background: "rgba(0,0,0,0.02)",
    },
    "&.Mui-selected": {
      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
      "&:hover": {
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
      },
    },
  },
  "& .MuiDataGrid-virtualScroller": {
    overflow: "visible",
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    height: "auto !important",
  },
  "& .MuiDataGrid-virtualScrollerRenderZone": {
    transform: "none !important",
  },
};

const renderCellContent = (field: string, value: unknown) => {
  switch (field) {
    case "schoolName":
      return <AvatarWithText text={value as string} />;
    case "programName":
      return <Tag label={value as string} />;
    case "coordinatorName":
      return <AvatarWithText text={value as string} avatarSize={28} fontSize="0.7rem" fontWeight="500" />;
    case "coordinatorEmail":
      return value ? (
        <InfoBadge
          icon={<Email />}
          text={value as string}
          backgroundColor="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
          borderColor="#2196f3"
          iconColor="#1976d2"
          textColor="#0d47a1"
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          -
        </Typography>
      );
    case "coordinatorPhone":
      return value ? (
        <InfoBadge
          icon={<Phone />}
          text={value as string}
          backgroundColor="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)"
          borderColor="#9c27b0"
          iconColor="#7b1fa2"
          textColor="#4a148c"
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          -
        </Typography>
      );
    case "schoolYear":
      return <InfoBadge icon={<CalendarToday />} text={value as string} />;
    case "studentCount":
      return (
        <InfoBadge
          icon={<Group />}
          text={value as string}
          backgroundColor="linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"
          borderColor="#4caf50"
          iconColor="#4caf50"
          textColor="#2e7d32"
        />
      );
    case "notes":
      return <NotesCell notes={value as string} />;
    case "createdAt":
      return <DateCell date={value as string} />;
    default:
      return <Typography variant="body2">{value as string}</Typography>;
  }
};

export const createColumns = (): GridColDef[] => {
  return TABLE_COLUMNS.map(({ field, headerName, flex, minWidth, align, headerAlign }) => ({
    field,
    headerName,
    flex,
    minWidth,
    align,
    headerAlign,
    renderCell: (params) => renderCellContent(field, params.value),
  }));
};
