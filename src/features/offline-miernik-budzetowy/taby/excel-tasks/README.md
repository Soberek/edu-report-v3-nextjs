# Excel Tasks Feature# Excel Tasks Feature# 📊 Excel Tasks Tab - Generowanie Dokumentów IZRZ

IZRZ Document Generation form with Excel integration.IZRZ Document Generation form with Excel integration.## 🎯 Cel

## 📁 Folder Structure## ArchitectureModuł umożliwia:

``````- 📋 Wczytanie pliku Excel z danymi zadań edukacyjnych

excel-tasks/

├── index.ts                         # Feature barrel exportexcel-tasks/- 👀 Przeglądanie wszystkich wierszy w interaktywnej tabeli

├── README.md                        # This file

│├── GenerateDocumentDialog.tsx       # Main dialog component- 📥 Generowanie dokumentu Word IZRZ dla każdego wiersza osobno

├── ExcelTasksTable.tsx              # Table display component

│├── index.ts                         # Barrel export- 📅 Formatowanie dat do standardu DD-MM-YYYY

├── components/                      # UI Components

│   ├── index.ts                     # Components barrel export├── schemas/                         # Zod validation schemas- 🎨 Kolorowanie kolumn liczbowych

│   ├── GenerateDocumentDialog.tsx   # Main dialog (orchestrator)

│   └── sections/                    # Form sections (presentational)│   ├── generateDocument.schema.ts

│       ├── index.ts

│       ├── IdentifiersSection.tsx│   └── index.ts## 🚀 Szybki Start

│       ├── ProgramNameSection.tsx

│       ├── TaskTypeSection.tsx├── types/                           # TypeScript interfaces

│       ├── LocationSection.tsx

│       ├── DateSection.tsx│   ├── SectionProps.ts### Krok 1: Przygotuj plik Excel

│       ├── ParticipantsSection.tsx

│       ├── ScopeSection.tsx│   ├── dialog.types.ts

│       ├── NotesSection.tsx

│       └── AttachmentsSection.tsx│   └── index.tsUpewnij się, że Twój plik Excel zawiera te kolumny (patrz `REQUIRED_COLUMNS.md` dla szczegółów):

│

├── hooks/                           # Custom Hooks├── components/                      # Presentational components

│   ├── index.ts                     # Hooks barrel export

│   ├── useGenerateDocumentForm.ts  # Form state & validation│   ├── IdentifiersSection.tsx```

│   └── useGenerateDocument.ts      # Document generation workflow

││   ├── ProgramNameSection.tsxNr informacji | Znak sprawy | Typ programu | Nazwa programu | Działanie | Data | Liczba ludzi | ...

├── schemas/                         # Zod Validation Schemas

│   ├── index.ts                     # Schemas barrel export│   ├── TaskTypeSection.tsx```

│   └── generateDocument.schema.ts

││   ├── LocationSection.tsx

├── types/                           # TypeScript Interfaces

│   ├── index.ts                     # Types barrel export│   ├── DateSection.tsx### Krok 2: Wczytaj plik

│   ├── SectionProps.ts              # Section component props

│   └── dialog.types.ts              # Dialog component props│   ├── ParticipantsSection.tsx

│

├── utils/                           # Pure Utilities│   ├── ScopeSection.tsx1. Przejdź do zakładki **"Wszystkie zadania z Excel"** w offline-miernik-budżetowy

│   ├── index.ts                     # Utils barrel export

│   ├── dateUtils.ts                 # Date parsing/formatting (12+ formats)│   ├── NotesSection.tsx2. Wczytaj plik Excel (przycisk Upload)

│   └── numberUtils.ts               # Number parsing

││   ├── AttachmentsSection.tsx3. Dane pojawią się w tabeli poniżej

└── __tests__/                       # Unit Tests

    └── utils.test.ts│   └── index.ts

