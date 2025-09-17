"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "@/firebase/config"; // Twoja konfiguracja

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  return <>{children}</>;
}
