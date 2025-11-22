"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { useAuth } from "@/contexts/AuthContext";
import { RouteErrorBoundary } from "@/components/ErrorBoundary/RouteErrorBoundary";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const router = useRouter();

  // All hooks must be called unconditionally (Rules of Hooks)
  useEffect(() => {
    // Check if current path is onboarding or auth routes
    setIsOnboarding(pathname === "/onboarding" || pathname.startsWith("/auth/"));
  }, [pathname]);

  // Public routes that don't require authentication
  const publicRoutes = ["/onboarding", "/auth/login"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/auth/");

  // Redirect unauthenticated users to onboarding (except for public routes)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, isLoading, pathname, router, isPublicRoute]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated and not on a public route, show loading while redirecting
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <RouteErrorBoundary>
        {isOnboarding || isPublicRoute ? (
          // For onboarding and auth routes, render without dashboard layout
          <div className="min-h-screen">
            {children}
          </div>
        ) : (
          // For all other pages, use dashboard layout (only if authenticated)
          isAuthenticated ? (
            <DashboardLayout>{children}</DashboardLayout>
          ) : (
            // Fallback: show loading while redirecting
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          )
        )}
      </RouteErrorBoundary>
    </StoreProvider>
  );
};

export default DashboardWrapper;