```

├── hooks/                           # Custom hooks### Krok 3: Generuj dokumenty

## 🏗️ Component Structure

│   └── useGenerateDocumentForm.ts  # Form state management

### GenerateDocumentDialog

Located in `components/GenerateDocumentDialog.tsx`├── utils/                           # Pure utility functions1. Każdy wiersz ma przycisk **📥 FileDownload** po prawej stronie



**Responsibility:** Orchestrate form UI and submission│   ├── dateUtils.ts                 # Date parsing/formatting2. Kliknij przycisk dla wybranego wiersza

- Renders all 9 form sections

- Manages submission error state│   ├── numberUtils.ts               # Number parsing3. Dokument Word zostanie wygenerowany z danymi z tego wiersza

- Delegates form logic to `useGenerateDocumentForm` hook

│   └── index.ts4. Plik pobierze się automatycznie

```typescript

interface GenerateDocumentDialogProps {└── __tests__/                       # Unit tests

  readonly open: boolean;

  readonly onClose: () => void;    └── utils.test.ts## 📁 Struktura Plików

  readonly rowData: ExcelRow;

  readonly rowIndex: number;````

  readonly onSubmit: (data: GenerateDocumentFormData) => Promise<void>;

  readonly isLoading?: boolean;````

}

```## Componentsexcel-tasks/



### Section Components (components/sections/)├── ExcelTasksTable.tsx          # Komponent główny tabeli

**9 pure presentational components**, each ~25-30 lines:

- `IdentifiersSection` - Report ID, case number### GenerateDocumentDialog├── useGenerateDocument.ts       # Hook do generowania dokumentu

- `ProgramNameSection` - Program name

- `TaskTypeSection` - Task formMain dialog orchestrator component. Responsibilities:├── index.ts                     # Barrel export

- `LocationSection` - Address

- `DateSection` - Date (DD.MM.YYYY)- Render form sections├── REQUIRED_COLUMNS.md          # Dokumentacja kolumn

- `ParticipantsSection` - Participant count & description

- `ScopeSection` - Task description (auto-expanding)- Handle form submission└── README.md                    # Ten plik

- `NotesSection` - Additional notes

- `AttachmentsSection` - Checkboxes- Manage error state```



All receive the same props interface:- Delegate form logic to `useGenerateDocumentForm` hook

```typescript

interface SectionProps {## 🔧 Komponenty i Hooki

  readonly control: any;           // react-hook-form control

  readonly errors: any;             // form errorsProps:

  readonly isLoading: boolean;

}```typescript### `ExcelTasksTable`

```

interface GenerateDocumentDialogProps {

### ExcelTasksTable

Located in `ExcelTasksTable.tsx`  readonly open: boolean;Główny komponent wyświetlający tabelę z zadaniami.



Displays Excel data in table with action column to generate documents per row.  readonly onClose: () => void;



## 🪝 Custom Hooks (hooks/)  readonly rowData: ExcelRow;**Props:**



### useGenerateDocumentForm  readonly rowIndex: number;

Manages form state, validation, and data transformation.

  readonly onSubmit: (data: GenerateDocumentFormData) => Promise<void>;```typescript

- Sets up react-hook-form with Zod resolver

- Prefills form with Excel data  readonly isLoading?: boolean;interface ExcelTasksTableProps {

- Handles 12+ date formats (parses to ISO, displays as DD.MM.YYYY)

- Parses numbers and booleans}  rawData: ExcelRow[]; // Dane z pliku Excel

- Validates form via Zod schema

