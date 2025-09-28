"use client";
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000ff",
      light: "#484848",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#000000ff",
      light: "#a4a4a4",
      dark: "#494949",
      contrastText: "#000000ff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "0.95rem",
          padding: "10px 24px",
          minHeight: "44px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
          },
        }),
        contained: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          border: "none",
          "&:hover": {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0px)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          },
        }),
        outlined: ({ theme }) => ({
          color: theme.palette.primary.main,
          border: `2px solid ${theme.palette.primary.main}`,
          background: "transparent",
          "&:hover": {
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            border: `2px solid ${theme.palette.primary.main}`,
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          },
          "&:active": {
            transform: "translateY(0px)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          },
        }),
        text: ({ theme }) => ({
          color: theme.palette.primary.main,
          background: "transparent",
          border: "none",
          "&:hover": {
            background: `${theme.palette.primary.main}15`,
            color: theme.palette.primary.dark,
          },
          "&:active": {
            background: `${theme.palette.primary.main}25`,
          },
        }),
        sizeSmall: {
          padding: "6px 16px",
          minHeight: "36px",
          fontSize: "0.85rem",
        },
        sizeLarge: {
          padding: "14px 32px",
          minHeight: "52px",
          fontSize: "1.1rem",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
        size: "small",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: theme.palette.divider,
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
              borderWidth: "2px",
            },
            "& input": {
              color: theme.palette.text.primary,
              padding: "12px 14px",
            },
          },
          "& .MuiInputLabel-root": {
            color: theme.palette.text.secondary,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-2px)",
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: "0 1px 8px rgba(0, 0, 0, 0.06)",
        }),
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) / 2,
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
        }),
        colorPrimary: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: theme.palette.primary.contrastText,
        }),
        colorSecondary: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
          color: theme.palette.secondary.contrastText,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          background: "#ffffff",
          boxShadow: "0 2px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: 0,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1rem",
          minWidth: "auto",
          padding: "12px 24px",
          transition: "all 0.2s ease-in-out",
          "&.Mui-selected": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) => ({
          background: theme.palette.primary.main,
          height: 3,
          borderRadius: "3px 3px 0 0",
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) * 1.5,
          boxShadow: "0 8px 48px rgba(0, 0, 0, 0.16)",
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          border: "1px solid",
        }),
        standardSuccess: ({ theme }) => ({
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderColor: theme.palette.primary.light,
          color: theme.palette.primary.dark,
        }),
        standardError: () => ({
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderColor: "#757575",
          color: "#212121",
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: 0,
          boxShadow: "2px 0 16px rgba(0, 0, 0, 0.08)",
          border: "none",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }),
        paperAnchorLeft: ({ theme }) => ({
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: "2px 0 16px rgba(0, 0, 0, 0.08)",
        }),
        paperAnchorRight: ({ theme }) => ({
          borderLeft: `1px solid ${theme.palette.divider}`,
          boxShadow: "-2px 0 16px rgba(0, 0, 0, 0.08)",
        }),
        paperAnchorTop: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)",
        }),
        paperAnchorBottom: ({ theme }) => ({
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 -2px 16px rgba(0, 0, 0, 0.08)",
        }),
      },
    },
  },
});

export default theme;
