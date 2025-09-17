"use client";
import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider, useTheme } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/constants/nav-routes";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PeopleIcon from "@mui/icons-material/People";
import TuneIcon from "@mui/icons-material/Tune";
import { useNavContext } from "@/providers/NavProvider";

const drawerWidth = 300;

// Icon mapping for routes
const getRouteIcon = (path: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "": <DashboardIcon />,
    schools: <AnalyticsIcon />,
    programs: <PeopleIcon />,
    acts: <TuneIcon />,
    contacts: <PeopleIcon />,
  };
  return iconMap[path] || <DashboardIcon />;
};

const SideDrawer: React.FC = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const navContext = useNavContext();
  const { isDrawerOpen, handleDrawerOpen, handleDrawerClose } = navContext;
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ width: drawerWidth }} role="presentation">
        <List sx={{ px: 1 }}>
          {navRoutes.map(({ title, path }) => {
            const isActive = pathname === path || (pathname === "/" && path === "");
            return (
              <ListItem key={title} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={path}
                  onClick={handleDrawerClose}
                  className={isActive ? "active" : ""}
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      transform: "translateX(4px)",
                      boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                    },
                    "&.active": {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {getRouteIcon(path)}
                  </ListItemIcon>
                  <ListItemText primary={title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Footer Section */}
        <Box
          sx={{
            p: 2,
            mt: "auto",
            textAlign: "center",
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="caption" display="block">
            Version 2.0
          </Typography>
          <Typography variant="caption">© 2025 Edu Report</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;
