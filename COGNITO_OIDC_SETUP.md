# Amazon Cognito OIDC Integration Setup

This document describes the Amazon Cognito OIDC integration that has been implemented following the Node.js quick setup guide.

## Overview

The integration uses the `openid-client` package to implement OAuth 2.0 / OpenID Connect authentication with Amazon Cognito. Authentication is handled server-side using Express sessions.

## Implementation Details

### 1. Installed Packages

- `openid-client`: ^5.7.0 - OIDC client library
- `express-session`: Session management middleware
- `@types/express-session`: TypeScript types

### 2. Files Created/Modified

#### New Files:
- `server/src/lib/cognitoClient.ts` - Cognito OIDC client initialization
- `server/src/routes/authRoutes.ts` - Authentication routes (login, callback, logout, me)

#### Modified Files:
- `server/src/index.ts` - Added session middleware and auth routes
- `server/src/middleware/authenticate.ts` - Updated to support session-based authentication
- `server/src/@types/express/index.d.ts` - Added express-session types
- `ENV_EXAMPLE.md` - Updated with Cognito configuration variables

### 3. Authentication Routes

All authentication routes are prefixed with `/auth`:

- `GET /auth/login` - Initiates login by redirecting to Cognito
- `GET /auth/callback` - Handles the OAuth callback from Cognito
- `GET /auth/logout` - Logs out the user and redirects to Cognito logout
- `GET /auth/me` - Returns current user info from session

### 4. Session Configuration

Sessions are configured with:
- Secure cookies in production (HTTPS only)
- HttpOnly cookies (prevents XSS)
- 24-hour expiration
- Configurable secret via `SESSION_SECRET` environment variable

### 5. Authentication Middleware

The `authenticate` middleware now supports:
1. **Session-based authentication** (Cognito) - Checks for `req.session.userInfo`
2. **Header-based authentication** (backward compatibility) - Falls back to `x-user-id` header

## Configuration

### Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Session Secret (generate a secure random string for production)
SESSION_SECRET=your-secure-session-secret

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000

# Cognito Configuration
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<your-client-secret>
COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net/auth/callback
COGNITO_USER_POOL_DOMAIN=<your-user-pool-domain>
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding
```

### Cognito User Pool Configuration

In your Amazon Cognito User Pool App Client settings, configure:

1. **Allowed callback URLs**: 
   - `https://d84l1y8p4kdic.cloudfront.net/auth/callback`
   - (Or your server URL + `/auth/callback`)

2. **Allowed logout URLs**:
   - `http://localhost:3000/onboarding`
   - (Or your frontend logout URL)

3. **Allowed OAuth scopes**:
   - `openid`
   - `email`
   - `profile`
   - `phone`

4. **Allowed OAuth flows**:
   - Authorization code grant

## Usage

### Login Flow

1. User navigates to `/auth/login`
2. Server redirects to Cognito hosted UI
3. User authenticates with Cognito
4. Cognito redirects to `/auth/callback` with authorization code
5. Server exchanges code for tokens and fetches user info
6. User info is stored in session
7. User is redirected to frontend home page

### Logout Flow

1. User navigates to `/auth/logout`
2. Server destroys session
3. Server redirects to Cognito logout endpoint
4. Cognito redirects back to configured logout URI

### Checking Authentication Status

- Frontend can call `GET /auth/me` to check if user is authenticated
- Returns `{ isAuthenticated: boolean, userInfo: object | null }`

## Important Notes

1. **Client Secret**: The client secret must be obtained from your Cognito User Pool App Client settings. If your app client doesn't have a secret (public client), you'll need to modify the client configuration.

2. **Redirect URI**: The `COGNITO_REDIRECT_URI` must exactly match what's configured in your Cognito App Client settings, including the full path (e.g., `/auth/callback`).

3. **User Pool Domain**: This is the domain you configured in Cognito (e.g., `your-app.auth.us-east-1.amazoncognito.com`). It's used for the logout redirect.

4. **Session Secret**: Generate a secure random string for production:
   ```bash
   openssl rand -base64 32
   ```

5. **CORS**: The server is configured to accept credentials from the frontend. Make sure your frontend sends credentials with requests:
   ```javascript
   fetch('/api/endpoint', { credentials: 'include' })
   ```

## Testing

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Navigate to `http://localhost:3001/auth/login` in your browser

3. You should be redirected to Cognito for authentication

4. After successful authentication, you'll be redirected back to your frontend

## Troubleshooting

### "Cognito client not initialized"
- Check that `COGNITO_CLIENT_SECRET` is set in your `.env` file
- Verify the `COGNITO_ISSUER_URL` is correct

### "User authenticated but not found in database"
- The user has authenticated with Cognito but doesn't exist in your database
- You may need to create the user during the callback or redirect to onboarding

### Callback errors
- Verify the redirect URI matches exactly in Cognito settings
- Check that the callback route path matches the redirect URI path
- Ensure CORS is properly configured

## Next Steps

1. Update your frontend to use the new authentication endpoints
2. Handle user creation in the database when a new Cognito user authenticates
3. Implement token refresh if needed
4. Add error handling and user feedback in the frontend
5. Configure production environment variables

