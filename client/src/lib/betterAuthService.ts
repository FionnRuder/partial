// Better Auth service implementation
import { authClient } from "./better-auth-client";
import { AuthUser, AuthService, SignUpData, SignInData, AuthTokens } from "./auth";

export class BetterAuthService implements AuthService {
  private listeners: Array<(user: AuthUser | null) => void> = [];
  private currentUser: AuthUser | null = null;

  constructor() {
    // Initialize from Better Auth session
    this.initializeFromSession();
  }

  private async initializeFromSession() {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        // Fetch full user data from backend
        await this.fetchUserFromBackend(session.data.user.id);
      }
    } catch (error) {
      console.debug("No Better Auth session found");
    }
  }

  private async fetchUserFromBackend(betterAuthUserId: string): Promise<AuthUser | null> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    
    try {
      const response = await fetch(`${apiBaseUrl}/users/${betterAuthUserId}`, {
        method: "GET",
        credentials: "include", // Include session cookie
      });

      if (response.ok) {
        const userData = await response.json();
        const user: AuthUser = {
          id: userData.id,
          organizationId: userData.organizationId,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
          profilePictureUrl: userData.profilePictureUrl || undefined,
          disciplineTeamId: userData.disciplineTeamId || undefined,
          organizationName: userData.organization?.name || undefined,
        };
        this.currentUser = user;
        this.notifyListeners();
        return user;
      }
    } catch (error) {
      console.error("Failed to fetch user from backend:", error);
    }
    
    return null;
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  async signUp(data: SignUpData): Promise<AuthUser> {
    // Step 1: Sign up with Better Auth
    // Note: phoneNumber is NOT passed here - Better Auth rejects additional fields that aren't properly configured
    // The phoneNumber will be set in the onboarding flow via the /onboarding/signup endpoint
    // The database hook will set phoneNumber to an empty string initially
    const { data: signUpData, error: signUpError } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (signUpError) {
      // Log the full error for debugging
      console.error("Better Auth sign-up error (full):", JSON.stringify(signUpError, null, 2));
      console.error("Better Auth sign-up error message:", signUpError.message);
      console.error("Better Auth sign-up error code:", signUpError.code);
      console.error("Better Auth sign-up error status:", signUpError.status);
      throw new Error(signUpError.message || signUpError.code || "Failed to sign up");
    }

    if (!signUpData?.user) {
      throw new Error("Sign up succeeded but no user data returned");
    }

    // Step 2: Create user in database via onboarding endpoint
    // NOTE: If invitationToken is provided, the backend will update the user to join the invitation organization
    // If not provided, it will create a new organization
    // The onboarding page will handle the actual user creation with the invitation token
    // So we don't call the onboarding endpoint here - let the onboarding flow handle it
    // This prevents duplicate user creation
    
    // Just return the Better Auth user - the onboarding flow will handle database creation
    const user: AuthUser = {
      id: signUpData.user.id,
      organizationId: 0, // Will be set by onboarding endpoint
      username: signUpData.user.name?.split(' ')[0] || signUpData.user.email.split('@')[0],
      name: signUpData.user.name || '',
      email: signUpData.user.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
    };
    
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  async signIn(data: SignInData): Promise<AuthUser> {
    // Sign in with Better Auth
    const { data: signInData, error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      // Check for specific error codes/messages to distinguish between user not found and incorrect password
      const errorMessage = signInError.message?.toLowerCase() || "";
      const errorCode = (signInError as any)?.code?.toLowerCase() || "";
      
      // Check if user not found (email doesn't exist)
      // Better Auth may use various formats, so we check multiple patterns
      if (
        errorMessage.includes("user not found") ||
        errorMessage.includes("email not found") ||
        errorMessage.includes("no user found") ||
        errorMessage.includes("account not found") ||
        errorMessage.includes("user does not exist") ||
        errorCode === "user_not_found" ||
        errorCode === "email_not_found" ||
        errorCode === "account_not_found" ||
        (signInError as any)?.status === 404
      ) {
        const error = new Error("USER_NOT_FOUND");
        (error as any).code = "USER_NOT_FOUND";
        throw error;
      }
      
      // Check if password is incorrect (user exists but password is wrong)
      if (
        errorMessage.includes("invalid password") ||
        errorMessage.includes("incorrect password") ||
        errorMessage.includes("wrong password") ||
        errorMessage.includes("password mismatch") ||
        errorMessage.includes("password is incorrect") ||
        errorCode === "invalid_password" ||
        errorCode === "incorrect_password" ||
        errorCode === "wrong_password"
      ) {
        const error = new Error("INVALID_PASSWORD");
        (error as any).code = "INVALID_PASSWORD";
        throw error;
      }
      
      // For generic "invalid credentials" errors, Better Auth might not distinguish
      // between user not found and wrong password for security reasons.
      // However, we'll check the error structure to see if we can infer more.
      // If the error suggests it's specifically about credentials, we'll show a generic message.
      if (
        errorMessage.includes("invalid credentials") ||
        errorMessage.includes("authentication failed") ||
        errorCode === "invalid_credentials" ||
        errorCode === "authentication_failed"
      ) {
        // Better Auth might not distinguish, but we'll throw a generic error
        // The UI can show a generic message
        throw new Error(signInError.message || "Invalid email or password");
      }
      
      // If we can't determine the specific error, throw the original error message
      throw new Error(signInError.message || "Failed to sign in");
    }

    if (!signInData?.user) {
      throw new Error("Sign in succeeded but no user data returned");
    }

    // Fetch full user data from backend
    const user = await this.fetchUserFromBackend(signInData.user.id);
    
    if (!user) {
      // User authenticated but not in database - needs onboarding
      throw new Error("User authenticated but not found in database. Please complete onboarding.");
    }

    return user;
  }

  async signOut(): Promise<void> {
    // Sign out from Better Auth
    await authClient.signOut();
    
    // Clear local state
    this.currentUser = null;
    this.notifyListeners();
  }

  async refreshTokens(): Promise<AuthTokens> {
    // Better Auth handles token refresh automatically
    // This is a placeholder for the interface
    throw new Error("Token refresh is handled automatically by Better Auth");
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Get session from Better Auth
    const { data: session, error } = await authClient.getSession();

    if (error || !session?.user) {
      this.currentUser = null;
      this.notifyListeners();
      return null;
    }

    // If we have a cached user with the same ID, return it
    if (this.currentUser && this.currentUser.id === session.user.id) {
      return this.currentUser;
    }

    // Fetch full user data from backend
    const user = await this.fetchUserFromBackend(session.user.id);
    return user;
  }

  async updateUserProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    if (!this.currentUser) {
      throw new Error("No authenticated user");
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const user: AuthUser = {
          id: updatedUser.id,
          organizationId: updatedUser.organizationId,
          username: updatedUser.username,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          role: updatedUser.role,
          profilePictureUrl: updatedUser.profilePictureUrl || undefined,
          disciplineTeamId: updatedUser.disciplineTeamId || undefined,
          organizationName: updatedUser.organization?.name || undefined,
        };
        this.currentUser = user;
        this.notifyListeners();
        return user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user profile");
      }
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unable to update profile. Please check your connection and try again."
      );
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // Better Auth handles password changes
    // This would need to be implemented using Better Auth's password change endpoint
    throw new Error("Password change not yet implemented with Better Auth");
  }

  async resetPassword(email: string): Promise<void> {
    // Better Auth handles password reset
    throw new Error("Password reset not yet implemented with Better Auth");
  }

  async confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
    // Better Auth handles password reset confirmation
    throw new Error("Password reset confirmation not yet implemented with Better Auth");
  }

  getTokens(): AuthTokens | null {
    // Better Auth handles tokens internally via cookies
    // This is a placeholder for the interface
    return null;
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