```}

### useGenerateDocument

Manages document generation workflow.````



- Dialog open/close state### Section Components

- Fetches Word template

- Sends API requestEach section is a **presentational-only** component that receives form state via props.**Funkcje:**

- Downloads generated document

- Shows notifications- `IdentifiersSection` - Report ID and case number- Wyświetla wybrane 8 kolumn



## 📋 Schemas (schemas/)- `ProgramNameSection` - Intervention name- Formatuje daty do DD-MM-YYYY



### generateDocument.schema.ts- `TaskTypeSection` - Task form- Koloruje kolumny liczbowe

Zod validation for IZRZ form.

- `LocationSection` - Institution address- Obsługuje puste komórki

Validates:

- Required fields: reportNumber, caseNumber, programName, address- `DateSection` - Task completion date- Integruje przycisk generowania dokumentu dla każdego wiersza

- Date (12+ formats) → converts to YYYY-MM-DD

- Participant count (non-negative integer)- `ParticipantsSection` - Target group and count

- Optional: descriptions, notes

- Booleans: attachments- `ScopeSection` - Task description with auto-expanding textarea### `useGenerateDocument`



## 🔧 Utilities (utils/)- `NotesSection` - Additional remarks



### dateUtils.ts- `AttachmentsSection` - Attachment checkboxesHook do generowania i pobierania dokumentu Word.

**Functions:**

- `parseDateToIso(date: unknown): string` - Any format → ISO YYYY-MM-DDProps:**Parametry:**

- `formatDateDisplay(isoDate: string): string` - ISO → DD.MM.YYYY

- `getSupportedDateFormats(): string[]`````typescript

- `getDateDisplayFormat(): string`

interface SectionProps {```typescript

**Supported formats (12+):**

```  readonly control: any;interface GenerateDocumentParams {

YYYY-MM-DD, DD.MM.YYYY, DD-MM-YYYY, DD/MM/YYYY,

YYYY-MM-DDTHH:mm:ss.SSSZ (ISO with timezone),  readonly errors: any;  rowData: ExcelRow; // Dane z wybranego wiersza

Excel serial numbers,

And more...  readonly isLoading: boolean;  rowIndex: number; // Indeks wiersza

```

}}

### numberUtils.ts

- `parseViewerCount(count: unknown): number`````



## 🧪 Testing (__tests__/)## Hooks**Zwraca:**



Unit tests for utilities:### useGenerateDocumentForm```typescript



```bashManages form state, validation, and data transformation.interface UseGenerateDocumentReturn {

pnpm test

```isLoading: boolean; // Czy trwa generowanie



Tests cover:````typescript isError: boolean; // Czy był błąd

- Date parsing (multiple formats, edge cases, invalid input)

- Number parsing (strings, nulls, negatives)function useGenerateDocumentForm(rowData: ExcelRow, rowIndex: number): UseFormReturn<GenerateDocumentFormData>  generateDocument: () => Promise<void>; // Funkcja do wygenerowania

- Utility functions

```}

## 📦 Imports/Exports

````

All folders have `index.ts` barrel exports for clean imports:

Responsibilities:

```typescript

// ✅ Clean imports- Setup react-hook-form with Zod resolver**Proces:**

import { GenerateDocumentDialog } from "./components";

import { useGenerateDocument, useGenerateDocumentForm } from "./hooks";- Initialize form with default values

import { generateDocumentFormSchema } from "./schemas";

- Reset form when rowData changes1. Pobiera szablon z `/generate-templates/izrz.docx`

// ✅ Feature-level imports

import { GenerateDocumentDialog, useGenerateDocument } from "./excel-tasks";- Transform Excel data (parsing dates, numbers)2. Mapuje dane z wiersza na pola IZRZ

```

- Handle validation via Zod schema3. Wysyła do `/api/generate-izrz`

## 🎯 Usage Example

4. Pobiera wygenerowany plik Word

```typescript

import { GenerateDocumentDialog, useGenerateDocument } from "./excel-tasks";## Utilities5. Pokazuje powiadomienie o sukcesie/błędzie



