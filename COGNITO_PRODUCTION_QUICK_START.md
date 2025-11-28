# Cognito Production Setup - Quick Start

## TL;DR: You Don't Need EC2 Specifically

Your Cognito integration will work in production on **any hosting platform** (EC2, ECS, Elastic Beanstalk, Heroku, Railway, etc.) as long as you:

1. ✅ Set the correct environment variables
2. ✅ Configure Cognito App Client with production URLs
3. ✅ Use HTTPS for your production domains

## The 3 Critical Steps

### Step 1: Update Cognito App Client (5 minutes)

In AWS Console:
1. Go to **AWS Cognito** → **User Pools** → Your Pool → **App integration** → **App clients**
2. Edit your app client
3. Add production URLs:
   - **Allowed callback URLs:** `https://your-api-domain.com/auth/callback`
   - **Allowed sign-out URLs:** `https://your-frontend-domain.com/onboarding`
4. Save

### Step 2: Set Production Environment Variables

**First, determine your domains:**
- **Frontend domain:** Where your Next.js app will be accessible (e.g., `app.yourdomain.com`)
- **API domain:** Where your Express server will be accessible (e.g., `api.yourdomain.com`)

**❓ Not sure what your domains are?** See `HOW_TO_FIND_YOUR_DOMAINS.md` for detailed guidance.

**On your server**, create/update `.env`:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
COGNITO_REDIRECT_URI=https://your-api-domain.com/auth/callback
COGNITO_LOGOUT_URI=https://your-frontend-domain.com/onboarding
SESSION_SECRET=<generate-with-openssl-rand-base64-32>
# ... (keep other Cognito values the same as development)
```

**On your client**, create/update `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://your-frontend-domain.com/home
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://your-frontend-domain.com/onboarding
# ... (keep other Cognito values the same as development)
```

### Step 3: Deploy

Deploy your application with the updated environment variables. That's it!

## If You're Using EC2

If you choose EC2, here's the process:

1. **Launch EC2 instance** (Ubuntu/Amazon Linux recommended)
2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```
3. **Install Node.js and dependencies:**
   ```bash
   # Install Node.js (example for Ubuntu)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone your repo or upload code
   git clone your-repo-url
   cd your-repo
   ```
4. **Set up environment variables:**
   ```bash
   cd server
   nano .env  # Create and paste production env vars
   cd ../client
   nano .env.local  # Create and paste production env vars
   ```
5. **Install and build:**
   ```bash
   cd server && npm install && npm run build
   cd ../client && npm install && npm run build
   ```
6. **Start with PM2:**
   ```bash
   npm install -g pm2
   cd server
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup  # Follow instructions to enable on boot
   ```
7. **Set up reverse proxy (nginx):**
   ```bash
   sudo apt-get install nginx
   # Configure nginx to proxy to your Node.js app
   # Set up SSL with Let's Encrypt
   ```

## What Changed from Development?

The **only** differences for production are:

1. **URLs** - Use `https://` instead of `http://localhost`
2. **SESSION_SECRET** - Use a secure random string (not the default)
3. **Cognito App Client** - Add production URLs to allowed lists

Everything else (Cognito User Pool ID, Client ID, etc.) stays the same!

## Common Issues

### "Invalid redirect URI"
→ Add your production callback URL to Cognito App Client

### "Invalid request" on logout
→ Add your production logout URL to Cognito App Client

### Cookies not working
→ Ensure you're using HTTPS and CORS is configured correctly

## Full Documentation

- **Complete Guide:** `PRODUCTION_DEPLOYMENT.md`
- **Environment Variables:** `PRODUCTION_ENV_SETUP.md`
- **Development Setup:** `ENV_EXAMPLE.md`

## Need Help?

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test Cognito configuration in AWS Console
4. Review the troubleshooting section in `PRODUCTION_DEPLOYMENT.md`

