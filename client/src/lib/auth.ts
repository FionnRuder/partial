// Authentication service abstraction layer
// This will allow easy switching between mock auth and Cognito
import { BetterAuthService } from "./betterAuthService";

export interface AuthUser {
  id: string; // Better Auth user ID (string)
  organizationId: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
  disciplineTeamId?: number;
  organizationName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role: string;
  invitationToken?: string; // Optional invitation token
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthService {
  // Authentication methods
  signUp(data: SignUpData): Promise<AuthUser>;
  signIn(data: SignInData): Promise<AuthUser>;
  signOut(): Promise<void>;
  refreshTokens(): Promise<AuthTokens>;
  
  // User management
  getCurrentUser(): Promise<AuthUser | null>;
  updateUserProfile(updates: Partial<AuthUser>): Promise<AuthUser>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void>;
  
  // Token management
  getTokens(): AuthTokens | null;
  isAuthenticated(): boolean;
  
  // Event listeners
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

// Mock authentication service (current implementation)
export class MockAuthService implements AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Array<(user: AuthUser | null) => void> = [];

  constructor() {
    // Initialize from localStorage if available
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        try {
          const parsed: AuthUser = JSON.parse(stored);
          this.currentUser = {
            ...parsed,
            organizationId: parsed?.organizationId ?? 1,
          };
        } catch (error) {
          console.warn('Failed to parse stored auth user', error);
          this.currentUser = null;
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      if (this.currentUser) {
        localStorage.setItem('authUser', JSON.stringify(this.currentUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.removeItem('authUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  async signUp(data: SignUpData): Promise<AuthUser> {
    // NOTE: With Cognito integration, signup flow has changed:
    // 1. User must first sign up in Cognito (via Cognito hosted UI or API)
    // 2. After Cognito authentication, user is redirected to /auth/callback
    // 3. Callback checks if user exists in DB, if not redirects to /onboarding
    // 4. Onboarding page calls /onboarding/signup with session cookie (cognitoId comes from session)
    
    // For mock auth service, we'll still try to call the endpoint
    // but the backend will reject it if there's no Cognito session
    const username = data.email.split('@')[0];
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    let user: AuthUser | null = null;
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Use onboarding endpoint which creates both organization and user
      // NOTE: This will fail without a Cognito session - user should authenticate first
      const response = await fetch(`${apiBaseUrl}/onboarding/signup`, {
        method: 'POST',
        headers,
        credentials: 'include', // Include session cookie
        body: JSON.stringify({
          // cognitoId is now retrieved from session on server side
          username,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          // organizationName is optional - backend will use default name if not provided
        }),
      });

      if (response.ok) {
        // User and organization created in database successfully
        const result = await response.json();
        console.log('Onboarding response:', result);
        
        // Ensure userId is present - Prisma returns userId as the primary key
        if (!result.user?.id) {
          console.error('User object missing id:', result.user);
          throw new Error('User creation response missing userId');
        }
        
        user = {
          id: result.user.id,
          organizationId: result.organization.id,
          username: result.user.username,
          name: result.user.name,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
          profilePictureUrl: result.user.profilePictureUrl || undefined,
          disciplineTeamId: result.user.disciplineTeamId || undefined,
          organizationName: result.organization.name || undefined,
        };
        console.log('User and organization created in database:', user);
      } else {
        // If user already exists or database error
        const errorData = await response.json();
        console.error('Failed to save user to database:', errorData);
        
        // If user already exists (409), use that user data
        if (response.status === 409 && errorData.user) {
          user = {
            id: errorData.user.id,
            organizationId: errorData.user.organizationId,
            username: errorData.user.username,
            name: errorData.user.name,
            email: errorData.user.email,
            phoneNumber: errorData.user.phoneNumber,
            role: errorData.user.role,
            profilePictureUrl: errorData.user.profilePictureUrl || undefined,
            disciplineTeamId: errorData.user.disciplineTeamId || undefined,
          };
          console.log('Using existing user from error response:', user);
        } else {
          // For other errors, throw so the UI can handle it
          throw new Error(errorData.message || 'Failed to create user account');
        }
      }
    } catch (error) {
      // If API call fails (e.g., server not running), throw error
      console.error('Onboarding API call failed:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Unable to create account. Please check your connection and try again.'
      );
    }

    // Verify user was created successfully
    if (!user) {
      throw new Error('User creation failed: no user object returned');
    }

    // Verify user has required fields before saving
    if (!user.id || !user.organizationId) {
      console.error('User object missing required fields:', user);
      throw new Error('User creation failed: missing userId or organizationId');
    }
    
    this.currentUser = user;
    this.saveToStorage();
    console.log('User saved to localStorage:', this.currentUser);
    this.notifyListeners();
    
    return user;
  }

  async signIn(data: SignInData): Promise<AuthUser> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const existingUser = JSON.parse(storedUser);
        // Verify email matches
        if (existingUser.email === data.email) {
          const normalizedUser: AuthUser = {
            ...existingUser,
            organizationId: existingUser?.organizationId ?? 1,
          };
          this.currentUser = normalizedUser;
          this.saveToStorage();
          this.notifyListeners();
          return normalizedUser;
        }
      }
    }
    
    // If no existing user found, throw error (user should sign up first)
    throw new Error('User not found. Please sign up first.');
  }

  async signOut(): Promise<void> {
    // Clear local storage first
    this.currentUser = null;
    this.saveToStorage();
    this.notifyListeners();
    
    // Redirect to server logout endpoint
    // The server will clear the session and redirect to Cognito logout,
    // which will then redirect back to the frontend
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    window.location.href = `${apiBaseUrl}/auth/logout`;
  }

  async refreshTokens(): Promise<AuthTokens> {
    // Mock implementation
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      idToken: 'mock-id-token',
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Always check for Cognito session on server to get fresh data (including organization name)
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include session cookie
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // If user has Cognito session and exists in database, use that
        if (data.isAuthenticated && data.userExistsInDb && data.user) {
          const user: AuthUser = {
            id: data.user.id,
            organizationId: data.user.organizationId,
            username: data.user.username,
            name: data.user.name,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
            role: data.user.role,
            profilePictureUrl: data.user.profilePictureUrl || undefined,
            disciplineTeamId: data.user.disciplineTeamId || undefined,
            organizationName: data.organization?.name || undefined,
          };
          this.currentUser = user;
          this.saveToStorage();
          this.notifyListeners();
          return user;
        }
        
        // If user has Cognito session but not in DB, return null (they need onboarding)
        // The onboarding page will handle this case
        if (data.isAuthenticated && !data.userExistsInDb) {
          return null; // User needs to complete onboarding
        }
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
          console.error('Failed to check Cognito session:', error);
        }
      } else {
        console.error('Failed to check Cognito session:', error);
      }
      
      // If we have a cached user and the server is unavailable, return the cached user
      if (this.currentUser) {
        return this.currentUser;
      }
    }

