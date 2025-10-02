# Main Categories Feature - Implementation Summary

## Overview

Added a new tab to the Budget Meter (Miernik Budżetowy) that aggregates and displays data based on main categories from the raw Excel file.

## Files Created/Modified

### 1. Constants (`constants/index.ts`)

- Added `MAIN_CATEGORIES` tab to `TABS` enum
- Added tab configuration for "Kategorie główne" with Category icon

### 2. Main Category Mapping (`utils/mainCategoryMapping.ts`)

**New File** - Handles main category identification from Excel data

- `MAIN_CATEGORIES` - Main category constants
- `MainCategory` - TypeScript type for categories
- `normalizeMainCategory()` - Normalizes category names from Excel
- `getMainCategoryFromRow()` - Extracts category from Excel row (looks for "Main Category", "Kategoria główna", or "main category" keys)
- `getAllMainCategories()` - Returns all available categories

### 3. Main Category Aggregation (`utils/mainCategoryAggregation.ts`)

**New File** - Aggregates data by main categories and sub-categories

- `ActionData` - Interface for individual action data
- `SubCategoryData` - Interface for sub-category data within a program
- `CategoryProgramData` - Interface for program data within a category (includes sub-categories support)
- `MainCategoryData` - Interface for aggregated category data
- `MainCategoryAggregatedData` - Complete aggregation structure
- `aggregateByMainCategories()` - Main aggregation function that handles both regular programs and programs with sub-categories

### 4. Main Categories View Component (`components/data-visualization/MainCategoriesView.tsx`)

**New File** - Displays the categorized data
Features:

- Summary cards showing grand totals (people and actions)
- Expandable accordions for each main category
- Category-level statistics (chips showing totals)
- Program cards within each category
- **Sub-category support**: Programs with sub-categories display them separately
- Sub-category statistics (chips showing totals per sub-category)
- Detailed action tables for each program or sub-category
- Polish number formatting with `toLocaleString("pl-PL")`

### 5. Tab Content Component (`components/layout/TabContent.tsx`)

**Modified** - Added main categories tab case

- Imported `MainCategoriesView` component
- Imported `aggregateByMainCategories` utility
- Added `useMemo` hook for category data calculation
- Added case for `TABS.MAIN_CATEGORIES`

### 6. Data Visualization Index (`components/data-visualization/index.ts`)

**Modified** - Exported new component

- Added export for `MainCategoriesView`

### 7. Utils Index (`utils/index.ts`)

**Modified** - Exported new utilities

- Added exports for `mainCategoryMapping`
- Added exports for `mainCategoryAggregation`

## Main Categories

The system recognizes 5 main categories:

1. **Zapobieganie otyłości** (Obesity Prevention)
2. **Szczepienia** (Vaccinations)
3. **Profilaktyka uzależnień** (Addiction Prevention)
4. **HIV/AIDS**
5. **Inne** (Other)

## Data Flow

1. Excel file contains "Main Category" column (required) and optional "Sub Category" column
2. `getMainCategoryFromRow()` extracts main category from each row
3. `normalizeMainCategory()` standardizes the category name
4. `aggregateByMainCategories()` groups data by:
   - Main category
   - Program (within category)
   - Sub-category (if present in the data)
   - Actions (within program or sub-category)
5. `MainCategoriesView` displays the aggregated data in an organized hierarchy

## UI Structure

```
Main Categories Tab
├── Summary Cards (Total People & Actions)
└── Category Accordions
    ├── Category 1
    │   ├── Category Stats (Chips)
    │   └── Program Cards
    │       ├── Program Info
    │       ├── Program Stats (Chips)
    │       └── Sub-Categories (if present)
    │           ├── Sub-Category 1
    │           │   ├── Sub-Category Stats (Chips)
    │           │   └── Actions Table
    │           └── Sub-Category 2
    │               └── ...
    │       └── Actions Table (if no sub-categories)
    ├── Category 2
    └── ...
```

## Key Features

- ✅ Automatic category detection from Excel "Main Category" column
- ✅ **Sub-category support** from Excel "Sub Category" or "Podkategoria" column
- ✅ **Automatic grouping** of data with same sub-category
- ✅ Fallback to "Inne" for unmapped programs
- ✅ Case-insensitive category matching
- ✅ Support for Polish and typo variations
- ✅ Hierarchical display: Categories → Programs → Sub-Categories (if present) → Actions
- ✅ **Flexible structure**: Programs can have sub-categories or display actions directly
- ✅ Grand totals at the top
- ✅ Category-level and program-level statistics
- ✅ Sub-category-level statistics (when applicable)
- ✅ Expandable/collapsible sections
- ✅ Detailed action-level data in tables
- ✅ Polish number formatting

## Testing

To test the feature:

1. Upload an Excel file with:
   - "Main Category" column (required)
   - "Sub Category" or "Podkategoria" column (optional)
2. Select desired months
3. Click on "Kategorie główne" tab
4. Verify data is properly categorized and displayed
5. Check that:
   - Programs with sub-categories show them grouped together
   - Programs without sub-categories show actions directly
   - Totals are correct at all levels (grand, category, program, sub-category)

## Example Excel Structure

| Main Category | Sub Category | Typ programu  | Nazwa programu     | Działanie   | Liczba ludzi | Liczba działań | Data       |
| ------------- | ------------ | ------------- | ------------------ | ----------- | ------------ | -------------- | ---------- |
| Szczepienia   | WZW          | programowy    | Podstępne WZW      | Wykład      | 50           | 1              | 2025-01-15 |
| Szczepienia   | WZW          | programowy    | Podstępne WZW      | Prezentacja | 30           | 1              | 2025-01-20 |
| Szczepienia   | Grypa        | programowy    | Profilaktyka grypy | Ulotki      | 100          | 200            | 2025-02-01 |
| Inne          |              | nieprogramowy | Bezpieczne ferie   | Zabawa      | 75           | 1              | 2025-01-10 |

In this example:

- "Podstępne WZW" program has "WZW" sub-category with 2 actions
- "Profilaktyka grypy" program has "Grypa" sub-category with 1 action
- "Bezpieczne ferie" program has no sub-category, actions display directly

## Future Enhancements

Potential improvements:

- Export category data to Excel
- Charts/visualizations for category comparison
- Filtering by category
- Search functionality within categories
- Custom category colors/icons
