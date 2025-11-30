# Amazon Cognito Production Integration Guide

This is a comprehensive, step-by-step guide for integrating Amazon Cognito into your production environment. Your codebase already has the OIDC backend implementation using `openid-client`, so this guide focuses on configuring it for production.

## Architecture Overview

- **Frontend**: Next.js app hosted on AWS Amplify
- **Backend**: Express.js server hosted on EC2
- **Database**: PostgreSQL on RDS
- **Authentication**: Amazon Cognito User Pool with OIDC (OpenID Connect)

## Prerequisites

1. AWS Account with appropriate permissions
2. Cognito User Pool already created (you have: `us-east-1_zFt1mmhx8`)
3. Cognito App Client already created (you have: `5429ep5otfjduo6ntjt2foc5of`)
4. Access to your EC2 instance
5. Access to your Amplify app configuration
6. Your production domain names (frontend and backend)

---

## Step 1: Configure Cognito User Pool App Client

### 1.1 Access Cognito Console

1. Go to AWS Console → Amazon Cognito
2. Select your User Pool: `us-east-1_zFt1mmhx8`
3. Navigate to: **App integration** → **App clients and analytics**
4. Click on your app client: `5429ep5otfjduo6ntjt2foc5of`

### 1.2 Configure Allowed Callback URLs

**This is CRITICAL - these URLs must match exactly or authentication will fail.**

1. In the app client settings, find **"Allowed callback URLs"**
2. Add your production callback URL:
   ```
   https://your-api-domain.com/auth/callback
   ```
   Replace `your-api-domain.com` with your actual EC2 backend domain (e.g., `api.yourdomain.com` or your EC2 public IP/domain).

3. **IMPORTANT**: Keep your development URL if you want to test locally:
   ```
   http://localhost:8000/auth/callback
   ```
   You can have multiple URLs separated by commas.

### 1.3 Configure Allowed Sign-out URLs

1. Find **"Allowed sign-out URLs"** in the same section
2. Add your production logout redirect URL:
   ```
   https://your-frontend-domain.com/onboarding
   ```
   Replace `your-frontend-domain.com` with your Amplify frontend domain.

3. **IMPORTANT**: Keep your development URL:
   ```
   http://localhost:3000/onboarding
   ```

### 1.4 Configure OAuth Scopes

1. Find **"Allowed OAuth scopes"**
2. Ensure these are checked:
   - ✅ `openid`
   - ✅ `email`
   - ✅ `profile`
   - ✅ `phone`

### 1.5 Configure OAuth Flows

1. Find **"Allowed OAuth flows"**
2. Ensure this is checked:
   - ✅ `Authorization code grant`

3. **IMPORTANT**: If you see "Client secret" option, make sure it's enabled (you're using a confidential client with a secret).

### 1.6 Get Your Client Secret

1. In the app client settings, find **"Client secret"**
2. If it's hidden, click **"Show"** to reveal it
3. **Copy this value** - you'll need it for Step 2
4. ⚠️ **SECURITY**: Store this securely. Never commit it to version control.

---

## Step 2: Configure Backend Environment Variables (EC2)

### 2.1 SSH into Your EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
# Or use your preferred method to access EC2
```

### 2.2 Navigate to Your Server Directory

```bash
cd /path/to/your/server/directory
# Example: cd /home/ec2-user/your-app/server
```

### 2.3 Create or Edit `.env` File

```bash
nano .env
# Or use vi, vim, or your preferred editor
```

### 2.4 Add Production Environment Variables

Add the following to your `.env` file:

```env
# ============================================
# PRODUCTION CONFIGURATION
# ============================================

# Environment
NODE_ENV=production

# Server Port
# Use the port your server listens on (e.g., 8000, or behind nginx on 80/443)
PORT=8000

# Session Secret
# Generate a secure random string: openssl rand -base64 32
# IMPORTANT: Use a different secret than development!
SESSION_SECRET=<generate-this-with-openssl-rand-base64-32>

# Frontend URL (Your Amplify domain)
# Replace with your actual Amplify frontend URL
FRONTEND_URL=https://your-amplify-domain.amplifyapp.com
# OR if you have a custom domain:
# FRONTEND_URL=https://yourdomain.com

# ============================================
# AWS Cognito OIDC Configuration
# ============================================

# Issuer URL (same for dev and prod)
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8

# Client ID (same for dev and prod)
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of

# Client Secret (from Step 1.6)
# ⚠️ REPLACE THIS WITH YOUR ACTUAL CLIENT SECRET
COGNITO_CLIENT_SECRET=<your-actual-client-secret-from-cognito>

