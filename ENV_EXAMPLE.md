# Environment Configuration

This file shows configuration for LOCAL DEVELOPMENT.
For PRODUCTION, create a separate .env file with production values.

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
# PRODUCTION: https://your-production-domain.com
FRONTEND_URL=http://localhost:3000

# Database URL (PostgreSQL)
# Format: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/partial

# Better Auth Configuration
# Secret key for encryption and hashing (generate with: openssl rand -base64 32)
# Can reuse SESSION_SECRET if desired, but recommended to use a separate secret
BETTER_AUTH_SECRET=some-secret-change-this-in-production
# Base URL of your application (used for auth callbacks and redirects)
# Should match FRONTEND_URL in most cases
BETTER_AUTH_URL=http://localhost:3000

# TODO: Email Service Configuration
# When implementing your email service (SendGrid, Resend, Nodemailer, etc.), add configuration here:
# EMAIL_API_KEY=...
# EMAIL_FROM=notifications@partialsystems.com
# etc.

# ============================================
# CLIENT-SIDE CONFIGURATION (Frontend)
# ============================================

# API Configuration
# Should match your server port (default is 8000 for local development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# TODO: Authentication Provider Configuration
# When implementing better-auth.com, add configuration here:
# NEXT_PUBLIC_BETTER_AUTH_URL=...
# etc.

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
3. **Update `DATABASE_URL` with your PostgreSQL connection string**
4. **Generate a secure `SESSION_SECRET`**: `openssl rand -base64 32`
5. **Configure authentication**: When implementing better-auth.com, add the required environment variables
6. **Configure email service**: When implementing your email service, add the required environment variables

## For PRODUCTION:

1. **Create a separate `.env` file in the server directory with production values:**
   ```env
   NODE_ENV=production
   PORT=8000  # Or your production port
   SESSION_SECRET=<generate-secure-random-string>
   FRONTEND_URL=https://your-production-domain.com
   DATABASE_URL=postgresql://user:password@host:port/database
   # ... authentication and email service configuration
   ```

2. **Update client `.env.local` with production values:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
   # ... authentication configuration
   ```

## Important Notes:

- **Session cookies**: Automatically use `secure: true` in production (when FRONTEND_URL uses HTTPS)
- **CORS**: Automatically configured based on FRONTEND_URL
- **Generate SESSION_SECRET for production**: `openssl rand -base64 32`
- **Database**: Ensure your PostgreSQL database is accessible and migrations are run