export function TaskTable() {### dateUtils.ts## 📊 Wyświetlane Kolumny

  const { isLoading, isDialogOpen, openDialog, closeDialog, generateDocument } =

    useGenerateDocument({ rowData: excelRow, rowIndex: 0 });Date parsing and formatting utilities.



  return (Tabela wyświetla 8 kluczowych kolumn:

    <>

      <button onClick={openDialog}>Generate Document</button>**Functions:**



      <GenerateDocumentDialog- `parseDateToIso(date: unknown): string` - Convert any format to ISO YYYY-MM-DD1. **Nr informacji** - Unikalny numer

        open={isDialogOpen}

        onClose={closeDialog}- `formatDateDisplay(isoDate: string): string` - Convert ISO to DD.MM.YYYY2. **Działanie** - Opis zadania

        rowData={excelRow}

        rowIndex={0}- `getSupportedDateFormats(): string[]` - Get list of supported formats3. **Data** - Formatowana do DD-MM-YYYY

        onSubmit={generateDocument}

        isLoading={isLoading}- `getDateDisplayFormat(): string` - Get display format string4. **Liczba działań** - Wyróżniona na niebiesko (liczba)

      />

    </>5. **Liczba ludzi** - Wyróżniona na niebiesko (liczba)

  );

}**Supported input formats (12+):**6. **Nazwa programu** - Pogrubiona

```

- `YYYY-MM-DD`7. **Osoba odpowiedzialna** - Pogrubiona

## ✨ Design Principles

- `YYYY-MM-DDTHH:mm:ss.SSSZ` (ISO with timezone)8. **Typ programu** - Pogrubiona

| Principle | Implementation |

|-----------|-----------------|- `DD.MM.YYYY`

| **SRP** | Each file has ONE clear responsibility |

| **Feature-based** | Organized by feature, not type |- `DD-MM-YYYY`## 🎨 Formatowanie i Styling

| **Barrel exports** | Clean imports via index.ts at each level |

| **Composition** | Sections compose into main dialog |- `DD/MM/YYYY`

| **Type-safe** | Full TypeScript + Zod validation |

| **Testable** | Isolated utilities, hooks, components |- Excel serial numbers### Daty

| **DRY** | No duplicate date/number parsing |

| **Scalable** | Add sections without modifying existing code |- And more...



## 📚 Related Files- **Format wejściowy:** Dowolny format rozpoznany przez JavaScript



- `/src/features/offline-miernik-budzetowy/taby/excel-tasks/ExcelTasksTable.tsx` - Uses dialog### numberUtils.ts- **Format wyświetlony:** DD-MM-YYYY (08-11-2024)

- `/src/app/api/generate-izrz/route.ts` - API endpoint

Number parsing utilities.

### Kolumny liczbowe

**Functions:**

- `parseViewerCount(count: unknown): number` - Parse participant count- Wyróżnione **niebieskim** kolorem

- Wyrównane do **prawej** strony

## Schemas- **Pogrubione**

### generateDocument.schema.ts### Kolumny tekstowe

Zod validation schema for IZRZ document form.

- Wyróżnione kluczowe kolumny (pogrubienie)

Validates:- Domyślny kolor tekstu

- Required text fields (reportNumber, caseNumber, programName, address)

- Date format (12+ formats, converts to ISO)### Puste komórki

- Participant count (non-negative integer)

- Optional fields (descriptions, notes)- Wyświetlane jako **"-"** zamiast pustej przestrzeni

- Boolean attachments

## 🔄 Mapowanie Danych

## Types

Dane z wiersza Excel są automatycznie mapowane na pola dokumentu:

### SectionProps

Interface for all section components.```typescript

Nr informacji → reportNumber

### GenerateDocumentDialogPropsZnak sprawy → caseNumber

Interface for main dialog component.Typ programu → taskType

Nazwa programu → programName

## TestingDziałanie → taskDescription

Data → dateInput

Run unit tests:Liczba ludzi → viewerCount

````bashLiczba działań         → viewerCountDescription

pnpm testAdres/Szkoła           → address

```Dodatkowe informacje   → additionalInfo

Lista obecności        → attachmentList

Tests cover:Rozdzielnik            → rozdzielnik

- Date parsing edge cases (multiple formats, invalid input)```