# Redirect URI (MUST match what you configured in Cognito)
# This is your EC2 backend URL + /auth/callback
# Replace with your actual backend domain
COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback
# Examples:
# - If using EC2 public IP: https://54.123.45.67/auth/callback
# - If using domain: https://api.yourdomain.com/auth/callback
# - If using load balancer: https://your-alb-domain.com/auth/callback

# Cognito Domain Configuration
# Option A: Using Cognito default domain (recommended for simplicity)
# Find this in: Cognito Console → Your User Pool → App integration → Domain
# Format: your-prefix.auth.us-east-1.amazoncognito.com
COGNITO_HOSTED_UI_DOMAIN=your-prefix.auth.us-east-1.amazoncognito.com

# Option B: Using custom domain (if you configured one)
# Only set this if you have a custom domain configured in Cognito
# COGNITO_USER_POOL_DOMAIN=auth.yourdomain.com

# If using custom domain but DNS not ready, set this to 'true'
# Set to 'false' or remove once DNS is fully configured
COGNITO_USE_ISSUER_URL_FOR_AUTH=false

# Logout redirect URI (MUST match what you configured in Cognito)
COGNITO_LOGOUT_URI=https://your-frontend-domain.com/onboarding
# Replace with your Amplify frontend URL + /onboarding

# ============================================
# Database Configuration (RDS)
# ============================================
# Add your RDS connection string if not already configured
# DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/dbname

# ============================================
# AWS SES Configuration (if using email)
# ============================================
AWS_REGION=us-east-1
# If using IAM roles on EC2, you don't need access keys
# If not, add:
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
```

### 2.5 Generate Session Secret

Run this command to generate a secure session secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `SESSION_SECRET` in your `.env` file.

### 2.6 Verify Environment Variables

```bash
# Check that your .env file is readable
cat .env | grep -v SECRET  # Don't print secrets to console
```

### 2.7 Restart Your Server

If using PM2:
```bash
pm2 restart all
# Or
pm2 restart your-app-name
```

If using systemd:
```bash
sudo systemctl restart your-app-service
```

If running directly:
```bash
# Stop the current process (Ctrl+C) and restart
npm start
# Or
node dist/index.js
```

---

## Step 3: Configure Frontend Environment Variables (Amplify)

### 3.1 Access Amplify Console

1. Go to AWS Console → AWS Amplify
2. Select your app
3. Navigate to **App settings** → **Environment variables**

### 3.2 Add Environment Variables

Add the following environment variables:

```env
# Authentication Provider
# Keep as 'mock' for now - we'll change this later
NEXT_PUBLIC_AUTH_PROVIDER=mock

# API Base URL (Your EC2 backend)
# Replace with your actual backend URL
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
# Examples:
# - https://api.yourdomain.com
# - https://54.123.45.67 (if using EC2 public IP)
# - https://your-alb-domain.com (if using load balancer)

# AWS Cognito Configuration (for future use)
# These are already in your code but not actively used yet
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_zFt1mmhx8
NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of

# Redirect URLs (for future Cognito frontend integration)
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://your-frontend-domain.com/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://your-frontend-domain.com/onboarding
```

### 3.3 Save and Redeploy

1. Click **Save** in the Amplify console
2. Amplify will automatically trigger a new build and deployment
3. Wait for the deployment to complete

---

## Step 4: Configure CORS on Backend

Your backend already has CORS configured, but verify it matches your frontend URL.

### 4.1 Check CORS Configuration

In `server/src/index.ts`, verify:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent with requests
}));
```

This should automatically use your `FRONTEND_URL` environment variable from Step 2.4.

### 4.2 Verify Session Cookie Configuration

In `server/src/index.ts`, the session configuration should automatically detect production:

```typescript
const isProduction = process.env.NODE_ENV === 'production' || 
                     (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://'));

app.use(session({
  // ...
  cookie: {
    secure: isProduction ? true : false, // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    path: '/',
  },
}));
```

This should work automatically if `FRONTEND_URL` starts with `https://`.

---

## Step 5: Configure Security Groups and Network

### 5.1 EC2 Security Group

Ensure your EC2 security group allows:

1. **Inbound HTTPS (443)** - if using HTTPS
2. **Inbound HTTP (80)** - if using HTTP or redirecting to HTTPS
3. **Inbound Custom TCP (8000)** - if your server listens on port 8000

**Source**: `0.0.0.0/0` (or restrict to your frontend domain if possible)

### 5.2 RDS Security Group

Ensure your RDS security group allows:

