# Environment Configuration for Cognito Integration
# This file shows configuration for LOCAL DEVELOPMENT
# For PRODUCTION, create a separate .env file with production values

# ============================================
# SERVER-SIDE CONFIGURATION (Backend)
# ============================================

# Environment (development or production)
# The code automatically detects production if FRONTEND_URL uses HTTPS
NODE_ENV=development

# Server Port
# For local development, use 8000 (or any available port)
# For production, use your production server port (e.g., 443 for HTTPS, or behind a reverse proxy)
PORT=8000

# Session Configuration
# IMPORTANT: Change this to a secure random string in production
# Generate with: openssl rand -base64 32
SESSION_SECRET=some-secret-change-this-in-production

# Frontend URL (for CORS and redirects after authentication)
# LOCAL: http://localhost:3000
# PRODUCTION: https://your-production-domain.com (or your CloudFront URL)
FRONTEND_URL=http://localhost:3000

# AWS Cognito OIDC Configuration (Server-side)
# These values are the SAME for both development and production
# Issuer URL format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<your-client-secret-here>

# IMPORTANT: Redirect URI must point to your SERVER's callback route, not the client!
# LOCAL: http://localhost:8000/auth/callback
# PRODUCTION: https://your-api-domain.com/auth/callback (or your CloudFront/server URL)
# This MUST match what you configure in Cognito App Client settings (see setup instructions below)
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback

# Cognito Domain Configuration
# For Cognito domain: your-prefix.auth.us-east-1.amazoncognito.com
# For custom domain: auth.yourdomain.com (requires DNS setup)
# Leave empty or comment out if not using Cognito logout
# NOTE: Same value works for both dev and prod if using a custom domain
COGNITO_USER_POOL_DOMAIN=<your-user-pool-domain>

# Cognito Hosted UI Domain (REQUIRED when custom domain DNS is not configured)
# Find this in AWS Console → Cognito → Your User Pool → App integration → Domain
# Format: your-prefix.auth.us-east-1.amazoncognito.com
# This is the default Cognito domain that works without DNS configuration
COGNITO_HOSTED_UI_DOMAIN=<your-prefix>.auth.us-east-1.amazoncognito.com

# If custom domain DNS is not configured yet, set this to 'true' to use Cognito domain for login
# This allows login to work while you set up DNS for the custom domain
# Set to 'false' or remove once DNS is configured
COGNITO_USE_ISSUER_URL_FOR_AUTH=true

# Logout redirect URI
# LOCAL: http://localhost:3000/onboarding
# PRODUCTION: https://your-production-domain.com/onboarding
COGNITO_LOGOUT_URI=http://localhost:3000/onboarding

# ============================================
# CLIENT-SIDE CONFIGURATION (Frontend)
# ============================================

# Authentication Provider
# Options: 'mock' (current implementation) or 'cognito' (future implementation)
NEXT_PUBLIC_AUTH_PROVIDER=mock

# AWS Cognito Configuration (Client-side)
# These will be used when NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_zFt1mmhx8
NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain

# Redirect URLs for Cognito
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/onboarding

# API Configuration
# Should match your server port (default is 8000 for local development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# ============================================
# DEVELOPMENT SETTINGS
# ============================================
NODE_ENV=development

# ============================================
# SETUP INSTRUCTIONS
# ============================================

## For LOCAL DEVELOPMENT:

1. **Copy this file to `.env` in the server directory**
2. **Copy relevant `NEXT_PUBLIC_*` variables to `.env.local` in the client directory**
3. **Replace `<your-client-secret-here>` with your actual Cognito app client secret**
4. **Replace `<your-user-pool-domain>` with your Cognito user pool domain (or leave empty)**
5. **Configure your Cognito User Pool App Client** (AWS Console → Cognito → Your User Pool → App integration → App clients):
   - **Allowed callback URLs**: Add BOTH:
     - `http://localhost:8000/auth/callback` (for local development)
     - `https://your-production-api-domain.com/auth/callback` (for production)
   - **Allowed sign-out URLs**: Add BOTH:
     - `http://localhost:3000/onboarding` (for local development)
     - `https://your-production-domain.com/onboarding` (for production)
   - **Allowed OAuth scopes**: Check: `openid`, `email`, `profile`, `phone`
   - **Allowed OAuth flows**: Check: `Authorization code grant`

## For PRODUCTION:

1. **Create a separate `.env` file in the server directory with production values:**
   ```env
   NODE_ENV=production
   PORT=8000  # Or your production port
   SESSION_SECRET=<generate-secure-random-string>
   FRONTEND_URL=https://your-production-domain.com
   COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback
   COGNITO_LOGOUT_URI=https://your-production-domain.com/onboarding
   # ... other values same as development
   ```

2. **Update client `.env.local` with production values:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
   # ... other values
   ```

3. **Ensure your Cognito App Client has BOTH local and production URLs configured** (see above)

## Important Notes:

- **Cognito App Client settings must include BOTH local and production URLs** for seamless development
- **Session cookies**: Automatically use `secure: true` in production (when FRONTEND_URL uses HTTPS)
- **CORS**: Automatically configured based on FRONTEND_URL
- **Generate SESSION_SECRET for production**: `openssl rand -base64 32`
- **Custom Domain**: If using a custom domain, ensure DNS is configured before removing `COGNITO_USE_ISSUER_URL_FOR_AUTH=true`
