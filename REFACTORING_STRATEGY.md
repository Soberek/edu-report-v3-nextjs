# Feature-Based Architecture Refactoring Strategy

## 📋 Executive Summary

This document outlines the strategy to refactor the Edu Report V3 Next.js application from a hybrid architecture (partially feature-based, partially layer-based) to a fully consistent **feature-based architecture**.

## 🎯 Goals

1. **Improved Modularity**: Each feature contains all its related code (components, hooks, utils, types, services)
2. **Better Scalability**: Easy to add, remove, or modify features without affecting others
3. **Enhanced Maintainability**: Clear ownership and location of code
4. **Reduced Coupling**: Features are self-contained with minimal cross-dependencies
5. **Consistent Structure**: All modules follow the same architectural pattern

## 📊 Current State Analysis

### ✅ Already Feature-Based Modules
These modules already follow good practices:
- `src/app/login/` - Complete with components, hooks, utils, types, constants
- `src/app/register/` - Complete with components, hooks, utils, types, constants
- `src/app/(protected)/spisy-spraw/` - Complete with schemas, lib, hooks, components
- `src/app/(protected)/zadania-edukacyjne/` - Well-structured feature module
- `src/app/(protected)/szkoly-w-programie/` - Good feature organization
- `src/app/(protected)/offline-miernik-budzetowy/` - Comprehensive feature structure

### ⚠️ Partially Feature-Based Modules
These need some organization:
- `src/app/(protected)/holidays/` - Has components, hooks, utils, types but missing services
- `src/app/(protected)/czerniak/` - Has basic structure but could be enhanced
- `src/app/(protected)/grypa-i-przeziebienia/` - Good structure but incomplete
- `src/app/(protected)/contacts/` - Basic structure present
- `src/app/(protected)/schools/` - Needs better organization
- `src/app/(protected)/schedule/` - Could use refinement

### ❌ Problematic: Global Shared Folders
These create coupling and should be redistributed:

#### `src/components/` (Global)
```
components/
├── auth/           # Should move to auth feature or stay as shared auth
├── layout/         # Can stay as shared
├── shared/         # Need to evaluate each component
└── ui/            # Can stay as shared UI primitives
```

#### `src/hooks/` (Global)
```
hooks/
├── shared/         # Generic hooks - can stay
├── useAdminUsers.tsx    # Should move to admin feature
├── useContact.tsx       # Should move to contacts feature
├── useProgram.tsx       # Should move to programs feature
├── useScheduledTask.tsx # Should move to schedule feature
├── useUser.tsx          # Should move to user management feature
├── useSzkolyWProgramie.ts # Should move to szkoly-w-programie
└── ...
```

#### `src/services/` (Global)
```
services/
├── contactService.ts    # Should move to contacts feature
├── schoolService.ts     # Should move to schools feature
├── userService.ts       # Should move to user management feature
├── unsplashService.ts   # Should move to holidays or shared/external-apis
├── generatedImagePostImagesService.ts # Should move to holidays
└── ...
```

#### `src/types/` (Global)
```
types/
├── index.ts        # Some types are feature-specific
└── user.ts         # Should move to user feature or auth
```

#### `src/utils/` (Global)
```
utils/
├── shared/         # Generic utils - can stay
├── auth.ts         # Should move to auth
├── graphicsGenerator.ts # Should move to holidays
└── ...
```

## 🏗️ Target Architecture

### Feature Module Structure Template

```
feature-name/
├── components/           # Feature-specific UI components
│   ├── FeatureComponent.tsx
│   ├── SubComponent.tsx
│   └── index.ts         # Barrel exports
├── hooks/               # Feature-specific React hooks
│   ├── useFeatureData.ts
│   ├── useFeatureLogic.ts
│   └── index.ts
├── services/            # Business logic & API calls
│   ├── featureService.ts
│   ├── apiClient.ts
│   └── index.ts
├── lib/                 # Core business logic (optional)
│   ├── FeatureClass.ts
│   └── index.ts
├── utils/               # Feature-specific utilities
│   ├── helpers.ts
│   ├── formatters.ts
│   └── index.ts
├── types/               # TypeScript interfaces & types
│   ├── feature.types.ts
│   └── index.ts
├── schemas/             # Zod validation schemas (optional)
│   ├── feature.schema.ts
│   └── index.ts
├── constants/           # Feature-specific constants
│   └── index.ts
├── reducers/            # State management (optional)
│   └── featureReducer.ts
├── config/              # Feature configuration (optional)
│   └── index.ts
├── page.tsx             # Next.js page component
├── layout.tsx           # Feature layout (optional)
└── README.md            # Feature documentation
```

### Shared/Common Module Structure

```
src/
├── common/              # NEW: Truly shared code
│   ├── components/      # Shared UI components
│   │   ├── ui/         # Base UI primitives (Button, Input, etc.)
│   │   └── layout/     # Layout components
│   ├── hooks/          # Generic React hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── utils/          # Generic utilities
│   │   ├── dateUtils.ts
│   │   ├── formatUtils.ts
│   │   └── index.ts
│   ├── types/          # Global types only
│   │   └── common.types.ts
│   └── constants/      # Global constants
│       └── index.ts
│
├── features/           # NEW: Cross-cutting features
│   ├── auth/          # Authentication & authorization
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── context/
│   └── navigation/    # Navigation & routing
│       └── ...
│
└── infrastructure/     # NEW: External integrations
    ├── firebase/
    │   ├── config.ts
    │   ├── admin.ts
    │   └── ProtectedPage.tsx
    ├── openai/
    │   └── client.ts
    ├── unsplash/
    │   └── client.ts
    └── stripe/
        └── client.ts
```

