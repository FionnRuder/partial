import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GlobalErrorHandlerSetup } from "@/components/ErrorBoundary/GlobalErrorHandler";
import { SentryInit } from "@/components/SentryInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Partial - Hardware Development Work Management",
  description: "Streamline your hardware development with comprehensive work management, part tracking, and program analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SentryInit />
        <ErrorBoundary>
          <GlobalErrorHandlerSetup />
          <AuthProvider>
            <DashboardWrapper>{children}</DashboardWrapper>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  maxWidth: "400px",
                },
                success: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                  style: {
                    background: "#10b981",
                    color: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                  style: {
                    background: "#ef4444",
                    color: "#fff",
                  },
                },
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}