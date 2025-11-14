import React from "react";
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { Home, ChevronRight } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material/styles";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs = [], actions, sx = {}, children }) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
        ...sx,
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 2 }}>
          <Link
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <Home sx={{ fontSize: 16, mr: 0.5 }} />
            Strona główna
          </Link>
          {breadcrumbs.map((item, index) => (
            <Box key={index}>
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <Typography color={item.current ? "primary.main" : "text.secondary"} sx={{ fontWeight: item.current ? 600 : 400 }}>
                  {item.label}
                </Typography>
              )}
            </Box>
          ))}
        </Breadcrumbs>
      )}

      {/* Title and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: subtitle ? 1 : 0,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{actions}</Box>}
      </Box>

      {children && <Box sx={{ mt: subtitle ? 2 : 3 }}>{children}</Box>}
    </Box>
  );
};

// Simple page header without breadcrumbs
export const SimplePageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}> = ({ title, subtitle, actions, sx = {}, children }) => (
  <PageHeader title={title} subtitle={subtitle} actions={actions} sx={sx}>
    {children}
  </PageHeader>
);
