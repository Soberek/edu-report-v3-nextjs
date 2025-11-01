# Szkoły w Programie – School Program Management Module

A production-ready module for managing school participation in educational programs. Built with modern React patterns, TypeScript strict mode, and SOLID principles for maintainability and scalability.

## 🎯 Overview

This module provides:

- **School Program Management**: Create, read, update, delete school participation records
- **Advanced Data Table**: Sorting, filtering, searching, pagination
- **Type-Safe Forms**: React Hook Form + Zod validation with 100% TypeScript coverage
- **Real-time Sync**: Firebase integration for live data synchronization
- **API Layer**: TanStack Query (React Query) for data fetching and caching
- **Performance Optimized**: Memoization, lazy loading, debouncing
- **Fully Tested**: Pure functions, dependency injection, mockable architecture

## 🏗️ Architecture

### Layered Design (Clean Architecture)

```
UI Components (React)
        ↓
Forms & Validation (React Hook Form + Zod)
        ↓
Data Layer (TanStack Query)
        ↓
Business Logic (Pure Utility Functions)
        ↓
External Services (Firebase, APIs)
```

### Directory Structure

```
src/features/szkoly-w-programie/
├── api/                        # TanStack Query & data fetching
│   ├── keys.ts                # Query key factory
│   ├── queries.ts             # useQuery hooks
│   ├── mutations.ts           # useMutation hooks
│   └── index.ts               # Public API
├── components/                # React components (all < 150 LOC)
│   ├── ParticipationForm.tsx            # Add form orchestrator
│   ├── FormSection.tsx                  # Reusable form container
│   ├── FormSubmitButton.tsx             # Reusable submit button
│   ├── ParticipationFormFields.tsx      # Form fields (shared between add/edit)
│   ├── table.tsx                        # Main data table
│   ├── EditParticipationForm.tsx        # Edit form
│   ├── TableConfig.tsx                  # Table column configuration
│   ├── TableDialogs.tsx                 # Add/Edit dialogs
│   ├── ParticipationView.tsx            # Display view
│   ├── NonParticipationView.tsx         # Non-participating schools view
│   ├── ProgramStatistics.tsx            # Statistics display
│   └── index.ts                         # Component exports
├── hooks/                     # Custom React hooks
│   ├── useParticipationForm.ts          # Form state & validation
│   ├── useFilterState.ts                # Filter state (useReducer pattern)
│   ├── useTableState.ts                 # Table UI state
│   ├── useEmailMenuLogic.ts             # Email aggregation
│   ├── useParticipationNotifications.ts # Toast/notification management
│   └── index.ts                         # Hook exports with JSDoc
├── schemas/                   # Zod validation schemas
│   ├── participation.schema.ts          # Main data schema
│   └── index.ts                         # Schema exports
├── types/                     # TypeScript types
│   ├── szkoly-w-programie.types.ts      # Feature-specific types
│   ├── shared.ts                        # Shared component types
│   └── index.ts                         # Type exports
├── utils/                     # Pure utility functions
│   ├── optionFactories.ts               # Data → select options transformers
│   ├── szkoly-w-programie.utils.ts      # Business logic (filtering, stats, search)
│   ├── validation.utils.ts              # Validation helpers
│   └── index.ts                         # Utility exports
├── constants/                 # Feature constants
│   ├── index.ts                         # UI, styling, validation constants
│   └── filterDefaults.ts                # Filter defaults
├── context/                   # React Context (if needed)
├── page.tsx                   # Next.js page component
└── README.md                  # This documentation
```

## 🚀 Quick Start

### Using the Main Component

```tsx
import { SchoolProgramParticipationPage } from '@/features/szkoly-w-programie';

export default function EducationPage() {
  return <SchoolProgramParticipationPage />;
}
```

### Using Individual Hooks

```tsx
import { useParticipationForm } from '@/features/szkoly-w-programie/hooks';
import { useParticipations, useCreateParticipation } from '@/features/szkoly-w-programie/api';

export function MyComponent() {
  // Fetch data
  const { data: participations, isLoading } = useParticipations();
  
  // Handle mutations
  const createMutation = useCreateParticipation();
  
  // Manage form
  const form = useParticipationForm({
    onSubmit: async (data) => {
      await createMutation.mutateAsync(data);
    },
  });

  return <form onSubmit={form.handleSubmit(form.handleFormSubmit)}>{/* ... */}</form>;
}
```

## 📊 Data Flow

### Reading Data (Queries)

```
useParticipations()
  ↓
TanStack Query (caching)
  ↓
fetchParticipations()
  ↓
API (/api/participations)
  ↓
Zod validation (participationSchema)
  ↓
Type-safe data in component
```

### Writing Data (Mutations)

```
Form Submit
  ↓
React Hook Form + Zod validation
  ↓
useCreateParticipation().mutate()
  ↓
API call (POST /api/participations)
  ↓
Automatic query invalidation
  ↓
UI updates with new data
```

## 🧩 Key Components

### `ParticipationForm` – Add New Participation

