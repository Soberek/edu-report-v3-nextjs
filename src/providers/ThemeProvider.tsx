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
          color: "black",
          border: "1px solid black",
          borderRadius: theme.shape.borderRadius,
          boxShadow: "0 4px 0px rgba(0, 0, 0, 0.8)",
          fontWeight: theme.typography.button.fontWeight,
          textTransform: theme.typography.button.textTransform,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            color: "black",
            background: "rgba(255, 255, 255, 0.1)",
            transform: "translateY(4px)",
            boxShadow: "0 0px 0px rgba(0, 0, 0, 0.4)",
          },
          "&:active": {
            transform: "translateY(0px)",
            boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
          },
          "&:disabled": {
            background: theme.palette.action.disabled,
            color: theme.palette.text.disabled,
            boxShadow: "none",
            transform: "none",
          },
        }),
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
