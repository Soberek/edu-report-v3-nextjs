# Shared Authentication Components

A comprehensive, reusable authentication system built with TypeScript, React, and Firebase Auth. This module provides shared components, hooks, and utilities used across login and registration modules.

## 📁 Architecture

```
src/components/auth/
├── components/          # Reusable UI components
│   ├── ErrorAlert.tsx  # Error display with accessibility
│   ├── AuthForm.tsx    # Generic authentication form
│   ├── AuthLayout.tsx  # Shared layout for auth pages
│   └── index.ts        # Barrel exports
├── constants/          # Shared constants
│   └── index.ts        # Common validation, UI text, styling
├── hooks/             # Shared React hooks
│   ├── useAuthRedirect.ts # Authentication redirects
│   ├── useAuthForm.ts     # Generic form logic
│   └── index.ts           # Barrel exports
├── types/             # TypeScript interfaces
│   └── index.ts       # All shared type definitions
├── utils/             # Pure utility functions
│   ├── authUtils.ts   # Firebase error handling
│   ├── validationUtils.ts # Zod schemas and validation
│   └── index.ts       # Barrel exports
├── index.ts           # Module barrel export
└── README.md          # This file
```

## 🎯 Purpose

This shared module eliminates code duplication between login and register modules by providing:

- **Consistent UI components** across all authentication flows
- **Unified error handling** for Firebase authentication
- **Shared validation logic** with Zod schemas
- **Common styling and theming** for authentication pages
- **Reusable hooks** for authentication operations

## 🧩 Components

### `ErrorAlert`

**Purpose**: Consistent error display with accessibility features
**Features**: 
- Collapsible animations
- ARIA live regions for screen readers
- Customizable titles
- Dismissible with close callback

**Usage**:
```tsx
import { ErrorAlert } from "@/components/auth";

<ErrorAlert 
  error={errorMessage} 
  onClose={clearError}
  title="Login Error"
/>
```

### `AuthForm`

**Purpose**: Generic form component for authentication
**Features**:
- Configurable with Zod schemas
- Consistent styling and behavior
- Loading states and validation
- Email and password fields

**Usage**:
```tsx
import { AuthForm } from "@/components/auth";

<AuthForm
  onSubmit={handleSubmit}
  isLoading={isLoading}
  schema={loginFormSchema}
  constants={LOGIN_CONSTANTS}
  submitButtonText="Log In"
  loadingText="Logging in..."
/>
```

### `AuthLayout`

**Purpose**: Shared layout wrapper for authentication pages
**Features**:
- Responsive design
- Consistent spacing and styling
- Configurable background and sizing
- Mobile-optimized

**Usage**:
```tsx
import { AuthLayout } from "@/components/auth";

<AuthLayout title="Login">
  <ErrorAlert error={error} />
  <AuthForm onSubmit={handleSubmit} />
  <NavigationPrompt />
</AuthLayout>
```

## 🪝 Hooks

### `useAuthRedirect`

**Purpose**: Handles authentication-based redirects
**Parameters**: 
- `redirectTo?: string` - Custom redirect path
- `defaultRedirect: string` - Default redirect if no custom path

**Returns**: `{ shouldRedirect: boolean, redirectPath: string }`

**Usage**:
```tsx
import { useAuthRedirect } from "@/components/auth";

const { shouldRedirect } = useAuthRedirect("/dashboard", "/");

if (shouldRedirect) {
  return null; // User is authenticated, redirect will happen
}
```

### `useAuthForm`

**Purpose**: Generic authentication form logic
**Parameters**:
- `authFunction: (data: T) => Promise<any>` - Firebase auth function
- `successRedirect: string` - Where to redirect on success
- `errorContext: string` - Context for error logging

**Returns**: `{ submit, isLoading, error, clearError }`

**Usage**:
```tsx
import { useAuthForm } from "@/components/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

const { submit, isLoading, error, clearError } = useAuthForm(
  (data) => signInWithEmailAndPassword(auth, data.email, data.password),
  "/dashboard",
  "Login error"
);
```

## 🛠️ Utilities

### `validationUtils.ts`

**Features**:
- Base Zod schema for email/password forms
- Generic validation function
- Email and password validation helpers
- Type-safe form data interfaces

**Key Functions**:
```tsx
import { baseAuthFormSchema, validateAuthForm } from "@/components/auth";

// Use base schema
const loginSchema = baseAuthFormSchema;

// Validate form data
const { isValid, errors } = validateAuthForm(data, schema);
```

### `authUtils.ts`

**Features**:
- Comprehensive Firebase error mapping
- User-friendly error messages in Polish
- Error classification (retryable, requires user action)
- Development logging utilities

**Key Functions**:
```tsx
import { getAuthErrorMessage, isRetryableError } from "@/components/auth";

// Convert Firebase error to user message
const message = getAuthErrorMessage(error);

// Check if error can be retried
const canRetry = isRetryableError(parsedError);
```

## 📊 Error Handling Matrix

