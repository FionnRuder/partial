# Onboarding Flow

This document describes the onboarding flow implemented for the Partial work management application.

## Overview

The onboarding flow provides a comprehensive introduction to new users, guiding them through account creation, role selection, and initial setup. The flow is designed to differentiate between Engineer and Program Manager user experiences.

## Flow Structure

### 1. Landing/Welcome Screen (`/onboarding`)
- **Purpose**: Introduce the application and its value proposition
- **Features**:
  - App tagline: "Streamline Your Hardware Development"
  - Value propositions highlighting key features
  - Three main CTAs: "Get Started", "Login", "Learn More"
  - Responsive design with gradient background
  - Dark mode support

### 2. Authentication Screen
- **Purpose**: Handle user registration and login
- **Features**:
  - Toggle between signup and login modes
  - Form fields: Name, Phone, Email, Password, Confirm Password (signup only)
  - Form validation
  - Back navigation to landing screen
  - Clean, centered layout

### 3. Role Selection Screen
- **Purpose**: Allow users to choose their primary role
- **Roles**:
  - **Engineer**: Focus on tracking work items for assigned parts
  - **Program Manager**: Focus on monitoring program health and team performance
- **Features**:
  - Visual role cards with descriptions
  - Feature lists for each role
  - Interactive selection with visual feedback
  - Back navigation to auth screen

### 4. Success Screen
- **Purpose**: Confirm setup completion and guide next steps
- **Features**:
  - Welcome message with selected role
  - Next steps checklist
  - Call-to-action to enter dashboard
  - Success animation and confirmation

## Technical Implementation

### File Structure
```
client/src/app/
├── onboarding/
│   └── page.tsx          # Main onboarding component
├── dashboardWrapper.tsx  # Conditional layout wrapper
├── page.tsx             # Root page with auth redirect
└── layout.tsx           # Updated metadata
```

### Key Components

#### OnboardingPage
- Main component managing the onboarding flow state
- Handles navigation between steps
- Manages user role selection
- Integrates with Learn More modal

#### Individual Step Components
- `LandingScreen`: Welcome and value proposition
- `AuthScreen`: Registration and login forms
- `RoleSelectionScreen`: Role selection interface
- `SuccessScreen`: Completion confirmation

### Authentication Flow
- Uses localStorage for simple authentication state
- Stores `isAuthenticated` and `userRole` flags
- Redirects unauthenticated users to onboarding
- Logout functionality clears state and redirects

### Routing Logic
- Root page (`/`) checks authentication status
- Redirects to `/onboarding` for new users
- Redirects to `/home` for authenticated users
- Dashboard wrapper conditionally renders layout based on route

## User Experience Features

### Visual Design
- Modern, clean interface with Tailwind CSS
- Gradient backgrounds and card-based layouts
- Consistent color scheme with blue primary color
- Responsive design for mobile and desktop
- Dark mode support throughout

### Navigation
- Clear back buttons on each step
- Progress indication through step flow
- Smooth transitions between screens
- Modal overlay for additional information

### Accessibility
- Semantic HTML structure
- Proper form labels and inputs
- Keyboard navigation support
- Screen reader friendly content

## Integration Points

### Existing App Integration
- Integrates with existing Redux store
- Uses existing component patterns
- Maintains consistent styling with main app
- Preserves dark mode preferences

### Future Enhancements
- Integration with actual Cognito authentication
- User profile completion flow
- Team assignment during onboarding
- Program selection for new users

## Testing the Flow

1. **New User Flow**:
   - Navigate to `/` (root)
   - Should redirect to `/onboarding`
   - Complete the full flow: Landing → Auth → Role → Success
   - Should redirect to `/home` dashboard

2. **Returning User Flow**:
   - With `isAuthenticated` in localStorage
   - Navigate to `/` should redirect to `/home`

3. **Logout Flow**:
   - Click logout button in navbar
   - Should clear localStorage and redirect to `/onboarding`

## Customization

### Adding New Roles
1. Update the `roles` array in `RoleSelectionScreen`
2. Add role-specific features and descriptions
3. Update success screen messaging
4. Consider role-specific dashboard routing

### Modifying Steps
1. Update the `steps` array in `OnboardingPage`
2. Add new step components
3. Update the `renderCurrentStep` switch statement
4. Adjust navigation logic as needed

### Styling Changes
- All styles use Tailwind CSS classes
- Color scheme defined in component classes
- Responsive breakpoints follow Tailwind conventions
- Dark mode classes use `dark:` prefix
