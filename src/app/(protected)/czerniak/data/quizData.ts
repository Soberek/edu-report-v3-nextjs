import { QuizQuestion, MelanomaCase, ABCDEFeature, EducationalContent } from "../types";

// ABCDE Features for melanoma detection
export const ABCDE_FEATURES: ABCDEFeature[] = [
  {
    key: "A",
    name: "Asymetria",
    description: "Asymetria - jedna połowa znamienia różni się od drugiej",
    icon: "🔺",
    details: "Zdrowe znamiona są zazwyczaj symetryczne. Asymetria może wskazywać na nieprawidłowy wzrost komórek.",
  },
  {
    key: "B",
    name: "Nieregularna granica",
    description: "Brzeg - nieregularne, poszarpane lub rozmyte krawędzie",
    icon: "✂️",
    details:
      "Zdrowe znamiona mają gładkie, wyraźne granice. Nieregularne brzegi mogą wskazywać na rozprzestrzenianie się komórek nowotworowych.",
  },
  {
    key: "C",
    name: "Różnorodność kolorów",
    description: "Kolor - różne odcienie brązu, czerni, czerwieni, bieli lub niebieskiego",
    icon: "🌈",
    details: "Zdrowe znamiona mają jednolity kolor. Różnorodność kolorów może wskazywać na nieprawidłowy wzrost komórek.",
  },
  {
    key: "D",
    name: "Średnica",
    description: "Średnica większa niż 6mm (rozmiar gumki na ołówku)",
    icon: "📏",
    details: "Znamiona większe niż 6mm mają większe ryzyko bycia nowotworowymi, choć małe znamiona też mogą być niebezpieczne.",
  },
  {
    key: "E",
    name: "Ewolucja",
    description: "Zmiana w czasie - rozmiar, kształt, kolor lub objawy",
    icon: "⏳",
    details: "Każda zmiana w znamieniu powinna być zbadana przez dermatologa. Ewolucja to najważniejszy znak ostrzegawczy.",
  },
];

// Educational content
export const EDUCATIONAL_CONTENT: EducationalContent[] = [
  {
    title: "Czym jest czerniak?",
    content:
      "Czerniak to najgroźniejszy rodzaj raka skóry, który rozwija się z komórek produkujących melaninę (melanocytów). Wcześnie wykryty jest w pełni uleczalny.",
    type: "info",
    icon: "🩺",
  },
  {
    title: "Czynniki ryzyka",
    content:
      "Główne czynniki ryzyka to: ekspozycja na UV, oparzenia słoneczne w dzieciństwie, jasna karnacja, duża liczba znamion, historia rodzinna czerniaka.",
    type: "warning",
    icon: "⚠️",
  },
  {
    title: "Zapobieganie",
    content: "Używaj kremów z filtrem SPF 30+, unikaj słońca w godzinach 10-16, noś odzież ochronną, regularnie badaj skórę i znamiona.",
    type: "tip",
    icon: "💡",
  },
  {
    title: "Statystyki",
    content: "Czerniak stanowi tylko 1% wszystkich nowotworów skóry, ale odpowiada za 80% zgonów z powodu raka skóry.",
    type: "fact",
    icon: "📊",
  },
];

