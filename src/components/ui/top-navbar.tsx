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
      router.push("/sign-in");
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
        display: { xs: "none", md: "block" },
        backgroundColor: theme.palette.primary.main,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.05)",
          zIndex: -1,
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 80, px: 3 }}>
        {/* Left Section - Logo and Menu */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            color="inherit"
            aria-label="open navigation menu"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{
              background: "rgba(255, 255, 255, 1)",
              color: "black",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                backgroundColor: theme.palette.secondary.main,
                borderRadius: "16px",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(-5deg) scale(1.1)",
                  boxShadow: `0 10px 30px ${theme.palette.secondary.main}33`,
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
                  background: "linear-gradient(45deg, #fff, #e3f2fd)",
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
                  backgroundColor: theme.palette.secondary.main,
                  color: "white",
                  fontSize: "10px",
                  height: 18,
                  ml: 1,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Center Section - Search */}
        <Box sx={{ mx: 4, maxWidth: 450, width: "100%" }}>
          <TextField
            value={searchContext?.searchTerm || ""}
            onChange={(e) => searchContext?.setSearchTerm(e.target.value)}
            placeholder="Odkryj niesamowite kursy..."
            variant="outlined"
            size="medium"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              sx: {
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.3)",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover": {
                  background: "rgba(255,255,255,1)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                },
                "&.Mui-focused": {
                  background: "rgba(255,255,255,1)",
                  transform: "translateY(-2px)",
                  boxShadow: `0 15px 50px ${theme.palette.primary.main}33`,
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              },
            }}
          />
        </Box>

        {/* Right Section - User Menu */}
        <Box display="flex" alignItems="center" gap={2}>
          {authContext.user ? (
            <>
              <IconButton
                sx={{
                  background: "rgba(255, 255, 255)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.8)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

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
                    backgroundColor: theme.palette.primary.main,
                    width: 44,
                    height: 44,
                    border: "2px solid rgba(255,255,255,0.3)",
                    fontSize: 18,
                    fontWeight: 600,
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
            <Button
              onClick={() => router.push("/sign-in")}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              ✨ Zaloguj się
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
