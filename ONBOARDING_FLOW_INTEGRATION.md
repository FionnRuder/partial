# Onboarding Flow Integration with Cognito

## Overview

The onboarding flow has been integrated with Cognito session-based authentication. The flow now works as follows:

## Authentication Flow

### New Users (First Time Cognito Signup)
1. User clicks "Get Started" or "Login" → Redirected to `/auth/login`
2. Server redirects to Cognito hosted UI
3. User signs up/authenticates with Cognito
4. Cognito redirects to `/auth/callback` (server)
5. Server checks database:
   - User NOT found → Redirects to `/onboarding`
6. Onboarding page checks Cognito session:
   - Has session but NOT in DB → Shows **role selection** (skips landing/auth screens)
7. User selects role → User is created in database via `/onboarding/signup`
8. User completes profile → Continues with onboarding flow
9. On completion → Redirected to `/home`

### Existing Users (Already in Database)
1. User clicks "Login" → Redirected to `/auth/login`
2. Server redirects to Cognito hosted UI
3. User authenticates with Cognito
4. Cognito redirects to `/auth/callback` (server)
5. Server checks database:
   - User found → Redirects to `/home` (skips onboarding)
6. User is now authenticated and can use the app

## Changes Made

### 1. Server-Side (`server/src/routes/authRoutes.ts`)
- ✅ Updated `/auth/me` endpoint to check if user exists in database
- ✅ Returns `userExistsInDb` flag to distinguish between authenticated users who need onboarding vs. existing users
- ✅ Callback route redirects based on user existence:
  - User exists → `/home`
  - User doesn't exist → `/onboarding`

### 2. Client-Side Onboarding (`client/src/app/onboarding/page.tsx`)
- ✅ Added Cognito session check on page load
- ✅ If user has Cognito session but not in DB → Shows role selection (skips landing/auth)
- ✅ If user has Cognito session and in DB → Redirects to `/home`
- ✅ If no Cognito session → Shows landing page
- ✅ Role selection now creates user in database via `/onboarding/signup`
- ✅ Profile screen handles user refresh if needed

### 3. Auth Service (`client/src/lib/auth.ts`)
- ✅ Updated `getCurrentUser()` to check Cognito session via `/auth/me`
- ✅ If user has Cognito session and exists in DB → Returns user
- ✅ If user has Cognito session but not in DB → Returns null (needs onboarding)

## User Flow Diagrams

### New User Flow
```
Landing Page
  ↓ (Click "Get Started")
/auth/login → Cognito UI → /auth/callback
  ↓ (User not in DB)
/onboarding → Role Selection → Profile → Program Setup → Home
```

### Existing User Flow
```
Landing Page
  ↓ (Click "Login")
/auth/login → Cognito UI → /auth/callback
  ↓ (User in DB)
/home
```

## Key Features

1. **No More Auth Screen**: Users coming from Cognito skip the local auth form
2. **Automatic User Creation**: When user selects role, they're automatically created in database
3. **Session-Based**: All authentication is handled via Cognito session cookies
4. **Smart Redirects**: Server automatically redirects based on user existence

## Testing Checklist

- [ ] New user signup: Cognito → Role selection → Profile → Home
- [ ] Existing user login: Cognito → Home (skips onboarding)
- [ ] Onboarding page shows role selection for new Cognito users
- [ ] Onboarding page redirects existing users to home
- [ ] Role selection creates user in database
- [ ] Profile screen works after user creation

## Notes

- The "auth" step in onboarding is now skipped for Cognito users
- All user data (email, name) comes from Cognito session (trusted source)
- `cognitoId` is automatically retrieved from session, not user input
- Back button from role selection goes to landing (skips auth step)

