// Authentication service abstraction layer
// This will allow easy switching between mock auth and Cognito

export interface AuthUser {
  userId: number;
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
        this.currentUser = JSON.parse(stored);
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
    
    // Try to save user to database
    let user: AuthUser;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${apiBaseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cognitoId,
          username,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
        }),
      });

      if (response.ok) {
        // User created in database successfully
        user = await response.json();
        console.log('User saved to database:', user);
      } else {
        // If user already exists or database error, use local storage
        const errorData = await response.json();
        console.warn('Failed to save user to database:', errorData.message);
        
        // Create user object for local storage
        user = {
          userId: Math.floor(Math.random() * 10000),
          cognitoId,
          username,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
        };
      }
    } catch (error) {
      // If API call fails (e.g., server not running), use local storage
      console.warn('Database API not available, using local storage only:', error);
      user = {
        userId: Math.floor(Math.random() * 10000),
        cognitoId,
        username,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
      };
    }

    this.currentUser = user;
    this.saveToStorage();
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
          this.currentUser = existingUser;
          this.saveToStorage();
          this.notifyListeners();
          return existingUser;
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

    // Try to update user in database
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        // User updated in database successfully
        const updatedUser = await response.json();
        this.currentUser = updatedUser;
        console.log('User updated in database:', updatedUser);
      } else {
        // If database update fails, still update local storage
        console.warn('Failed to update user in database, using local storage only');
        this.currentUser = { ...this.currentUser, ...updates };
      }
    } catch (error) {
      // If API call fails, use local storage
      console.warn('Database API not available, using local storage only:', error);
      this.currentUser = { ...this.currentUser, ...updates };
    }

    this.saveToStorage();
    this.notifyListeners();
    
    return this.currentUser;
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
