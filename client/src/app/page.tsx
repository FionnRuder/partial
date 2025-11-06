"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect if we're already on onboarding page
    if (pathname === "/onboarding") {
      return;
    }

    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/onboarding");
      } else {
        router.push("/home");
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
