import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "@/providers/ThemeProvider";
import { ThemeProvider } from "@mui/material";
import { NavProvider } from "@/providers/NavProvider";
import { UserProvider } from "@/providers/UserContext";
import { SearchProvider } from "@/providers/SearchProvider";
import LocalizationProviderClient from "@/providers/LocalizationProvder";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { GlobalErrorProvider } from "@/providers/GlobalErrorProvider";
import { GlobalErrorBoundary } from "@/components/shared/GlobalErrorBoundary";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import QueryClientProvider from "@/providers/QueryClientProvider";

export const metadata: Metadata = {
  title: "Ozipz",
  description: "Ozipz",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalErrorProvider>
          <NotificationProvider>
            <GlobalErrorBoundary>
              <AppRouterCacheProvider>
              <LocalizationProviderClient>
                <ThemeProvider theme={theme}>
                  <SearchProvider>
                    <UserProvider>
                      <NavProvider>
                        <QueryClientProvider>
                          <AuthenticatedLayout>{children}</AuthenticatedLayout>
                        </QueryClientProvider>
                      </NavProvider>
                    </UserProvider>
                  </SearchProvider>
                </ThemeProvider>
              </LocalizationProviderClient>
            </AppRouterCacheProvider>
          </GlobalErrorBoundary>
          </NotificationProvider>
        </GlobalErrorProvider>
      </body>
    </html>
  );
}
