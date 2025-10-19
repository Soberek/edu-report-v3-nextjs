# Contacts Module

Contact management system with CRUD operations and search functionality.

## 📁 Feature-Based Structure

# Contacts Feature Module

Complete contact management system with CRUD operations, validation, and search functionality.

## 📁 Structure

```
contacts/
├── components/
│   ├── contact-avatar.tsx      # Deterministic avatar with initials
│   ├── contact-card.tsx        # Reusable contact card for list/search
│   ├── edit-dialog.tsx         # Modal for editing contacts
│   ├── form.tsx                # Form for creating new contacts
│   ├── list.tsx                # List view (table or card) with edit/delete
│   ├── search.tsx              # Search and filter contacts
│   └── stats.tsx               # Statistics dashboard
│
├── hooks/
│   ├── useContact.tsx          # Main hook with useReducer state management
│   └── index.ts                # Exports
│
├── types/
│   └── index.ts                # Types, schemas, and interfaces
│
└── index.ts                    # Barrel exports
```

## 🎯 Architecture & Best Practices

### State Management (`useContact.tsx`)

Uses **`useReducer`** with **`useFirebaseData`** for:
- Centralized state management with clear action types
- Synchronized Firebase data with local state
- Type-safe reducers with discriminated unions
- Proper error handling and validation

```typescript
const { data, loading, error, createContact, updateContact, deleteContact } = useContacts();
```

### Type Safety (`types/index.ts`)

- **Zod schemas** for validation (ContactSchema, ContactCreateSchema)
- **Type inference** from schemas (`Contact`, `ContactCreateDTO`)
- **Discriminated unions** for state actions
- **Explicit component props interfaces**

### Component Composition

#### Reusable Components
- **`ContactAvatar`**: Deterministic color assignment based on name
- **`ContactCard`**: Renders contact info with actions (used in list and search)

#### Container Components
- **`ContactForm`**: Uses shared `FormField` component
- **`ContactList`**: Supports table and card views
- **`ContactSearch`**: Filters and displays contacts
- **`EditDialog`**: Modal for editing with validation

### Shared Components Usage

Uses `FormField` from `@/components/shared` for:
- Consistent form styling and validation
- Polish localization helpers
- Reduced code duplication

## 📋 Usage Examples

### Hook Usage

```typescript
import { useContacts, type Contact } from '@/features/contacts';

function ContactsPage() {
  const {
    data: contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refetch
  } = useContacts();

  // All operations are async and handle validation + notifications
  const handleCreate = async (data: ContactFormData) => {
    const contact = await createContact(data);
    if (contact) {
      // Success! Notifications handled by hook
    }
  };

  const handleUpdate = async (id: string, data: ContactFormData) => {
    const success = await updateContact(id, data);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteContact(id);
  };

  return (
    <>
      <ContactForm onAddContact={handleCreate} loading={loading} />
      <ContactList
        contacts={contacts}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </>
  );
}
```

### Component Usage

```typescript
import {
  ContactList,
  ContactForm,
  ContactSearch,
  ContactStats,
  useContacts
} from '@/features/contacts';

// In your page or container component
const { data, loading, error } = useContacts();

// Render components with data
<ContactStats contacts={data} loading={loading} />
<ContactList contacts={data} loading={loading} error={error} ... />
<ContactSearch contacts={data} onEdit={...} onDelete={...} />
```

## 🔄 Data Flow

```
Page Component
    ↓
useContacts() hook
    ↓
useReducer + dispatch
    ↓
useFirebaseData (Firebase operations)
    ↓
Reducer updates local state
    ↓
Components re-render with new state
```

## ✅ Validation

All contact data is validated using Zod schemas:

```typescript
ContactCreateSchema = {
  firstName: string (min 1)
  lastName: string (min 1)
  email: string (email format, optional)
  phone: string (optional)
}
```

Validation happens:
1. In the form (via `FormField` component)
2. In the hook before Firebase operations
3. Errors displayed via notification system

## 🎨 UI Features

### Contact Avatar (`ContactAvatar`)
- Deterministic color based on first letter
- Prevents re-rendering of avatars for same contact
- Supports 3 sizes: small, medium, large

### Contact Card (`ContactCard`)
- Reusable across list and search views
- Shows name, email, phone, creation date
- Action buttons for edit/delete
- Smooth animations and transitions

### Views
- **Table View**: Compact, sortable contacts
- **Card View**: Rich, visual contact cards
- **Search View**: Filtered contact results

## 🧪 Testing Considerations

Each component is designed to be testable:
- Pure functions for utils (avatar color, initials)
- Callbacks passed as props (not directly called)
- Async operations return values for verification
- Loading/error states explicitly handled

## 🔗 Dependencies

### Internal
- `@/hooks/useUser` - User authentication
- `@/hooks/useFirebaseData` - Firebase data management
- `@/hooks/useNotification` - User notifications
- `@/components/shared/FormField` - Shared form component

### External
- **Firebase** - Data persistence
- **Zod** - Schema validation
- **React Hook Form** - Form state management
- **Material-UI** - UI components

## 📦 Exports

```typescript
// Hooks
export { useContacts } from './hooks';
export type { UseContactsReturn } from './types';

// Components
export { default as ContactList } from './components/list';
export { default as ContactForm } from './components/form';
export { default as ContactStats } from './components/stats';
export { default as ContactSearch } from './components/search';
export { default as ContactEditDialog } from './components/edit-dialog';

// Types
export * from './types';
```

## 🚀 Development Guidelines

### Adding New Features
1. Start with types in `types/index.ts`
2. Update reducer if needed in `useContact.tsx`
3. Create/update components
4. Update page component usage
5. Test all flows

### Code Standards
- Keep functions under 50 lines
- Use TypeScript strict mode
- Add JSDoc for public APIs
- Use shared components instead of duplicating
- Handle errors explicitly
- Show loading states

## 🔍 Performance

- **Memoization**: useMemo for filtered contacts in search
- **Callbacks**: useCallback for memoized action handlers
- **Lazy Rendering**: Fade animations for tab transitions
- **Reducer**: Efficient state updates without re-rendering all contacts

---

**Status**: ✅ Production-ready with best practices
**Last Updated**: 2025
**Pattern**: Feature-based architecture with useReducer state management

## 🏗️ Architecture

This module follows the **feature-based architecture** pattern:

### Hooks Layer
- **`useContact`**: Main hook managing contacts state and operations
  - Integrates with Firebase for data persistence
  - Provides CRUD operations
  - Handles search and filtering

### Components Layer
- **UI Components**: Presentation components for contacts
- **Smart Components**: Container components using hooks

## ✨ Features

1. **Contact Management**: Full CRUD operations
2. **Search**: Real-time contact search
3. **Statistics**: Contact metrics and analytics
4. **Form Validation**: Zod schema validation

## 📝 Usage Example

```typescript
import { useContact } from "./hooks";

function ContactsPage() {
  const {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact
  } = useContact();

  // Use the hook data and methods
}
```

## 🔗 Dependencies

### Internal
- `@/hooks/useUser` - User context
- `@/hooks/useFirebaseData` - Firebase integration
- `@common/components/shared` - Shared UI components

### External
- Firebase - Data persistence
- Zod - Schema validation
- Material-UI - UI components

## 🚀 Future Improvements

- [ ] Add services directory for business logic
- [ ] Implement contact groups/categories
- [ ] Add export/import functionality
- [ ] Enhance search with filters

---

**Status**: ✅ Well-structured
**Pattern**: Feature-based architecture

