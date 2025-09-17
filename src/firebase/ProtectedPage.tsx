"use client";

import { useUser } from "@/hooks/useUser";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const auth = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push("/login");
    }
  }, [auth.loading, auth.user, router]);

  console.log("ProtectedPage loading:", auth.loading);
  if (auth.loading) {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #d400a6ff 0%, #da0000ff 100%)",
        }}
      >
        <Box
          style={{
            padding: "2rem 3rem",
            borderRadius: "1rem",
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#2d3748",
          }}
        >
          Ładuje się strona, poczekaj...
        </Box>
      </Box>
    );
  }

  console.log("ProtectedPage user:", auth.user);

  return auth.user ? children : null;
}
