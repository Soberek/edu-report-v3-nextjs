"use client";
import React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

// Route mapping for breadcrumbs
const routeMap: { [key: string]: string } = {
  "/": "Strona główna",
  "/contacts": "Kontakty",
  "/schedule": "Harmonogram",
  "/generator-postow": "Generator postów",
  "/wygeneruj-izrz": "Generator IZRZ",
  "/czerniak": "Czerniak",
  "/habit-tracker": "Śledzenie nawyków",
  "/holidays": "Święta",
  "/offline-miernik-budzetowy": "Miernik budżetowy",
  "/programy-edukacyjne": "Programy edukacyjne",
  "/spisy-spraw": "Spisy spraw",
  "/szkoly-w-programie": "Szkoły w programie",
  "/todo": "Lista zadań",
  "/grypa-i-przeziebienia": "Grypa i przeziębienia",
};

const Breadcrumbs: React.FC = () => {
  const theme = useTheme();
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      {
        label: "Strona główna",
        href: "/",
        isLast: pathname === "/",
      },
    ];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        label: routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 2px 10px ${theme.palette.primary.main}05`,
      }}
    >
      <MuiBreadcrumbs
        separator="›"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: theme.palette.text.secondary,
            fontSize: "1.2rem",
            fontWeight: "bold",
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          if (item.isLast) {
            return (
              <Typography
                key={item.href}
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.href}
              component={NextLink}
              href={item.href}
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                  textDecoration: "underline",
                },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
