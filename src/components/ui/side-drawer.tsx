"use client";
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/constants/nav-routes";
import { useNavContext } from "@/providers/NavProvider";
import { useUser } from "@/hooks/useUser";

const drawerWidth = 280;

const SideDrawer: React.FC = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const navContext = useNavContext();
  const isUserLoggedIn = useUser().user?.uid ? true : false;

  // Filter routes based on authentication
  // show only public routes if not logged in
  // show only private routes if logged in
  const filteredNavRoutes = navRoutes.filter((route) => {
    // if route is private and user is not logged in, hide it
    // if route is public and user is logged in, hide it
    if (route.isPrivate === true && !isUserLoggedIn) {
      return false;
    } else if (route.isPrivate === false && isUserLoggedIn) {
      return false;
    }
    return true;
  });

  // Use filtered routes for rendering
  const navRoutesToRender = filteredNavRoutes;
  const { isDrawerOpen, handleDrawerOpen, handleDrawerClose } = navContext;
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 0 20px ${theme.palette.primary.main}10`,
        },
      }}
    >
      <Box sx={{ width: drawerWidth, height: "100%", display: "flex", flexDirection: "column" }} role="presentation">
        {/* Header Section */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            textAlign: "center",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.light} 50%, transparent 100%)`,
            },
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            ER
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
            Edu Report
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            System zarządzania edukacją
          </Typography>
        </Box>

        {/* Navigation Section */}
        <Box sx={{ flex: 1, py: 2 }}>
          <List sx={{ px: 2 }}>
            {navRoutesToRender.map(({ title, path, category, icon }) => {
              // Enhanced active path detection
              const isActive = (() => {
                // Handle root path
                if (pathname === "/" && path === "") return true;
                
                // Handle exact match
                if (pathname === path) return true;
                
                // Handle nested routes - check if current path starts with the nav path
                if (path !== "" && pathname.startsWith(path)) {
                  // Make sure it's not a partial match (e.g., /schedule vs /schedule-edit)
                  const nextChar = pathname[path.length];
                  return !nextChar || nextChar === "/";
                }
                
                return false;
              })();
              
              return (
                <ListItem key={title} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={path}
                    onClick={handleDrawerClose}
                    className={isActive ? "active" : ""}
                    sx={{
                      borderRadius: 2,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateX(8px)",
                        boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
                        "&::before": {
                          opacity: 1,
                        },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      },
                      "&.active": {
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                        transform: "translateX(8px)",
                        "&::before": {
                          opacity: 1,
                          background: "white",
                        },
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
                        minWidth: 44,
                        transition: "all 0.3s ease",
                        "& .MuiSvgIcon-root": {
                          fontSize: "1.3rem",
                        },
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={title}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                    {isActive && (
                      <Chip
                        label="Aktywny"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Footer Section */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[50]} 100%)`,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: "center",
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Chip
              label="v2.0"
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              © 2025 Edu Report
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
              Wszystkie prawa zastrzeżone
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;
