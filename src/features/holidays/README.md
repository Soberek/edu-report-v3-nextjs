# Holidays Module

A comprehensive holiday management and social media post generation system with AI-powered content creation and graphics generation.

## 📁 Feature-Based Structure

```
holidays/
├── components/           # UI components
│   ├── ActionSection.tsx
│   ├── BulkTemplateUpload.tsx
│   ├── ExportSection.tsx
│   ├── GeneratedPostsWithGraphics.tsx
│   ├── HolidaysList.tsx
│   ├── MockTemplateTest.tsx
│   ├── ResultsSection.tsx
│   ├── scraped-holidays.tsx
│   ├── TemplateConfigDialog.tsx
│   ├── TemplatePreview.tsx
│   ├── TemplateUpload.tsx
│   ├── UploadedImagesList.tsx
│   ├── UrlInput.tsx
│   └── index.ts
│
├── config/              # Feature configuration
│   └── templateConfig.ts
│
├── hooks/               # React hooks
│   ├── useHolidayGraphics.ts
│   ├── useHolidays.ts
│   └── index.ts
│
├── reducers/            # State management
│   ├── holidaysReducer.ts
│   └── index.ts
│
├── services/            # Business logic & API clients
│   ├── generatedImagePostImagesService.ts
│   ├── postImagesUploadService.ts
│   └── index.ts
│
├── types/               # TypeScript types
│   └── index.ts
│
├── utils/               # Utility functions
│   ├── aiUtils.ts
│   ├── exportUtils.ts
│   ├── graphicsGenerator.ts
│   └── index.ts
│
├── page.tsx             # Main page component
├── README.md            # This file
└── README-GRAPHICS.md   # Graphics generation documentation
```

## 🏗️ Architecture

This module follows a **feature-based architecture** where all related code is co-located:

### Services Layer
- **`generatedImagePostImagesService.ts`**: Handles uploading generated images to PostImages
- **`postImagesUploadService.ts`**: Core PostImages API integration

### Components Layer
- **UI Components**: Presentation components with minimal logic
- **Smart Components**: Container components that use hooks for data/logic

### Hooks Layer
- **`useHolidays`**: Main hook for holiday data management
- **`useHolidayGraphics`**: Hook for graphics generation logic

### Utils Layer
- **`graphicsGenerator.ts`**: Client-side canvas-based graphics generation
- **`exportUtils.ts`**: CSV/Excel export utilities
- **`aiUtils.ts`**: AI content generation helpers

### State Management
- Uses React's `useReducer` with custom reducers
- State is managed locally within the feature

## ✨ Key Features

1. **Holiday Scraping**: Fetch health-related holidays from external sources
2. **AI Content Generation**: Generate social media posts using OpenAI
3. **Graphics Generation**: Create branded post graphics with templates
4. **Image Management**: Upload and manage images via PostImages
5. **Batch Processing**: Generate multiple posts with graphics
6. **Export Capabilities**: Export data to CSV/Excel formats

## 🔄 Data Flow

```
User Action
    ↓
Page Component
    ↓
useHolidays / useHolidayGraphics Hook
    ↓
Service Layer (API calls)
    ↓
External APIs (Unsplash, PostImages, OpenAI)
    ↓
State Update (Reducer)
    ↓
Component Re-render
```

## 📝 Usage Example

```typescript
import { useHolidays } from "./hooks";
import { useHolidayGraphics } from "./hooks/useHolidayGraphics";

export default function HolidaysPage() {
  const {
    holidays,
    posts,
    loading,
    fetchHolidays,
    extractHealthHolidays,
    generatePosts
  } = useHolidays();

  const {
    generatedPosts,
    generateWithGraphics,
    templateConfig,
    updateTemplateConfig
  } = useHolidayGraphics();

  // Use the hooks in your components
}
```

## 🎨 Graphics Generation

The module includes a powerful client-side graphics generator that:

- Uses HTML5 Canvas API
- Supports custom templates
- Handles image positioning and text overlay
- Generates high-quality PNG images

See [README-GRAPHICS.md](./README-GRAPHICS.md) for detailed documentation.

## 🔗 Dependencies

### Internal
- `@/components/shared` - Shared UI components (LoadingSpinner, etc.)

### External
- Material-UI - UI components
- OpenAI - AI content generation
- Unsplash API - Image fetching
- PostImages API - Image hosting

## 🚀 Future Improvements

- [ ] Add TypeScript strict mode
- [ ] Implement unit tests
- [ ] Add E2E tests for critical flows
- [ ] Optimize bundle size
- [ ] Add error boundary
- [ ] Implement retry logic for failed API calls
- [ ] Add caching for generated posts

## 📚 Related Documentation

- [Graphics Generation](./README-GRAPHICS.md)
- [Refactoring Strategy](/REFACTORING_STRATEGY.md)
- [Main README](/README.md)

