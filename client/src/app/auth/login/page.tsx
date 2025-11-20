"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the server URL from environment variable or use default
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    
    // Preserve invitation token if present in URL
    const invitationToken = searchParams.get('invitation');
    const loginUrl = invitationToken 
      ? `${apiBaseUrl}/auth/login?invitation=${invitationToken}`
      : `${apiBaseUrl}/auth/login`;
    
    // Redirect to server's auth/login endpoint
    window.location.href = loginUrl;
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  );
}

