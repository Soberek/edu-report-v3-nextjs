# Console Logging Reference - Main Categories Aggregation

## Overview

The `aggregateByMainCategories()` function now includes comprehensive console logging to help track how data is being connected and grouped.

## Console Output Structure

### 1. Start Message

```
🔄 Starting aggregation by main categories...
📊 Total rows to process: [number]
```

### 2. Program Discovery (Per Unique Program)

Each time a new program is encountered:

```
✨ New Program Found [Row X]:
  📁 Main Category: [category name]
  🏷️  Program Type: [programowy/nieprogramowy]
  📝 Program Name: [program name]
```

### 3. Sub-Category Discovery (Per Unique Sub-Category within Program)

When a new sub-category is found for a program:

```
  🔗 Sub-Category: "[sub-category name]" (Row X)
```

### 4. Aggregation Summary

At the end, a detailed summary is displayed:

```
============================================================
📋 AGGREGATION SUMMARY
============================================================

📌 [Program Name] ([Program Type])
   ├─ Total rows connected: [number]
   ├─ Has sub-categories: YES ([count])
   │  └─ "[Sub-Category 1]"
   │  └─ "[Sub-Category 2]"

📌 [Another Program Name] ([Program Type])
   ├─ Total rows connected: [number]
   └─ Has sub-categories: NO

============================================================
📊 GRAND TOTALS
============================================================
👥 Total People: [formatted number]
🎯 Total Actions: [formatted number]
📁 Total Programs: [count]
🏷️  Total Categories: [count]
============================================================
```

## Example Console Output

### Example with Sub-Categories

```
🔄 Starting aggregation by main categories...
📊 Total rows to process: 15

✨ New Program Found [Row 1]:
  📁 Main Category: Szczepienia
  🏷️  Program Type: programowy
  📝 Program Name: Podstępne WZW
  🔗 Sub-Category: "WZW" (Row 1)

✨ New Program Found [Row 3]:
  📁 Main Category: Szczepienia
  🏷️  Program Type: programowy
  📝 Program Name: Podstępne WZW
  🔗 Sub-Category: "Wirusowe zapalenie wątroby" (Row 3)

✨ New Program Found [Row 5]:
  📁 Main Category: Inne
  🏷️  Program Type: nieprogramowy
  📝 Program Name: Bezpieczne ferie

============================================================
📋 AGGREGATION SUMMARY
============================================================

📌 Podstępne WZW (programowy)
   ├─ Total rows connected: 4
   ├─ Has sub-categories: YES (2)
   │  └─ "WZW"
   │  └─ "Wirusowe zapalenie wątroby"

📌 Bezpieczne ferie (nieprogramowy)
   ├─ Total rows connected: 2
   └─ Has sub-categories: NO

============================================================
📊 GRAND TOTALS
============================================================
👥 Total People: 350
🎯 Total Actions: 12
📁 Total Programs: 2
🏷️  Total Categories: 2
============================================================
```

## What to Look For

### ✅ Successful Connections

- Same program name appearing once in "New Program Found"
- Multiple rows with same program being counted in "Total rows connected"
- Sub-categories being grouped under one program

### ⚠️ Potential Issues

- Same program appearing multiple times as "New Program Found" → Check for typos or extra spaces in program names
- Expected sub-categories not showing up → Check column name ("Sub Category" or "Podkategoria")
- Wrong row counts → Data might have unexpected duplicates or missing values

## Debug Tips

1. **Check Row Numbers**: The console shows which row each program/sub-category first appears
2. **Verify Connections**: "Total rows connected" should match your expectation for each program
3. **Sub-Category Count**: Compare sub-category count with your Excel data
4. **Grand Totals**: Verify totals match your raw data sums

## When to Review Console Output

- **First Time Loading Data**: Verify all programs are detected correctly
- **After Data Changes**: Check if new programs/sub-categories are added
- **Debugging**: When aggregated numbers don't match expectations
- **Data Quality Check**: Spot duplicate or inconsistent entries

## Disabling Logs (If Needed)

To disable logs in production, you can:

1. Comment out all `console.log()` statements
2. Add a flag at the top of the function:
   ```typescript
   const DEBUG = false;
   if (DEBUG) console.log(...);
   ```
3. Use a proper logging library with levels (info, debug, error)

## Performance Note

Console logging is relatively fast, but if you have thousands of rows:

- The "New Program Found" messages are only shown once per unique program
- Sub-category messages are only shown once per unique sub-category per program
- Most logging happens before heavy processing
- Summary generation is O(n) where n = number of unique programs
