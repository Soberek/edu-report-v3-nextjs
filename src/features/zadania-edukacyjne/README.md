# Zadania Edukacyjne Module

A comprehensive module for managing educational tasks and their activities, following modern React patterns and TypeScript best practices.

## Features

- **Educational Task Management**: Create, edit, and delete educational tasks with multiple activities
- **Activity Management**: Support for multiple activity types (presentations, distributions, media publications, etc.)
- **Advanced Filtering**: Filter by year, month, program, and activity type
- **Task Grouping**: Tasks grouped by month/year for better organization
- **Collapsible Activities**: Expandable activity details with media and materials
- **Real-time Updates**: Live data synchronization with Firebase
- **Type Safety**: Full TypeScript support with strict typing
- **Responsive Design**: Mobile-first responsive layout
- **Performance Optimized**: Memoization, debouncing, and efficient re-renders

## Architecture

### Components

- `FilterSection`: Advanced filtering interface with active filter display
- `TaskGroups`: Groups tasks by month/year with expandable content
- `TaskCard`: Individual task display with collapsible activities
- `EmptyState`: Contextual empty state with call-to-action
- `EducationalTaskForm`: Comprehensive form for task creation/editing

### Hooks

- `useEducationalTasksPage`: Main page logic and state management
- `useEducationalTasks`: Firebase data operations
- `useSimplifiedEducationalTasks`: Simplified task operations
- `useTaskNumberManager`: Task numbering logic

### Types

- Comprehensive TypeScript interfaces
- Readonly types for immutability
- Proper type guards and narrowing
- Discriminated unions for variant data

### Constants

- Centralized configuration
- UI constants and styling
- Validation limits and error messages
- Field labels and placeholders

### Utils

- Data transformation utilities
- Filter and grouping logic
- Date formatting helpers
- Validation utilities

## Usage

### Basic Usage

```tsx
import { EducationalTasks } from "./zadania-edukacyjne/page";

export default function MyApp() {
  return <EducationalTasks />;
}
```

### Custom Hook Usage

```tsx
import { useEducationalTasksPage } from "./zadania-edukacyjne/hooks";

function CustomTasksPage() {
  const { tasks, loading, error, handleAddTask, handleEditTask, handleDeleteTask, handleFormSave } = useEducationalTasksPage();

  // Custom logic here
}
```

## Data Flow

1. **Page Load**: Fetch tasks and related data (schools, programs, contacts)
2. **Filter Application**: Apply filters and group tasks by month/year
3. **Task Operations**: Create, edit, delete tasks with form validation
4. **Activity Management**: Manage multiple activities per task
5. **Real-time Updates**: Firebase syncs data across sessions

## Task Structure

### Educational Task

- **Basic Info**: Title, date, program, school, coordinator
- **Activities**: Multiple activities with different types
- **Materials**: Distribution materials for activities
- **Media**: Media publications and links
- **Audience**: Audience groups and counts

### Activity Types

- **Presentation**: Lectures and presentations
- **Distribution**: Material distribution activities
- **Media Publication**: Social media and online content
- **Educational Info Stand**: Community outreach
- **Report**: Reporting activities
- **Lecture**: Educational lectures

## Validation

### Form Validation

- Required field validation
- Data type validation
- Length constraints
- Custom validation rules for business logic
- Cross-field validation

### Data Validation

- Task existence validation
- Activity type validation
- Material and media validation
- Date and number validation

## Error Handling

- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: Inline form validation with user feedback
- **API Errors**: Proper error propagation and user notification
- **Loading States**: Visual feedback during async operations
- **Confirmation Dialogs**: Safe deletion with confirmation

## Performance Optimizations

- **Memoization**: Expensive calculations are memoized
- **Debouncing**: Input validation is debounced
- **Virtualization**: Efficient rendering of large lists
- **Lazy Loading**: Components loaded on demand
- **Lookup Maps**: Efficient data access with pre-computed maps

## Styling

- **Material-UI**: Consistent design system
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliant
- **Theming**: Supports light/dark themes
- **Custom Styling**: Gradient backgrounds and modern aesthetics
- **Animations**: Smooth transitions and collapsible content

## State Management