    // If no server response and no cached user, return null
    return this.currentUser || null;
  }

  async updateUserProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    const baseUser = this.currentUser;
    // Try to update user in database
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(this.currentUser.id),
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // User updated in database successfully
        const updatedUser = await response.json();
        const mergedUser: AuthUser = {
          ...baseUser,
          ...updatedUser,
          id: baseUser.id,
          organizationId: updatedUser?.organizationId ?? baseUser.organizationId,
        };
        this.currentUser = mergedUser;
        console.log('User updated in database:', updatedUser);
      } else {
        // If database update fails, still update local storage
        console.warn('Failed to update user in database, using local storage only');
        const mergedUser: AuthUser = {
          ...baseUser,
          ...updates,
          id: baseUser.id,
          organizationId: baseUser.organizationId,
        };
        this.currentUser = mergedUser;
      }
    } catch (error) {
      // If API call fails, use local storage
      console.warn('Database API not available, using local storage only:', error);
      const mergedUser: AuthUser = {
        ...baseUser,
        ...updates,
        id: baseUser.id,
        organizationId: baseUser.organizationId,
      };
      this.currentUser = mergedUser;
    }

    this.saveToStorage();
    this.notifyListeners();
    
    const finalUser = this.currentUser;
    if (!finalUser) {
      throw new Error('Failed to update user profile');
    }
    return finalUser;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async resetPassword(email: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  getTokens(): AuthTokens | null {
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      idToken: 'mock-id-token',
    };
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Factory function to create auth service
export function createAuthService(): AuthService {
  // Use Better Auth service
  return new BetterAuthService();
}

// Singleton instance - create synchronously for backward compatibility
export const authService: AuthService = new BetterAuthService();
