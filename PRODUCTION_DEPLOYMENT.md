# Production Deployment Guide for Amazon Cognito

This guide will help you deploy your application with Cognito authentication to production, whether you're using EC2, ECS, Elastic Beanstalk, or any other hosting platform.

## Overview

Your Cognito integration is already working in development. To make it work in production, you need to:

1. **Update environment variables** with production URLs
2. **Configure Cognito App Client** to allow production callback/logout URLs
3. **Set up your production server** with the correct environment variables
4. **Ensure proper domain configuration** (if using custom domains)

## Prerequisites

- Your Cognito User Pool is already set up and working in development
- You have your production domain(s) ready
- You have access to AWS Console to configure Cognito

## Step 1: Configure Cognito App Client

Before deploying, you must add your production URLs to your Cognito App Client settings.

### In AWS Console:

1. Go to **AWS Cognito** → **User Pools** → Select your User Pool
2. Navigate to **App integration** → **App clients** → Select your app client
3. Click **Edit** and update the following:

#### Allowed callback URLs
Add **BOTH** development and production URLs:
```
http://localhost:8000/auth/callback,https://your-api-domain.com/auth/callback
```

**Important:** Replace `your-api-domain.com` with your actual production API domain.

#### Allowed sign-out URLs
Add **BOTH** development and production URLs:
```
http://localhost:3000/onboarding,https://your-frontend-domain.com/onboarding
```

**Important:** Replace `your-frontend-domain.com` with your actual production frontend domain.

#### Allowed OAuth scopes
Ensure these are checked:
- ✅ `openid`
- ✅ `email`
- ✅ `profile`
- ✅ `phone`

#### Allowed OAuth flows
Ensure this is checked:
- ✅ `Authorization code grant`

4. **Save** the changes

## Step 2: Set Up Production Environment Variables

### Server-Side Environment Variables

