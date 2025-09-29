# Login Module

A comprehensive, maintainable authentication system built with TypeScript, React, and Firebase Auth.

## 📁 Architecture

```
src/app/login/
├── components/           # Reusable UI components
│   ├── ErrorAlert.tsx   # Error display with accessibility
│   ├── RegisterPrompt.tsx # Link to registration page
│   ├── LoginForm.tsx    # Main login form
│   └── index.ts         # Barrel exports
├── constants/           # Application constants
│   └── index.ts         # UI text, validation rules, styling
├── hooks/              # Custom React hooks
│   ├── useAuthRedirect.ts # Handles authentication redirects
│   ├── useLogin.ts        # Login logic
│   └── index.ts           # Barrel exports
├── types/              # TypeScript interfaces
│   └── index.ts        # All module type definitions
├── utils/              # Pure utility functions
│   ├── authUtils.ts    # Firebase error handling
│   ├── validationUtils.ts # Zod schemas and validation
│   └── index.ts        # Barrel exports
├── page.tsx            # Main page component
├── index.ts            # Module barrel export
└── README.md           # This file
```

## 🏗️ Key Design Principles

### 1. **Separation of Concerns**

- **Components**: Pure UI components with minimal logic
- **Hooks**: Business logic and state management
- **Utils**: Pure functions for data transformation
- **Constants**: Centralized configuration

### 2. **Type Safety**

- Strict TypeScript with no `any` types
- Zod schemas for runtime validation
- Type guards for error handling
- Discriminated unions for variant types

### 3. **Testability**

- Pure functions are easily mockable
- Hooks separated from UI components
- Dependency injection patterns
- Clear interfaces for mocking

### 4. **Error Handling**

- Firebase-specific error mapping
- User-friendly error messages
- Graceful fallbacks
- Accessibility support

## 🧩 Components

### `LoginForm`

- **Purpose**: Form handling with validation
- **Features**: Zod validation, loading states, accessibility
- **Props**: `onSubmit`, `isLoading`, `disabled`

### `ErrorAlert`

- **Purpose**: Consistent error display
- **Features**: Collapsible, accessible, dismissible
- **Props**: `error`, `onClose`, `title`

### `RegisterPrompt`

- **Purpose**: Navigation to registration page
- **Features**: Consistent styling, proper routing

## 🪝 Hooks

### `useLogin`

- **Purpose**: Handles user login flow
- **Returns**: `{ login, isLoading, error, clearError }`
- **Features**: Firebase integration, error handling

### `useAuthRedirect`

- **Purpose**: Redirects authenticated users
- **Returns**: `{ shouldRedirect, redirectPath }`
- **Features**: Configurable redirect paths

## 🛠️ Utilities

### `validationUtils.ts`

- Zod schemas for form validation
- Type-safe form data interfaces
- Validation helper functions

### `authUtils.ts`

- Firebase error code mapping
- User-friendly error messages
- Error classification (retryable/non-retryable)
- Development logging utilities

## 📝 Usage Examples

### Basic Login Page

```tsx
import LoginPage from "./page";

// Use with default behavior
<LoginPage />

// Use with custom redirect
<LoginPage redirectTo="/dashboard" />
```

### Custom Form Implementation

```tsx
import { useLogin } from "./hooks";
import { LoginForm } from "./components";

const CustomLoginPage = () => {
  const { login, isLoading, error } = useLogin();

  return <LoginForm onSubmit={login} isLoading={isLoading} />;
};
```

### Standalone Validation

```tsx
import { validateLoginForm } from "./utils";

const { isValid, errors } = validateLoginForm({
  email: "user@example.com",
  password: "password123",
});
```

## 🧪 Testing Strategy

### Unit Tests

- **Utils**: Test pure functions with various inputs
- **Hooks**: Test with React Testing Library
- **Components**: Test rendering and user interactions

### Integration Tests

- Form submission flow
- Error handling scenarios
- Authentication redirects

### E2E Tests

- Complete login journey
- Error recovery flows
- Mobile responsiveness

## 🔧 Configuration

### Environment Variables

```env
# Firebase configuration (required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
```

### Constants Customization

```typescript
// Modify constants/index.ts
export const LOGIN_CONSTANTS = {
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8, // Change password requirements
  },
  TEXT: {
    TITLE: "Custom Title", // Change UI text
  },
  // ... other customizations
};
```

## 📱 Accessibility Features

- **ARIA labels**: Proper labeling for screen readers
- **Error announcements**: Live regions for error feedback
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Logical tab order
- **High contrast**: Works with system preferences

## 🚀 Performance Optimizations

- **Code splitting**: Lazy loading of non-critical code
- **Memoization**: React.memo for components
- **Bundle optimization**: Tree-shaking friendly exports
- **Form validation**: Client-side validation reduces server load

## 🔄 Migration Guide

### From Legacy Implementation

1. Replace form validation with Zod schemas
2. Extract business logic to custom hooks
3. Replace inline styles with constants
4. Add proper TypeScript types
5. Implement error boundaries

### Breaking Changes

- Form validation now uses Zod instead of react-hook-form rules
- Error handling changed from inline to component-based
- Constants structure updated for better organization

## 🛡️ Security Features

### Input Validation

- Client-side email format validation
- Password strength requirements
- XSS protection through proper escaping

### Authentication Security

- Firebase Auth security rules
- Automatic token refresh
- Session management
- Rate limiting for failed attempts

### Error Handling Security

- No sensitive information leaked in errors
- Generic error messages for security
- Development-only detailed logging

## 📊 Error Handling Matrix

| Firebase Error Code           | User Message                    | Action Required      |
| ----------------------------- | ------------------------------- | -------------------- |
| `auth/user-not-found`         | "Nie znaleziono użytkownika..." | User should register |
| `auth/wrong-password`         | "Nieprawidłowe hasło"           | User should retry    |
| `auth/too-many-requests`      | "Zbyt wiele prób..."            | User should wait     |
| `auth/network-request-failed` | "Błąd połączenia..."            | User should retry    |
| `auth/user-disabled`          | "Konto zostało zablokowane"     | Contact support      |

## 🔄 State Management

### Form State

- React Hook Form for form management
- Zod validation integration
- Real-time validation feedback

### Authentication State

- Firebase Auth state persistence
- Custom hooks for auth operations
- Automatic redirect handling

### Error State

- Centralized error management
- User-friendly error display
- Automatic error clearing

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Add tests for new functionality
3. Update constants for UI changes
4. Document complex business logic
5. Ensure accessibility compliance

## 🔗 Integration Points

### Firebase Auth

- Email/password authentication
- Error handling and mapping
- Session management
- User state persistence

### Next.js Router

- Programmatic navigation
- Protected route handling
- Query parameter support

### Material-UI

- Consistent theming
- Responsive design
- Accessibility compliance

## 📚 Related Documentation

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Zod Schema Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Material-UI Components](https://mui.com/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
