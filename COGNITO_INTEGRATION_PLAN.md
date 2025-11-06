# Amazon Cognito Integration Plan

This document outlines the comprehensive plan for integrating Amazon Cognito authentication into the Partial work management application.

## Overview

The codebase has been prepared with a complete authentication abstraction layer that allows seamless switching between the current mock authentication and future Cognito integration. All authentication logic is centralized and ready for Cognito implementation.

## Current Architecture

### Authentication Service Abstraction
- **Location**: `client/src/lib/auth.ts`
- **Purpose**: Provides a unified interface for authentication operations
- **Implementation**: Currently uses `MockAuthService`, ready for `CognitoAuthService`

### Authentication Context
- **Location**: `client/src/contexts/AuthContext.tsx`
- **Purpose**: React context for managing authentication state
- **Features**: User state, loading states, auth actions, role-based access control

### Configuration Management
- **Location**: `client/src/lib/cognito.ts`
- **Purpose**: Cognito-specific configuration and utilities
- **Features**: Password validation, error handling, session management

### Route Protection
- **Location**: `client/src/lib/auth-guards.ts`
- **Purpose**: Route guards and permission management
- **Features**: Role-based access control, route protection levels

## Implementation Steps

### Phase 1: AWS Cognito Setup

#### 1.1 Create Cognito User Pool
```bash
# Using AWS CLI or Console
aws cognito-idp create-user-pool \
  --pool-name "Partial-UserPool" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": true
    }
  }' \
  --schema '[
    {
      "Name": "email",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "name",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "phone_number",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "custom:role",
      "AttributeDataType": "String",
      "Required": false,
      "Mutable": true
    },
    {
      "Name": "custom:discipline_team_id",
      "AttributeDataType": "String",
      "Required": false,
      "Mutable": true
    },
    {
      "Name": "custom:user_id",
      "AttributeDataType": "String",
      "Required": false,
      "Mutable": true
    }
  ]'
```

#### 1.2 Create User Pool Client
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id "your-user-pool-id" \
  --client-name "Partial-WebClient" \
  --explicit-auth-flows "ALLOW_USER_SRP_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" \
  --supported-identity-providers "COGNITO" \
  --callback-urls "http://localhost:3000/home" \
  --logout-urls "http://localhost:3000/onboarding"
```

#### 1.3 Create Identity Pool (Optional)
```bash
aws cognito-identity create-identity-pool \
  --identity-pool-name "Partial-IdentityPool" \
  --allow-unauthenticated-identities false \
  --cognito-identity-providers '[
    {
      "ClientId": "your-web-client-id",
      "ProviderName": "cognito-idp.us-east-1.amazonaws.com/your-user-pool-id"
    }
  ]'
```

### Phase 2: Install Dependencies

#### 2.1 Install AWS Amplify
```bash
npm install aws-amplify @aws-amplify/ui-react
```

#### 2.2 Install AWS SDK (Alternative)
```bash
npm install @aws-sdk/client-cognito-identity-provider
```

### Phase 3: Implement CognitoAuthService

#### 3.1 Update `client/src/lib/auth.ts`
Replace the `CognitoAuthService` class with actual implementation:

```typescript
import { Auth } from 'aws-amplify';
import { CognitoConfig, CognitoUserAttributes, getCognitoErrorMessage } from './cognito';

export class CognitoAuthService implements AuthService {
  private config: CognitoConfig;

  constructor() {
    this.config = {
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID!,
      // ... other config
    };
    
    // Configure Amplify
    Auth.configure({
      region: this.config.region,
      userPoolId: this.config.userPoolId,
      userPoolWebClientId: this.config.userPoolWebClientId,
    });
  }