1. **Inbound PostgreSQL (5432)** from your EC2 security group

### 5.3 Load Balancer (If Using)

If you're using an Application Load Balancer (ALB):

1. Ensure it forwards traffic to your EC2 instance on the correct port
2. Configure SSL certificate for HTTPS
3. Update `COGNITO_REDIRECT_URI` to use the ALB domain

---

## Step 6: Test Authentication Flow

### 6.1 Test Login Flow

1. **Open your production frontend**: `https://your-frontend-domain.com`
2. **Navigate to login** (or wherever you trigger authentication)
3. **Click login** - you should be redirected to Cognito hosted UI
4. **Sign in with test credentials**
5. **After successful login**, you should be redirected to:
   - `/home` if user exists in database
   - `/onboarding` if user doesn't exist in database

### 6.2 Verify Session Cookie

1. Open browser DevTools → Application/Storage → Cookies
2. After login, you should see a cookie named `connect.sid`
3. Verify it has:
   - `Secure` flag (if using HTTPS)
   - `HttpOnly` flag
   - `SameSite=None` (if cross-domain)

### 6.3 Test Logout Flow

1. **Click logout** in your app
2. **You should be redirected to Cognito logout**
3. **Then redirected back to** `/onboarding`

### 6.4 Test API Calls

1. **After logging in**, make an API call from your frontend
2. **Verify the request includes the session cookie** (check Network tab)
3. **Verify the API responds successfully** (not 401 Unauthorized)

---

## Step 7: Monitor and Debug

### 7.1 Check Backend Logs

On your EC2 instance:

```bash
# If using PM2
pm2 logs

# If using systemd
sudo journalctl -u your-app-service -f

# If running directly
# Check console output
```

Look for:
- ✅ "Cognito OIDC client initialized successfully"
- ✅ "Server started successfully"
- ❌ Any errors related to Cognito initialization
- ❌ Any 401/403 errors

### 7.2 Check Frontend Logs

In Amplify Console:
1. Go to **Deployments**
2. Click on the latest deployment
3. Check **Build logs** for any errors

### 7.3 Common Issues and Solutions

#### Issue: "Invalid redirect_uri"

**Solution**: 
- Verify `COGNITO_REDIRECT_URI` in backend `.env` exactly matches what's in Cognito App Client settings
- URLs are case-sensitive and must match exactly (including trailing slashes)

#### Issue: "Session expired" errors

**Solution**:
- Verify `SESSION_SECRET` is set and consistent (server restarts clear sessions if secret changes)
- Check session cookie is being sent with requests (check Network tab)
- Verify CORS allows credentials

#### Issue: "CORS error" when calling API

**Solution**:
- Verify `FRONTEND_URL` in backend `.env` matches your actual frontend domain
- Check CORS configuration allows your frontend origin
- Ensure `credentials: true` is set in both frontend fetch calls and backend CORS

#### Issue: "State mismatch" error

**Solution**:
- This usually means session storage isn't working
- Verify session middleware is configured correctly
- Check if you're using a session store (Redis recommended for production)
- For now, the default memory store works but sessions are lost on server restart

---

## Step 8: Production Best Practices

### 8.1 Use Redis for Session Storage (Recommended)

The current implementation uses in-memory session storage, which means:
- Sessions are lost on server restart
- Sessions don't work across multiple server instances

**To fix this, install Redis session store:**

```bash
# On EC2
npm install connect-redis redis
```

Then update `server/src/index.ts`:

```typescript
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// Update session configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'some secret',
  // ... rest of config
}));
```

### 8.2 Set Up HTTPS

**If not already using HTTPS:**