// Quiz questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "Która z poniższych cech NIE jest częścią systemu ABCDE do oceny znamion?",
    options: ["Asymetria", "Brzeg", "Kolor", "Gęstość", "Średnica", "Ewolucja"],
    correctAnswer: "Gęstość",
    explanation: "System ABCDE obejmuje: A-Asymetria, B-Brzeg, C-Kolor, D-Średnica, E-Ewolucja. Gęstość nie jest częścią tego systemu.",
    difficulty: "easy",
    category: "diagnosis",
    tags: ["ABCDE", "podstawy"],
  },
  {
    id: "q2",
    type: "true-false",
    question: "Czerniak może wystąpić tylko na skórze wystawionej na słońce.",
    correctAnswer: "false",
    explanation:
      "Czerniak może wystąpić wszędzie na ciele, w tym w miejscach nie wystawionych na słońce, takich jak podeszwy stóp, dłonie, pod paznokciami.",
    difficulty: "medium",
    category: "symptoms",
    tags: ["lokalizacja", "fakty"],
  },
  {
    id: "q3",
    type: "multiple-choice",
    question: "Jaki jest najważniejszy czynnik ryzyka rozwoju czerniaka?",
    options: ["Wiek", "Ekspozycja na promieniowanie UV", "Kolor włosów", "Wzrost"],
    correctAnswer: "Ekspozycja na promieniowanie UV",
    explanation:
      "Ekspozycja na promieniowanie UV, szczególnie w dzieciństwie i młodości, jest najważniejszym czynnikiem ryzyka rozwoju czerniaka.",
    difficulty: "medium",
    category: "risk-factors",
    tags: ["czynniki ryzyka", "UV"],
  },
  {
    id: "q4",
    type: "true-false",
    question: "Czerniak wcześnie wykryty ma bardzo dobre rokowania.",
    correctAnswer: "true",
    explanation:
      "Czerniak wcześnie wykryty (w stadium I) ma 5-letnie przeżycie wynoszące ponad 95%. Dlatego tak ważne są regularne badania skóry.",
    difficulty: "easy",
    category: "treatment",
    tags: ["rokowania", "wczesne wykrycie"],
  },
  {
    id: "q5",
    type: "multiple-choice",
    question: "Który z poniższych objawów może wskazywać na czerniak?",
    options: ["Swędzenie znamienia", "Krwawienie znamienia", "Zmiana koloru znamienia", "Wszystkie powyższe"],
    correctAnswer: "Wszystkie powyższe",
    explanation: "Wszystkie te objawy mogą wskazywać na czerniak i wymagają natychmiastowej konsultacji z dermatologiem.",
    difficulty: "hard",
    category: "symptoms",
    tags: ["objawy", "ostrzeżenia"],
  },
  {
    id: "q6",
    type: "scenario",
    question: "Pacjent ma znamię o średnicy 4mm, które zmieniło kolor w ciągu ostatnich 3 miesięcy. Co należy zrobić?",
    options: [
      "Poczekać i obserwować",
      "Umówić wizytę u dermatologa w ciągu tygodnia",
      "Natychmiast udać się do dermatologa",
      "Zastosować krem z filtrem",
    ],
    correctAnswer: "Umówić wizytę u dermatologa w ciągu tygodnia",
    explanation:
      "Zmiana koloru znamienia to znak ostrzegawczy (E-Ewolucja). Choć średnica jest mniejsza niż 6mm, zmiana w czasie wymaga pilnej konsultacji.",
    difficulty: "hard",
    category: "diagnosis",
    tags: ["scenariusz", "ewolucja", "diagnoza"],
  },
];

// Melanoma cases for image analysis
export const MELANOMA_CASES: MelanomaCase[] = [
  {
    id: "case1",
    imageUrl: "czerniak-1.jpg",
    correctFeatures: new Set(["A", "B", "D", "E"]),
    description: "Przypadek 1: Znamię na plecach u 45-letniego mężczyzny",
    diagnosis: "Czerniak powierzchowny rozprzestrzeniający się",
    explanation: "Znamię wykazuje asymetrię, nieregularne brzegi, jest większe niż 6mm i zmieniło się w ostatnich miesiącach.",
    difficulty: "medium",
    category: "typical",
  },
  {
    id: "case2",
    imageUrl: "czerniak-2.jpg",
    correctFeatures: new Set(["B", "C"]),
    description: "Przypadek 2: Znamię na ramieniu u 32-letniej kobiety",
    diagnosis: "Dysplastyczne znamię (znamię atypowe)",
    explanation: "Znamię ma nieregularne brzegi i różnorodność kolorów, ale nie wykazuje innych cech ABCDE.",
    difficulty: "easy",
    category: "atypical",
  },
  {
    id: "case3",
    imageUrl: "czerniak-3.jpg",
    correctFeatures: new Set(["A", "C", "E"]),
    description: "Przypadek 3: Znamię na nodze u 28-letniej kobiety",
    diagnosis: "Wczesny czerniak",
    explanation: "Znamię wykazuje asymetrię, różnorodność kolorów i ewolucję w czasie, ale ma regularne brzegi i jest mniejsze niż 6mm.",
    difficulty: "hard",
    category: "early",
  },
  {
    id: "case4",
    imageUrl: "czerniak-4.jpg",
    correctFeatures: new Set(["A", "B", "C", "D", "E"]),
    description: "Przypadek 4: Znamię na tułowiu u 55-letniego mężczyzny",
    diagnosis: "Zaawansowany czerniak",
    explanation:
      "Znamię wykazuje wszystkie cechy ABCDE - to klasyczny przykład zaawansowanego czerniaka wymagającego natychmiastowego leczenia.",
    difficulty: "easy",
    category: "advanced",
  },
];