  async signUp(data: SignUpData): Promise<AuthUser> {
    try {
      const result = await Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          email: data.email,
          name: data.name,
          phone_number: data.phoneNumber,
          'custom:role': data.role,
        },
      });

      // Handle confirmation requirement
      if (result.userConfirmed) {
        return this.mapCognitoUserToAuthUser(result.user);
      } else {
        throw new Error('Email confirmation required');
      }
    } catch (error: any) {
      throw new Error(getCognitoErrorMessage(error.code));
    }
  }

  async signIn(data: SignInData): Promise<AuthUser> {
    try {
      const result = await Auth.signIn(data.email, data.password);
      return this.mapCognitoUserToAuthUser(result);
    } catch (error: any) {
      throw new Error(getCognitoErrorMessage(error.code));
    }
  }

  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return this.mapCognitoUserToAuthUser(user);
    } catch (error) {
      return null;
    }
  }

  // ... implement other methods
}
```

### Phase 4: Update Environment Configuration

#### 4.1 Create `.env.local`
```bash
# Copy from ENV_EXAMPLE.md and update with actual values
NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
```

### Phase 5: Server-Side Integration

#### 5.1 Update API Authentication
Update `server/src/index.ts` to validate Cognito tokens:

```typescript
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function verifyCognitoToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      audience: process.env.COGNITO_USER_POOL_WEB_CLIENT_ID,
      issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
```

#### 5.2 Update User Controller
Modify `server/src/controllers/userController.ts` to sync with Cognito:

```typescript
export const syncUserWithCognito = async (cognitoUser: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { cognitoId: cognitoUser.sub }
  });

  if (existingUser) {
    return existingUser;
  }

  // Create new user from Cognito data
  const newUser = await prisma.user.create({
    data: {
      cognitoId: cognitoUser.sub,
      username: cognitoUser.username,
      name: cognitoUser.name,
      email: cognitoUser.email,
      phoneNumber: cognitoUser.phone_number,
      role: cognitoUser['custom:role'] || 'Engineer',
      disciplineTeamId: cognitoUser['custom:discipline_team_id'] ? 
        parseInt(cognitoUser['custom:discipline_team_id']) : null,
    }
  });

  return newUser;
};
```

### Phase 6: Testing and Validation

#### 6.1 Test Authentication Flow
1. Test user registration with email confirmation
2. Test user login/logout
3. Test password reset flow
4. Test role-based access control
5. Test token refresh

#### 6.2 Test Integration Points
1. Verify user data sync between Cognito and database
2. Test API authentication with Cognito tokens
3. Validate role-based permissions
4. Test onboarding flow with Cognito

## Migration Strategy

### Step 1: Parallel Implementation
- Keep mock authentication running
- Implement Cognito service alongside mock service
- Use environment variable to switch between providers

### Step 2: Gradual Rollout
- Deploy with `NEXT_PUBLIC_AUTH_PROVIDER=mock`
- Test Cognito implementation in staging
- Switch to `NEXT_PUBLIC_AUTH_PROVIDER=cognito` when ready

### Step 3: Data Migration
- Export existing mock users
- Create corresponding Cognito users
- Update database records with Cognito IDs

## Security Considerations

### Token Management
- Implement proper token refresh logic
- Handle token expiration gracefully
- Secure token storage (httpOnly cookies recommended)

### Password Policy
- Enforce strong password requirements
- Implement password history
- Add password complexity validation

### Session Management
- Implement session timeout
- Handle concurrent sessions
- Add device management

## Monitoring and Logging

### Authentication Metrics
- Track login success/failure rates
- Monitor password reset requests
- Log suspicious activity

### Error Handling
- Implement comprehensive error logging
- Add user-friendly error messages
- Monitor authentication errors

## Future Enhancements

### Multi-Factor Authentication
- Implement SMS-based MFA
- Add TOTP support
- Consider hardware token support

### Social Login
- Add Google OAuth integration
- Implement Microsoft Azure AD
- Support SAML providers

### Advanced Features
- Implement user groups
- Add fine-grained permissions
- Support custom attributes

## Rollback Plan

If issues arise during Cognito integration:

1. **Immediate Rollback**: Change `NEXT_PUBLIC_AUTH_PROVIDER` back to `mock`
2. **Data Recovery**: Restore from database backups
3. **User Communication**: Notify users of temporary authentication issues
4. **Issue Resolution**: Fix Cognito configuration issues
5. **Re-deployment**: Re-enable Cognito once issues are resolved

## Support and Documentation

### User Documentation
- Create user guides for new authentication flow
- Document password reset process
- Provide troubleshooting guides

### Developer Documentation
- Update API documentation
- Document authentication flow
- Create integration examples

This comprehensive plan ensures a smooth transition to Amazon Cognito while maintaining the existing functionality and user experience.
