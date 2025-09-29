# Szkoły w Programie Module

A comprehensive module for managing school participation in educational programs, following modern React patterns and TypeScript best practices.

## Features

- **School Program Management**: Add, edit, and delete school participation in programs
- **Multi-step Form**: Intuitive form with validation and error handling
- **Data Table**: Advanced table with sorting, filtering, and CRUD operations
- **Real-time Updates**: Live data synchronization with Firebase
- **Type Safety**: Full TypeScript support with strict typing
- **Responsive Design**: Mobile-first responsive layout
- **Performance Optimized**: Memoization, debouncing, and efficient re-renders

## Architecture

### Components
- `ParticipationForm`: Main form for adding new participations
- `SchoolProgramParticipationTable`: Data table with CRUD operations
- `EditParticipationForm`: Inline editing form with ref-based submission

### Hooks
- `useParticipationPage`: Main page logic and state management
- `useParticipationForm`: Form-specific logic and validation

### Types
- Comprehensive TypeScript interfaces
- Readonly types for immutability
- Proper type guards and narrowing

### Constants
- Centralized configuration
- UI constants and styling
- Validation limits and error messages

### Utils
- Data transformation utilities
- Lookup map creation
- Validation helpers

## Usage

### Basic Usage

```tsx
import { SchoolsProgramParticipation } from "./szkoly-w-programie/page";

export default function MyApp() {
  return <SchoolsProgramParticipation />;
}
```

### Custom Hook Usage

```tsx
import { useParticipationPage } from "./szkoly-w-programie/hooks";

function CustomParticipationPage() {
  const {
    schools,
    contacts,
    programs,
    participations,
    isLoading,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
  } = useParticipationPage();

  // Custom logic here
}
```

## Data Flow

1. **Page Load**: Fetch schools, contacts, programs, and participations
2. **Form Submission**: Validate and create new participation
3. **Table Operations**: Edit, update, or delete existing participations
4. **Real-time Updates**: Firebase syncs data across sessions

## Validation

### Form Validation
- Required field validation
- Data type validation
- Length constraints
- Custom validation rules

### Data Validation
- School existence validation
- Program availability validation
- Coordinator assignment validation

## Error Handling

- **Network Errors**: Graceful handling of connection issues
- **Validation Errors**: Inline form validation with user feedback
- **API Errors**: Proper error propagation and user notification
- **Loading States**: Visual feedback during async operations

## Performance Optimizations

- **Memoization**: Expensive calculations are memoized
- **Debouncing**: Input validation is debounced
- **Lookup Maps**: Efficient data access with pre-computed maps
- **Lazy Loading**: Components loaded on demand

## Styling

- **Material-UI**: Consistent design system
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliant
- **Theming**: Supports light/dark themes
- **Custom Styling**: Gradient backgrounds and modern aesthetics

## State Management

- **Local State**: Form state and UI interactions
- **Server State**: Firebase data synchronization
- **Derived State**: Computed values and transformations
- **Shared State**: Context for global application state

## Testing

The module is designed for comprehensive testing:

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Form submission and API interactions
- **E2E Tests**: Full user workflow testing
- **Mocking**: Easy dependency mocking for isolated tests

## File Structure

```
szkoly-w-programie/
├── components/
│   ├── ParticipationForm.tsx        # Main form component
│   ├── table.tsx                    # Data table with CRUD
│   ├── EditParticipationForm.tsx    # Edit form component
│   ├── TableConfig.tsx             # Table configuration
│   └── index.ts                    # Component exports
├── hooks/
│   ├── useParticipationPage.ts     # Main page logic
│   ├── useParticipationForm.ts     # Form logic
│   └── index.ts                    # Hook exports
├── constants/
│   └── index.ts                    # All constants
├── types/
│   └── index.ts                    # TypeScript types
├── utils/
│   └── index.ts                    # Utility functions
├── page.tsx                        # Main page component
└── README.md                       # This documentation
```

## Dependencies

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Material-UI**: UI components
- **Firebase**: Data persistence
- **TypeScript**: Type safety

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
- `SchoolsProgramParticipation`: Main page component

### Hooks
- `useParticipationPage`: Page-level state and operations
- `useParticipationForm`: Form-specific logic

### Utilities
- `mapParticipationsForDisplay`: Transform data for UI
- `createLookupMaps`: Create efficient lookup structures
- `transform*ToOptions`: Convert data to select options

## Configuration

All configuration is centralized in the `constants/index.ts` file:

- UI constants and styling
- Validation limits
- Error messages
- Field labels and placeholders

## Performance Considerations

- **Large Datasets**: Pagination and virtualization for performance
- **Frequent Updates**: Optimistic updates for better UX
- **Memory Usage**: Proper cleanup of subscriptions and timers
- **Bundle Size**: Code splitting and lazy loading

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## Troubleshooting

### Common Issues

1. **Form not submitting**: Check validation errors and network connectivity
2. **Data not loading**: Verify Firebase configuration and permissions
3. **Table not updating**: Check real-time listeners and data flow
4. **Performance issues**: Review memoization and unnecessary re-renders

### Debug Mode

Enable debug logging by setting `DEBUG=true` in environment variables.

## Future Enhancements

- [ ] Bulk operations for multiple participations
- [ ] Advanced filtering and search
- [ ] Export functionality (CSV, PDF)
- [ ] Audit trail and history tracking
- [ ] Multi-year program support
- [ ] Integration with external systems
