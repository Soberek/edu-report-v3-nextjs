# Sub-Category Feature Implementation

## Overview

Extended the Main Categories feature to support sub-categories. Data with the same sub-category is now automatically grouped together under their parent program.

## Changes Made

### 1. Data Structures (`utils/mainCategoryAggregation.ts`)

#### New Interfaces:

- **`ActionData`**: Individual action data structure

  ```typescript
  {
    actionName: string;
    people: number;
    actionNumber: number;
  }
  ```

- **`SubCategoryData`**: Sub-category grouping structure
  ```typescript
  {
    subCategoryName: string;
    totalPeople: number;
    totalActions: number;
    actions: ActionData[];
  }
  ```

#### Updated Interface:

- **`CategoryProgramData`**: Now includes sub-category support
  ```typescript
  {
    programName: string;
    programType: string;
    totalPeople: number;
    totalActions: number;
    hasSubCategories: boolean;      // NEW
    subCategories: SubCategoryData[]; // NEW
    actions: ActionData[];           // For programs without sub-categories
  }
  ```

### 2. Aggregation Logic (`utils/mainCategoryAggregation.ts`)

#### `aggregateByMainCategories()` Function Updates:

1. **Sub-Category Detection**:

   - Reads "Sub Category" or "Podkategoria" column from Excel
   - Trims whitespace to handle empty strings

2. **Conditional Grouping**:

   - If sub-category exists: Groups actions under the sub-category
   - If no sub-category: Adds actions directly to the program

3. **Totals Calculation**:
   - Sub-category totals (people and actions)
   - Program totals (sum of all sub-categories or direct actions)
   - Category totals
   - Grand totals

### 3. UI Component (`components/data-visualization/MainCategoriesView.tsx`)

#### Display Logic:

1. **Programs with Sub-Categories** (`hasSubCategories: true`):

   ```
   Program Card
   ├── Program Header (name, type, totals)
   └── For each Sub-Category:
       ├── Sub-Category Header (name, totals as chips)
       └── Actions Table
   ```

2. **Programs without Sub-Categories** (`hasSubCategories: false`):
   ```
   Program Card
   ├── Program Header (name, type, totals)
   └── Actions Table (directly)
   ```

#### Visual Elements:

- Sub-category names displayed as bold subtitles
- Info-colored chips for sub-category statistics
- Separate tables for each sub-category
- Consistent spacing and visual hierarchy

### 4. Column Name Support

The system recognizes the following column names for sub-categories:

- "Sub Category" (English)
- "Podkategoria" (Polish)
- Case-insensitive matching

## Data Processing Flow

```
Excel Row
    ↓
1. Extract Main Category → Normalize → Assign to category map
    ↓
2. Extract Program Info → Create/Get program in map
    ↓
3. Check Sub Category column
    ↓
    ├─ IF Sub-Category exists:
    │   ├─ Find or create SubCategoryData
    │   ├─ Add action to sub-category
    │   └─ Update sub-category totals
    │
    └─ IF No Sub-Category:
        ├─ Add action directly to program
        └─ Keep hasSubCategories: false
    ↓
4. Update program totals (regardless of sub-category)
    ↓
5. Update grand totals
```

## Example Use Cases

### Use Case 1: Program with Multiple Sub-Categories

**Excel Data:**

```
Main Category: Szczepienia
Program: Programy profilaktyki chorób zakaźnych
Sub Category: WZW
Actions: [Wykład, Prezentacja]

Sub Category: Grypa
Actions: [Ulotki, Poster]
```

**Result:**

- One program card with 2 sub-category sections
- Each sub-category shows its own actions and totals
- Program total = sum of both sub-categories

### Use Case 2: Mixed Program (Some Rows with Sub-Categories, Some Without)

**Excel Data:**

```
Main Category: Inne
Program: Promocja zdrowia
Sub Category: (empty)
Actions: [Wykład]

Sub Category: Dieta
Actions: [Prezentacja, Ulotki]
```

**Result:**

- Program has `hasSubCategories: true`
- "Dieta" sub-category shown separately
- Actions without sub-category grouped under an empty sub-category name

### Use Case 3: Program Without Any Sub-Categories

**Excel Data:**

```
Main Category: Inne
Program: Bezpieczne ferie
Sub Category: (all empty)
Actions: [Zabawa, Konkurs]
```

**Result:**

- Program has `hasSubCategories: false`
- All actions displayed in single table directly under program

## Benefits

1. **Better Organization**: Related activities grouped logically
2. **Detailed Statistics**: Sub-category level insights
3. **Flexibility**: Supports both flat and hierarchical program structures
4. **Clarity**: Visual distinction between programs with/without sub-categories
5. **Scalability**: Easy to add more sub-categories without code changes

## Testing Checklist

- [ ] Program with single sub-category
- [ ] Program with multiple sub-categories
- [ ] Program without any sub-categories
- [ ] Mixed data (some rows with, some without sub-categories)
- [ ] Totals accuracy at all levels
- [ ] Visual rendering of sub-categories
- [ ] Empty/null sub-category values handled correctly
- [ ] Polish column name "Podkategoria" works
- [ ] English column name "Sub Category" works

## Future Enhancements

- Color coding for different sub-categories
- Collapsible sub-category sections
- Sub-category filtering
- Export with sub-category grouping maintained
- Sub-category comparison charts
