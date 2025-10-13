# Architecture Overview

## 🏗️ Feature-Based Architecture

This project follows a **feature-based architecture** where each feature module contains all its related code, making the codebase modular, maintainable, and scalable.

## 📐 Core Principles

### 1. Feature Isolation
Each feature is self-contained with its own:
- Components
- Hooks
- Services (if needed)
- Utils
- Types
- Constants

### 2. Shared Code Separation
Truly shared, generic code lives in `src/common/`:
- Only code used by 3+ features
- Generic, reusable utilities
- Base UI components

### 3. Clear Dependencies
- Features depend on `@common` (shared code)
- Features should NOT depend on each other
- Cross-feature communication via shared state/services

## 📁 Directory Structure

```
src/
├── common/                 # Shared/generic code only
│   ├── components/
│   │   ├── ui/            # Base UI primitives
│   │   ├── shared/        # Reusable components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Generic React hooks
│   ├── utils/             # Generic utilities
│   └── types/             # Global types
│
├── components/
│   └── auth/              # Auth as cross-cutting feature
│
├── app/
│   ├── (protected)/       # Protected routes
│   │   ├── holidays/      # ✅ Feature module (reference)
│   │   ├── contacts/      # ✅ Feature module
│   │   ├── schools/       # ✅ Feature module
│   │   ├── todo/          # ✅ Feature module
│   │   └── [others]/      # Other feature modules
│   │
│   ├── api/               # API routes
│   └── ...
│
├── providers/             # Global context providers
├── services/              # Shared services
└── utils/                 # Shared utilities
```

## 🎯 Feature Module Template

Every feature module should follow this structure:

```
feature-name/
├── components/          # UI components
│   ├── FeatureList.tsx
│   ├── FeatureForm.tsx
│   ├── FeatureDialog.tsx
│   └── index.ts        # Barrel exports
│
├── hooks/              # React hooks
│   ├── useFeature.ts   # Main hook
│   ├── useFeatureLogic.ts
│   └── index.ts
│
├── services/           # Business logic (optional)
│   ├── featureService.ts
│   └── index.ts
│
├── utils/              # Feature utilities (optional)
│   ├── helpers.ts
│   └── index.ts
│
├── types/              # TypeScript types
│   └── index.ts
│
├── schemas/            # Zod schemas (optional)
│   └── feature.schema.ts
│
├── reducers/           # State management (optional)
│   └── featureReducer.ts
│
├── constants/          # Constants (optional)
│   └── index.ts
│
├── config/             # Configuration (optional)
│   └── index.ts
│
├── page.tsx            # Main page component
└── README.md           # Feature documentation
```

## 📊 Module Status

### ✅ Fully Refactored (Reference Implementations)

#### 1. Holidays Module
```
holidays/
├── components/  ✅ 14 components
├── hooks/       ✅ 2 hooks
├── services/    ✅ 3 services (moved from global)
├── utils/       ✅ 4 utilities
├── types/       ✅ Type definitions
└── README.md    ✅ Documentation
```
**Status**: Complete feature-based structure
**Pattern**: Services + Utils + Hooks + Components

#### 2. Contacts Module
```
contacts/
├── components/  ✅ 5 components
├── hooks/       ✅ 1 hook (useContact)
└── README.md    ✅ Documentation
```
**Status**: Well-structured
**Pattern**: Hooks + Components

#### 3. Schools Module
```
schools/
├── components/  ✅ 4 components
├── hooks/       ✅ 4 hooks
├── reducers/    ✅ State management
├── schemas/     ✅ Validation
├── types/       ✅ Type definitions
└── README.md    ✅ Documentation
```
**Status**: Excellent structure
**Pattern**: Reducers + Schemas + Hooks + Components

#### 4. TODO Module
```
todo/
├── components/  ✅ 7 components (multi-view)
├── hooks/       ✅ 2 hooks
├── reducers/    ✅ State management
├── types/       ✅ Type definitions
└── README.md    ✅ Documentation
```
**Status**: Well-structured with multiple views
**Pattern**: Reducers + Hooks + Components

### ✅ Good Structure (Already Feature-Based)

