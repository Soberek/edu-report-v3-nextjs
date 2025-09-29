"use client";
import React from "react";
import { Box } from "@mui/material";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/top-navbar";
import SideDrawer from "@/components/ui/side-drawer";

interface AuthenticatedLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Layout component that conditionally renders navigation elements based on authentication status
 * and current route. Provides different layouts for authenticated vs non-authenticated users.
 */
export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { user, loading } = useUser();
  const pathname = usePathname();

  // Define routes that should not show navigation even when authenticated
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "4px solid rgba(123, 31, 162, 0.3)",
              borderTop: "4px solid #7b1fa2",
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Box sx={{ textAlign: "center", color: "#7b1fa2" }}>
            <Box sx={{ fontSize: "1.1rem", fontWeight: 600, mb: 0.5 }}>Ładowanie...</Box>
            <Box sx={{ fontSize: "0.9rem", opacity: 0.7 }}>Sprawdzanie stanu uwierzytelnienia</Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // For authenticated users on non-auth routes: show full navigation
  if (user && !isAuthRoute) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <SideDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            transition: "all 0.3s ease",
            pt: 0, // Remove top padding since navbar is not fixed
            minHeight: "calc(100vh - 80px)", // Account for navbar height
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  // For non-authenticated users or auth routes: show only navbar (no side drawer)
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "calc(100vh - 80px)", // Account for navbar height
          display: "flex",
          flexDirection: "column",
          pt: 0, // Remove top padding since navbar is not fixed
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;
