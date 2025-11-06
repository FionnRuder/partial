"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { validatePassword } from "@/lib/cognito";
import { useGetTeamsQuery } from "@/state/api";

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
        // Save step to localStorage immediately after signup
        if (typeof window !== 'undefined') {
          localStorage.setItem('onboardingStep', '2');
        }
      }
      onNext();
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

const RoleSelectionScreen = ({ onBack, onNext }: {
  onBack: () => void;
  onNext: (role: string) => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();

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
            Choose Your Role
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select your primary role to customize your experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {roles.map((role) => (
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
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={async () => {
              if (!selectedRole) return;
              setIsLoading(true);
              try {
                // Update user profile with selected role
                await updateProfile({ role: selectedRole });
                onNext(selectedRole);
              } catch (error) {
                console.error('Failed to update role:', error);
                onNext(selectedRole); // Continue anyway
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={!selectedRole || isLoading}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 ${
              selectedRole && !isLoading
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
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileCompletionScreen = ({ onBack, onNext }: {
  onBack: () => void;
  onNext: () => void;
}) => {
  const { user, updateProfile } = useAuth();
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(user?.disciplineTeamId || null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(user?.profilePictureUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await updateProfile({
        disciplineTeamId: selectedTeamId || undefined,
        profilePictureUrl: profilePictureUrl || undefined,
      });
      onNext();
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
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/profile.jpg"
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
                You can add a profile picture URL now, or add one later in settings
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

const SuccessScreen = ({ role, onComplete }: {
  role: string;
  onComplete: () => void;
}) => {
  const roleTitle = role === "engineer" ? "Engineer" : "Program Manager";
  
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// Main Onboarding Component
const OnboardingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboardingStep');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [userRole, setUserRole] = useState<string>("");
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const { signOut, isAuthenticated, isLoading } = useAuth();


  // Save step to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingStep', currentStep.toString());
    }
  }, [currentStep]);

  // Prevent step reset when authentication state changes during onboarding
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check localStorage when auth state stabilizes
      if (typeof window !== 'undefined') {
        const savedStep = localStorage.getItem('onboardingStep');
        if (savedStep) {
          const savedStepNum = parseInt(savedStep);
          // Only restore if we're on an earlier step than saved
          setCurrentStep((prevStep) => {
            if (savedStepNum > prevStep && prevStep < 3) {
              console.log('Restoring step from localStorage:', savedStepNum, 'prevStep was:', prevStep);
              return savedStepNum;
            }
            return prevStep;
          });
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  // Clear onboarding step when completed
  useEffect(() => {
    if (currentStep === 4) { // success step
      localStorage.removeItem('onboardingStep');
    }
  }, [currentStep]);

  const steps = [
    "landing",
    "auth", 
    "role-selection",
    "profile-completion",
    "success"
  ];

  const handleGetStarted = () => {
    setAuthMode("signup");
    setCurrentStep(1);
  };

  const handleLogin = () => {
    setAuthMode("login");
    setCurrentStep(1);
  };

  const handleLearnMore = () => {
    setShowLearnMore(true);
  };

  const handleAuthNext = () => {
    // Save to localStorage immediately before state update
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingStep', '2');
    }
    // Use functional update to ensure we have the latest state
    setCurrentStep((prevStep) => {
      console.log('handleAuthNext: prevStep =', prevStep, 'setting to 2');
      return 2;
    });
  };

  const handleRoleNext = (role: string) => {
    setUserRole(role);
    // Save to localStorage immediately before state update
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingStep', '3');
    }
    setCurrentStep(3); // Go to profile-completion step
  };

  const handleProfileNext = () => {
    // Save to localStorage immediately before state update
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingStep', '4');
    }
    setCurrentStep(4); // Go to success step
  };

  const handleComplete = async () => {
    try {
      // Navigate to dashboard - authentication state is already managed by AuthContext
      router.push("/home");
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      router.push("/home"); // Continue anyway
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (steps[currentStep]) {
      case "landing":
        return (
          <LandingScreen
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
            onLearnMore={handleLearnMore}
          />
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
          />
        );
      case "profile-completion":
        return (
          <ProfileCompletionScreen
            onBack={handleBack}
            onNext={handleProfileNext}
          />
        );
      case "success":
        return (
          <SuccessScreen
            role={userRole}
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