Create a `.env` file on your production server (or use your deployment platform's environment variable configuration):

```env
# Environment
NODE_ENV=production

# Server Port
# Use 8000 or configure based on your reverse proxy/load balancer
PORT=8000

# Session Secret (IMPORTANT: Generate a secure random string)
# Generate with: openssl rand -base64 32
SESSION_SECRET=<your-secure-random-session-secret>

# Frontend URL (Production)
FRONTEND_URL=https://your-frontend-domain.com

# AWS Cognito Configuration (Same as development)
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<your-client-secret>

# Redirect URI (Production - points to your API server)
COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback

# Cognito Domain Configuration
# Option 1: Use Cognito hosted UI domain (recommended for quick setup)
COGNITO_HOSTED_UI_DOMAIN=your-prefix.auth.us-east-1.amazoncognito.com

# Option 2: Use custom domain (requires DNS setup)
# COGNITO_USER_POOL_DOMAIN=auth.yourdomain.com
# COGNITO_USE_ISSUER_URL_FOR_AUTH=false

# Logout redirect URI (Production)
COGNITO_LOGOUT_URI=https://your-frontend-domain.com/onboarding

# Database (if different from development)
DATABASE_URL=<your-production-database-url>

# AWS SES Configuration (for email)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
# OR use IAM role if running on EC2/ECS
```

### Client-Side Environment Variables

For your Next.js frontend, create a `.env.local` or `.env.production` file:

```env
# API Base URL (Production)
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com

# AWS Cognito Configuration (Same as development)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_zFt1mmhx8
NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=<your-identity-pool-id>
NEXT_PUBLIC_COGNITO_DOMAIN=<your-cognito-domain>

# Redirect URLs (Production)
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://your-frontend-domain.com/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://your-frontend-domain.com/onboarding

# Authentication Provider
NEXT_PUBLIC_AUTH_PROVIDER=cognito
```

## Step 3: Deployment Options

### Option A: EC2 Deployment

If deploying to EC2:

1. **SSH into your EC2 instance**
2. **Clone your repository** (or upload your code)
3. **Install dependencies:**
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```
4. **Create `.env` file** in the `server` directory with production values
5. **Create `.env.local` file** in the `client` directory with production values
6. **Build your application:**
   ```bash
   # Server
   cd server
   npm run build
   
   # Client
   cd ../client
   npm run build
   ```
7. **Set up PM2** (or your preferred process manager):
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js --env production
   ```
8. **Configure reverse proxy** (nginx or Apache) to route traffic to your server
9. **Set up SSL/TLS** certificates (Let's Encrypt recommended)

### Option B: Docker Deployment

If using Docker:

1. **Create Dockerfile** for server and client
2. **Use environment variables** in docker-compose.yml or container configuration
3. **Ensure environment variables are set** when running containers

### Option C: AWS Elastic Beanstalk

1. **Configure environment variables** in Elastic Beanstalk console
2. **Deploy your application** using EB CLI or console
3. **Environment variables** are automatically available to your application

### Option D: AWS ECS/Fargate

1. **Create task definition** with environment variables
2. **Use AWS Secrets Manager** or Parameter Store for sensitive values
3. **Deploy your service**

## Step 4: Domain and DNS Configuration

### If Using Custom Cognito Domain

If you want to use a custom domain for Cognito (e.g., `auth.yourdomain.com`):

1. **In AWS Console:**
   - Go to Cognito → User Pools → Your Pool → App integration → Domain
   - Add custom domain: `auth.yourdomain.com`
   - AWS will provide you with DNS records to add

2. **Add DNS records** to your domain provider:
   - Add the CNAME record provided by AWS
   - Wait for DNS propagation (can take up to 48 hours)

3. **Update environment variables:**
   ```env
   COGNITO_USER_POOL_DOMAIN=auth.yourdomain.com
   COGNITO_USE_ISSUER_URL_FOR_AUTH=false
   ```

### If Using Cognito Hosted UI Domain

If you're using the default Cognito domain (e.g., `your-prefix.auth.us-east-1.amazoncognito.com`):

1. **Find your domain** in AWS Console:
   - Cognito → User Pools → Your Pool → App integration → Domain
   - Copy the domain name

2. **Set environment variable:**
   ```env
   COGNITO_HOSTED_UI_DOMAIN=your-prefix.auth.us-east-1.amazoncognito.com
   ```

## Step 5: Testing Production Deployment

1. **Test the login flow:**
   - Navigate to your production frontend
   - Click login
   - Should redirect to Cognito login page
   - After login, should redirect back to your app

2. **Test the callback:**
   - Verify redirect goes to: `https://your-api-domain.com/auth/callback`
   - Then redirects to frontend

3. **Test logout:**
   - Click logout
   - Should redirect to Cognito logout
   - Then redirect to onboarding page

4. **Check server logs** for any errors

## Step 6: Security Checklist

- ✅ **SESSION_SECRET** is a secure random string (not the default)
- ✅ **HTTPS** is enabled for both frontend and backend
- ✅ **Secure cookies** are enabled (automatically enabled when `FRONTEND_URL` uses HTTPS)
- ✅ **CORS** is configured correctly (only allows your frontend domain)
- ✅ **Environment variables** are not committed to git
- ✅ **Database credentials** are secure
- ✅ **AWS credentials** are properly secured (use IAM roles when possible)

## Troubleshooting

### Issue: "Invalid redirect URI"

**Solution:** Ensure your production callback URL is added to Cognito App Client's "Allowed callback URLs"

### Issue: "Invalid request" on logout

**Solution:** Ensure your production logout URL is added to Cognito App Client's "Allowed sign-out URLs"

### Issue: Cookies not working

**Solution:** 
- Ensure `FRONTEND_URL` uses HTTPS
- Check CORS configuration allows credentials
- Verify `sameSite` cookie setting (should be 'none' in production for cross-domain)

### Issue: Session not persisting

**Solution:**
- Check `SESSION_SECRET` is set correctly
- Verify cookies are being set (check browser DevTools)
- Ensure secure cookies are enabled in production

### Issue: CORS errors

**Solution:**
- Verify `FRONTEND_URL` environment variable matches your actual frontend domain
- Check that CORS middleware is configured correctly
- Ensure credentials are allowed in CORS config

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Cognito Hosted UI Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-integration.html)
- [Environment Variables Guide](./ENV_EXAMPLE.md)

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test Cognito configuration in AWS Console
4. Review the troubleshooting section above