- Number parsing (strings, nulls, edge cases)

- Utility functions## ⚠️ Wymagania

- Component rendering (basic smoke tests)

**Obowiązkowe kolumny w Excelu:**

## Usage

- Nr informacji

```typescript- Typ programu

import { GenerateDocumentDialog } from "./excel-tasks";- Nazwa programu

- Działanie

export function MyComponent() {- Data

  const [open, setOpen] = useState(false);- Liczba ludzi

  const [isLoading, setIsLoading] = useState(false);- Adres (lub Szkoła/Osoba odpowiedzialna)



  const handleSubmit = async (data: GenerateDocumentFormData) => {**Opcjonalne kolumny:**

    setIsLoading(true);

    try {- Liczba działań

      // Send to API- Dodatkowe informacje

      await generateDocument(data);- Lista obecności

    } finally {- Rozdzielnik

      setIsLoading(false);- Numer IZRZ

    }- Znak sprawy

  };

## 🔐 Bezpieczeństwo i Walidacja

  return (

    <GenerateDocumentDialog- ✅ TypeScript strict mode

      open={open}- ✅ Zod validation na backendzie

      onClose={() => setOpen(false)}- ✅ Obsługa błędów na frontendzie

      rowData={excelRow}- ✅ Sanityzacja nazw plików

      rowIndex={0}- ✅ Limit rozmiaru pliku: 10MB (szablon)

      onSubmit={handleSubmit}

      isLoading={isLoading}## 🐛 Debugging

    />

  );### Konsola przeglądarki

}

```- Przycisk generuje zaledwie `console.log` dla każdego kroku

- Sprawdź Network tab dla żądań API

## Architecture Principles- Sprawdź błędy CORS jeśli pojawią się problemy



1. **Single Responsibility** - Each file has one clear purpose### Błędy API

2. **Composition** - Sections compose into main dialog

3. **Dependency Injection** - Form state passed via props- 400: Walidacja danych - sprawdź `REQUIRED_COLUMNS.md`

4. **Pure Functions** - Utilities have no side effects- 500: Błąd generowania - sprawdź szablon

5. **Type Safety** - Full TypeScript with Zod validation- Network error: Problem z połączeniem

6. **Testability** - Isolated components, mockable dependencies

## 📝 Notatki Implementacyjne

## Related Files

### Performance

- `/src/features/offline-miernik-budzetowy/taby/excel-tasks/ExcelTasksTable.tsx` - Uses dialog

- `/src/app/api/generate-izrz/route.ts` - API endpoint for document generation- Tabela memoizowana (`React.memo`)

- Kolumny memoizowane (`useMemo`)
- Komponent wiersza memoizowany dla optymalizacji

### UX

- Loading spinner podczas generowania
- Tooltip na przycisku akcji
- Powiadomienia o sukcesie/błędzie
- Sticky header i kolumna akcji

### Architektura

- **SRP**: Każdy plik ma jedną odpowiedzialność
- **Reusability**: Hook można użyć w innych miejscach
- **Testability**: Funkcje pure i dependency injection

## 🔮 Możliwe Rozszerzenia

- [ ] Generowanie wielu dokumentów naraz (batch)
- [ ] Export do PDF
- [ ] Edycja danych bezpośrednio w tabeli
- [ ] Filtrowanie i sortowanie
- [ ] Custom mapping kolumn przez UI
- [ ] Podgląd dokumentu przed pobraniem
- [ ] Szablony dynamiczne

## 📚 Powiązane Dokumenty

- `REQUIRED_COLUMNS.md` - Szczegółowy opis wszystkich kolumn
- `/api/generate-izrz` - Endpoint do generowania dokumentów
- `wygeneruj-izrz` - Moduł formularza (powiązany)

---

**Ostatnia aktualizacja:** 2024-11-08
**Autor:** Clean Code Engineer
**Status:** ✅ Produkcja
````
``````
