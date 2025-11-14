// Authentication service abstraction layer
// This will allow easy switching between mock auth and Cognito

export interface AuthUser {
  userId: number;
  organizationId: number;
  cognitoId: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
  disciplineTeamId?: number;
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cognitoId = `mock-${Date.now()}`;
    const username = data.email.split('@')[0];
    
    // Try to save user to database via onboarding endpoint
    let user: AuthUser | null = null;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Use onboarding endpoint which creates both organization and user
      const response = await fetch(`${apiBaseUrl}/onboarding/signup`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cognitoId,
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
        if (!result.user?.userId) {
          console.error('User object missing userId:', result.user);
          throw new Error('User creation response missing userId');
        }
        
        user = {
          userId: result.user.userId,
          organizationId: result.organization.id,
          cognitoId: result.user.cognitoId,
          username: result.user.username,
          name: result.user.name,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
          profilePictureUrl: result.user.profilePictureUrl || undefined,
          disciplineTeamId: result.user.disciplineTeamId || undefined,
        };
        console.log('User and organization created in database:', user);
      } else {
        // If user already exists or database error
        const errorData = await response.json();
        console.error('Failed to save user to database:', errorData);
        
        // If user already exists (409), use that user data
        if (response.status === 409 && errorData.user) {
          user = {
            userId: errorData.user.userId,
            organizationId: errorData.user.organizationId,
            cognitoId: errorData.user.cognitoId,
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
    if (!user.userId || !user.organizationId) {
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
    this.currentUser = null;
    this.saveToStorage();
    this.notifyListeners();
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
    return this.currentUser;
  }

  async updateUserProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    const baseUser = this.currentUser;
    // Try to update user in database
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(this.currentUser.userId),
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // User updated in database successfully
        const updatedUser = await response.json();
        const mergedUser: AuthUser = {
          ...baseUser,
          ...updatedUser,
          userId: baseUser.userId,
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
          userId: baseUser.userId,
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
        userId: baseUser.userId,
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

// Cognito authentication service (to be implemented)
export class CognitoAuthService implements AuthService {
  // TODO: Implement Cognito integration
  // This will use AWS Amplify or AWS SDK for Cognito
  
  async signUp(data: SignUpData): Promise<AuthUser> {
    throw new Error('Cognito integration not yet implemented');
  }

  async signIn(data: SignInData): Promise<AuthUser> {
    throw new Error('Cognito integration not yet implemented');
  }

  async signOut(): Promise<void> {
    throw new Error('Cognito integration not yet implemented');
  }

  async refreshTokens(): Promise<AuthTokens> {
    throw new Error('Cognito integration not yet implemented');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    throw new Error('Cognito integration not yet implemented');
  }

  async updateUserProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    throw new Error('Cognito integration not yet implemented');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    throw new Error('Cognito integration not yet implemented');
  }

  async resetPassword(email: string): Promise<void> {
    throw new Error('Cognito integration not yet implemented');
  }

  async confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
    throw new Error('Cognito integration not yet implemented');
  }

  getTokens(): AuthTokens | null {
    throw new Error('Cognito integration not yet implemented');
  }

  isAuthenticated(): boolean {
    throw new Error('Cognito integration not yet implemented');
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    throw new Error('Cognito integration not yet implemented');
  }
}

// Factory function to create auth service
export function createAuthService(): AuthService {
  const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'mock';
  
  switch (authProvider) {
    case 'cognito':
      return new CognitoAuthService();
    case 'mock':
    default:
      return new MockAuthService();
  }
}

// Singleton instance
export const authService = createAuthService();
