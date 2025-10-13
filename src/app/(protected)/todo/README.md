# TODO Module

Task management system with multiple views (list, calendar, kanban) and full CRUD functionality.

## 📁 Feature-Based Structure

```
todo/
├── components/          # UI components
│   ├── TodoCalendar.tsx    # Calendar view
│   ├── TodoControls.tsx    # Action controls
│   ├── TodoEditDialog.tsx  # Edit dialog
│   ├── TodoForm.tsx        # Todo form
│   ├── TodoItem.tsx        # Todo item card
│   ├── TodoKanban.tsx      # Kanban board view
│   └── index.ts            # Barrel exports
│
├── hooks/              # React hooks
│   ├── useTodoApp.ts   # Main app logic
│   ├── useTodoUtils.ts # Utility functions
│   └── index.ts        # Barrel exports (implicit)
│
├── reducers/           # State management
│   └── todoReducer.ts  # Todo state reducer
│
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
│
├── index.ts            # Module barrel export
└── page.tsx            # Main page component
```

## 🏗️ Architecture

This module follows the **feature-based architecture** with multiple view options:

### Hooks Layer
- **`useTodoApp`**: Main application logic
  - State management with useReducer
  - CRUD operations
  - View switching
  - Filter and search

- **`useTodoUtils`**: Utility functions
  - Date formatting
  - Status helpers
  - Priority sorting

### Reducers Layer
- **`todoReducer`**: Centralized state management
  - Add/Update/Delete actions
  - Filter actions
  - View mode switching
  - Loading states

### Components Layer
- **View Components**: Calendar, Kanban, List views
- **Form Components**: TodoForm, TodoEditDialog
- **Item Components**: TodoItem display
- **Control Components**: TodoControls for actions

### Types Layer
- **Todo interface**: Core todo type
- **TodoState**: Reducer state type
- **TodoAction**: Action types

## ✨ Features

1. **Multiple Views**:
   - 📋 List view (default)
   - 📅 Calendar view
   - 📊 Kanban board

2. **Task Management**:
   - Create, edit, delete tasks
   - Set priority levels
   - Due date management
   - Status tracking

3. **Organization**:
   - Filter by status
   - Search functionality
   - Sort by priority/date
   - Drag & drop (kanban)

## 📝 Usage Example

```typescript
import { useTodoApp } from "./hooks";

function TodoPage() {
  const {
    todos,
    viewMode,
    addTodo,
    updateTodo,
    deleteTodo,
    setViewMode
  } = useTodoApp();

  // Use the hook data and methods
}
```

## 🔄 Data Flow

```
User Action (Add/Edit/Delete)
    ↓
useTodoApp Hook
    ↓
todoReducer (Dispatch Action)
    ↓
Firebase (Persistence)
    ↓
State Update
    ↓
Component Re-render
```

## 🎨 View Modes

### List View (Default)
- Simple list of todos
- Quick actions
- Status badges

### Calendar View
- Monthly calendar
- Due date visualization
- Drag to reschedule

### Kanban Board
- Columns by status
- Drag & drop
- Visual workflow

## 🔗 Dependencies

### Internal
- `@common/components/shared` - Shared UI components
- Firebase hooks for persistence

### External
- Firebase - Data persistence
- Material-UI - UI components
- Date libraries - Date handling
- DnD library - Drag and drop

## 🚀 Future Improvements

- [ ] Add services directory
- [ ] Implement subtasks
- [ ] Add task categories/tags
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Collaboration features
- [ ] Notifications/reminders

---

**Status**: ✅ Well-structured
**Pattern**: Feature-based with multiple views

