# Onboarding Flow Migration to Cognito Session-Based Auth

## Summary

The onboarding flow has been refactored to use **Cognito session-based authentication only**. Header-based authentication (`x-user-id`) has been completely removed.

## Changes Made

### 1. Authentication Middleware (`server/src/middleware/authenticate.ts`)
- ✅ **Removed** header-based authentication (`x-user-id`)
- ✅ **Now requires** Cognito session (`req.session.userInfo`)
- ✅ Returns `requiresOnboarding: true` if user is authenticated but not in database

### 2. New Middleware: `requireCognitoSession` (`server/src/middleware/requireCognitoSession.ts`)
- ✅ Created new middleware that requires Cognito session but doesn't require user to exist in database
- ✅ Used for onboarding routes where user is authenticated but not yet in database
- ✅ Attaches `req.cognitoUserInfo` for easy access to Cognito user data

### 3. Onboarding Controller (`server/src/controllers/onboardingController.ts`)
- ✅ **Removed** `cognitoId` from request body
- ✅ **Gets** `cognitoId` from session (`req.cognitoUserInfo.sub`)
- ✅ **Uses** email and name from Cognito session (more trustworthy than user input)
- ✅ Validates that Cognito session exists before processing

### 4. Onboarding Routes (`server/src/routes/onboardingRoutes.ts`)
- ✅ **Added** `requireCognitoSession` middleware
- ✅ Routes now require Cognito authentication but user may not exist in DB yet

### 5. Auth Callback Route (`server/src/routes/authRoutes.ts`)
- ✅ **Checks** if user exists in database after Cognito authentication
- ✅ **Redirects** to `/home` if user exists
- ✅ **Redirects** to `/onboarding` if user doesn't exist (first-time login)

### 6. Client-Side Auth Service (`client/src/lib/auth.ts`)
- ✅ **Removed** mock `cognitoId` generation
- ✅ **Added** `credentials: 'include'` to include session cookies
- ✅ **Updated** comments to explain new Cognito-based flow

## New Authentication Flow

### For New Users:
1. User navigates to `/onboarding` page
2. User clicks "Sign Up" → Redirected to `/auth/login`
3. Server redirects to Cognito hosted UI
4. User signs up/authenticates with Cognito
5. Cognito redirects to `/auth/callback`
6. Server checks if user exists in database
7. If not found → Redirects to `/onboarding` (with session cookie)
8. Onboarding page calls `/onboarding/signup` with session cookie
9. Server gets `cognitoId` from session, creates user in database
10. User completes onboarding → Redirected to `/home`

### For Existing Users:
1. User navigates to any protected route or clicks "Login"
2. User redirected to `/auth/login`
3. Server redirects to Cognito hosted UI
4. User authenticates with Cognito
5. Cognito redirects to `/auth/callback`
6. Server checks if user exists in database
7. If found → Redirects to `/home`
8. User is now authenticated via session

## Breaking Changes

### ❌ Removed Features:
- Header-based authentication (`x-user-id` header)
- Mock `cognitoId` generation in client
- Ability to call onboarding endpoints without Cognito session

### ✅ New Requirements:
- All API calls must include session cookies (`credentials: 'include'`)
- Users must authenticate via Cognito before accessing onboarding
- `cognitoId` is now retrieved from session, not request body

## Migration Notes

### Frontend Updates Needed:
1. **Update API calls** to include `credentials: 'include'`:
   ```typescript
   fetch('/api/endpoint', {
     credentials: 'include', // Important!
     // ... other options
   })
   ```

2. **Update onboarding flow**:
   - Remove any client-side `cognitoId` generation
   - Ensure onboarding page redirects to `/auth/login` if no session
   - Onboarding form should not send `cognitoId` in request body

3. **Update login flow**:
   - Redirect to `/auth/login` instead of calling sign-in API
   - Handle redirects from `/auth/callback`

### Backend API Changes:
- All protected routes now require Cognito session
- Onboarding routes require Cognito session (but user may not exist in DB)
- No more `x-user-id` header support

## Testing Checklist

- [ ] New user signup flow works end-to-end
- [ ] Existing user login flow works
- [ ] Onboarding page requires Cognito authentication
- [ ] API calls include session cookies
- [ ] Header-based auth no longer works (should return 401)
- [ ] Callback route redirects correctly based on user existence

## Security Improvements

1. ✅ **No more mock authentication** - All users must authenticate via Cognito
2. ✅ **Session-based auth** - More secure than header-based
3. ✅ **Trusted user data** - Email and name come from Cognito, not user input
4. ✅ **Automatic user creation** - Users can't create accounts without Cognito authentication

