"use client";

import ProtectedPage from "@/firebase/ProtectedPage";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Box } from "@mui/material";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Breadcrumbs />
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </ProtectedPage>
  );
}