| Firebase Error Code | User Message | Classification |
|---------------------|--------------|----------------|
| `auth/user-not-found` | "Nie znaleziono użytkownika..." | User action required |
| `auth/wrong-password` | "Nieprawidłowe hasło" | User action required |
| `auth/email-already-in-use` | "Ten adres email jest już używany" | User action required |
| `auth/weak-password` | "Hasło jest zbyt słabe" | User action required |
| `auth/too-many-requests` | "Zbyt wiele prób..." | Temporary restriction |
| `auth/network-request-failed` | "Błąd połączenia..." | Retryable |
| `auth/invalid-credential` | "Nieprawidłowe dane logowania" | User action required |
| `auth/user-disabled` | "Konto zostało zablokowane" | Contact support |

## 📝 Constants Structure

### `SHARED_AUTH_CONSTANTS`

```typescript
export const SHARED_AUTH_CONSTANTS = {
  VALIDATION: {
    EMAIL_REQUIRED: "Email jest wymagany",
    EMAIL_INVALID: "Nieprawidłowy format email",
    PASSWORD_REQUIRED: "Hasło jest wymagane",
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MIN_LENGTH_MESSAGE: "Hasło musi mieć co najmniej 6 znaków",
  },
  
  TEXT: {
    UNKNOWN_ERROR: "Wystąpił nieznany błąd",
    ERROR_PREFIX: "Wystąpił błąd:",
    DEFAULT_ERROR_TITLE: "Błąd",
  },
  
  FIELDS: {
    EMAIL: { LABEL: "Email", TYPE: "email", AUTOCOMPLETE: "email" },
    PASSWORD: { LABEL: "Hasło", TYPE: "password" },
  },
  
  ROUTES: {
    HOME: "/",
    LOGIN: "/login", 
    REGISTER: "/register",
  },
  
  STYLES: {
    BACKGROUND_GRADIENT: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    PRIMARY_COLOR: "#7b1fa2",
    PAPER_ELEVATION: 6,
    BORDER_RADIUS: 3,
    MIN_WIDTH: 320,
    MAX_WIDTH: 400,
    BUTTON_PADDING_Y: 1.5,
    FORM_GAP: 2,
    COMPONENT_GAP: 3,
  },
} as const;
```

## 🔄 Integration Guide

### Extending for New Auth Pages

1. **Import shared constants**:
```tsx
import { SHARED_AUTH_CONSTANTS } from "@/components/auth";

export const NEW_AUTH_CONSTANTS = {
  ...SHARED_AUTH_CONSTANTS,
  TEXT: {
    ...SHARED_AUTH_CONSTANTS.TEXT,
    TITLE: "Custom Title",
    SUBMIT_BUTTON: "Custom Action",
  },
};
```

2. **Use shared components**:
```tsx
import { AuthLayout, AuthForm, ErrorAlert } from "@/components/auth";

export const NewAuthPage = () => (
  <AuthLayout title="Custom Auth">
    <ErrorAlert error={error} />
    <AuthForm 
      schema={customSchema}
      onSubmit={handleSubmit}
      submitButtonText="Custom Action"
    />
  </AuthLayout>
);
```

3. **Leverage shared hooks**:
```tsx
import { useAuthForm, useAuthRedirect } from "@/components/auth";

const { submit, isLoading, error } = useAuthForm(
  customAuthFunction,
  "/success-redirect",
  "Custom error context"
);
```

## 🧪 Testing Strategy

### Unit Tests
- **Utils**: Test pure functions with various inputs
- **Hooks**: Test with React Testing Library
- **Components**: Test rendering and interactions

### Integration Tests
- **Form flows**: Test complete submission cycles
- **Error handling**: Test various Firebase errors
- **Redirects**: Test authentication state changes

### Example Test
```tsx
import { render, screen } from "@testing-library/react";
import { ErrorAlert } from "@/components/auth";

test("displays error message with accessibility", () => {
  render(<ErrorAlert error="Test error" />);
  
  const alert = screen.getByRole("alert");
  expect(alert).toHaveAttribute("aria-live", "assertive");
  expect(alert).toHaveTextContent("Test error");
});
```

## 🎨 Customization

### Theming
All components use Material-UI theming and can be customized through the theme provider:

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: "#your-color",
    },
  },
});
```

### Styling Override
Individual components accept `sx` props for custom styling:

```tsx
<AuthLayout 
  title="Custom"
  backgroundGradient="linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
/>
```

## 📱 Accessibility Features

- **ARIA labels**: Proper labeling for screen readers
- **Live regions**: Error announcements
- **Keyboard navigation**: Full keyboard support
- **Focus management**: Logical tab order
- **High contrast**: System preference support

## 🚀 Performance Benefits

- **Code reuse**: Eliminates duplication between auth modules
- **Bundle optimization**: Shared components reduce bundle size
- **Tree shaking**: Only used components are included
- **Memoization ready**: Components optimized for React.memo

## 🔒 Security Features

- **Input validation**: Client-side validation with Zod
- **XSS protection**: Proper escaping and sanitization
- **Error sanitization**: No sensitive data in error messages
- **Development logging**: Conditional debug information

## 🤝 Contributing

1. **Add new auth methods**: Extend the shared hooks and utilities
2. **Update validation**: Modify shared Zod schemas
3. **Enhance error handling**: Add new Firebase error codes
4. **Improve accessibility**: Follow WCAG guidelines
5. **Document changes**: Update this README

## 📚 Related Documentation

- [Login Module](../../app/login/README.md)
- [Register Module](../../app/register/README.md)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Zod Schema Validation](https://zod.dev/)
- [Material-UI Components](https://mui.com/)
