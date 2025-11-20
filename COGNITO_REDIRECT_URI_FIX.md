# Fix: Cognito Redirect URI Mismatch

## Problem
Your server logs show:
```
- Redirect URI: https://d84l1y8p4kdic.cloudfront.net/auth/callback
```

But for **local development**, it should be:
```
- Redirect URI: http://localhost:8000/auth/callback
```

## Solution

### Step 1: Update Your `server/.env` File

Open `server/.env` and change:
```env
# WRONG (production URL):
COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net/auth/callback

# CORRECT (local development):
COGNITO_REDIRECT_URI=http://localhost:8000/auth/callback
```

### Step 2: Update Cognito App Client Settings

1. Go to **AWS Console** → **Cognito** → **User Pools** → **"wgv9rf"**
2. Click **"App integration"** tab
3. Find your app client: `5429ep5otfjduo6ntjt2foc5of`
4. Click on it to edit
5. In **"Allowed callback URLs"**, add BOTH:
   - `http://localhost:8000/auth/callback` (for local development)
   - `https://d84l1y8p4kdic.cloudfront.net/auth/callback` (for production)
6. Click **"Save changes"**

### Step 3: Restart Your Server

After updating the `.env` file:
```bash
# Stop your server (Ctrl+C)
# Then restart it
cd server
npm run dev
```

### Step 4: Verify

After restarting, when you click login, check server logs. You should now see:
```
- Redirect URI: http://localhost:8000/auth/callback
```

## Why This Happened

The redirect URI in your authorization request must **exactly match** one of the callback URLs configured in Cognito. Since you're running locally, you need:
- The localhost URL in your `.env` file
- The localhost URL added to Cognito's allowed callback URLs

## For Production

When you deploy to production, you'll need to:
1. Set `COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net/auth/callback` in your production environment
2. Make sure that URL is also in Cognito's allowed callback URLs (which you just added)

## Quick Checklist

- [ ] Updated `COGNITO_REDIRECT_URI` in `server/.env` to `http://localhost:8000/auth/callback`
- [ ] Added `http://localhost:8000/auth/callback` to Cognito's allowed callback URLs
- [ ] Restarted the server
- [ ] Verified server logs show the correct redirect URI

