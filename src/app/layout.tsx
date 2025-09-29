import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "@/providers/ThemeProvider";
import { ThemeProvider } from "@mui/material";
import { NavProvider } from "@/providers/NavProvider";
import { UserProvider } from "@/providers/UserContext";
import { SearchProvider } from "@/providers/SearchProvider";
import LocalizationProviderClient from "@/providers/LocalizationProvder";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edu Report",
  description: "Edu Report - Modern platform for educational reporting and analytics.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppRouterCacheProvider>
          <LocalizationProviderClient>
            <ThemeProvider theme={theme}>
              <SearchProvider>
                <UserProvider>
                  <NavProvider>
                    <AuthenticatedLayout>{children}</AuthenticatedLayout>
                  </NavProvider>
                </UserProvider>
              </SearchProvider>
            </ThemeProvider>
          </LocalizationProviderClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