- **login/** - Complete auth module
- **register/** - Complete auth module
- **spisy-spraw/** - Clean architecture with schemas
- **zadania-edukacyjne/** - Well-organized
- **szkoly-w-programie/** - Feature-complete
- **offline-miernik-budzetowy/** - Comprehensive structure
- **programy-edukacyjne/** - Has hooks
- **schedule/** - Has hooks
- **wygeneruj-izrz/** - Good organization

### 🟡 Needs Minor Updates

- **czerniak/** - Has good structure, could add README
- **grypa-i-przeziebienia/** - Has structure, needs documentation
- **sprawozdanie-z-tytoniu/** - Functional, could enhance

## 🔗 Import Path Conventions

### ✅ Correct Import Patterns

```typescript
// Importing from common (shared code)
import { LoadingSpinner } from "@common/components/shared";
import { useDebounce } from "@common/hooks/shared";
import { formatDate } from "@common/utils/shared";

// Importing within same feature (relative)
import { HolidaysList } from "../components/HolidaysList";
import { useHolidays } from "../hooks/useHolidays";
import { exportUtils } from "../utils/exportUtils";

// Importing from feature (when necessary)
import { useContact } from "@/app/(protected)/contacts/hooks";
```

### ❌ Avoid These Patterns

```typescript
// ❌ Don't import shared from old location
import { LoadingSpinner } from "@/components/shared";

// ❌ Don't import feature code from another feature
import { HolidaysList } from "@/app/(protected)/holidays/components";
// Instead: move shared code to common or use proper architecture

// ❌ Don't mix absolute and relative randomly
import { Component } from "@/app/(protected)/feature/components";
// Use relative within feature: import { Component } from "../components";
```

## 🎨 Architecture Patterns

### Pattern 1: Simple Feature (Contacts)
```
Components → Hooks → Firebase
```
- Direct hook integration
- Minimal abstraction
- Good for CRUD operations

### Pattern 2: Complex Feature (Holidays)
```
Components → Hooks → Services → Firebase/APIs
```
- Service layer for business logic
- Multiple external integrations
- Good for complex workflows

### Pattern 3: State-Heavy Feature (Schools, TODO)
```
Components → Hooks → Reducer → Firebase
```
- Centralized state management
- Complex state transitions
- Good for multi-view features

### Pattern 4: Clean Architecture (Spisy-Spraw)
```
Components → Hooks → Services → Utils/Schemas
```
- Full separation of concerns
- Service layer with DI
- Zod validation
- Good for enterprise features

## 🔄 Data Flow Patterns

### Basic CRUD Flow
```
User Action (UI)
    ↓
Component Event Handler
    ↓
Hook Method (useState/useReducer)
    ↓
Firebase/API Call
    ↓
State Update
    ↓
Component Re-render
```

### Service Layer Flow
```
User Action (UI)
    ↓
Component Event Handler
    ↓
Hook Method
    ↓
Service Method (Business Logic)
    ↓
Validation (Zod Schema)
    ↓
Firebase/API Call
    ↓
State Update
    ↓
Component Re-render
```

### Reducer Pattern Flow
```
User Action (UI)
    ↓
Component Event Handler
    ↓
Dispatch Action
    ↓
Reducer (State Update)
    ↓
Side Effect (Firebase)
    ↓
Component Re-render
```

## 📦 Dependencies

### Feature Dependencies (✅ Allowed)
- Feature → Common (always allowed)
- Feature → Global Services (when necessary)
- Feature → Firebase/External APIs

### Feature Dependencies (❌ Avoid)
- Feature → Another Feature (creates coupling)
- Feature → Old Global Locations (outdated paths)

### Common Dependencies (✅ Expected)
- Generic utilities only
- No feature-specific code
- No business logic

## 🚀 Adding New Features

### Step 1: Create Structure
```bash
mkdir -p src/app/(protected)/new-feature/{components,hooks,types}
touch src/app/(protected)/new-feature/{page.tsx,README.md}
```

### Step 2: Follow Template
Use holidays module as reference for complex features
Use contacts module as reference for simple features

### Step 3: Import Patterns
- Use `@common/*` for shared code
- Use relative imports within feature
- Avoid cross-feature imports

### Step 4: Document
Create README.md with:
- Feature description
- Architecture pattern used
- Dependencies
- Usage examples

## 🎯 Benefits Achieved

### 1. Modularity
- ✅ Each feature is self-contained
- ✅ Easy to understand in isolation
- ✅ Can be developed independently

### 2. Maintainability
- ✅ Clear code location
- ✅ Related code is together
- ✅ Easy to find and fix bugs

### 3. Scalability
- ✅ Add features without affecting others
- ✅ Multiple teams can work in parallel
- ✅ Easy to extract to microservices

### 4. Testability
- ✅ Test features in isolation
- ✅ Mock dependencies easily
- ✅ Unit and integration tests per feature

## 📚 Documentation

### For Each Feature
- `README.md` - Feature overview and usage
- Type definitions with JSDoc
- Inline comments for complex logic

### Project-Level
- `ARCHITECTURE.md` (this file) - Overall architecture
- `REFACTORING_STRATEGY.md` - Refactoring approach
- `MIGRATION_GUIDE.md` - How to update imports
- `REFACTORING_COMPLETE.md` - What was done

## 🔍 Code Review Checklist

When adding/modifying features:

- [ ] Feature follows template structure
- [ ] Imports use correct paths (`@common/*` or relative)
- [ ] No cross-feature dependencies
- [ ] README.md exists and is up to date
- [ ] Types are properly defined
- [ ] Components are properly organized
- [ ] Hooks follow naming convention (use*)
- [ ] No code in wrong location

## 💡 Best Practices

### Do's ✅
- Keep features self-contained
- Use common for truly shared code
- Document your feature
- Follow established patterns
- Use TypeScript strictly
- Write meaningful component names

### Don'ts ❌
- Import from other features
- Put feature code in common
- Skip documentation
- Mix patterns unnecessarily
- Use `any` type
- Create god components

---

**Architecture Status**: ✅ Feature-Based (Implemented)  
**Last Updated**: October 13, 2025  
**Maturity**: Production-Ready

