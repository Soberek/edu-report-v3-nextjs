# Wygeneruj IZRZ Module

A comprehensive form module for generating IZRZ (Individualny Zespół Rehabilitacyjno-Zawodowy) reports and educational documents.

## Features

- **Template Management**: Predefined templates with file validation
- **Form Validation**: Comprehensive Zod schema validation with Polish error messages
- **Type Safety**: Full TypeScript support with strict typing
- **Error Handling**: Robust error handling with user-friendly messages
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized with memoization and debouncing

## Architecture

### Components

- `TemplateSelector`: Template selection with validation
- `FormField`: Reusable form field component with multiple input types

### Hooks

- `useIzrzForm`: Form state management with validation
- `useFormSubmission`: API submission with file download
- `useTemplateManager`: Template file management

### Types

- Comprehensive TypeScript interfaces
- Readonly types for immutability
- Discriminated unions for type safety

### Constants

- Centralized configuration
- UI constants and styling
- Validation limits and error messages

### Utils

- File validation and formatting
- Date formatting utilities
- Text manipulation helpers

## Usage

```tsx
import { useIzrzForm } from "./hooks/useIzrzForm";
import { TemplateSelector, FormField } from "./components";

export default function IzrzForm() {
  const { control, handleSubmit, isValid, isSubmitting } = useIzrzForm({
    onSubmit: async (data) => {
      // Handle form submission
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <TemplateSelector onTemplateSelect={handleTemplateSelect} />
      <FormField type="text" name="caseNumber" control={control} label="Numer sprawy" required />
      {/* ... other fields */}
    </form>
  );
}
```

## Validation

The module uses Zod schemas for comprehensive validation:

- **Required fields**: All mandatory fields are validated
- **Length limits**: String fields have min/max length validation
- **File validation**: Template files are validated for type and size
- **Date validation**: Date fields are validated for proper format
- **Number validation**: Numeric fields have range validation

## Error Handling

- **Form validation errors**: Displayed inline with fields
- **API errors**: Shown as alerts with retry options
- **File errors**: Validation errors for template files
- **Network errors**: Graceful handling of connection issues

## Performance Optimizations

- **Memoization**: Expensive calculations are memoized
- **Debouncing**: Input validation is debounced
- **Lazy loading**: Components are loaded on demand
- **Code splitting**: Module is split for better loading

## Styling

- **Material-UI**: Consistent design system
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliant
- **Theming**: Supports light/dark themes

## Testing

The module is designed for easy testing:

- **Pure functions**: Business logic is testable
- **Mockable dependencies**: Hooks can be easily mocked
- **Type safety**: TypeScript prevents many runtime errors
- **Error boundaries**: Graceful error handling

## Contributing

When contributing to this module:

1. Follow the established patterns
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new functionality
5. Update documentation

## Dependencies

- React Hook Form: Form state management
- Zod: Schema validation
- Material-UI: UI components
- TypeScript: Type safety
