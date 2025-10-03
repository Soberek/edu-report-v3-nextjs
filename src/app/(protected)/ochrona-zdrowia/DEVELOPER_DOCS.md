# Ochrona Zdrowia - Excel Aggregation Module

## 📋 Overview

A complete Next.js module for aggregating health inspection data from multiple Excel files. This tool processes up to 10 Excel files with standardized structure and generates a consolidated report.

## ✨ Features

- **Multi-file Upload**: Upload up to 10 Excel files simultaneously
- **Real-time Validation**: Automatic validation of file format and data structure
- **Progress Tracking**: Visual feedback for each file processing status
- **Data Aggregation**: Automatic summation of values across all files
- **Excel Export**: Generate a properly formatted Excel report with merged cells
- **Error Handling**: Detailed error messages for each file
- **Responsive UI**: Built with Material-UI for a modern interface

## 📁 File Structure

```
ochrona-zdrowia/
├── page.tsx                                    # Main page component
├── components/
│   ├── HealthInspectionAggregator.tsx         # Main UI component
│   └── AggregatedDataTable.tsx                # Results table component
├── hooks/
│   └── useHealthInspectionAggregator.ts       # Business logic hook
├── utils/
│   ├── fileProcessing.ts                      # File processing utilities
│   ├── exampleGenerator.ts                    # Example file generator
│   └── __tests__/
│       └── fileProcessing.test.ts             # Unit tests (12 tests)
├── types/
│   └── index.ts                               # TypeScript types and schemas
└── README.md                                  # User documentation
```

## 🧪 Testing

All tests passing ✅ (12/12)

```bash
npm test -- src/app/\(protected\)/ochrona-zdrowia
```

### Test Coverage:

- ✅ File validation (format, size, extension)
- ✅ Data structure validation
- ✅ Data aggregation logic
- ✅ Empty value handling
- ✅ String to number conversion
- ✅ Multiple file aggregation

## 🚀 Usage

### Access the Module:

Navigate to `/ochrona-zdrowia` in your application or use the navigation menu: **Tools → Ochrona zdrowia - agregacja**

### Step-by-Step:

1. **Upload Files**

   - Click "Wybierz Pliki"
   - Select 1-10 Excel files (.xlsx or .xls)
   - Wait for automatic processing

2. **Review Status**

   - Check each file's status (✅ Gotowy / ❌ Błąd)
   - Remove problematic files if needed

3. **Aggregate Data**

   - Click "Agreguj Dane" button
   - Review the aggregated results table

4. **Export Report**
   - Enter the month/year (e.g., "sierpień 2025")
   - Click "Pobierz Raport Excel"
   - Excel file downloads automatically

## 📊 Data Structure

### Input Excel Format:

Each file should contain:

- Header rows (rows 1-4): Title and metadata
- Column headers (rows 5-6): "RODZAJ OBIEKTU", "LICZBA SKONTROLOWANYCH OBIEKTÓW", etc.
- Data rows (rows 7-16): 10 facility types with numeric values
- Summary row: "RAZEM:" (automatically skipped during processing)

### 10 Facility Types:

1. przedsiębiorstwa podmiotów leczniczych
2. jednostki organizacyjne systemu oświaty
3. jednostki organizacyjne pomocy społecznej
4. uczelnie wyższe
5. zakłady pracy
6. obiekty kultury i wypoczynku
7. lokale gastronomiczno-rozrywkowe
8. obiekty służące obsłudze podróżnych
9. pomieszczenia obiektów sportowych
10. inne pomieszczenia użytku publicznego

## 🛠️ Technical Details

### Technologies:

- **React 19** with Next.js 15
- **TypeScript** for type safety
- **Material-UI (MUI)** for components
- **xlsx** library for Excel processing
- **Zod** for data validation
- **Vitest** for testing

### Key Features:

**Validation**:

- File type checking (xlsx/xls only)
- File size limit (10MB max)
- Data structure validation with Zod schemas
- Required field checking

**Data Processing**:

- Reads Excel starting from row 5
- Filters out empty rows and "RAZEM" rows
- Normalizes facility type names
- Converts string numbers to numeric values
- Handles empty/undefined values as 0

**Export Features**:

- Merged cells in headers
- Proper column widths
- Automatic total calculations
- Timestamp in filename

## 🔧 Configuration

### Constants (types/index.ts):

```typescript
MAX_FILES = 10              // Maximum files allowed
MAX_FILE_SIZE = 10MB        // Maximum file size
VALID_FILE_EXTENSIONS = ['.xlsx', '.xls']
```

### Customization:

To add/modify facility types, edit `FACILITY_TYPES` array in `types/index.ts`

## 🐛 Troubleshooting

| Issue                         | Solution                                          |
| ----------------------------- | ------------------------------------------------- |
| "Nieprawidłowy format pliku"  | Check file extension (.xlsx or .xls)              |
| "Plik jest za duży"           | File exceeds 10MB limit                           |
| "Nieprawidłowy format danych" | Verify Excel structure matches requirements       |
| "Plik nie zawiera danych"     | Ensure data starts from row 5 with proper columns |

## 📝 Example Data Generator

For testing purposes, use the example generator:

```typescript
import { generateExampleExcelFile, generateMultipleExampleFiles } from "./utils/exampleGenerator";

// Generate single example file
generateExampleExcelFile("sierpień 2025");

// Generate multiple files for testing aggregation
generateMultipleExampleFiles(3);
```

## 🔐 Security

- File processing happens client-side (browser)
- No data sent to external servers
- File size limits prevent memory issues
- Input validation prevents malicious data

## 📈 Performance

- Files processed sequentially to prevent memory issues
- Progress indicators for user feedback
- Efficient data structures for aggregation
- Optimized for up to 10 files with ~1000 rows each

## 🎨 UI Components

### Main Components:

1. **File Upload Area**: Drag & drop or click to upload
2. **File List**: Shows all uploaded files with status
3. **Aggregation Button**: Triggers data processing
4. **Results Table**: Displays aggregated data
5. **Export Section**: Month input and download button

### Status Indicators:

- 🕐 Pending (grey)
- ⏳ Processing (blue)
- ✅ Success (green)
- ❌ Error (red)

## 🔄 Updates & Maintenance

### Adding New Facility Types:

1. Update `FACILITY_TYPES` in `types/index.ts`
2. Tests will automatically include new types
3. Export format will adjust automatically

### Modifying Validation Rules:

Edit `HealthInspectionRowSchema` in `types/index.ts`

## 📚 Related Modules

Similar functionality exists in:

- `/offline-miernik-budzetowy` - Budget meter with Excel processing
- File processing utilities can be found in both modules

## 🏆 Best Practices

- Always test with example files first
- Keep original files as backup
- Review aggregated data before export
- Use descriptive month names in exports
- Check file processing status before aggregating

## 📞 Support

For issues or questions:

1. Check the README.md in the module directory
2. Review error messages in the UI
3. Check browser console (F12) for detailed errors
4. Contact technical team

---

**Version**: 1.0.0  
**Last Updated**: October 3, 2025  
**Author**: Krzysztof Palpuchowski  
**License**: Internal Use Only