1. **Get SSL certificate** (use AWS Certificate Manager or Let's Encrypt)
2. **Configure nginx or ALB** to terminate SSL
3. **Update all URLs** to use `https://`

### 8.3 Set Up Monitoring

1. **CloudWatch Logs**: Send application logs to CloudWatch
2. **CloudWatch Alarms**: Set up alarms for authentication failures
3. **Sentry**: Already configured in your code - verify it's working

### 8.4 Backup Environment Variables

Store your production `.env` securely:
- Use AWS Secrets Manager
- Or use a secure password manager
- Never commit to version control

---

## Step 9: Verify Everything Works

### 9.1 Complete Checklist

- [ ] Cognito App Client has production callback URL configured
- [ ] Cognito App Client has production sign-out URL configured
- [ ] Backend `.env` has all required variables set
- [ ] Frontend Amplify environment variables are set
- [ ] Session secret is generated and secure
- [ ] Client secret is set in backend `.env`
- [ ] CORS is configured correctly
- [ ] Security groups allow necessary traffic
- [ ] Login flow works end-to-end
- [ ] Logout flow works end-to-end
- [ ] API calls work after authentication
- [ ] Session persists across page refreshes

### 9.2 Test Scenarios

1. **New User Flow**:
   - User signs up in Cognito
   - User is redirected to `/onboarding`
   - User completes onboarding
   - User can access protected routes

2. **Existing User Flow**:
   - User logs in
   - User is redirected to `/home`
   - User can access protected routes

3. **Session Persistence**:
   - User logs in
   - User refreshes page
   - User remains logged in

4. **Logout Flow**:
   - User clicks logout
   - User is logged out of Cognito
   - User is redirected to `/onboarding`
   - User cannot access protected routes

---

## Step 10: Optional - Enable Frontend Cognito Integration

Currently, your frontend uses the backend OIDC flow (which is working). If you want to use Cognito directly from the frontend in the future:

1. **Update `NEXT_PUBLIC_AUTH_PROVIDER`** in Amplify to `cognito`
2. **Implement `CognitoAuthService`** in `client/src/lib/auth.ts`
3. **Configure Amplify** in your frontend code

**However, your current setup (backend OIDC) is perfectly fine for production and is actually more secure** because:
- Client secret is never exposed to frontend
- Session management is centralized
- Easier to implement rate limiting and security controls

---

## Summary

Your Cognito integration is already implemented in the backend using OIDC. To deploy to production:

1. ✅ Configure Cognito App Client URLs (Step 1)
2. ✅ Set backend environment variables on EC2 (Step 2)
3. ✅ Set frontend environment variables in Amplify (Step 3)
4. ✅ Verify CORS and security (Step 4)
5. ✅ Configure network access (Step 5)
6. ✅ Test everything (Step 6)
7. ✅ Monitor and debug (Step 7)
8. ✅ Implement best practices (Step 8)

**Key Points**:
- All URLs must match exactly between Cognito, backend `.env`, and frontend config
- Session cookies require HTTPS in production (automatically handled)
- Client secret must be kept secure
- Test thoroughly before going live

---

## Quick Reference: Key URLs to Configure

Here's a checklist of all the URLs you need to configure. Replace placeholders with your actual domains:

### Cognito App Client Settings (AWS Console)
- **Allowed callback URLs**: 
  - `https://your-api-domain.com/auth/callback`
  - `http://localhost:8000/auth/callback` (for local dev)
- **Allowed sign-out URLs**:
  - `https://your-frontend-domain.com/onboarding`
  - `http://localhost:3000/onboarding` (for local dev)

### Backend `.env` (EC2)
```env
FRONTEND_URL=https://your-frontend-domain.com
COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback
COGNITO_LOGOUT_URI=https://your-frontend-domain.com/onboarding
COGNITO_HOSTED_UI_DOMAIN=your-prefix.auth.us-east-1.amazoncognito.com
```

### Frontend Environment Variables (Amplify)
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://your-frontend-domain.com/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://your-frontend-domain.com/onboarding
```

### Important Notes
- If using **CloudFront** in front of your backend, use the CloudFront URL for `COGNITO_REDIRECT_URI`
- If using a **Load Balancer**, use the ALB domain for `COGNITO_REDIRECT_URI`
- All URLs must use `https://` in production (except localhost for dev)
- URLs are case-sensitive and must match exactly

---

## Need Help?

If you encounter issues:

1. Check backend logs on EC2
2. Check Amplify build logs
3. Check browser console and Network tab
4. Verify all environment variables are set correctly
5. Verify Cognito App Client settings match your URLs
6. Verify URLs use `https://` in production (not `http://`)

### Common URL Patterns

**If using EC2 directly:**
- Backend: `https://ec2-XX-XX-XX-XX.compute-1.amazonaws.com` or `https://api.yourdomain.com`
- Frontend: `https://your-amplify-app.amplifyapp.com` or `https://yourdomain.com`

**If using CloudFront:**
- Backend: `https://dXXXXXXXXXXXXX.cloudfront.net` (your CloudFront distribution)
- Frontend: `https://your-amplify-app.amplifyapp.com` or `https://yourdomain.com`

**If using Load Balancer:**
- Backend: `https://your-alb-XXXXXXXXXX.us-east-1.elb.amazonaws.com` or `https://api.yourdomain.com`
- Frontend: `https://your-amplify-app.amplifyapp.com` or `https://yourdomain.com`

Your codebase is well-structured and ready for production. The main work is configuration, not code changes!

