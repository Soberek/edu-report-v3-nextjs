# Sub-Category Grouping Feature

## Overview

The Budget Meter's "Main Categories" tab now implements intelligent sub-category grouping where data from multiple programs with the same sub-category is automatically aggregated.

## Key Concept

Instead of displaying programs with nested sub-categories, the system now **groups BY sub-category** and shows example programs that belong to each sub-category.

### Example:

If you have:

- Program A with sub-category "WZW"
- Program B with sub-category "WZW"
- Program C with sub-category "HIV"

The display will show:

```
🔗 WZW (sub-category group)
   ├─ Aggregated from 2 programs
   ├─ Example programs: "Program A", "Program B"
   └─ Combined actions and people counts

🔗 HIV (sub-category group)
   ├─ Aggregated from 1 program
   ├─ Example programs: "Program C"
   └─ Actions and people counts

📌 Program D (no sub-category)
   └─ Standard program display
```

## Data Structure

### CategoryProgramData Interface

Each item in the programs array can represent either:

1. **Sub-Category Group** (`isSubCategoryGroup: true`)

   - `programName`: The sub-category name (e.g., "WZW")
   - `programType`: Empty or inherited from first program
   - `isSubCategoryGroup`: `true`
   - `examplePrograms`: Array of up to 3 program names
   - `totalProgramCount`: Total number of programs aggregated
   - `totalPeople`: Sum of all people from all programs
   - `totalActions`: Sum of all actions from all programs
   - `actions`: Merged and deduplicated action list

2. **Standalone Program** (`isSubCategoryGroup: false`)
   - `programName`: The actual program name
   - `programType`: The program type
   - `isSubCategoryGroup`: `false`
   - `examplePrograms`: Empty array
   - `totalProgramCount`: 0
   - `totalPeople`: People count for this program
   - `totalActions`: Action count for this program
   - `actions`: Action list for this program

## Aggregation Logic

### Grouping Key Strategy

```typescript
// For items WITH sub-category
const key = subCategory; // e.g., "WZW"

// For items WITHOUT sub-category
const key = `NO_SUB::${programType}::${programName}`; // e.g., "NO_SUB::Edukacja::Program X"
```

### Action Aggregation

Actions from multiple programs are merged by action name:

- Same action names → counts are summed
- Different action names → kept separate
- Result: Complete list of all unique actions with aggregated counts

## Console Logging

The feature includes comprehensive logging to help understand the aggregation process:

```
📋 AGGREGATION SUMMARY
==========================================================

🔗 Sub-Category: "WZW"
   ├─ Total rows: 145
   ├─ Programs aggregated: 2
   │  ├─ "Program A (Edukacja)"
   │  └─ "Program B (Profilaktyka)"

🔗 Sub-Category: "HIV"
   ├─ Total rows: 67
   ├─ Programs aggregated: 1
   │  └─ "Program C (Badania)"

📌 Program D (Edukacja)
   └─ Total rows: 23

==========================================================
📊 GRAND TOTALS
==========================================================
👥 Total People: 1,234
🎯 Total Actions: 235
📁 Total Items: 3
🏷️  Total Categories: 5
==========================================================
```

## UI Display

### Sub-Category Groups

- **Title**: 🔗 [Sub-Category Name]
- **Subtitle**: "Podkategoria obejmująca X program(y/ów)"
- **Example Programs**: Chips showing up to 3 program names
- **Overflow Indicator**: "+X więcej" chip if there are more programs
- **Statistics**: Total people and actions aggregated across all programs
- **Actions Table**: Complete merged action list

### Standalone Programs

- **Title**: [Program Name]
- **Subtitle**: "Typ programu: [Type]"
- **Statistics**: Program-specific people and action counts
- **Actions Table**: Program-specific actions

## Excel Data Requirements

The system reads the following columns from Excel files:

- **Main Category** (or "Kategoria główna"): Required for top-level categorization
- **Sub Category** (or "Podkategoria"): Optional - triggers grouping when present
- **Program Name** / **Program Type**: For program identification
- **Action Name** / **People** / **Action Number**: For aggregation

## Benefits

1. **Automatic Grouping**: No manual configuration needed
2. **Clear Attribution**: See which programs contribute to each sub-category
3. **Aggregated Insights**: View combined statistics for related programs
4. **Flexible Display**: Works with or without sub-categories
5. **Debug-Friendly**: Comprehensive console logging
6. **Performance**: Efficient Map-based aggregation

## Edge Cases Handled

1. **No Sub-Category**: Programs display normally
2. **Single Program in Sub-Category**: Still displays as group (for consistency)
3. **Many Programs**: Shows first 3 examples + overflow count
4. **Mixed Categories**: Some programs with/without sub-categories work together
5. **Duplicate Actions**: Properly merged with summed counts
6. **Empty Data**: Graceful "No data" message

## Testing

To test the feature:

1. Upload Excel file with "Sub Category" column
2. Check console for aggregation summary
3. Verify sub-category groups show correct example programs
4. Confirm totals match sum of individual programs
5. Test with files that have no sub-categories (should work normally)

## Future Enhancements

Potential improvements:

- Expandable list to show all programs (not just first 3)
- Filter by sub-category
- Export aggregated data
- Visual indicator for group vs individual program
- Sort by sub-category name or program count
