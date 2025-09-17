"use client";

import ProtectedPage from "@/firebase/ProtectedPage";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedPage>{children}</ProtectedPage>;
}