- **Local State**: Form state and UI interactions
- **Server State**: Firebase data synchronization
- **Derived State**: Computed values and transformations
- **Shared State**: Context for global application state

## File Structure

```
zadania-edukacyjne/
├── components/
│   ├── FilterSection.tsx           # Advanced filtering interface
│   ├── TaskGroups.tsx              # Task grouping by month/year
│   ├── TaskCard.tsx                # Individual task display
│   ├── EmptyState.tsx              # Empty state component
│   ├── EducationalTaskForm.tsx     # Comprehensive task form
│   ├── ActivityForm.tsx            # Activity management form
│   ├── MaterialSelector.tsx        # Material selection component
│   ├── AudienceGroupsForm.tsx      # Audience management
│   ├── SimplifiedEducationalTaskForm.tsx # Simplified form
│   ├── TaskNumberField.tsx         # Task numbering logic
│   └── index.ts                    # Component exports
├── hooks/
│   ├── useEducationalTasksPage.ts # Main page logic
│   ├── useEducationalTasks.ts     # Firebase operations
│   ├── useSimplifiedEducationalTasks.ts # Simplified operations
│   ├── useTaskNumberManager.ts    # Task numbering
│   └── index.ts                    # Hook exports
├── constants/
│   └── index.ts                    # All constants
├── types/
│   └── index.ts                    # TypeScript types
├── utils/
│   └── index.ts                    # Utility functions
├── schemas/
│   └── educationalTaskSchemas.ts   # Zod validation schemas
├── reducers/
│   └── educationalTasksPageReducer.ts # State management
├── __tests__/
│   └── (test files)                # Comprehensive tests
├── page.tsx                        # Main page component
└── README.md                       # This documentation
```

## Dependencies

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Material-UI**: UI components
- **Firebase**: Data persistence
- **TypeScript**: Type safety
- **React Query**: Data fetching and caching

## Contributing

When contributing to this module:

1. Follow the established patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new functionality
5. Update documentation
6. Follow the coding guidelines

## API Reference

### Main Component

- `EducationalTasks`: Main page component

### Hooks

- `useEducationalTasksPage`: Page-level state and operations
- `useEducationalTasks`: Firebase data operations
- `useSimplifiedEducationalTasks`: Simplified task operations
- `useTaskNumberManager`: Task numbering logic

### Utilities

- `filterTasks`: Filter tasks by criteria
- `groupTasksByMonth`: Group tasks by month/year
- `extractFilterOptions`: Extract filter options from tasks
- `applyFiltersAndGrouping`: Complete filtering and grouping logic

## Configuration

All configuration is centralized in the `constants/index.ts` file:

- UI constants and styling
- Validation limits
- Error messages
- Field labels and placeholders
- Animation settings

## Performance Considerations

- **Large Datasets**: Pagination and virtualization for performance
- **Frequent Updates**: Optimistic updates for better UX
- **Memory Usage**: Proper cleanup of subscriptions and timers
- **Bundle Size**: Code splitting and lazy loading
- **Re-renders**: Memoization of expensive calculations

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Testing

The module is designed for comprehensive testing:

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Form submission and API interactions
- **E2E Tests**: Full user workflow testing
- **Mocking**: Easy dependency mocking for isolated tests
- **Coverage**: High test coverage with meaningful assertions

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## Troubleshooting

### Common Issues

1. **Form not submitting**: Check validation errors and network connectivity
2. **Data not loading**: Verify Firebase configuration and permissions
3. **Filters not working**: Check filter logic and data structure
4. **Performance issues**: Review memoization and unnecessary re-renders
5. **Type errors**: Ensure proper TypeScript configuration

### Debug Mode

Enable debug logging by setting `DEBUG=true` in environment variables.

## Future Enhancements

- [ ] Advanced search functionality
- [ ] Bulk operations for multiple tasks
- [ ] Export functionality (CSV, PDF, Excel)
- [ ] Calendar view for task scheduling
- [ ] Advanced analytics and reporting
- [ ] Multi-year program support
- [ ] Integration with external calendar systems
- [ ] Mobile app support
- [ ] Offline functionality
- [ ] Real-time collaboration features
