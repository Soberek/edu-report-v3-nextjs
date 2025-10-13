# Migration Guide: Feature-Based Architecture

This guide helps you migrate imports from the old structure to the new feature-based architecture.

## 📋 Quick Reference

### Components

| Old Path | New Path | Notes |
|----------|----------|-------|
| `@/components/shared/LoadingSpinner` | `@common/components/shared/LoadingSpinner` | Moved to common |
| `@/components/ui/bottom-navbar` | `@common/components/ui/bottom-navbar` | Moved to common |
| `@/components/auth/*` | `@/components/auth/*` | Stays as is (auth feature) |

### Hooks

| Old Path | New Path | Notes |
|----------|----------|-------|
| `@/hooks/useContact` | `@/app/(protected)/contacts/hooks/useContact` | Moved to contacts feature |
| `@/hooks/useProgram` | `@/app/(protected)/programy-edukacyjne/hooks/useProgram` | Moved to programs feature |
| `@/hooks/useScheduledTask` | `@/app/(protected)/schedule/hooks/useScheduledTask` | Moved to schedule feature |
| `@/hooks/shared/useDebounce` | `@common/hooks/shared/useDebounce` | Moved to common |

### Services

| Old Path | New Path | Notes |
|----------|----------|-------|
| `@/services/generatedImagePostImagesService` | `@/app/(protected)/holidays/services/generatedImagePostImagesService` | Moved to holidays feature |
| `@/services/postImagesUploadService` | `@/app/(protected)/holidays/services/postImagesUploadService` | Moved to holidays feature |
| `@/services/unsplashService` | `@/services/unsplashService` | Stays (used by API routes) |

### Utils

| Old Path | New Path | Notes |
|----------|----------|-------|
| `@/utils/graphicsGenerator` | `@/app/(protected)/holidays/utils/graphicsGenerator` | Moved to holidays feature |
| `@/utils/shared/dateUtils` | `@common/utils/shared/dateUtils` | Moved to common |

## 🔄 Step-by-Step Migration

### 1. Update Component Imports

**Before:**
```typescript
import { LoadingSpinner } from "@/components/shared";
import { BottomNavbar } from "@/components/ui/bottom-navbar";
```

**After:**
```typescript
import { LoadingSpinner } from "@common/components/shared";
import { BottomNavbar } from "@common/components/ui/bottom-navbar";
```

### 2. Update Hook Imports

**Before:**
```typescript
import { useContact } from "@/hooks/useContact";
import { useDebounce } from "@/hooks/shared/useDebounce";
```

**After:**
```typescript
// Feature-specific hook
import { useContact } from "../hooks/useContact"; // if in same feature
// or
import { useContact } from "@/app/(protected)/contacts/hooks";

// Common hook
import { useDebounce } from "@common/hooks/shared";
```

### 3. Update Service Imports

**Before (in holidays module):**
```typescript
import { generatedImagePostImagesService } from "@/services/generatedImagePostImagesService";
```

**After:**
```typescript
import { generatedImagePostImagesService } from "../services/generatedImagePostImagesService";
// or
import { generatedImagePostImagesService } from "./services";
```

### 4. Update Utils Imports

**Before:**
```typescript
import { graphicsGenerator } from "@/utils/graphicsGenerator";
import { formatDate } from "@/utils/shared/dateUtils";
```

**After:**
```typescript
// Feature-specific util (in holidays)
import { graphicsGenerator } from "../utils/graphicsGenerator";

// Common util
import { formatDate } from "@common/utils/shared/dateUtils";
```

## 🎯 Path Aliases

The following path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@common/*": ["./src/common/*"]
    }
  }
}
```

## 📝 Import Best Practices

### Within a Feature Module

Use relative imports for files within the same feature:

```typescript
// ✅ Good - within holidays module
import { HolidaysList } from "../components/HolidaysList";
import { useHolidays } from "../hooks/useHolidays";
import { exportUtils } from "../utils/exportUtils";
```

### From Common Module

Use the `@common` alias:

```typescript
// ✅ Good - importing common code
import { LoadingSpinner } from "@common/components/shared";
import { useDebounce } from "@common/hooks/shared";
import { formatDate } from "@common/utils/shared";
```

### From Another Feature

Use absolute path when crossing feature boundaries (avoid if possible):

```typescript
// ⚠️ Acceptable but indicates potential coupling
import { SomeComponent } from "@/app/(protected)/other-feature/components";
```

## 🔍 Find & Replace Guide

Use your IDE's find-and-replace feature to update imports:

### VS Code / Cursor

1. **Find:** `from "@/components/shared"`
   **Replace:** `from "@common/components/shared"`

2. **Find:** `from "@/components/ui/`
   **Replace:** `from "@common/components/ui/`

3. **Find:** `from "@/hooks/shared/`
   **Replace:** `from "@common/hooks/shared/`

4. **Find:** `from "@/utils/shared/`
   **Replace:** `from "@common/utils/shared/`

### Feature-Specific Replacements

For holidays module files:

1. **Find:** `from "@/services/generatedImagePostImagesService"`
   **Replace:** `from "../services/generatedImagePostImagesService"` (adjust `..` based on file location)

2. **Find:** `from "@/utils/graphicsGenerator"`
   **Replace:** `from "../utils/graphicsGenerator"`

## 🧪 Testing After Migration

1. **Run TypeScript compiler:**
   ```bash
   pnpm run type-check
   ```

2. **Run linter:**
   ```bash
   pnpm run lint
   ```

3. **Run tests:**
   ```bash
   pnpm run test
   ```

4. **Build the project:**
   ```bash
   pnpm run build
   ```

## ❓ Common Issues

### Issue: Module not found

**Problem:**
```
Module not found: Can't resolve '@/components/shared/LoadingSpinner'
```

**Solution:**
```typescript
// Change from:
import { LoadingSpinner } from "@/components/shared";

// To:
import { LoadingSpinner } from "@common/components/shared";
```

### Issue: Circular dependencies

**Problem:**
```
Warning: Circular dependency detected
```

**Solution:**
- Avoid importing feature code from another feature
- Move shared code to `@common`
- Use dependency injection patterns

### Issue: Type imports

**Problem:**
```
Cannot find type 'SomeType'
```

**Solution:**
```typescript
// Make sure to update type imports too
import type { SomeType } from "../types";
```

## 📊 Migration Checklist

- [ ] Update all component imports
- [ ] Update all hook imports
- [ ] Update all service imports
- [ ] Update all utility imports
- [ ] Update all type imports
- [ ] Update test files
- [ ] Run linter and fix issues
- [ ] Run tests and verify passing
- [ ] Build project and verify success
- [ ] Test application functionality
- [ ] Update documentation

## 🚀 Rollback Plan

If you need to rollback:

1. The old files still exist in their original locations
2. Use git to revert changes:
   ```bash
   git checkout -- path/to/file
   ```
3. Or revert the entire branch:
   ```bash
   git reset --hard origin/main
   ```

## 📚 Additional Resources

- [Feature-Based Architecture Strategy](REFACTORING_STRATEGY.md)
- [Common Module README](src/common/README.md)
- [Holidays Module Example](src/app/(protected)/holidays/README.md)

---

**Need Help?** Check the documentation or create an issue in the repository.

