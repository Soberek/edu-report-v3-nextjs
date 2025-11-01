import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Szkoły w Programie",
  description: "Zarządzaj uczestnictwem szkół w programach edukacyjnych",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function SchoolParticipationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
