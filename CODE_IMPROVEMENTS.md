# Code Improvements & Optimization Opportunities

## 🎯 Priority 1: Duplication & Consolidation

### 1.1 Validation Messages Pattern
**Status**: Partially addressed in `schoolSchemas.ts` ✅ **GOOD!**

**Current Issue**: Other schema files still have inline error messages
- `src/features/spisy-spraw/schemas/actSchemas.ts` - Error messages hardcoded in schemas
- `src/features/programy-edukacyjne/schemas/programSchemas.ts` - Same pattern

**Recommendation**: Create a shared validation constants file
```typescript
// src/lib/validations/commonMessages.ts
export const COMMON_VALIDATION_MESSAGES = {
  required: (field: string) => `${field} jest wymagane/y`,
  minLength: (field: string, min: number) => `${field} musi mieć co najmniej ${min} znaków`,
  maxLength: (field: string, max: number) => `${field} może mieć maksymalnie ${max} znaków`,
  email: "Nieprawidłowy adres email",
  postalCode: "Kod pocztowy musi być w formacie XX-XXX",
} as const;
```

**Impact**: 
- Centralized message management for i18n
- Consistent error messages across app
- Easier to maintain translations

---

### 1.2 Error Handling Utilities Duplication
**Current Issue**: Multiple implementations of the same error handlers

```
✓ src/hooks/utils/error-handler.utils.ts          (38 lines)
✓ src/features/spisy-spraw/utils/error-handler.ts (36 lines)
✓ src/features/szkoly-w-programie/utils/error-handler.utils.ts (12 lines - minified)
```

**Observation**: 
- `formatZodError()` - implemented 3 times
- `isZodError()` - implemented 3 times
- `getErrorMessage()` - implemented 3 times

**Recommendation**: 
```typescript
// Use centralized version from src/hooks/utils/error-handler.utils.ts
// Update imports: 
// FROM: import { formatZodError } from "../utils/error-handler.ts"
// TO:   import { formatZodError } from "@/hooks/utils"
```

**Impact**: 
- Single source of truth for error handling
- Easier bug fixes
- Consistency across modules
- ~100 lines of code saved

---

## 🎯 Priority 2: Schema Pattern Improvements

### 2.1 Inconsistent Schema Definition Patterns
**Current Issue**: Different approaches across features

**Schema Files Analysis**:
```
schoolSchemas.ts:
  ✓ Uses `satisfies` removal (good!)
  ✓ Extracts VALIDATION_MESSAGES (good!)
  ✓ JSDoc comments (good!)
  ✓ Type-safe defaults

actSchemas.ts:
  ✗ Inline error messages
  ✗ Uses `.infer` from schemas
  ✗ No constants extraction
  ✗ No JSDoc comments

programSchemas.ts:
  ✗ Inline error messages
  ✓ Uses `.infer<>` approach (different pattern)
  ✗ Minimal JSDoc
```

**Recommendation**: Standardize all schema files to follow `schoolSchemas.ts` pattern:
```typescript
// CONSISTENT PATTERN:
1. Import types at top
2. Extract VALIDATION_MESSAGES constant
3. Export inferred types AFTER schemas
4. Add JSDoc for each export
5. Provide default values for forms
```

---

### 2.2 Missing `.infer<>` Pattern
**Current File**: `src/features/schools/schemas/schoolSchemas.ts`

**Issue**: File uses manual type definitions instead of Zod's type inference

```typescript
// CURRENT (works but manual):
export type CreateSchoolFormData = Omit<School, "id" | "createdAt" | "updatedAt">;

// COULD BE (automatic):
export type CreateSchoolFormData = z.infer<typeof createSchoolSchema>;
```

**But Wait**: Your approach is actually BETTER because:
- You're ensuring `CreateSchoolFormData` matches the `School` interface
- Provides better documentation of what fields are expected
- More maintainable than Zod inference

**No Action Needed** ✅

---

## 🎯 Priority 3: Type Safety & Inference

### 3.1 Generic Validation Hook Enhancement
**File**: `src/hooks/useFormValidation.ts`

**Current Issue**: Generic validation could be more robust
```typescript
const validateField = (fieldName: keyof T, value: unknown): string | null => {
  // Uses reflection to get field schema - fragile
  const fieldSchema = (schema as z.ZodObject<z.ZodRawShape>).shape[fieldName as string];
  // ...
};
```

**Recommendation**: Add fallback for non-object schemas
```typescript
/**
 * Validates a single field value against the schema
 * @template T The form data type
 * @param fieldName The field to validate
 * @param value The value to validate
 * @returns Error message or null if valid
 */
export const validateField = useCallback(
  (fieldName: keyof T, value: unknown): string | null => {
    try {
      const fieldSchema = (schema as z.ZodObject<z.ZodRawShape>).shape[fieldName as string];
      
      if (!fieldSchema || !('parse' in fieldSchema)) {
        console.warn(`Field ${String(fieldName)} not found in schema`);
        return null;
      }
      
      (fieldSchema as z.ZodType).parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || "Nieprawidłowa wartość";
      }
      return "Nieprawidłowa wartość";
    }
  },
  [schema]
);
```

