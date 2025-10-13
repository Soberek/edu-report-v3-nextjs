# Features Directory

This directory contains all feature modules following a **feature-driven architecture** pattern for maximum scalability and maintainability.

## 📁 Structure

Each feature is self-contained with its own:
- **components/** - Feature-specific UI components
- **hooks/** - Feature-specific React hooks
- **services/** - API calls and business logic
- **types/** - TypeScript types and interfaces
- **utils/** - Helper functions
- **constants/** - Feature constants
- **reducers/** - State management (where applicable)
- **index.ts** - Public API (barrel export)

## 🎯 Available Features

### Core Features

#### **auth/** 
Authentication and authorization
- Components: AuthForm, AuthLayout
- Hooks: useAuthForm, useAuthRedirect
- Utils: Password validation, auth helpers
- **Import:** `import { useAuth, AuthForm } from '@/features/auth'`

#### **contacts/**
Contact management system
- Components: ContactList, ContactForm, ContactStats
- Hooks: useContacts
- **Import:** `import { ContactList, useContacts } from '@/features/contacts'`

#### **holidays/**
Holiday scraping and social media post generation
- Components: HolidaysList, GeneratedPostsWithGraphics
- Hooks: useHolidays, useHolidayGraphics
- Services: Post generation, image upload
- **Import:** `import { useHolidays, HolidaysList } from '@/features/holidays'`

#### **todo/**
Task management system
- Components: TodoKanban, TodoCalendar, TodoItem
- Hooks: useTodoApp
- **Import:** `import { TodoKanban, useTodoApp } from '@/features/todo'`

### Domain Features

#### **czerniak/**
Melanoma education module

#### **grypa-i-przeziebienia/**
Flu and cold education module

#### **offline-miernik-budzetowy/**
Budget meter (offline mode)

#### **programy-edukacyjne/**
Educational programs management
- Components: ProgramTable, ProgramForm
- Hooks: useProgramsState, useProgramFilters
- **Import:** `import { ProgramTable, useProgramsState } from '@/features/programy-edukacyjne'`

#### **schedule/**
Educational task scheduling
- Components: TaskForm, StatisticsCards
- Hooks: useScheduleFilters
- Utils: Schedule utilities
- **Import:** `import { TaskForm, useScheduleFilters } from '@/features/schedule'`

#### **schools/**
School management system
- Components: SchoolTable, SchoolForm, SchoolFilter
- Hooks: useSchoolState, useSchoolFilters
- **Import:** `import { SchoolTable, useSchoolState } from '@/features/schools'`

#### **spisy-spraw/**
Case records management
- Components: ActCaseRecordsTable, FilterSection
- Hooks: useSpisySpraw
- Reducers: spisySprawReducer
- **Import:** `import { ActCaseRecordsTable, useSpisySpraw } from '@/features/spisy-spraw'`

#### **sprawozdanie-z-tytoniu/**
Tobacco reporting module

#### **szkoly-w-programie/**
Schools in program management
- Components: ParticipationView, NonParticipationView
- Hooks: useSzkolyWProgramie
- **Import:** `import { ParticipationView, useSzkolyWProgramie } from '@/features/szkoly-w-programie'`

#### **wygeneruj-izrz/**
IZRZ document generation

#### **zadania-edukacyjne/**
Educational tasks management
- Components: EducationalTaskForm, TaskGroups
- Hooks: useEducationalTasksPage
- Constants: Form constants, validation rules
- **Import:** `import { EducationalTaskForm, useEducationalTasksPage } from '@/features/zadania-edukacyjne'`

## 🔨 Usage Guidelines

### ✅ DO

**Import from feature barrel exports:**
```typescript
// ✅ Good - use barrel exports
import { ContactList, ContactForm, useContacts } from '@/features/contacts';
import { HolidaysList, useHolidays } from '@/features/holidays';
```

**Keep feature code self-contained:**
```typescript
// ✅ Good - feature has its own utilities
// features/contacts/utils/contactUtils.ts
export const formatContactName = (contact: Contact) => { ... };
```

**Use shared components from /components:**
```typescript
// ✅ Good - use shared UI components
import { PageHeader, LoadingSpinner } from '@/components/shared';
import { BottomNavbar } from '@/components/ui';
```

### ❌ DON'T

**Don't import directly from feature internals:**
```typescript
// ❌ Bad - don't bypass barrel exports
import { ContactList } from '@/features/contacts/components/ContactList';

// ✅ Good - use barrel export
import { ContactList } from '@/features/contacts';
```

**Don't create cross-feature dependencies:**
```typescript
// ❌ Bad - feature coupling
import { useContacts } from '@/features/contacts';
import { useHolidays } from '@/features/holidays';

// If you need data from multiple features, 
// consider creating a shared hook or lifting state up
```

**Don't put generic code in features:**
```typescript
// ❌ Bad - generic utility in feature
// features/contacts/utils/dateUtils.ts
export const formatDate = (date: Date) => { ... };

// ✅ Good - generic utility in /utils
// utils/dateUtils.ts
export const formatDate = (date: Date) => { ... };
```

## 📝 Creating a New Feature

### 1. Create Feature Structure
```bash
mkdir -p src/features/my-feature/{components,hooks,services,types,utils}
```

### 2. Create Barrel Export (index.ts)
```typescript
// src/features/my-feature/index.ts
/**
 * My Feature Module
 * 
 * Description of what this feature does
 */

export * from './components';
export * from './hooks';
export * from './services';
export * from './types';
export * from './utils';
```

### 3. Create Component Index
```typescript
// src/features/my-feature/components/index.ts
export { MyComponent } from './MyComponent';
export { MyOtherComponent } from './MyOtherComponent';
```

### 4. Update Page to Use Feature
```typescript
// app/(protected)/my-feature/page.tsx
"use client";
import { MyComponent, useMyFeature } from '@/features/my-feature';

export default function MyFeaturePage() {
  const { data } = useMyFeature();
  return <MyComponent data={data} />;
}
```

## 🔄 Migration from Old Structure

### Before (Route-based)
```
app/
└── (protected)/
    └── contacts/
        ├── components/
        ├── hooks/
        └── page.tsx
```

### After (Feature-based)
```
features/
└── contacts/
    ├── components/
    ├── hooks/
    ├── types/
    ├── services/
    └── index.ts

app/
└── (protected)/
    └── contacts/
        └── page.tsx  # Only routing, imports from @/features/contacts
```

## 📊 Benefits

1. **Scalability** - Easy to add new features without affecting others
2. **Maintainability** - Clear boundaries and responsibilities
3. **Reusability** - Features can be extracted or reused
4. **Testing** - Easier to test isolated features
5. **Collaboration** - Multiple developers can work on different features
6. **Code Organization** - Logical grouping by functionality

## 🔗 Related Documentation

- [Architecture Overview](/ARCHITECTURE.md)
- [Shared Components](/src/components/README.md)
- [TypeScript Guidelines](/MIGRATION_GUIDE.md)

---

**Remember**: Features should be as independent as possible. Use shared utilities from `/src/components`, `/src/hooks`, and `/src/utils` for cross-cutting concerns.
