"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  InputAdornment,
  Divider,
  Chip,
  Badge,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useUser } from "@/hooks/useUser";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useSearch } from "../../hooks/useSearch";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useNavContext } from "@/providers/NavProvider";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const authContext = useUser();
  const searchContext = useSearch();
  const router = useRouter();
  const navContext = useNavContext();
  const { handleDrawerOpen } = navContext;

  // Determine if menu button should be shown (only for authenticated users)
  const showMenuButton = Boolean(authContext.user);

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      handleUserMenuClose();
    }
  };

  const userInitial = authContext.user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 2px 20px ${theme.palette.primary.main}10`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 80, px: 3 }}>
        {/* Left Section - Logo and Menu */}
        <Box display="flex" alignItems="center" gap={2}>
          {showMenuButton && (
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="start"
              onClick={handleDrawerOpen}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                borderRadius: "16px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 15px ${theme.palette.secondary.main}30`,
                "&:hover": {
                  transform: "rotate(-5deg) scale(1.1)",
                  boxShadow: `0 10px 30px ${theme.palette.secondary.main}50`,
                },
              }}
              onClick={() => router.push("/")}
            >
              <MenuBookIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>

            <Box>
              <Typography
                variant="h5"
                component="h1"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(45deg, #b80000ff, #7300ffff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => router.push("/")}
              >
                EduReport
              </Typography>
              <Chip
                label="v2.0"
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: "white",
                  fontSize: "10px",
                  height: 20,
                  ml: 1,
                  fontWeight: "bold",
                  boxShadow: `0 2px 8px ${theme.palette.secondary.main}30`,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right Section - User Menu */}
        <Box display="flex" alignItems="center" gap={2}>
          {authContext.user ? (
            <>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  p: 0,
                  position: "relative",
                  "&:hover": { transform: "scale(1.1)" },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: "50%",
                    zIndex: -1,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover::before": {
                    opacity: 1,
                  },
                }}
                aria-label="user menu"
              >
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    width: 44,
                    height: 44,
                    border: "2px solid rgba(255,255,255,0.3)",
                    fontSize: 18,
                    fontWeight: 600,
                    boxShadow: `0 4px 15px ${theme.palette.primary.main}30`,
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 260,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ px: 3, py: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {authContext.user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    🎉 Miło Cię widzieć ponownie!
                  </Typography>
                </Box>
                <Divider sx={{ mx: 2 }} />
                <MenuItem
                  onClick={() => router.push("/profile")}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}20`,
                    },
                  }}
                >
                  <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                  Mój Profil
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    mx: 1,
                    mb: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: `${theme.palette.secondary.main}20`,
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, color: "error.main" }} />
                  Wyloguj się
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                onClick={() => router.push("/login")}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: `${theme.palette.primary.main}10`,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Zaloguj się
              </Button>
              <Button
                onClick={() => router.push("/register")}
                variant="contained"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 4px 15px ${theme.palette.secondary.main}30`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 30px ${theme.palette.primary.main}40`,
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Utwórz konto
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
