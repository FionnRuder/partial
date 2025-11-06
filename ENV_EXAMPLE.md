# Environment Configuration for Cognito Integration

# Authentication Provider
# Options: 'mock' (current implementation) or 'cognito' (future implementation)
NEXT_PUBLIC_AUTH_PROVIDER=mock

# AWS Cognito Configuration
# These will be used when NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID=your-web-client-id
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain

# Redirect URLs for Cognito
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/onboarding

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Development Settings
NODE_ENV=development
