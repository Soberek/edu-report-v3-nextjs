import { QuizQuestion, MelanomaCase, ABCDEFeature, EducationalContent } from "../types/index";

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
      "Czerniak (melanoma) to najgroźniejszy rodzaj raka skóry, który rozwija się z komórek produkujących melaninę - melanocytów. Te komórki znajdują się głównie w skórze, ale także w oczach, błonach śluzowych i innych narządach. Czerniak może rozwinąć się z istniejącego znamienia lub pojawić się jako nowe znamię. Wcześnie wykryty (w stadium I) ma 5-letnie przeżycie wynoszące ponad 95%, dlatego tak ważne są regularne badania skóry i znajomość objawów ostrzegawczych.",
    type: "info",
    icon: "🩺",
  },
  {
    title: "Czynniki ryzyka czerniaka",
    content:
      "Główne czynniki ryzyka rozwoju czerniaka obejmują: intensywną ekspozycję na promieniowanie UV (szczególnie w dzieciństwie), oparzenia słoneczne w przeszłości, jasną karnację skóry z piegami i rudymi włosami, dużą liczbę znamion (>50), atypowe znamiona, historię rodzinną czerniaka, osłabiony układ odpornościowy, wiek (ryzyko wzrasta z wiekiem), płeć męską, oraz ekspozycję na promieniowanie jonizujące. Osoby z jasną karnacją mają 10-20 razy większe ryzyko niż osoby z ciemną karnacją.",
    type: "warning",
    icon: "⚠️",
  },
  {
    title: "Strategie zapobiegania",
    content:
      "Skuteczna profilaktyka czerniaka wymaga wieloaspektowego podejścia: używaj kremów z filtrem SPF 30+ (aplikuj co 2 godziny), unikaj słońca w godzinach 10-16, noś odzież ochronną (kapelusz, okulary przeciwsłoneczne, długie rękawy), unikaj solariów, regularnie badaj skórę i znamiona (co miesiąc), dokumentuj zmiany fotograficznie, oraz regularnie odwiedzaj dermatologa (co roku lub częściej w przypadku wysokiego ryzyka).",
    type: "tip",
    icon: "💡",
  },
  {
    title: "Statystyki i fakty",
    content:
      "Czerniak stanowi tylko 1% wszystkich nowotworów skóry, ale odpowiada za 80% zgonów z powodu raka skóry. W Polsce rocznie diagnozuje się około 3500 nowych przypadków czerniaka. Częstość występowania wzrasta o 3-7% rocznie. Czerniak jest najczęstszym nowotworem u osób w wieku 25-29 lat. Wcześnie wykryty ma doskonałe rokowania, ale zaawansowany może być śmiertelny w ciągu kilku miesięcy.",
    type: "fact",
    icon: "📊",
  },
  {
    title: "System ABCDE - szczegółowy przewodnik",
    content:
      "System ABCDE to kluczowe narzędzie do oceny znamion: A-Asymetria (jedna połowa różni się od drugiej), B-Brzeg (nieregularne, poszarpane krawędzie), C-Kolor (różne odcienie brązu, czerni, czerwieni, bieli, niebieskiego), D-Średnica (większa niż 6mm, rozmiar gumki na ołówku), E-Ewolucja (zmiana w czasie - rozmiar, kształt, kolor, objawy). Ewolucja to najważniejszy znak ostrzegawczy - każda zmiana w znamieniu wymaga konsultacji dermatologicznej.",
    type: "info",
    icon: "🔍",
  },
  {
    title: "Objawy ostrzegawcze czerniaka",
    content:
      "Oprócz cech ABCDE, inne objawy ostrzegawcze to: swędzenie znamienia, krwawienie lub sączenie, ból w okolicy znamienia, zmiana tekstury (szorstkość, łuszczenie), pojawienie się guzka lub zgrubienia, zmiana koloru otaczającej skóry, powiększenie węzłów chłonnych. Te objawy mogą wystąpić wcześnie i wymagają natychmiastowej konsultacji dermatologicznej, nawet jeśli znamię nie spełnia kryteriów ABCDE.",
    type: "warning",
    icon: "🚨",
  },
  {
    title: "Lokalizacje czerniaka",
    content:
      "Czerniak może wystąpić wszędzie na ciele, gdzie są melanocyty. U mężczyzn najczęściej na tułowiu, u kobiet na nogach. Inne lokalizacje to: skóra głowy, twarz, szyja, plecy, klatka piersiowa, brzuch, kończyny, dłonie, podeszwy stóp, pod paznokciami (czerniak podpaznokciowy), błony śluzowe jamy ustnej, nosa, odbytu, narządów płciowych, oraz oczy (czerniak oka). Czerniak może również wystąpić w miejscach nie wystawionych na słońce.",
    type: "info",
    icon: "📍",
  },
  {
    title: "Diagnostyka i badania",
    content:
      "Diagnostyka czerniaka obejmuje: dokładne badanie dermatoskopowe (mikroskop powierzchniowy), wideodermatoskopię (dokumentacja fotograficzna), biopsję wycinającą (usunięcie całego znamienia), badanie histopatologiczne, oraz w przypadku zaawansowanego czerniaka - badania obrazowe (CT, MRI, PET). Wczesna diagnoza jest kluczowa - czerniak w stadium I ma 95% szans na wyleczenie, podczas gdy w stadium IV tylko 15-20%.",
    type: "info",
    icon: "🔬",
  },
  {
    title: "Leczenie czerniaka",
    content:
      "Leczenie czerniaka zależy od stadium: wczesny czerniak (stadium I-II) - chirurgiczne usunięcie z marginesem bezpieczeństwa, zaawansowany czerniak (stadium III-IV) - chirurgia + immunoterapia, terapia celowana, chemioterapia, radioterapia. Nowoczesne metody leczenia obejmują: immunoterapię (nivolumab, pembrolizumab), terapię celowaną (wemurafenib, dabrafenib), oraz terapię kombinowaną. Rokowania znacznie się poprawiły w ostatnich latach dzięki nowym metodom leczenia.",
    type: "info",
    icon: "💊",
  },
  {
    title: "Samobadanie skóry - krok po kroku",
    content:
      "Regularne samobadanie skóry (co miesiąc) obejmuje: badanie całego ciała w dobrze oświetlonym pomieszczeniu, użycie lustra do badania pleców i innych trudno dostępnych miejsc, zwrócenie uwagi na nowe znamiona, zmiany w istniejących znamionach, oraz znamiona o nietypowym wyglądzie. Dokumentuj zmiany fotograficznie i porównuj z poprzednimi zdjęciami. Jeśli zauważysz jakiekolwiek zmiany, niezwłocznie skonsultuj się z dermatologiem.",
    type: "tip",
    icon: "🪞",
  },
  {
    title: "Mity i fakty o czerniaku",
    content:
      "MIT: Czerniak występuje tylko u osób starszych. FAKT: Czerniak może wystąpić w każdym wieku, nawet u dzieci. MIT: Tylko znamiona na słońcu są niebezpieczne. FAKT: Czerniak może wystąpić wszędzie, nawet w miejscach nie wystawionych na słońce. MIT: Solarium jest bezpieczniejsze niż słońce. FAKT: Solarium emituje 10-15 razy więcej UV niż słońce. MIT: Czerniak zawsze boli. FAKT: Wczesny czerniak zwykle nie boli. MIT: Opalanie się chroni przed czerniakiem. FAKT: Opalanie się zwiększa ryzyko czerniaka.",
    type: "fact",
    icon: "❌",
  },
  {
    title: "Profilaktyka w różnych grupach wiekowych",
    content:
      "Dzieci (0-12 lat): unikanie oparzeń słonecznych, kremy z filtrem SPF 50+, odzież ochronna, unikanie solariów. Młodzież (13-18 lat): edukacja o ryzyku, unikanie opalania się, regularne badania skóry. Dorośli (19-50 lat): regularne samobadanie, coroczne wizyty u dermatologa, ochrona przed UV. Seniorzy (50+ lat): szczególna uwaga na nowe znamiona, regularne badania, monitorowanie zmian. Osoby z wysokim ryzykiem: częstsze badania (co 3-6 miesięcy), wideodermatoskopia, genetyczne poradnictwo.",
    type: "tip",
    icon: "👥",
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
    options: ["Prawda", "Fałsz"],
    correctAnswer: "Fałsz",
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
    options: ["Prawda", "Fałsz"],
    correctAnswer: "Prawda",
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
  {
    id: "q7",
    type: "multiple-choice",
    question: "Jaki jest minimalny współczynnik ochrony przeciwsłonecznej (SPF) zalecany dla skutecznej ochrony przed UV?",
    options: ["SPF 15", "SPF 30", "SPF 50", "SPF 100"],
    correctAnswer: "SPF 30",
    explanation: "SPF 30 blokuje około 97% promieni UVB, co jest uważane za minimalny poziom skutecznej ochrony. SPF 50 blokuje około 98%.",
    difficulty: "easy",
    category: "prevention",
    tags: ["SPF", "ochrona", "UV"],
  },
  {
    id: "q8",
    type: "true-false",
    question: "Czerniak może rozwinąć się z istniejącego znamienia lub pojawić się jako nowe znamię.",
    options: ["Prawda", "Fałsz"],
    correctAnswer: "Prawda",
    explanation:
      "Czerniak może rozwinąć się zarówno z istniejącego znamienia (około 30% przypadków), jak i pojawić się jako nowe znamię (około 70% przypadków).",
    difficulty: "medium",
    category: "symptoms",
    tags: ["rozwój", "znamiona", "nowe zmiany"],
  },
  {
    id: "q9",
    type: "multiple-choice",
    question: "Która grupa wiekowa ma największe ryzyko rozwoju czerniaka?",
    options: ["Dzieci (0-12 lat)", "Młodzież (13-18 lat)", "Dorośli (19-50 lat)", "Seniorzy (50+ lat)"],
    correctAnswer: "Dorośli (19-50 lat)",
    explanation:
      "Czerniak najczęściej występuje u dorosłych w wieku 20-50 lat, choć może wystąpić w każdym wieku. Ryzyko wzrasta z wiekiem.",
    difficulty: "medium",
    category: "risk-factors",
    tags: ["wiek", "grupa ryzyka", "statystyki"],
  },
  {
    id: "q10",
    type: "scenario",
    question: "Pacjent zgłasza, że znamię na plecach swędzi i czasami krwawi. Znamię ma 8mm średnicy i nieregularne brzegi. Co to oznacza?",
    options: [
      "To normalne dla dużych znamion",
      "Wymaga natychmiastowej konsultacji dermatologicznej",
      "Można leczyć maścią przeciwświądową",
      "Wystarczy obserwacja",
    ],
    correctAnswer: "Wymaga natychmiastowej konsultacji dermatologicznej",
    explanation:
      "Swędzenie, krwawienie, duża średnica (>6mm) i nieregularne brzegi to wszystkie znaki ostrzegawcze czerniaka wymagające pilnej konsultacji.",
    difficulty: "hard",
    category: "symptoms",
    tags: ["scenariusz", "objawy", "pilne"],
  },
  {
    id: "q11",
    type: "true-false",
    question: "Czerniak jest bardziej agresywny niż inne rodzaje raka skóry.",
    options: ["Prawda", "Fałsz"],
    correctAnswer: "Prawda",
    explanation:
      "Czerniak jest najgroźniejszym rodzajem raka skóry, ponieważ może szybko rozprzestrzeniać się do innych narządów (przerzuty).",
    difficulty: "easy",
    category: "risk-factors",
    tags: ["agresywność", "porównanie", "rak skóry"],
  },
  {
    id: "q12",
    type: "multiple-choice",
    question: "Które z poniższych jest najważniejsze w zapobieganiu czerniakowi?",
    options: ["Unikanie słońca całkowicie", "Używanie kremów z filtrem SPF 30+", "Regularne samobadanie skóry", "Wszystkie powyższe"],
    correctAnswer: "Wszystkie powyższe",
    explanation:
      "Skuteczna profilaktyka wymaga kombinacji: ochrony przed UV, regularnych badań skóry i unikania nadmiernej ekspozycji na słońce.",
    difficulty: "medium",
    category: "prevention",
    tags: ["profilaktyka", "ochrona", "badania"],
  },
  {
    id: "q13",
    type: "scenario",
    question:
      "U 35-letniej kobiety z jasną karnacją i licznymi piegami pojawiło się nowe znamię na ramieniu. Znamię ma 3mm średnicy, jest symetryczne i jednolitego koloru. Co należy zrobić?",
    options: [
      "Natychmiast usunąć chirurgicznie",
      "Obserwować przez 3 miesiące",
      "Zrobić zdjęcie i porównać za miesiąc",
      "Zignorować - wygląda normalnie",
    ],
    correctAnswer: "Zrobić zdjęcie i porównać za miesiąc",
    explanation:
      "Nowe znamię u osoby z wysokim ryzykiem wymaga dokumentacji fotograficznej i regularnej obserwacji. Jeśli się zmieni, należy skonsultować dermatologa.",
    difficulty: "hard",
    category: "diagnosis",
    tags: ["scenariusz", "nowe znamię", "obserwacja"],
  },
  {
    id: "q14",
    type: "true-false",
    question: "Czerniak może wystąpić również pod paznokciami i na błonach śluzowych.",
    options: ["Prawda", "Fałsz"],
    correctAnswer: "Prawda",
    explanation:
      "Czerniak może wystąpić wszędzie, gdzie są melanocyty, w tym pod paznokciami (czerniak podpaznokciowy) i na błonach śluzowych jamy ustnej, nosa, odbytu.",
    difficulty: "medium",
    category: "symptoms",
    tags: ["lokalizacja", "paznokcie", "błony śluzowe"],
  },
  {
    id: "q15",
    type: "multiple-choice",
    question: "Który z poniższych czynników NIE zwiększa ryzyka czerniaka?",
    options: [
      "Historia oparzeń słonecznych w dzieciństwie",
      "Duża liczba znamion (>50)",
      "Ciemna karnacja skóry",
      "Historia rodzinna czerniaka",
    ],
    correctAnswer: "Ciemna karnacja skóry",
    explanation: "Ciemna karnacja skóry chroni przed czerniakiem. Osoby z jasną karnacją, piegami i rudymi włosami mają większe ryzyko.",
    difficulty: "medium",
    category: "risk-factors",
    tags: ["czynniki ryzyka", "karnacja", "ochrona"],
  },
  {
    id: "q16",
    type: "scenario",
    question:
      "Pacjent ma znamię, które zmieniło się z brązowego na ciemnobrązowy w ciągu 6 miesięcy. Znamię ma 5mm średnicy, jest symetryczne z gładkimi brzegami. Co to oznacza?",
    options: ["To normalna zmiana z wiekiem", "Wymaga natychmiastowej biopsji", "Wymaga obserwacji i dokumentacji", "Można zignorować"],
    correctAnswer: "Wymaga obserwacji i dokumentacji",
    explanation:
      "Zmiana koloru to znak ostrzegawczy (E-Ewolucja), ale przy braku innych cech ABCDE wystarczy dokładna obserwacja i dokumentacja fotograficzna.",
    difficulty: "hard",
    category: "diagnosis",
    tags: ["scenariusz", "ewolucja", "obserwacja"],
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
    explanation:
      "Znamię wykazuje wyraźną asymetrię (jedna połowa różni się od drugiej), nieregularne, poszarpane brzegi, średnicę większą niż 6mm (około 8-10mm), oraz ewolucję w czasie - pacjent zgłasza, że znamię zmieniło się w ciągu ostatnich 6 miesięcy. To klasyczny przykład czerniaka powierzchownego rozprzestrzeniającego się, który wymaga natychmiastowego chirurgicznego usunięcia z marginesem bezpieczeństwa.",
    difficulty: "medium",
    category: "typical",
  },
  {
    id: "case2",
    imageUrl: "czerniak-2.jpg",
    correctFeatures: new Set(["B", "C"]),
    description: "Przypadek 2: Znamię na ramieniu u 32-letniej kobiety",
    diagnosis: "Dysplastyczne znamię (znamię atypowe)",
    explanation:
      "Znamię ma nieregularne, poszarpane brzegi i wyraźną różnorodność kolorów (od jasnobrązowego przez ciemnobrązowy do czarnego), ale jest symetryczne, ma średnicę około 4mm i nie wykazuje ewolucji w czasie. To przykład dysplastycznego znamienia (znamienia atypowego), które ma zwiększone ryzyko transformacji w czerniaka i wymaga regularnej obserwacji oraz dokumentacji fotograficznej.",
    difficulty: "easy",
    category: "atypical",
  },
  {
    id: "case3",
    imageUrl: "czerniak-3.jpg",
    correctFeatures: new Set(["A", "C", "E"]),
    description: "Przypadek 3: Znamię na nodze u 28-letniej kobiety",
    diagnosis: "Wczesny czerniak",
    explanation:
      "Znamię wykazuje subtelną asymetrię (lewa połowa jest nieco inna od prawej), wyraźną różnorodność kolorów (brązowy, ciemnobrązowy, czarny), oraz ewolucję w czasie - pacjentka zgłasza, że znamię zmieniło kolor i nieco powiększyło się w ciągu ostatnich 3 miesięcy. Pomimo regularnych brzegów i średnicy 4mm, zmiana w czasie (ewolucja) jest najważniejszym znakiem ostrzegawczym. To przykład wczesnego czerniaka, który został wcześnie wykryty dzięki czujności pacjentki.",
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
      "Znamię wykazuje wszystkie cechy ABCDE: wyraźną asymetrię, nieregularne, poszarpane brzegi, różnorodność kolorów (brązowy, czarny, czerwony, biały), średnicę większą niż 6mm (około 12mm), oraz ewolucję w czasie - pacjent zgłasza, że znamię swędzi, krwawi i znacznie się powiększyło w ciągu ostatnich 2 miesięcy. To klasyczny przykład zaawansowanego czerniaka wymagającego natychmiastowego leczenia chirurgicznego oraz dalszej diagnostyki w celu oceny stopnia zaawansowania.",
    difficulty: "easy",
    category: "advanced",
  },
  {
    id: "case5",
    imageUrl: "czerniak-5.jpg",
    correctFeatures: new Set(["A", "B", "C"]),
    description: "Przypadek 5: Znamię na skórze głowy u 40-letniego mężczyzny",
    diagnosis: "Czerniak w miejscu trudno dostępnym",
    explanation:
      "Znamię na skórze głowy wykazuje asymetrię, nieregularne brzegi i różnorodność kolorów, ale ma średnicę 3mm i nie wykazuje ewolucji w czasie. Lokalizacja na skórze głowy jest szczególnie niebezpieczna, ponieważ znamiona w tym miejscu są często pomijane podczas samobadania. Czerniak skóry głowy ma gorsze rokowania ze względu na późne wykrycie. Ten przypadek podkreśla wagę dokładnego badania skóry głowy, szczególnie u osób z łysieniem.",
    difficulty: "hard",
    category: "advanced",
  },
  {
    id: "case6",
    imageUrl: "czerniak-6.jpg",
    correctFeatures: new Set(["C", "E"]),
    description: "Przypadek 6: Znamię pod paznokciem u 35-letniej kobiety",
    diagnosis: "Czerniak podpaznokciowy",
    explanation:
      "Znamię pod paznokciem wykazuje różnorodność kolorów (brązowy, czarny) i ewolucję w czasie - pacjentka zgłasza, że pasek pod paznokciem pojawił się 6 miesięcy temu i stopniowo się powiększa. Czerniak podpaznokciowy jest rzadki ale agresywny, często mylony z urazem paznokcia. Charakterystyczne objawy to: ciemny pasek pod paznokciem, który się powiększa, oraz objaw Hutchinsona (ciemny pigment rozprzestrzeniający się na skórę wokół paznokcia).",
    difficulty: "hard",
    category: "advanced",
  },
  {
    id: "case7",
    imageUrl: "czerniak-7.jpg",
    correctFeatures: new Set(["A", "B", "D"]),
    description: "Przypadek 7: Znamię na podeszwie stopy u 50-letniego mężczyzny",
    diagnosis: "Czerniak akralny",
    explanation:
      "Znamię na podeszwie stopy wykazuje asymetrię, nieregularne brzegi i średnicę większą niż 6mm (około 8mm), ale ma jednolity kolor i nie wykazuje ewolucji w czasie. Czerniak akralny (występujący na dłoniach i podeszwach stóp) jest rzadki ale agresywny, szczególnie u osób z ciemną karnacją. Lokalizacja na podeszwie stopy często opóźnia diagnozę, ponieważ znamiona w tym miejscu są rzadko badane. Ten przypadek podkreśla wagę badania dłoni i stóp podczas samobadania skóry.",
    difficulty: "medium",
    category: "early",
  },
  {
    id: "case8",
    imageUrl: "czerniak-8.jpg",
    correctFeatures: new Set(["B", "C", "E"]),
    description: "Przypadek 8: Znamię na twarzy u 60-letniej kobiety",
    diagnosis: "Czerniak lentigo maligna",
    explanation:
      "Znamię na twarzy wykazuje nieregularne brzegi, różnorodność kolorów (brązowy, ciemnobrązowy, czarny) i ewolucję w czasie - pacjentka zgłasza, że znamię stopniowo się powiększa i ciemnieje od 2 lat. To przykład czerniaka lentigo maligna, który rozwija się na skórze chronicznie uszkodzonej przez słońce, szczególnie u osób starszych. Charakterystyczne cechy to: powolny wzrost, nieregularne brzegi, oraz lokalizacja na skórze twarzy, szyi lub dłoni. Wczesne wykrycie ma doskonałe rokowania.",
    difficulty: "medium",
    category: "advanced",
  },
];
