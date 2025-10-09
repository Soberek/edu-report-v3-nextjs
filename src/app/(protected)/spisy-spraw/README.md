# Spisy Spraw (Case Records) Module

This module manages case records (acts) with a clean architecture following SOLID principles and separation of concerns.

## 📁 Folder Structure

```
spisy-spraw/
├── schemas/           # Data validation and type definitions
│   ├── act.schema.ts  # Zod schemas for Act validation
│   └── index.ts       # Barrel exports
│
├── utils/            # Pure utility functions
│   ├── filters.ts    # Data filtering and sorting
│   ├── error-handler.ts  # Error handling utilities
│   └── index.ts      # Barrel exports
│
├── lib/              # Business logic layer
│   ├── act-service.ts    # ActService with CRUD operations
│   └── index.ts      # Barrel exports
│
├── hooks/            # React hooks
│   ├── useSpisySprawData.ts  # Main hook (useSpisySpraw)
│   └── index.ts      # Barrel exports
│
├── components/       # UI components
│   ├── ActForm.tsx
│   ├── EditActForm.tsx
│   ├── FilterSection.tsx
│   ├── table.tsx
│   └── index.ts
│
├── constants/        # Constants and configuration
│   └── index.ts
│
├── reducers/         # State management
│   └── spisySprawReducer.ts
│
├── types/            # TypeScript type definitions
│   └── index.ts
│
└── page.tsx          # Main page component
```

## 🏗️ Architecture

The module follows clean architecture principles with clear separation of concerns:

### Layer 1: Schemas (`schemas/`)
- **Purpose**: Data validation and type safety
- **Technology**: Zod for runtime validation
- **Exports**: 
  - `ActSchema` - Complete act validation
  - `ActCreateDTO` - Data transfer object for creation
  - `ActUpdateDTO` - Data transfer object for updates

### Layer 2: Utilities (`utils/`)
- **Purpose**: Pure functions for data manipulation
- **Key Functions**:
  - `filterRecordsByCode()` - Filters records with special "966" handling
  - `sortRecordsByDate()` - Sorts by date descending
  - `handleValidationError()` - Centralized error handling
  - `formatErrorMessages()` - Error message formatting

### Layer 3: Business Logic (`lib/`)
- **Purpose**: Business rules and operations
- **Pattern**: Service layer with dependency injection
- **Key Class**: `ActService`
  - Methods: `create()`, `update()`, `delete()`
  - Handles validation, CRUD operations, and refetch

### Layer 4: Hooks (`hooks/`)
- **Purpose**: React-specific logic and state management
- **Main Hook**: `useSpisySpraw`
  - Integrates all layers
  - Provides data, CRUD operations, UI actions
  - Manages local state with useReducer

### Layer 5: Components & Pages
- **Purpose**: UI presentation
- **Pattern**: Container/Presentational pattern
- Page component orchestrates everything using `useSpisySpraw`

## 🔄 Data Flow

```
User Action (UI)
    ↓
Page Component (page.tsx)
    ↓
useSpisySpraw Hook
    ↓
ActService (Business Logic)
    ↓
useFirebaseData (Data Layer)
    ↓
Firebase/Firestore
    ↓
Refetch & Update State
    ↓
Re-render Components
```

## 📝 Usage Example

```typescript
import { useSpisySpraw } from "./hooks";

function SpisySprawPage() {
  const [state, dispatch] = useReducer(spisySprawReducer, initialState);
  const formRef = useRef(null);
  const reset = () => dispatch(actions.reset());

  const {
    sortedCaseRecords,
    actsOptions,
    isLoading,
    addActRecord,
    updateActRecord,
    deleteActRecord,
    editCaseRecord,
    changeCode,
  } = useSpisySpraw({ state, dispatch, formRef, reset });

  // Use the hook data and methods in your components
}
```

## 🎯 Key Features

1. **Type Safety**: Full TypeScript + Zod validation
2. **Clean Architecture**: Clear separation of concerns
3. **Dependency Injection**: Service layer accepts dependencies
4. **Immutable Operations**: Pure functions for data transformations
5. **Automatic Refetch**: Data refreshes after mutations
6. **Smart Filtering**: Special handling for code "966"
7. **Default Sorting**: Newest records first
8. **Error Handling**: Centralized with proper user feedback

## 🔧 Special Behaviors

### Code "966" Filtering
When code "966" is selected, the filter shows all records where `referenceNumber` starts with "OZiPZ.966".

### Default Filter
When no code is selected (empty string), all records are shown.

### Sorting
Records are always sorted by date in descending order (newest first).

## 🧪 Testing Checklist

- [ ] Create new record
- [ ] Update existing record
- [ ] Delete record
- [ ] Filter by code
- [ ] Filter by code "966"
- [ ] Default "all" filter
- [ ] Verify sorting (newest first)
- [ ] Error handling (validation errors)
- [ ] Loading states
- [ ] Refetch after mutations

## 📚 Dependencies

- **React**: Hooks (useMemo, useCallback, useReducer)
- **Zod**: Runtime validation
- **Firebase**: Backend data layer
- **MUI**: UI components (DataGrid, forms, dialogs)
- **Custom Hooks**: useFirebaseData, useUser

## 🚀 Future Improvements

- [ ] Add unit tests for utilities
- [ ] Add integration tests for ActService
- [ ] Implement optimistic updates
- [ ] Add caching layer
- [ ] Implement pagination
- [ ] Add export functionality