## 📝 Refactoring Plan

### Phase 1: Create New Structure ✅
- [x] Create `src/common/` directory
- [x] Create `src/features/` directory  
- [x] Create `src/infrastructure/` directory

### Phase 2: Refactor Holidays Module (Example) 🔄
**Current File**: `GeneratedPostsWithGraphics.tsx`

Move to feature-based structure:
```
holidays/
├── components/
│   ├── GeneratedPostsWithGraphics.tsx
│   └── ...
├── services/
│   ├── generatedImagePostImagesService.ts  # from global services
│   ├── unsplashService.ts                   # from global services
│   └── index.ts
├── utils/
│   ├── exportUtils.ts
│   ├── graphicsGenerator.ts                # from global utils
│   └── index.ts
└── types/
    └── holiday.types.ts
```

### Phase 3: Move Global Hooks to Features
- `useContact.tsx` → `contacts/hooks/`
- `useProgram.tsx` → `programy-edukacyjne/hooks/`
- `useScheduledTask.tsx` → `schedule/hooks/`
- `useAdminUsers.tsx` → `admin/hooks/`
- `useSzkolyWProgramie.ts` → `szkoly-w-programie/hooks/`

### Phase 4: Move Global Services to Features
- `contactService.ts` → `contacts/services/`
- `schoolService.ts` → `schools/services/`
- `userService.ts` → `features/auth/services/` or `admin/services/`
- `generatedImagePostImagesService.ts` → `holidays/services/`
- `postImagesUploadService.ts` → `holidays/services/`
- `unsplashService.ts` → `holidays/services/` or `infrastructure/unsplash/`

### Phase 5: Move Global Utils to Features
- `graphicsGenerator.ts` → `holidays/utils/`
- `auth.ts` → `features/auth/utils/`
- Keep `shared/` utils in `common/utils/`

### Phase 6: Reorganize Auth as Feature
```
features/auth/
├── components/
│   ├── AdminOnly.tsx       # from components/auth
│   ├── RoleProtected.tsx   # from components/auth
│   └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── useRole.ts
│   └── ...
├── services/
│   └── authService.ts
├── utils/
│   ├── auth.ts
│   └── tokenUtils.ts
├── types/
│   └── auth.types.ts
└── context/
    └── UserContext.tsx     # from providers
```

### Phase 7: Create Infrastructure Layer
```
infrastructure/
├── firebase/
│   ├── config.ts
│   ├── admin.ts
│   └── hooks/
│       └── useFirebaseData.ts
├── openai/
│   └── client.ts
├── unsplash/
│   ├── client.ts
│   └── unsplashService.ts
└── stripe/
    └── client.ts
```

### Phase 8: Update All Import Paths
- Create path mapping in `tsconfig.json`
- Use find-and-replace for import updates
- Test each module after updates

### Phase 9: Clean Up & Documentation
- Remove empty directories
- Update README files
- Create module documentation
- Update main README.md

## 🎨 Import Path Strategy

### Current Paths
```typescript
import { LoadingSpinner } from "@/components/shared";
import { useContact } from "@/hooks/useContact";
import { contactService } from "@/services/contactService";
```

### New Paths (Option 1: Feature-based)
```typescript
import { LoadingSpinner } from "@/common/components/shared";
import { useContact } from "@/app/(protected)/contacts/hooks";
import { contactService } from "@/app/(protected)/contacts/services";
```

### New Paths (Option 2: Alias-based)
```typescript
import { LoadingSpinner } from "@/common/components/shared";
import { useContact } from "@features/contacts/hooks";
import { contactService } from "@features/contacts/services";
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@common/*": ["./src/common/*"],
      "@features/*": ["./src/features/*"],
      "@infrastructure/*": ["./src/infrastructure/*"]
    }
  }
}
```

## ✅ Benefits of Refactoring

1. **Feature Isolation**: Each feature is self-contained
2. **Easier Testing**: Test features in isolation
3. **Better Code Splitting**: Load only what's needed
4. **Clear Dependencies**: Explicit imports show relationships
5. **Team Collaboration**: Multiple teams can work on different features
6. **Onboarding**: New developers can understand one feature at a time
7. **Maintenance**: Find and fix bugs faster
8. **Scalability**: Add new features without affecting existing code

## 📊 Migration Checklist

### For Each Feature Module:
- [ ] Create feature directory structure
- [ ] Move feature-specific hooks
- [ ] Move feature-specific services
- [ ] Move feature-specific utils
- [ ] Move feature-specific types
- [ ] Update internal imports
- [ ] Update external imports
- [ ] Test feature functionality
- [ ] Update documentation
- [ ] Remove old files

### Global Cleanup:
- [ ] Keep only truly shared code in `common/`
- [ ] Move cross-cutting concerns to `features/`
- [ ] Move external integrations to `infrastructure/`
- [ ] Update tsconfig paths
- [ ] Run linter
- [ ] Run tests
- [ ] Update README.md

## 🚀 Execution Order

1. **Holidays Module** (currently viewing - good example)
2. **Contacts Module** (simple, good practice)
3. **Schools Module** (medium complexity)
4. **Auth Feature** (cross-cutting)
5. **Schedule Module**
6. **All Other Modules**
7. **Final Cleanup**

## 📚 References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/routing)
- [Clean Architecture in React](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Modular Architecture Patterns](https://www.patterns.dev/posts/module-pattern)

---

**Last Updated**: October 13, 2025
**Status**: In Progress 🔄

