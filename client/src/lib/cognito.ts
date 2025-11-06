// Cognito configuration and setup
// This file will contain all Cognito-related configuration

export interface CognitoConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  identityPoolId?: string;
  domain?: string;
  redirectSignIn: string;
  redirectSignOut: string;
  responseType: 'code' | 'token';
  scopes: string[];
}

// Default configuration - will be overridden by environment variables
export const defaultCognitoConfig: CognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID || '',
  identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || '',
  domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
  redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/home',
  redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/onboarding',
  responseType: 'code',
  scopes: ['openid', 'email', 'profile'],
};

// Cognito attribute mapping
export const cognitoAttributeMap = {
  email: 'email',
  name: 'name',
  phone_number: 'phone_number',
  'custom:role': 'role',
  'custom:discipline_team_id': 'discipline_team_id',
  'custom:user_id': 'user_id',
} as const;

// User attributes that will be synced with Cognito
export interface CognitoUserAttributes {
  email: string;
  name: string;
  phone_number: string;
  'custom:role': string;
  'custom:discipline_team_id'?: string;
  'custom:user_id': string;
}

// Cognito error codes mapping
export const cognitoErrorCodes = {
  USER_NOT_FOUND: 'UserNotFoundException',
  INVALID_PASSWORD: 'NotAuthorizedException',
  USER_ALREADY_EXISTS: 'UsernameExistsException',
  INVALID_PARAMETER: 'InvalidParameterException',
  LIMIT_EXCEEDED: 'LimitExceededException',
  CODE_MISMATCH: 'CodeMismatchException',
  EXPIRED_CODE: 'ExpiredCodeException',
  INVALID_TOKEN: 'InvalidTokenException',
  TOKEN_EXPIRED: 'TokenExpiredException',
} as const;

// Helper function to map Cognito errors to user-friendly messages
export function getCognitoErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    [cognitoErrorCodes.USER_NOT_FOUND]: 'User not found. Please check your email address.',
    [cognitoErrorCodes.INVALID_PASSWORD]: 'Invalid password. Please try again.',
    [cognitoErrorCodes.USER_ALREADY_EXISTS]: 'An account with this email already exists.',
    [cognitoErrorCodes.INVALID_PARAMETER]: 'Invalid input. Please check your information.',
    [cognitoErrorCodes.LIMIT_EXCEEDED]: 'Too many attempts. Please try again later.',
    [cognitoErrorCodes.CODE_MISMATCH]: 'Invalid verification code. Please try again.',
    [cognitoErrorCodes.EXPIRED_CODE]: 'Verification code has expired. Please request a new one.',
    [cognitoErrorCodes.INVALID_TOKEN]: 'Invalid session. Please sign in again.',
    [cognitoErrorCodes.TOKEN_EXPIRED]: 'Session expired. Please sign in again.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

// Cognito password policy requirements
export const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
};

// Helper function to validate password against policy
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < passwordPolicy.minLength) {
    errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
  }

  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (passwordPolicy.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Cognito session management
export interface CognitoSession {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
}

// Helper function to check if session is expired
export function isSessionExpired(session: CognitoSession): boolean {
  return Date.now() >= session.expiresAt;
}

// Helper function to get time until session expires
export function getTimeUntilExpiry(session: CognitoSession): number {
  return Math.max(0, session.expiresAt - Date.now());
}