```tsx
<ParticipationForm
  schools={schools}
  contacts={contacts}
  programs={programs}
  loading={isLoading}
  onSubmit={handleSubmit}
  formMethods={useForm(...)}
/>
```

**Single Responsibility**: Orchestrates form submission and layout only. Delegates field rendering to `ParticipationFormFields`.

### `FormSection` & `FormSubmitButton` – Reusable Layout Components

```tsx
<FormSection title="Add Participation">
  {/* Form content */}
  <FormSubmitButton loading={loading} isDirty={isDirty} />
</FormSection>
```

**DRY Pattern**: Eliminates inline styling duplication across forms.

### `useParticipationForm` – Form State Management

```tsx
const form = useParticipationForm({
  onSubmit: async (data) => { /* ... */ },
  initialData: participation, // Optional: for edit forms
});
```

**Features**:
- Zod schema validation
- Automatic data normalization
- Memoized validation state
- Error handling

### `useFilterState` – Filter Management (useReducer Pattern)

Replaces 6 `useState` calls with a single reducer:

```tsx
const { filters, setSchoolYear, setProgram, resetFilters } = useFilterState();

// Type-safe, memoized dispatcher functions prevent context re-renders
```

## 🔍 API Layer (TanStack Query)

### Queries

```typescript
// Fetch all participations
const { data, isLoading, error } = useParticipations();

// Fetch filtered participations
const { data } = useFilteredParticipations({ year: '2024/2025', program: 'P1' });

// Fetch single participation
const { data } = useParticipation(participationId);
```

### Mutations

```typescript
// Create
const create = useCreateParticipation();
await create.mutateAsync(newData);

// Update
const update = useUpdateParticipation();
await update.mutateAsync({ id, data: updatedData });

// Delete
const delete_ = useDeleteParticipation();
await delete_.mutateAsync(participationId);
```

**Benefits**:
- Automatic caching and deduplication
- Background refetching
- Optimistic updates
- Built-in error handling
- Query key factory ensures consistency

## 🛡️ Type Safety

### Zod Schemas (Single Source of Truth)

```typescript
// Defined once, used everywhere
export const participationSchema = z.object({
  id: z.string().min(1),
  schoolId: z.string().min(1),
  // ...
});

// Infer TypeScript types automatically
export type Participation = z.infer<typeof participationSchema>;
```

**Validation Points**:
- API responses: `participationSchema.parse(data)`
- Form submission: Automatic via React Hook Form + Zod
- Environment variables: Validated at app start

### Discriminated Unions (for variant types)

```typescript
type FilterAction =
  | { type: 'SET_SCHOOL_YEAR'; payload: string }
  | { type: 'SET_PROGRAM'; payload: string }
  // ... Type-safe reducer actions
```

## 🎨 Component Guidelines

### Size Constraints (SRP)

- **Components**: < 150 lines of code
- **Functions**: < 20 lines of code
- **Files**: < 300 lines of code

### Example: ParticipationForm Refactoring

**Before** (153 lines):
```tsx
// Inline CustomFormSection + ParticipationFormSubmitButton inside component
```

**After**:
- `ParticipationForm.tsx` (67 lines) – Orchestration only
- `FormSection.tsx` (52 lines) – Reusable layout container
- `FormSubmitButton.tsx` (45 lines) – Reusable button component

### Performance Patterns

```tsx
// Memoize expensive computations
const schoolOptions = useMemo(() => createSchoolOptions(schools), [schools]);

// Memoize callbacks to prevent child re-renders
const handleSubmit = useCallback(async (data) => { /* ... */ }, [dependencies]);

// Use React.memo for pure components
export const FormSection = React.memo(({ title, children }) => {
  // Won't re-render if props haven't changed
});
```

## 📝 Utility Functions (Pure & Testable)

### Option Factories

```typescript
// Pure functions returning new arrays – no side effects
createSchoolOptions(schools);      // → { label, value }[]
createContactOptions(contacts);    // → { label, value }[]
createProgramOptions(programs);    // → { label, value }[]
createSchoolYearOptions(years);    // → { label, value }[]
```

### Business Logic (Highly Testable)

```typescript
// All pure functions – deterministic, no side effects
createSchoolParticipationsMap(participations);
calculateSchoolParticipationInfo(schools, programs, map);
calculateProgramStats(schools, programs, map);
getAvailableSchoolYears(participations);
searchParticipations(data, maps, query);
```

### Validation Helpers

```typescript
isValidEmail(email);           // Type guard: email is string
isValidStudentCount(count);    // Type guard: count is number
isValidId(id);                 // Type guard: id is string
```

## ✅ Testing Strategy

### Unit Tests (Pure Functions)

```typescript
describe('calculateProgramStats', () => {
  it('calculates correct participation stats', () => {
    const stats = calculateProgramStats(schools, programs, map);
    expect(stats['Math'].participating).toBe(5);
  });
});
```

### Component Tests (React Testing Library)

