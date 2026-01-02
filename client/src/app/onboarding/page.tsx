"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { validatePassword } from "@/lib/passwordValidation";
import type { Program, Milestone } from "@/state/api";
import type { AuthUser } from "@/lib/auth";
import { showApiError } from "@/lib/toast";
import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetProgramsQuery,
  useCreateProgramMutation,
  useCreateMilestoneMutation,
  useCreatePartMutation,
  useValidateInvitationQuery,
  PartState,
  PartStateLabels,
} from "@/state/api";
import { addDays, formatISO } from "date-fns";

// Helper function to convert role to display name
// Handles both Prisma enum values (e.g., "ProgramManager") and display names (e.g., "Program Manager")
const getRoleDisplayName = (role: string): string => {
  // Handle Prisma enum values (no spaces)
  if (role === "ProgramManager") return "Program Manager";
  if (role === "Admin") return "Admin";
  if (role === "Manager") return "Manager";
  if (role === "Engineer") return "Engineer";
  if (role === "Viewer") return "Viewer";
  
  // Handle display names (already formatted)
  if (role === "Program Manager") return "Program Manager";
  
  // Handle lowercase variants
  const roleLower = role.toLowerCase();
  if (roleLower === "programmanager" || roleLower === "program_manager") return "Program Manager";
  if (roleLower === "admin") return "Admin";
  if (roleLower === "manager") return "Manager";
  if (roleLower === "engineer") return "Engineer";
  if (roleLower === "viewer") return "Viewer";
  
  // Default fallback - return the role as-is (capitalized)
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const STEP_STORAGE_KEY = "onboardingStep";

// Onboarding Step Components
const LandingScreen = ({ onGetStarted, onLogin, onLearnMore }: {
  onGetStarted: () => void;
  onLogin: () => void;
  onLearnMore: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo1.png"
              alt="Partial Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Streamline Your
            <span className="text-blue-600 dark:text-blue-400"> Hardware Development</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track work items, manage parts, and monitor program progress with the comprehensive 
            work management platform built specifically for hardware engineering teams.
          </p>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Track Work Items</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Manage tasks, deliverables, and issues with comprehensive tracking and status updates.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Part Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Organize parts hierarchically and track their development state and ownership.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Program Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Monitor program health, identify bottlenecks, and track team performance.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button
              onClick={onLogin}
              className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-8 rounded-lg text-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={onLearnMore}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold py-4 px-8 text-lg transition-colors duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthScreen = ({ onBack, onNext, initialMode = "signup" }: {
  onBack: () => void;
  onNext: () => void;
  initialMode?: "signup" | "login";
}) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { signUp, signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
  });

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    if (!isLogin) {
      const validation = validatePassword(password);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signIn({
          email: formData.email,
          password: formData.password,
        });
        // For login, redirect directly to dashboard
        router.push("/home");
        return;
      } else {
        // Validate password for signup
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
          setPasswordErrors(validation.errors);
          setIsLoading(false);
          return;
        }

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          role: "Engineer", // Default role, will be updated in role selection
        });
        setIsLogin(true);
        onNext();
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="text-center">
            <Image
              src="/logo1.png"
              alt="Partial Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isLogin 
                ? "Sign in to your account to continue" 
                : "Join the platform to start managing your hardware development work"
              }
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required={!isLogin}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your password"
                  />
                  {!isLogin && passwordErrors.length > 0 && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      <ul className="list-disc list-inside space-y-1">
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Confirm your password"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RoleSelectionScreen = ({ onBack, onNext, invitationData, isNewOrganization }: {
  onBack: () => void;
  onNext: (role: string) => void;
  invitationData?: {
    organization: { id: number; name: string };
    role: string;
    invitedEmail?: string;
  } | null;
  isNewOrganization?: boolean;
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Note: For new organization creation, we show a special Admin assignment screen
  // The backend will automatically assign Admin role regardless of what's passed

  const roles = [
    {
      id: "engineer",
      title: "Engineer",
      description: "Track work items for parts you own, manage deliverables, and collaborate with your team.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      features: [
        "Track work items for assigned parts",
        "Manage deliverables and issues",
        "Collaborate with team members",
        "Update work item status and progress"
      ]
    },
    {
      id: "program-manager",
      title: "Program Manager",
      description: "Monitor program health, track team performance, and identify bottlenecks across all projects.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: [
        "Monitor program status and progress",
        "Track team performance metrics",
        "Identify bottlenecks and risks",
        "Manage milestones and deadlines"
      ]
    }
  ];

  // For new organization creation, show Admin assignment message
  if (isNewOrganization && !invitationData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Setting Up Your Organization
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              As the first user, you'll be automatically assigned the Admin role
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="p-8 border-2 border-blue-500 dark:border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Admin Role
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    As the organization administrator, you'll have full access to manage users, teams, programs, and invite new members.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Manage users and assign roles
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create and manage teams
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Invite new members to your organization
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Full access to all programs and work items
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onNext("Admin")}
              disabled={isLoading}
              className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Setting up...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {invitationData ? 'Join Organization' : 'Choose Your Role'}
          </h2>
          {invitationData && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                You've been invited to join:
              </p>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {invitationData.organization.name}
              </p>
              {invitationData.invitedEmail && (
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Invited as: {invitationData.invitedEmail}
                </p>
              )}
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Role: <span className="font-medium">{invitationData.role}</span>
              </p>
            </div>
          )}
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {invitationData 
              ? 'Your role has been pre-selected. Click continue to proceed.'
              : 'Select your primary role to customize your experience'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {invitationData ? (
            // If invitation exists, show pre-selected role and continue button
            <div className="col-span-2 p-6 border-2 border-blue-500 dark:border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {invitationData.role}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    This role was assigned by the organization administrator.
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ) : (
            // Normal role selection
            roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`cursor-pointer p-8 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  selectedRole === role.id
                    ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {role.description}
                  </p>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              if (invitationData) {
                // If invitation exists, use the role from invitation
                setIsLoading(true);
                onNext(invitationData.role);
                setIsLoading(false);
              } else if (selectedRole) {
                setIsLoading(true);
                // For new organization, role is automatically Admin (handled by backend)
                // But we still need to pass something - backend will override it
                // Map role ID to display name for backend
                // "engineer" -> "Engineer", "program-manager" -> "Program Manager"
                const roleDisplayName = selectedRole === "engineer" ? "Engineer" : "Program Manager";
                onNext(roleDisplayName);
                setIsLoading(false);
              }
            }}
            disabled={(!invitationData && !selectedRole) || isLoading}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 ${
              (invitationData || selectedRole) && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              invitationData ? "Continue" : "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrganizationNameScreen = ({ 
  onBack, 
  onNext, 
  invitationData 
}: { 
  onBack: () => void; 
  onNext: (organizationName: string) => void;
  invitationData?: {
    organization: { id: number; name: string };
    role: string;
    invitedEmail?: string;
  } | null;
}) => {
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Skip this screen if joining via invitation (organization already exists)
  useEffect(() => {
    if (invitationData) {
      onNext(""); // Skip organization name for invitations
    }
  }, [invitationData, onNext]);

  if (invitationData) {
    return null; // Don't render if invitation exists
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName.trim()) {
      return;
    }
    setIsLoading(true);
    onNext(organizationName.trim());
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Name Your Organization
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Give your organization a name. You can change this later in settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Name
              </label>
              <input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your organization name"
                required
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                This will be the name of your organization. All users you invite will be part of this organization.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!organizationName.trim() || isLoading}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileCompletionScreen = ({ onBack, onNext }: {
  onBack: () => void;
  onNext: (result: { requiresSetup: boolean; teamId: number | null }) => void;
}) => {
  const { user, updateProfile } = useAuth();
  const [isRefreshingUser, setIsRefreshingUser] = useState(false);
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();
  const { data: programs } = useGetProgramsQuery();
  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const sanitizeProfilePictureUrl = (value?: string | null) => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      return "";
    }
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  };

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(user?.disciplineTeamId || null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(sanitizeProfilePictureUrl(user?.profilePictureUrl));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refresh user on mount if not available (user was just created in role selection)
  useEffect(() => {
    const refreshUser = async () => {
      if (!user && !isRefreshingUser) {
        setIsRefreshingUser(true);
        try {
          const { authService } = await import('@/lib/auth');
          const refreshedUser = await authService.getCurrentUser();
          if (refreshedUser) {
            // User found - auth context will update via listeners
            console.log('User refreshed in profile screen:', refreshedUser);
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
        } finally {
          setIsRefreshingUser(false);
        }
      }
    };
    // Small delay to ensure user creation is complete
    const timer = setTimeout(refreshUser, 300);
    return () => clearTimeout(timer);
  }, [user, isRefreshingUser]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createTeamError, setCreateTeamError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // If user doesn't exist in context yet, refresh from server
      // (User should have been created in role selection step)
      let currentUser = user;
      if (!currentUser) {
        const { authService } = await import('@/lib/auth');
        currentUser = await authService.getCurrentUser();
        
        if (!currentUser) {
          setError("User not found. Please complete role selection first.");
          setIsSaving(false);
          return;
        }
      }

      await updateProfile({
        disciplineTeamId: selectedTeamId || undefined,
        profilePictureUrl: sanitizeProfilePictureUrl(profilePictureUrl),
      });

      // Use user from context (should be available after refresh above)
      const teamId = selectedTeamId ?? user?.disciplineTeamId ?? null;
      let requiresSetup = false;
      if (teamId) {
        const teamPrograms = programs?.filter((program) =>
          program.disciplineTeams?.some((dtp) => dtp.disciplineTeamId === teamId),
        ) ?? [];
        requiresSetup = teamPrograms.length === 0;
      }

      onNext({ requiresSetup, teamId });
    } catch (error: any) {
      setError(error.message || "Failed to update profile. Please try again.");
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Complete Your Profile
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Add optional information to personalize your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Profile Picture URL */}
            <div>
              <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture URL (Optional)
              </label>
              <input
                id="profilePictureUrl"
                name="profilePictureUrl"
                type="url"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(sanitizeProfilePictureUrl(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="/images/profile.jpg"
              />
              {profilePictureUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                    <img
                      src={profilePictureUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Use a local media path (e.g. /images/profile.jpg). You can add a profile picture later in settings.
              </p>
            </div>

            {/* Discipline Team Selection */}
            <div>
              <label htmlFor="disciplineTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discipline Team (Optional)
              </label>
              {teamsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading teams...</span>
                </div>
              ) : (
                <select
                  id="disciplineTeam"
                  name="disciplineTeam"
                  value={selectedTeamId || ""}
                  onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : null)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">No team selected</option>
                  {teams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} {team.description ? `- ${team.description}` : ""}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Select your team to connect with colleagues and collaborate on projects
              </p>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTeam((prev) => !prev);
                    setCreateTeamError(null);
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showCreateTeam ? "Cancel new team" : "Create a new discipline team"}
                </button>
              </div>

              {showCreateTeam && (
                <div className="mt-4 space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div>
                    <label htmlFor="newTeamName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Name
                    </label>
                    <input
                      id="newTeamName"
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter the new team name"
                    />
                  </div>
                  <div>
                    <label htmlFor="newTeamDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Description
                    </label>
                    <textarea
                      id="newTeamDescription"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Describe the purpose of this team"
                    />
                  </div>

                  {createTeamError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-600 dark:text-red-400">
                      {createTeamError}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={isCreatingTeam}
                      onClick={async () => {
                        setCreateTeamError(null);
                        if (!newTeamName.trim() || !newTeamDescription.trim()) {
                          setCreateTeamError("Please provide both a team name and description.");
                          return;
                        }

                        try {
                          // During onboarding, automatically assign the current user as team manager
                          const currentUserId = user?.id;
                          if (!currentUserId) {
                            setCreateTeamError("User not found. Please refresh the page.");
                            return;
                          }

                          const newTeam = await createTeam({
                            name: newTeamName.trim(),
                            description: newTeamDescription.trim(),
                            teamManagerUserId: currentUserId, // Automatically assign creator as team manager
                          }).unwrap();

                          // Automatically assign user to the newly created team
                          setSelectedTeamId(newTeam.id);
                          
                          // Update user's disciplineTeamId immediately
                          await updateProfile({
                            disciplineTeamId: newTeam.id,
                          });

                          setShowCreateTeam(false);
                          setNewTeamName("");
                          setNewTeamDescription("");
                        } catch (createErr: any) {
                          console.error("Failed to create team:", createErr);
                          setCreateTeamError(createErr?.data?.message || "Failed to create team. Please try again.");
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingTeam ? "Creating..." : "Create Team"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProgramSetupScreen = ({
  onBack,
  onComplete,
  onJoinExisting,
  currentUser,
}: {
  onBack: () => void;
  onComplete: (program: Program) => void;
  onJoinExisting: (program: Program) => void;
  currentUser: AuthUser | null;
}) => {
  const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
  const [mode, setMode] = useState<"create" | "join">("create");
  const [selectedProgramId, setSelectedProgramId] = useState<number | "">("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [createProgram, { isLoading, error }] = useCreateProgramMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => addDays(new Date(), 30).toISOString().split("T")[0]);
  const [createdProgram, setCreatedProgram] = useState<Program | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateProgram = async () => {
    setFormError(null);
    if (!name || !startDate || !endDate) {
      setFormError("Please provide a program name and date range.");
      return;
    }

    try {
      const payload = {
        name,
        description,
        programManagerUserId: currentUser?.id,
        startDate: formatISO(new Date(startDate), { representation: "complete" }),
        endDate: formatISO(new Date(endDate), { representation: "complete" }),
      };

      const newProgram = await createProgram(payload).unwrap();
      setCreatedProgram(newProgram);
      onComplete(newProgram);
    } catch (e) {
      setFormError("Failed to create program. Please try again.");
      console.error("Failed to create program:", e);
    }
  };

  const handleJoinProgram = () => {
    setJoinError(null);
    if (!selectedProgramId || typeof selectedProgramId !== "number") {
      setJoinError("Please select a program to join.");
      return;
    }

    const programToJoin = programs.find((program) => program.id === selectedProgramId);
    if (!programToJoin) {
      setJoinError("Selected program could not be found. Please try again.");
      return;
    }

    onJoinExisting(programToJoin);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {mode === "create" ? "Create Your First Program" : "Join an Existing Program"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {mode === "create"
              ? "Program Managers use programs to organize milestones, parts, and work items. Let's create your first program to get your team started."
              : "Already have programs running? Choose one below so your team can plug into its milestones, parts, and work items right away."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                mode === "create"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Create New Program
            </button>
            <button
              type="button"
              onClick={() => setMode("join")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                mode === "join"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Join Existing Program
            </button>
          </div>

          <div className="space-y-6">
            {mode === "create" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Program Name
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alpha Device Launch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide context for this program"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {formError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {formError}
                  </div>
                )}

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    Failed to create program. Please try again.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCreateProgram}
                  disabled={isLoading || !!createdProgram}
                  className="flex w-full justify-center rounded-md bg-blue-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Creating Program..." : createdProgram ? "Program Created" : "Create Program"}
                </button>

                {createdProgram && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Program "{createdProgram.name}" created successfully.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => createdProgram && onComplete(createdProgram)}
                  disabled={!createdProgram}
                  className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Continue to Milestones
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select a Program to Join
                  </label>
                  {programsLoading ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">Loading programs...</div>
                  ) : programs.length === 0 ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                      No programs are available yet. Create a new program to get started.
                    </div>
                  ) : (
                    <select
                      value={selectedProgramId === "" ? "" : selectedProgramId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedProgramId(value ? Number(value) : "");
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {typeof selectedProgramId === "number" && (
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <p className="font-semibold">
                      {programs.find((program) => program.id === selectedProgramId)?.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Joining this program will give your team access to its milestones, parts, and work items.
                    </p>
                  </div>
                )}

                {joinError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {joinError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleJoinProgram}
                  disabled={typeof selectedProgramId !== "number" || programsLoading}
                  className="flex w-full justify-center rounded-md bg-blue-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Join Program
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MilestoneSetupScreen = ({
  onBack,
  program,
  onComplete,
}: {
  onBack: () => void;
  program: Program | null;
  onComplete: (milestone: Milestone) => void;
}) => {
  const [createMilestone, { isLoading, error }] = useCreateMilestoneMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => addDays(new Date(), 14).toISOString().split("T")[0]);
  const [createdMilestone, setCreatedMilestone] = useState<Milestone | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Program not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find the program you just created. Please go back and create a program first.
          </p>
          <button
            onClick={onBack}
            className="rounded-md bg-blue-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Back to Program Setup
          </button>
        </div>
      </div>
    );
  }

  const handleCreateMilestone = async () => {
    setFormError(null);
    if (!name || !date) {
      setFormError("Please provide a milestone name and date.");
      return;
    }

    try {
      const payload = {
        name,
        description,
        date: formatISO(new Date(date), { representation: "complete" }),
        programId: program.id,
      };

      const newMilestone = await createMilestone(payload).unwrap();
      setCreatedMilestone(newMilestone);
      onComplete(newMilestone);
    } catch (e) {
      setFormError("Failed to create milestone. Please try again.");
      console.error("Failed to create milestone:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Add a Milestone to "{program.name}"
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Milestones help track major events or deliverables in your program timeline.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Milestone Name
              </label>
              <input
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Prototype Complete"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Milestone Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {formError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {formError}
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                Failed to create milestone. Please try again.
              </div>
            )}

            <button
              type="button"
              onClick={handleCreateMilestone}
              disabled={isLoading || !!createdMilestone}
              className="flex w-full justify-center rounded-md bg-blue-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Creating Milestone..." : createdMilestone ? "Milestone Created" : "Create Milestone"}
            </button>

            {createdMilestone && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                Milestone "{createdMilestone.name}" created successfully.
              </div>
            )}

            <button
              type="button"
              onClick={() => createdMilestone && onComplete(createdMilestone)}
              disabled={!createdMilestone}
              className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Continue to Parts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartSetupScreen = ({
  onBack,
  onComplete,
  program,
  currentUser,
  milestoneCreated,
}: {
  onBack: () => void;
  onComplete: () => void;
  program: Program | null;
  currentUser: AuthUser | null;
  milestoneCreated: boolean;
}) => {
  const [createPart, { isLoading, error }] = useCreatePartMutation();
  const [partCode, setPartCode] = useState("");
  const [partName, setPartName] = useState("");
  const [level, setLevel] = useState("0");
  const [revisionLevel, setRevisionLevel] = useState("-");
  const [state, setState] = useState<PartState>(PartState.InWork);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdPart, setCreatedPart] = useState<boolean>(false);

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Program not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find the program you just created. Please go back and create a program first.
          </p>
          <button
            onClick={onBack}
            className="rounded-md bg-blue-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Back to Program Setup
          </button>
        </div>
      </div>
    );
  }

  if (!milestoneCreated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Milestone required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please create at least one milestone for "{program.name}" before adding parts.
          </p>
          <button
            onClick={onBack}
            className="rounded-md bg-blue-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Back to Milestone Setup
          </button>
        </div>
      </div>
    );
  }

  const handleCreatePart = async () => {
    setFormError(null);
    if (!partCode || !partName) {
      setFormError("Please provide a part code and name.");
      return;
    }
    if (!currentUser?.id) {
      setFormError("An assigned user is required to create a part. Please sign in again.");
      return;
    }

    try {
      await createPart({
        code: partCode,
        partName,
        level: Number(level || "0"),
        state,
        revisionLevel: revisionLevel || "-",
        assignedUserId: currentUser.id,
        programId: program.id,
      }).unwrap();

      setCreatedPart(true);
      onComplete();
    } catch (e) {
      setFormError("Failed to create part. Please try again.");
      console.error("Failed to create part:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Create a Part for "{program.name}"
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Every program starts with at least one part assigned to an engineer. Create the first part so your team can begin collaborating.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Part Code
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={partCode}
                onChange={(e) => setPartCode(e.target.value)}
                placeholder="e.g. 1001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Part Name
              </label>
              <input
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="e.g. Main Control Board"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Revision
                </label>
                <input
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={revisionLevel}
                  onChange={(e) => setRevisionLevel(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={state}
                  onChange={(e) => setState(e.target.value as PartState)}
                >
                  {Object.values(PartState).map((stateValue) => (
                    <option key={stateValue} value={stateValue}>
                      {PartStateLabels[stateValue]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {formError}
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                Failed to create part. Please try again.
              </div>
            )}

            <button
              type="button"
              onClick={handleCreatePart}
              disabled={isLoading || createdPart}
              className="flex w-full justify-center rounded-md bg-blue-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Creating Part..." : createdPart ? "Part Created" : "Create Part"}
            </button>

            {createdPart && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                Part created successfully.
              </div>
            )}

            <button
              type="button"
              onClick={() => createdPart && onComplete()}
              disabled={!createdPart}
              className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Finish Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessScreen = ({ role, onComplete }: {
  role: string;
  onComplete: () => void;
}) => {
  // Use the centralized role display name function
  // This handles both Prisma enum values (e.g., "ProgramManager") and display names (e.g., "Program Manager")
  const roleTitle = getRoleDisplayName(role);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-10">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Partial!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Your account has been set up successfully as a <span className="font-semibold text-blue-600 dark:text-blue-400">{roleTitle}</span>.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
            You're all set! Start tracking your work items and managing your hardware development projects.
          </p>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

type OnboardingStep =
  | "landing"
  | "auth"
  | "role-selection"
  | "organization-name"
  | "profile"
  | "program-setup"
  | "milestone-setup"
  | "part-setup"
  | "success";

// Main Onboarding Component
const OnboardingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("landing");
  const [requiresSetup, setRequiresSetup] = useState(false);
  const [createdProgram, setCreatedProgram] = useState<Program | null>(null);
  const [createdMilestone, setCreatedMilestone] = useState<Milestone | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<{
    organization: { id: number; name: string };
    role: string;
    invitedEmail?: string;
  } | null>(null);

  const goToStep = (next: OnboardingStep) => {
    setStep(next);
  };

  // Check for error and invitation parameters in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const invitationParam = searchParams.get('invitation');
    
    if (errorParam === 'authentication_failed') {
      setAuthError('Authentication failed. Please try again.');
      // Clear the error parameter from URL
      router.replace('/onboarding', { scroll: false });
    }
    
    if (invitationParam) {
      setInvitationToken(invitationParam);
    }
  }, [searchParams, router]);

  // Validate invitation token if present
  const { data: invitationValidation, isLoading: isValidatingInvitation, error: invitationError } = useValidateInvitationQuery(
    invitationToken || '',
    { skip: !invitationToken }
  );

  // Store invitation data when validation succeeds
  useEffect(() => {
    if (invitationValidation?.invitation) {
      setInvitationData({
        organization: invitationValidation.invitation.organization,
        role: invitationValidation.invitation.role,
        invitedEmail: invitationValidation.invitation.invitedEmail,
      });
    }
  }, [invitationValidation]);

  // Check Better Auth session on mount - only on landing step
  // This prevents redirecting users who are actively going through onboarding
  // Note: 401 responses are expected and normal for unauthenticated users
  useEffect(() => {
    // Only check session if we're on the landing step
    // If user is already past landing (role-selection, organization-name, etc.),
    // they're actively onboarding and shouldn't be redirected
    if (step !== "landing") {
      return;
    }

    // Prevent duplicate calls in React strict mode
    let isMounted = true;

    const checkAuthSession = async () => {
      setCheckingSession(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          method: 'GET',
          credentials: 'include', // Include session cookie
          signal: controller.signal,
        }).catch((error) => {
          // Silently handle network errors - expected during onboarding
          if (error.name === 'AbortError') {
            return null; // Request was aborted
          }
          throw error;
        });

        clearTimeout(timeoutId);

        // If component unmounted or request was aborted, don't proceed
        if (!isMounted || !response) {
          return;
        }

        // Double-check step hasn't changed (user might have started onboarding)
        if (step !== "landing") {
          return;
        }

        if (response.ok) {
          const data = await response.json();
          
          // Better Auth /auth/me returns user object directly if authenticated
          // Only redirect to home if user exists AND has completed onboarding
          // IMPORTANT: Never redirect if we're not on the landing step (user is actively onboarding)
          if (data && data.id && data.organizationId) {
            const organizationName = data.organization?.name || '';
            const userCreatedAt = data.createdAt ? new Date(data.createdAt) : null;
            const now = new Date();
            
            // Check if user was just created (within last 5 minutes) - if so, they're likely still onboarding
            const isRecentlyCreated = userCreatedAt && (now.getTime() - userCreatedAt.getTime()) < 5 * 60 * 1000;
            
            // Additional check: if organization data is missing, assume still in onboarding
            // Also check if organization is the default one
            // "Default Organization" is assigned during signup, so having it means onboarding isn't complete
            const isDefaultOrganization = !organizationName || organizationName === "Default Organization";
            
            // Only redirect if:
            // 1. They have a real organization (not "Default Organization")
            // 2. User was NOT just created (not actively signing up)
            // 3. We're still on the landing step (not actively onboarding)
            // 4. Component is still mounted
            if (!isDefaultOrganization && !isRecentlyCreated && step === "landing" && isMounted) {
              // User is authenticated, exists in database, has a real organization, and wasn't just created
              // This means they've completed onboarding - redirect to home
              router.push('/home');
              return;
            }
            // If organization is "Default Organization", missing, or user was just created, they're still in onboarding
            // Continue with onboarding flow
          }
          // If user exists but doesn't have organizationId, they're still in onboarding
          // Continue with onboarding flow
        } else if (response.status === 401) {
          // Not authenticated - this is expected during onboarding, continue normally
          // 401 is normal for unauthenticated users on the onboarding page
          // The browser console will show this as an error, but it's expected behavior
        }
        
        // No session or not authenticated - if invitation exists, user needs to login first
        if (invitationToken) {
          // Show landing page but indicate invitation is pending
          setStep("landing");
        } else {
          setStep("landing");
        }
      } catch (error) {
        // Only log if it's not a network error (backend might not be running)
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            // Request timed out - backend might be slow or unavailable
            console.debug('Auth check request timed out - backend may be unavailable');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            // Network error - backend is likely not running
            console.debug('Backend server appears to be unavailable');
          } else {
            // Other error - log it
            console.error('Failed to check auth session:', error);
          }
        } else {
          console.error('Failed to check auth session:', error);
        }
        // On error, show landing page
        setStep("landing");
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    // Only check session if not validating invitation
    if (!isValidatingInvitation) {
      checkAuthSession();
    }

    return () => {
      isMounted = false;
    };
  }, [router, invitationToken, isValidatingInvitation, invitationError, invitationValidation, step]);

  // If user is authenticated (from local storage), skip to role selection
  useEffect(() => {
    if (!checkingSession && authUser && step === "landing") {
      setStep("role-selection");
    }
  }, [authUser, step, checkingSession]);

  const redirectToAuth = (mode: "signup" | "login" = "signup") => {
    // Clear any auth error when user tries to login again
    setAuthError(null);
    // Set the auth mode before going to auth step
    setAuthMode(mode);
    // Go to auth step instead of redirecting to login page
    goToStep("auth");
  };

  const handleGetStarted = () => redirectToAuth("signup");
  const handleLogin = () => redirectToAuth("login");

  const handleLearnMore = () => {
    setShowLearnMore(true);
  };

  const handleAuthNext = () => {
    goToStep("role-selection");
  };

  const handleRoleNext = async (role: string) => {
    setUserRole(role);
    
    // For invitations, create user immediately and go to profile
    // For new organization creation, go to organization name step first
    if (invitationToken) {
      // Create user immediately for invitations
      await createUserInDatabase(role);
      goToStep("profile");
    } else {
      // For new organization, go to organization name step
      goToStep("organization-name");
    }
  };

  const handleOrganizationNameNext = async (orgName: string) => {
    setOrganizationName(orgName);
    try {
      // Create user with organization name
      await createUserInDatabase(userRole, orgName);
      goToStep("profile");
    } catch (error) {
      console.error('Error creating user with organization:', error);
      // Error is already shown via alert in createUserInDatabase
      // Don't proceed to profile if user creation failed
    }
  };

  const createUserInDatabase = async (role: string, orgName?: string) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      // Check if user is authenticated via Better Auth
      // Note: Better Auth uses cookies for session, so we check /auth/me
      // If it returns 401, the user needs to sign in first (shouldn't happen during onboarding)
      let userEmail = '';
      let userName = '';
      let userPhoneNumber = '';
      
      try {
        const sessionCheck = await fetch(`${apiBaseUrl}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (sessionCheck.ok) {
          const sessionData = await sessionCheck.json();
          
          // Better Auth /auth/me returns user object directly if authenticated
          if (sessionData && sessionData.id) {
            userEmail = sessionData.email || '';
            userName = sessionData.name || sessionData.username || '';
            userPhoneNumber = sessionData.phoneNumber || '';
          }
        } else if (sessionCheck.status === 401) {
          // Not authenticated - this may be expected during onboarding before signup
          // Silently continue - the onboarding endpoint will handle user creation
        }
      } catch (error) {
        // Silently handle errors - user might not be authenticated yet
        // This is expected during onboarding before signup
        if (error instanceof Error && error.name !== 'AbortError') {
          // Only log non-abort errors in development
          if (process.env.NODE_ENV === 'development') {
            console.debug('Session check during onboarding:', error.message);
          }
        }
      }
      
      // Proceed with creating/updating user in database
      // Extract username from email (before @) if not provided
      const username = userEmail?.split('@')[0] || 'user';
      
      // Call signup endpoint to update/create user in database
      // Include invitationToken if present
      // For new organization creation, backend will automatically assign Admin role
      // For invitations, use the role from the invitation
      let roleToSend = role;
      if (!invitationData) {
        // For new organization creation, backend will override role to Admin
        // But we still need to pass a valid role format
        if (role === "engineer") {
          roleToSend = "Engineer";
        } else if (role === "program-manager") {
          roleToSend = "Program Manager";
        } else if (role === "Admin") {
          roleToSend = "Admin"; // Already correct - backend will accept and override
        }
        // If role is already in display format, keep it as is
      } else {
        // Use role from invitation (already in display format)
        roleToSend = invitationData.role;
      }
      
      // Use phone number from session data (set during Better Auth signup)
      // If not available in session, use empty string (backend will handle validation)
      const phoneNumber = userPhoneNumber || '';
      
      const signupBody: any = {
        username: username,
        name: userName,
        email: userEmail,
        phoneNumber: phoneNumber,
        role: roleToSend, // Backend will override to Admin for new orgs (no invitation token)
      };
      
      // Include organization name for new organization creation
      if (orgName && !invitationToken) {
        signupBody.organizationName = orgName;
      }
      
      if (invitationToken) {
        signupBody.invitationToken = invitationToken;
      }
      
      const signupResponse = await fetch(`${apiBaseUrl}/onboarding/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookie
        body: JSON.stringify(signupBody),
      });

      if (signupResponse.ok) {
        const result = await signupResponse.json();
        console.log('User created/updated in database:', result);
        
        // User is now created - the profile screen will refresh user on mount
        // Small delay to ensure database is ready
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        let errorData;
        try {
          errorData = await signupResponse.json();
        } catch (e) {
          errorData = { message: `HTTP ${signupResponse.status}: ${signupResponse.statusText}` };
        }
        console.error('Failed to create user:', errorData);
        console.error('Response status:', signupResponse.status);
        console.error('Response headers:', Object.fromEntries(signupResponse.headers.entries()));
        
        // Show error to user
        showApiError({ data: { message: errorData.message }, message: errorData.message }, `Failed to create user: ${signupResponse.status}`);
        // Don't continue - show error instead
        throw new Error(errorData.message || 'Failed to create user');
      }
    } catch (error) {
      // Improve error logging with specific handling
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request timed out - backend might be slow or unavailable
          console.error('Request timed out - backend may be unavailable');
          throw new Error('Backend server is not responding. Please check if the server is running.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          // Network error - backend is likely not running
          console.error('Backend server appears to be unavailable');
          throw new Error('Cannot connect to backend server. Please check if the server is running.');
        } else {
          // Other error - log and re-throw
          console.error('Error creating user:', error);
        }
      } else {
        console.error('Error creating user:', error);
      }
      throw error; // Re-throw so caller can handle it
    }
  };

  const handleProfileNext = ({ requiresSetup }: { requiresSetup: boolean; teamId: number | null }) => {
    setRequiresSetup(requiresSetup);
    setCreatedMilestone(null);

    if (requiresSetup) {
      setCreatedProgram(null);
      goToStep("program-setup");
    } else {
      goToStep("success");
    }
  };

  const handleProgramComplete = (program: Program) => {
    setCreatedProgram(program);
    goToStep("milestone-setup");
  };

  const handleProgramJoin = (program: Program) => {
    setCreatedProgram(program);
    setRequiresSetup(false);
    goToStep("success");
  };

  const handleMilestoneComplete = (milestone: Milestone) => {
    setCreatedMilestone(milestone);
    goToStep("part-setup");
  };

  const handlePartComplete = () => {
    goToStep("success");
  };

  const handleComplete = async () => {
    try {
      router.push("/home");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      router.push("/home");
    }
  };

  const handleBack = () => {
    let previous: OnboardingStep | null = null;
    switch (step) {
      case "landing":
        previous = null;
        break;
      case "auth":
        previous = "landing";
        break;
      case "role-selection":
        // If user came from external auth (no auth step), go back to landing
        // Otherwise go back to auth
        previous = "landing"; // Skip auth step for externally authenticated users
        break;
      case "organization-name":
        previous = "role-selection";
        break;
      case "profile":
        // If invitation exists, go back to role-selection (skip organization-name)
        // Otherwise go back to organization-name
        previous = invitationToken ? "role-selection" : "organization-name";
        break;
      case "program-setup":
        previous = "profile";
        break;
      case "milestone-setup":
        previous = "program-setup";
        break;
      case "part-setup":
        previous = "milestone-setup";
        break;
      case "success":
        previous = requiresSetup ? "part-setup" : "profile";
        break;
    }

    if (previous) {
      goToStep(previous);
    }
  };

      // Show loading while checking auth session or validating invitation
      if (checkingSession || isValidatingInvitation) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {isValidatingInvitation ? 'Validating invitation...' : 'Checking authentication...'}
              </p>
            </div>
          </div>
        );
      }
      
      // Show error if invitation validation failed
      if (invitationToken && invitationError) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Invitation</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This invitation link is invalid, expired, or has already been used. Please contact the organization administrator for a new invitation.
              </p>
              <button
                onClick={() => {
                  setInvitationToken(null);
                  router.replace('/onboarding');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        );
      }

  const renderCurrentStep = () => {
    switch (step) {
      case "landing":
        return (
          <>
            {authError && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">{authError}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => setAuthError(null)}
                        className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <LandingScreen
              onGetStarted={handleGetStarted}
              onLogin={handleLogin}
              onLearnMore={handleLearnMore}
            />
          </>
        );
      case "auth":
        return (
          <AuthScreen
            onBack={handleBack}
            onNext={handleAuthNext}
            initialMode={authMode}
          />
        );
          case "role-selection":
            return (
              <RoleSelectionScreen
                onBack={handleBack}
                onNext={handleRoleNext}
                invitationData={invitationData}
                isNewOrganization={!invitationToken}
              />
            );
          case "organization-name":
            return (
              <OrganizationNameScreen
                onBack={handleBack}
                onNext={handleOrganizationNameNext}
                invitationData={invitationData}
              />
            );
      case "profile":
        return (
          <ProfileCompletionScreen
            onBack={handleBack}
            onNext={handleProfileNext}
          />
        );
      case "program-setup":
        return (
          <ProgramSetupScreen
            onBack={handleBack}
            currentUser={authUser || null}
            onComplete={handleProgramComplete}
            onJoinExisting={handleProgramJoin}
          />
        );
      case "milestone-setup":
        return (
          <MilestoneSetupScreen
            onBack={handleBack}
            program={createdProgram}
            onComplete={handleMilestoneComplete}
          />
        );
      case "part-setup":
        return (
          <PartSetupScreen
            onBack={handleBack}
            program={createdProgram}
            currentUser={authUser || null}
            milestoneCreated={!!createdMilestone}
            onComplete={handlePartComplete}
          />
        );
      case "success":
        // Use actual user role from auth context if available, otherwise fall back to userRole state
        const displayRole = authUser?.role || userRole || "Admin";
        return (
          <SuccessScreen
            role={displayRole}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
      
      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  About Partial
                </h2>
                <button
                  onClick={() => setShowLearnMore(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What is Partial?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Partial is a comprehensive work management platform designed specifically for hardware development teams. 
                    It helps engineers track their work items, manage parts, and enables program managers to monitor 
                    program health and team performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">For Engineers:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Track work items for assigned parts</li>
                        <li>• Manage deliverables and issues</li>
                        <li>• Collaborate with team members</li>
                        <li>• Update progress and status</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">For Program Managers:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Monitor program status</li>
                        <li>• Track team performance</li>
                        <li>• Identify bottlenecks</li>
                        <li>• Manage milestones</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Hardware-Specific Features
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Hierarchical part number management</li>
                    <li>• Hardware-specific deliverable types (SRS, ICD, PDR, etc.)</li>
                    <li>• Issue tracking for defects, failures, and NCRs</li>
                    <li>• Program analytics and burndown charts</li>
                    <li>• Team-based work organization</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowLearnMore(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
