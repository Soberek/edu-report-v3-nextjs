# Agregacja Danych - Ochrona Zdrowia

## Opis

Moduł do agregacji danych z raportów kontroli realizacji ustawy o ochronie zdrowia przed następstwami używania tytoniu i wyrobów tytoniowych.

## Funkcjonalność

### Główne funkcje:

1. **Wczytywanie wielu plików Excel** - obsługa do 10 plików jednocześnie
2. **Automatyczna walidacja** - sprawdzanie formatu i struktury danych
3. **Agregacja danych** - sumowanie wartości z wielu raportów
4. **Generowanie raportu zbiorczego** - eksport do Excel

### Wspierane formaty plików:

- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- Maksymalny rozmiar pliku: 10MB

## Struktura danych

### Format wejściowy (każdy plik Excel):

```
Aktualna sytuacja w zakresie realizacji ustawy o ochronie zdrowia przed następstwami używania tytoniu i wyrobów tytoniowych
w województwie zachodniopomorskim, w miesiącu: sierpień 2025

Lp. | RODZAJ OBIEKTU | LICZBA SKONTROLOWANYCH OBIEKTÓW | LICZBA OBIEKTÓW, W KTÓRYCH USTAWA JEST REALIZOWANA
    |                |                                  | OGÓŁEM | W TYM Z WYKORZYSTANIEM PALARNI
----|----------------|----------------------------------|--------|--------------------------------
1   | przedsiębiorstwa podmiotów leczniczych | 16 | 16 | 0
2   | jednostki organizacyjne systemu oświaty | ... | ... | ...
... | ... | ... | ... | ...
RAZEM: | | 16 | | 0
```

### Kategorie obiektów:

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

## Jak używać

### Krok 1: Przygotowanie plików

- Przygotuj pliki Excel z danymi kontroli w standardowym formacie
- Każdy plik może reprezentować dane z innego okresu lub rejonu
- Upewnij się, że struktura kolumn jest zgodna z wymaganą

### Krok 2: Wgranie plików

1. Kliknij przycisk "Wybierz Pliki"
2. Zaznacz od 1 do 10 plików Excel
3. Poczekaj na automatyczne przetworzenie

### Krok 3: Agregacja

1. Sprawdź, czy wszystkie pliki zostały poprawnie przetworzone (status "Gotowy")
2. Kliknij przycisk "Agreguj Dane"
3. System automatycznie zsumuje wartości ze wszystkich plików

### Krok 4: Eksport

1. Sprawdź tabelę z zagregowanymi danymi
2. Podaj miesiąc i rok dla raportu (np. "sierpień 2025")
3. Kliknij "Pobierz Raport Excel"
4. Plik zostanie zapisany na dysku

## Technologia

### Stack technologiczny:

- **React** (Next.js 15) - framework aplikacji
- **TypeScript** - typowanie
- **Material-UI (MUI)** - komponenty UI
- **xlsx** - biblioteka do obsługi plików Excel
- **Zod** - walidacja danych

### Struktura plików:

```
ochrona-zdrowia/
├── page.tsx                          # Strona główna
├── components/
│   ├── HealthInspectionAggregator.tsx # Główny komponent
│   └── AggregatedDataTable.tsx        # Tabela wyników
├── hooks/
│   └── useHealthInspectionAggregator.ts # Hook zarządzający logiką
├── utils/
│   └── fileProcessing.ts              # Funkcje przetwarzania plików
├── types/
│   └── index.ts                       # Typy i schematy walidacji
└── README.md                          # Ta dokumentacja
```

## Walidacja

### Automatyczna walidacja obejmuje:

- ✅ Format pliku (xlsx/xls)
- ✅ Rozmiar pliku (max 10MB)
- ✅ Struktura kolumn
- ✅ Typy danych (liczby w odpowiednich kolumnach)
- ✅ Wymagane pola (rodzaj obiektu, liczby)

### Obsługa błędów:

- Każdy plik jest przetwarzany niezależnie
- Błędne pliki są oznaczane, ale nie blokują przetwarzania pozostałych
- Szczegółowe komunikaty o błędach dla każdego pliku

## Funkcje zaawansowane

### Normalizacja danych:

- Automatyczne czyszczenie i standaryzacja nazw obiektów
- Pomijanie wierszy "RAZEM" z oryginalnych plików
- Konwersja pustych wartości na 0

### Formatowanie eksportu:

- Zachowanie oryginalnego układu tabeli
- Łączenie komórek w nagłówkach
- Automatyczne obliczanie sum
- Odpowiednia szerokość kolumn

## Przykład użycia

```typescript
// Komponent wykorzystuje hook
const {
  files, // Lista wgranych plików
  isProcessing, // Status przetwarzania
  aggregatedData, // Zagregowane dane
  globalError, // Błędy globalne
  handleFilesUpload, // Funkcja wgrywania
  removeFile, // Usuwanie pojedynczego pliku
  clearAll, // Czyszczenie wszystkiego
  aggregateData, // Funkcja agregacji
  exportData, // Funkcja eksportu
} = useHealthInspectionAggregator();
```

## Limitacje

- Maksymalnie 10 plików jednocześnie
- Maksymalny rozmiar pojedynczego pliku: 10MB
- Wymaga JavaScript w przeglądarce
- Przetwarzanie odbywa się w przeglądarce (nie na serwerze)

## Rozwiązywanie problemów

### "Nieprawidłowy format pliku"

➡️ Sprawdź czy plik ma rozszerzenie .xlsx lub .xls

### "Nieprawidłowy format danych w pliku Excel"

➡️ Upewnij się, że struktura kolumn odpowiada wymaganej
➡️ Sprawdź czy nagłówki są poprawne

### "Plik nie zawiera danych"

➡️ Sprawdź czy plik zawiera dane w wierszach (nie tylko nagłówki)
➡️ Upewnij się, że dane zaczynają się od wiersza 5

### Pliki nie są przetwarzane

➡️ Sprawdź konsolę przeglądarki (F12) w poszukiwaniu błędów
➡️ Upewnij się, że JavaScript jest włączony

## Kontakt i wsparcie

W razie problemów lub pytań skontaktuj się z zespołem technicznym.

## Licencja

Wewnętrzne narzędzie dla województwa zachodniopomorskiego.