```typescript
describe('ParticipationForm', () => {
  it('submits form with valid data', async () => {
    render(<ParticipationForm {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(props.onSubmit).toHaveBeenCalled();
  });
});
```

### Integration Tests (Form + Validation + API)

```typescript
it('validates and submits participation', async () => {
  // Form renders
  // User fills in data
  // Submit button clicked
  // Zod validation passes
  // API called
  // Query invalidated
  // UI updates
});
```

## 🔒 Error Handling

### Explicit Error Handling (No Silent Failures)

```typescript
try {
  const data = participationSchema.parse(apiResponse);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation error
    console.error('Validation failed:', error.issues);
  } else {
    // Handle other errors
    showError('Failed to load participations');
  }
}
```

### Loading States

```tsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorAlert message={error.message} />;
return <DataTable data={data} />;
```

## 📐 SOLID Principles Applied

### Single Responsibility Principle (SRP)
- `FormSection` – Only layout
- `FormSubmitButton` – Only submit button styling
- `ParticipationForm` – Only form orchestration
- Pure utility functions – One thing each

### Open/Closed Principle (OCP)
- Extensible via composition, not modification
- `FormSection` reusable by any form component
- `createSchoolOptions` works with new school types without changes

### Liskov Substitution Principle (LSP)
- All components follow standard React patterns
- Hooks implement consistent return types
- Types are properly substitutable

### Interface Segregation Principle (ISP)
- Small, focused interfaces (< 5 properties)
- No "god types" with unused properties
- Components accept only what they need

### Dependency Inversion Principle (DIP)
- Depend on abstractions (types), not concretions
- Inject dependencies (onSubmit, formMethods, etc.)
- Pure functions with no hidden dependencies

## 🔄 Common Workflows

### Adding a New Participation

```
User fills form
  → React Hook Form capture
  → Zod validation
  → Submit button click
  → useCreateParticipation().mutate()
  → POST /api/participations
  → Query invalidation
  → UI re-fetches data
  → Success notification
```

### Editing a Participation

```
User clicks Edit button
  → Dialog opens with existing data
  → useParticipationForm initializes with data
  → User modifies fields
  → Submit
  → useUpdateParticipation().mutate()
  → PUT /api/participations/{id}
  → Detail query invalidated
  → List query invalidated
  → UI updates
```

### Filtering Participations

```
User selects filter
  → setSchoolYear() / setProgram() / setSearch()
  → useFilterState reducer dispatches
  → Filter state updates
  → Re-render with new filters
  → Table shows filtered data
```

## 🚨 Common Pitfalls to Avoid

### ❌ Don't

```tsx
// ❌ Tight coupling
const participation = new Participation(data);

// ❌ Silent failures
if (schools) return <div>Schools</div>; // What if schools is null?

// ❌ Large functions (>20 lines)
function handleEverything() { /* 50 lines */ }

// ❌ Magic numbers
if (count > 10000) { /* ... */ }

// ❌ Untyped
const handleSubmit = (data) => { /* ... */ }; // What is data?

// ❌ Mutable shared state
const globalFilters = { year: '2024' }; // Will cause bugs
```

### ✅ Do

```tsx
// ✅ Dependency injection
const form = useParticipationForm({ onSubmit });

// ✅ Explicit error handling
if (!schools) return <ErrorAlert />;

// ✅ Small functions
const handleSubmit = async (data) => { /* 10 lines */ };

// ✅ Named constants
const STUDENT_COUNT_MAX = 10000;
if (count > STUDENT_COUNT_MAX) { /* ... */ }

// ✅ Strict typing
const handleSubmit = (data: FormData) => { /* ... */ };

// ✅ Immutable state
const newFilters = { ...filters, year: '2024' };
```

## 📦 Dependencies

```json
{
  "react": "^18.0.0",
  "react-hook-form": "^7.0.0",
  "@hookform/resolvers": "^3.0.0",
  "zod": "^3.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@mui/material": "^5.0.0",
  "firebase": "^10.0.0"
}
```

## 🔧 Configuration

All feature-specific constants are in `constants/`:

```typescript
export const FIELD_LABELS = { /* ... */ };
export const BUTTON_LABELS = { /* ... */ };
export const STYLE_CONSTANTS = { /* ... */ };
export const MESSAGES = { /* ... */ };
```

## 🐛 Debugging

Enable debug logging (set in `.env.local`):

```
DEBUG=true
```

## 📚 Further Reading

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Schema Validation](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Material-UI Components](https://mui.com/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

## 📋 Checklist for New Features

- [ ] Define Zod schema in `schemas/`
- [ ] Add API hooks in `api/queries.ts` or `api/mutations.ts`
- [ ] Create component(s) < 150 LOC
- [ ] Write pure utility functions in `utils/`
- [ ] Add unit tests for utilities
- [ ] Add component tests
- [ ] Update types if needed
- [ ] Add JSDoc comments
- [ ] Update this README
- [ ] Code review by team member

---

**Last Updated**: November 2025  
**Version**: 3.0 (Refactored – Clean Code, SOLID, TanStack Query)
**Maintainer**: Development Team
