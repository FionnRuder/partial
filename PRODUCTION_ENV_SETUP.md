# Production Environment Variables Setup

This is a quick reference for setting up production environment variables. See `PRODUCTION_DEPLOYMENT.md` for the full deployment guide.

## Server Environment Variables

Create a `.env` file in the `server/` directory with these variables:

```env
NODE_ENV=production
PORT=8000
SESSION_SECRET=<generate-with-openssl-rand-base64-32>
FRONTEND_URL=https://your-frontend-domain.com
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_zFt1mmhx8
COGNITO_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
COGNITO_CLIENT_SECRET=<your-client-secret>
COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback
COGNITO_HOSTED_UI_DOMAIN=your-prefix.auth.us-east-1.amazoncognito.com
COGNITO_LOGOUT_URI=https://your-frontend-domain.com/onboarding
DATABASE_URL=<your-production-database-url>
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
```

## Client Environment Variables

Create a `.env.local` or `.env.production` file in the `client/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_zFt1mmhx8
NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID=5429ep5otfjduo6ntjt2foc5of
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=<your-identity-pool-id>
NEXT_PUBLIC_COGNITO_DOMAIN=<your-cognito-domain>
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://your-frontend-domain.com/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://your-frontend-domain.com/onboarding
```

## Critical Steps

1. **Generate SESSION_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update Cognito App Client in AWS Console:**
   - Add production callback URL: `https://your-api-domain.com/auth/callback`
   - Add production sign-out URL: `https://your-frontend-domain.com/onboarding`

3. **Replace placeholders:**
   - `your-api-domain.com` → Your actual API domain (see `HOW_TO_FIND_YOUR_DOMAINS.md`)
   - `your-frontend-domain.com` → Your actual frontend domain (see `HOW_TO_FIND_YOUR_DOMAINS.md`)
   - `<your-client-secret>` → Your Cognito client secret
   - `<your-identity-pool-id>` → Your Cognito Identity Pool ID (if using)
   - `<your-cognito-domain>` → Your Cognito domain

**❓ Not sure what your domains are?** See `HOW_TO_FIND_YOUR_DOMAINS.md` for detailed guidance.

## EC2-Specific Notes

If deploying to EC2:

1. **Create `.env` file** directly on the server:
   ```bash
   cd /path/to/your/app/server
   nano .env
   # Paste your environment variables
   ```

2. **Or use systemd environment file:**
   ```bash
   sudo nano /etc/systemd/system/partial-server.service
   ```
   Add `EnvironmentFile=/path/to/your/app/server/.env`

3. **Or use PM2 ecosystem file:**
   PM2 will automatically load `.env` if dotenv is configured in your app

4. **For IAM roles (recommended):**
   - Attach an IAM role to your EC2 instance
   - Grant permissions for Cognito, SES, etc.
   - Remove `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from `.env`

## Verification

After setting up, verify:
- ✅ All environment variables are set
- ✅ Cognito App Client has production URLs configured
- ✅ HTTPS is enabled for both frontend and backend
- ✅ Database connection works
- ✅ Login flow works end-to-end

