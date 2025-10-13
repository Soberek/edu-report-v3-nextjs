# Contacts Module

Contact management system with CRUD operations and search functionality.

## 📁 Feature-Based Structure

```
contacts/
├── components/          # UI components
│   ├── edit-dialog.tsx # Edit contact dialog
│   ├── form.tsx        # Contact form
│   ├── list.tsx        # Contacts list
│   ├── search.tsx      # Search functionality
│   └── stats.tsx       # Contact statistics
│
├── hooks/              # React hooks
│   ├── useContact.tsx  # Main contact hook
│   └── index.ts        # Barrel exports
│
└── page.tsx            # Main page component
```

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