---

## 🎯 Priority 4: Constants Organization

### 4.1 Scattered Constants
**Issue**: Validation messages scattered across files
- `VALIDATION_MESSAGES` in schema files
- `FIELD_LABELS` in component constants
- `ERROR_MESSAGES` in feature constants
- `SHARED_AUTH_CONSTANTS` in auth

**Recommendation**: 
```typescript
// src/constants/messages.ts (centralized)
export const VALIDATION_MESSAGES = {
  common: { /* shared validation messages */ },
  auth: { /* auth-specific messages */ },
  schools: { /* school-specific messages */ },
  // ...
} as const;
```

**Impact**:
- Single place for all user-facing messages
- Easier i18n implementation
- Consistent tone and terminology

---

## 🎯 Priority 5: Performance & Best Practices

### 5.1 Missing Memoization Opportunities
**Pattern Observed**: Multiple features implement custom hooks with similar patterns

**Recommendation**: Where you're using expensive transformations, add `useMemo`:
```typescript
const errorMessage = useMemo(
  () => formatZodError(zodError),
  [zodError]
);
```

### 5.2 Validation Regex Centralization
**Current**: Regex patterns defined locally
- `postalCode: /^\d{2}-\d{3}$/` in `schoolSchemas.ts`
- `phoneRegex` in `validationUtils.ts`

**Recommendation**: 
```typescript
// src/lib/validations/patterns.ts
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  postalCode: /^\d{2}-\d{3}$/,
  nip: /^\d{10}$/,
  regon: /^\d{9}$|^\d{14}$/,
} as const;
```

---

## 🎯 Priority 6: Documentation

### 6.1 JSDoc Coverage
**Status**: Good in `schoolSchemas.ts`, but inconsistent elsewhere

**Recommendation**: 
- Add JSDoc to all schema exports
- Document validation rules (min/max, patterns)
- Add usage examples in complex schemas

```typescript
/**
 * Schema for creating a new school
 * @example
 * const result = createSchoolSchema.parse(formData);
 */
export const createSchoolSchema = z.object({
  // ...
});
```

---

## 🎯 Priority 7: Testing

### 7.1 Schema Validation Testing
**Issue**: Schema files often lack tests

**Recommendation**: Add test files for each schema
```typescript
// src/features/schools/schemas/__tests__/schoolSchemas.test.ts
describe('schoolSchemas', () => {
  it('validates a valid school', () => {
    const data = { /* valid data */ };
    expect(() => createSchoolSchema.parse(data)).not.toThrow();
  });
  
  it('rejects invalid postal code', () => {
    const data = { postalCode: 'invalid' };
    expect(() => createSchoolSchema.parse(data)).toThrow();
  });
});
```

---

## 📊 Summary of Improvements

| Priority | Area | Impact | Effort | Status |
|----------|------|--------|--------|--------|
| 1 | Consolidate VALIDATION_MESSAGES | HIGH | MEDIUM | 🔴 TODO |
| 1 | Deduplicate error handlers | HIGH | SMALL | 🔴 TODO |
| 2 | Standardize schema patterns | MEDIUM | MEDIUM | 🟡 PARTIAL |
| 3 | Enhance validation hook | MEDIUM | SMALL | 🟡 PARTIAL |
| 4 | Centralize constants | MEDIUM | MEDIUM | 🔴 TODO |
| 5 | Add memoization | LOW | SMALL | 🔴 TODO |
| 5 | Centralize regex patterns | MEDIUM | SMALL | 🟡 PARTIAL |
| 6 | Improve JSDoc coverage | LOW | SMALL | 🟡 PARTIAL |
| 7 | Add schema tests | HIGH | MEDIUM | 🔴 TODO |

---

## 🚀 Quick Wins (Easy to Implement)

1. **Remove duplicate error handlers** (~10 mins)
   - Delete `src/features/spisy-spraw/utils/error-handler.ts`
   - Delete `src/features/szkoly-w-programie/utils/error-handler.utils.ts`
   - Update imports to use `@/hooks/utils`

2. **Apply schoolSchemas pattern** (~30 mins)
   - Update `actSchemas.ts` to use VALIDATION_MESSAGES constant
   - Update `programSchemas.ts` to use VALIDATION_MESSAGES constant
   - Add JSDoc comments

3. **Add memoization to expensive operations** (~15 mins)
   - Identify high-cost validations
   - Wrap with `useMemo`

---

## 📝 Notes

- Your **schoolSchemas.ts** is now a great template for other schema files
- Error handling consolidation will be the biggest improvement
- Consider adding a `SchemaBuilder` utility to enforce consistency
- Documentation is already quite good, just needs more examples

---

**Generated**: October 16, 2025
