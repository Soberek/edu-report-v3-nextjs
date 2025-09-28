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
  Collapse,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { 
  navRoutes, 
  getMainNavigation, 
  getRoutesByCategory,
  type NavRoute 
} from "@/constants/nav-routes";
import { useNavContext } from "@/providers/NavProvider";
import { useUser } from "@/hooks/useUser";

const drawerWidth = 280;

const SideDrawer: React.FC = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const navContext = useNavContext();
  const isUserLoggedIn = useUser().user?.uid ? true : false;
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(["education", "database", "tools"])
  );

  // Get main navigation routes (private routes only)
  const mainNavRoutes = getMainNavigation();
  
  // Group routes by category
  const routesByCategory = React.useMemo(() => {
    const grouped: Record<string, NavRoute[]> = {};
    mainNavRoutes.forEach((route) => {
      if (!grouped[route.category]) {
        grouped[route.category] = [];
      }
      grouped[route.category].push(route);
    });
    return grouped;
  }, [mainNavRoutes]);

  // Category labels and icons
  const categoryConfig = {
    main: { label: "Główna", icon: "🏠" },
    education: { label: "Edukacja", icon: "📚" },
    database: { label: "Baza danych", icon: "🗄️" },
    tools: { label: "Narzędzia", icon: "🔧" },
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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
        <Box sx={{ flex: 1, py: 2, overflow: "auto" }}>
          <List sx={{ px: 2 }}>
            {Object.entries(routesByCategory).map(([category, routes]) => {
              const isExpanded = expandedCategories.has(category);
              const config = categoryConfig[category as keyof typeof categoryConfig];
              
              return (
                <Box key={category}>
                  {/* Category Header */}
                  <ListItemButton
                    onClick={() => toggleCategory(category)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: isExpanded ? theme.palette.primary.light : "transparent",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Typography sx={{ fontSize: "1.2rem" }}>
                        {config?.icon}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={config?.label}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }}
                    />
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  {/* Category Routes */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {routes.map(({ title, path, icon, description }) => {
                        // Enhanced active path detection
                        const isActive = (() => {
                          // Handle root path
                          if (pathname === "/" && path === "/") return true;

                          // Handle exact match
                          if (pathname === `/${path}`) return true;

                          // Handle nested routes - check if current path starts with the nav path
                          if (path !== "/" && pathname.startsWith(`/${path}`)) {
                            // Make sure it's not a partial match (e.g., /schedule vs /schedule-edit)
                            const nextChar = pathname[`/${path}`.length];
                            return !nextChar || nextChar === "/";
                          }

                          return false;
                        })();

                        return (
                          <ListItem key={title} disablePadding sx={{ mb: 0.5, pl: 2 }}>
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
                                  minWidth: 40,
                                  transition: "all 0.3s ease",
                                  "& .MuiSvgIcon-root": {
                                    fontSize: "1.2rem",
                                  },
                                }}
                              >
                                {icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={title}
                                secondary={description}
                                primaryTypographyProps={{
                                  fontSize: "0.9rem",
                                  fontWeight: isActive ? 600 : 500,
                                }}
                                secondaryTypographyProps={{
                                  fontSize: "0.75rem",
                                  opacity: 0.7,
                                }}
                              />
                              {isActive && (
                                <Chip
                                  label="Aktywny"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.65rem",
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    color: "white",
                                    "& .MuiChip-label": {
                                      px: 0.8,
                                    },
                                  }}
                                />
                              )}
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                  
                  {/* Divider between categories */}
                  {category !== Object.keys(routesByCategory)[Object.keys(routesByCategory).length - 1] && (
                    <Divider sx={{ my: 2, opacity: 0.3 }} />
                  )}
                </Box>
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
