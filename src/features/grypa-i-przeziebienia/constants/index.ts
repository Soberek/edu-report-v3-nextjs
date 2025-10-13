/**
 * Constants for the Flu and Cold Education Module
 */

import type { SymptomComparison, RedFlag, PreventionTip, CommonMistake, MythFact } from "../types";

export const LESSON_CONSTANTS = {
  TITLE: "Grypa i Przeziębienia - Przewodnik Edukacyjny",
  SUBTITLE: "Praktyczne przekazywanie wiedzy o infekcjach wirusowych",
  ESTIMATED_DURATION: 45, // minutes
  TARGET_AUDIENCE: "Nastolatkowie i młodzież",
} as const;

export const SYMPTOM_COMPARISON: readonly SymptomComparison[] = [
  {
    feature: "Początek",
    cold: "Stopniowy, 2-3 dni",
    flu: "Nagły, godziny",
    covid19: "2–7 dni, różny",
  },
  {
    feature: "Gorączka",
    cold: "Rzadko, < 38°C",
    flu: "Wysoka, ponad 39°C",
    covid19: "Często, różnie",
  },
  {
    feature: "Dominujące objawy",
    cold: "Katar, kichanie, ból gardła",
    flu: "Bóle mięśni, ból głowy, zmęczenie",
    covid19: "Utrata węchu i smaku, kaszel",
  },
  {
    feature: "Czas trwania",
    cold: "7–10 dni",
    flu: "7–14 dni",
    covid19: "Zróżnicowany, od kilku dni do tygodni",
  },
  {
    feature: "Powikłania",
    cold: "Rzadkie",
    flu: "Ryzyko zapalenia płuc",
    covid19: "Ciężkie zapalenia, długotrwałe objawy",
  },
] as const;

export const RED_FLAGS: readonly RedFlag[] = [
  {
    id: "high-fever",
    symptom: "Gorączka powyżej 40°C",
    urgency: "immediate",
    description: "Utrzymująca się dłużej niż 3 dni",
  },
  {
    id: "breathing-problems",
    symptom: "Problemy z oddychaniem",
    urgency: "immediate",
    description: "Duszności, ból w klatce piersiowej",
  },
  {
    id: "bloody-cough",
    symptom: "Kaszel z krwistą wydzieliną",
    urgency: "immediate",
    description: "Wymaga natychmiastowej konsultacji lekarskiej",
  },
  {
    id: "neck-stiffness",
    symptom: "Sztywność karku",
    urgency: "immediate",
    description: "W połączeniu z silnym bólem głowy",
  },
  {
    id: "confusion",
    symptom: "Dezorientacja",
    urgency: "immediate",
    description: "Lub utrata przytomności",
  },
] as const;

export const PREVENTION_TIPS: readonly PreventionTip[] = [
  {
    id: "hand-washing",
    title: "Mycie rąk",
    description: "Przez 20 sekund wodą z mydłem przed jedzeniem i po skorzystaniu z toalety",
    category: "hygiene",
    icon: "🧼",
  },
  {
    id: "avoid-touching-face",
    title: "Unikanie dotykania twarzy",
    description: "Oczy, nos i usta to główne drogi zakażenia",
    category: "hygiene",
    icon: "👆",
  },
  {
    id: "physical-activity",
    title: "Aktywność fizyczna",
    description: "Umiarkowane ćwiczenia przez 1-2 godziny dziennie zmniejszają ryzyko o jedną trzecią",
    category: "lifestyle",
    icon: "💪",
  },
  {
    id: "healthy-sleep",
    title: "Zdrowy sen",
    description: "7-8 godzin snu wzmacnia układ odpornościowy",
    category: "lifestyle",
    icon: "😴",
  },
  {
    id: "flu-vaccination",
    title: "Szczepienie przeciw grypie",
    description: "Bezpłatne dla dzieci i młodzieży do 18. roku życia",
    category: "vaccination",
    icon: "💉",
  },
  {
    id: "ventilation",
    title: "Wietrzenie pomieszczeń",
    description: "Co godzinę przez 5-10 minut",
    category: "environment",
    icon: "🌬️",
  },
] as const;

export const COMMON_MISTAKES: readonly CommonMistake[] = [
  {
    id: "antibiotics-for-viruses",
    mistake: "Stosowanie antybiotyków przy infekcjach wirusowych",
    consequences: "Niszczenie flory jelitowej, obniżenie odporności, rozwój antybiotykooporności",
    correctApproach: "Antybiotyki działają tylko na bakterie, nie na wirusy",
  },
  {
    id: "doubling-medications",
    mistake: "Dublowanie leków",
    consequences: "Przekroczenie dawek i zwiększona toksyczność",
    correctApproach: "Sprawdzanie składu aktywnych substancji",
  },
  {
    id: "overuse-fever-reducers",
    mistake: "Nadużywanie leków przeciwgorączkowych",
    consequences: "Blokowanie naturalnej reakcji obronnej organizmu",
    correctApproach: "Stosowanie tylko przy gorączce powyżej 38,5°C",
  },
  {
    id: "alcohol-as-treatment",
    mistake: "Spożywanie alkoholu jako 'rozgrzewacza'",
    consequences: "Utrata ciepła i osłabienie układu odpornościowego",
    correctApproach: "Ciepłe napoje bezalkoholowe",
  },
  {
    id: "skipping-meals",
    mistake: "Rezygnacja z jedzenia",
    consequences: "Pogorszenie kondycji i spowolnienie walki z infekcją",
    correctApproach: "Lekkie, łatwostrawne posiłki",
  },
] as const;

export const MYTHS_AND_FACTS: readonly MythFact[] = [
  {
    id: "antibiotics-cure-cold",
    myth: "Antybiotyki leczą przeziębienie i grypę",
    fact: "Antybiotyki działają tylko na infekcje bakteryjne",
    explanation: "90% infekcji dróg oddechowych to wirusy. Nadużywanie antybiotyków prowadzi do rozwoju antybiotykooporności.",
  },
  {
    id: "always-reduce-fever",
    myth: "Gorączkę należy zawsze szybko zbijać",
    fact: "Gorączka jest naturalną reakcją obronną organizmu",
    explanation: "Zbicie gorączki zalecane tylko przy temperaturze powyżej 38,5°C lub silnym dyskomforcie.",
  },
  {
    id: "vitamin-d-prevents-colds",
    myth: "Suplementacja witaminą D zapobiega przeziębieniom",
    fact: "Witamina D wspiera odporność, ale nie gwarantuje ochrony",
    explanation: "Suplementacja jest korzystna zwłaszcza w okresie zimowym i u osób z niedoborami.",
  },
  {
    id: "masks-ineffective",
    myth: "Noszenie maseczek jest nieskuteczne",
    fact: "Maseczki redukują rozprzestrzenianie się wirusów",
    explanation: "Szczególnie skuteczne w bliskich kontaktach i pomieszczeniach zamkniętych.",
  },
] as const;

export const STYLE_CONSTANTS = {
  COLORS: {
    PRIMARY: "#1976d2",
    SECONDARY: "#42a5f5",
    SUCCESS: "#4caf50",
    WARNING: "#ff9800",
    ERROR: "#f44336",
    INFO: "#2196f3",
  },
  SPACING: {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3,
    XLARGE: 4,
  },
  BORDER_RADIUS: 3,
  SHADOW: "0 4px 16px rgba(0,0,0,0.1)",
  TRANSITIONS: {
    FAST: "0.2s ease",
    NORMAL: "0.3s ease",
    SLOW: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const QUIZ_CONSTANTS = {
  QUESTIONS: [
    {
      id: "1",
      question: "Który objaw jest najbardziej charakterystyczny dla COVID-19?",
      options: ["Wysoka gorączka", "Utrata smaku i węchu", "Ból gardła", "Katar"],
      correctAnswer: 1,
      explanation: "Utrata smaku i węchu to bardzo charakterystyczny objaw COVID-19, który rzadko występuje przy przeziębieniu czy grypie.",
      category: "symptoms",
    },
    {
      id: "2",
      question: "Jak długo trwa typowe przeziębienie?",
      options: ["2-3 dni", "7-10 dni", "2-3 tygodnie", "1 miesiąc"],
      correctAnswer: 1,
      explanation: "Typowe przeziębienie trwa 7-10 dni. Jeśli objawy utrzymują się dłużej, należy skonsultować się z lekarzem.",
      category: "symptoms",
    },
    {
      id: "3",
      question: "Który objaw jest najbardziej charakterystyczny dla grypy?",
      options: ["Katar i kichanie", "Nagły początek z wysoką gorączką", "Ból gardła", "Kaszel suchy"],
      correctAnswer: 1,
      explanation:
        "Grypa charakteryzuje się nagłym początkiem z wysoką gorączką (powyżej 39°C), podczas gdy przeziębienie rozwija się stopniowo.",
      category: "symptoms",
    },
    {
      id: "4",
      question: "Czy antybiotyki są skuteczne w leczeniu przeziębienia?",
      options: ["Tak, zawsze", "Nie, przeziębienie to wirus", "Tylko przy gorączce", "Tylko u dzieci"],
      correctAnswer: 1,
      explanation:
        "Antybiotyki działają tylko na bakterie, a przeziębienie jest wywoływane przez wirusy. Ich stosowanie nie pomoże i może zaszkodzić.",
      category: "treatment",
    },
    {
      id: "5",
      question: "Jak często należy myć ręce, aby zmniejszyć ryzyko zakażenia?",
      options: ["Raz dziennie", "Przed każdym posiłkiem", "Przed posiłkami i po skorzystaniu z toalety", "Tylko gdy są brudne"],
      correctAnswer: 2,
      explanation: "Ręce należy myć przed posiłkami, po skorzystaniu z toalety, po powrocie do domu i po kontakcie z chorymi osobami.",
      category: "prevention",
    },
    {
      id: "6",
      question: "Czy maseczki są skuteczne w zapobieganiu rozprzestrzenianiu się wirusów?",
      options: ["Nie, są nieskuteczne", "Tak, redukują rozprzestrzenianie", "Tylko w szpitalach", "Tylko dla chorych"],
      correctAnswer: 1,
      explanation:
        "Maseczki skutecznie redukują rozprzestrzenianie się wirusów, szczególnie w bliskich kontaktach i pomieszczeniach zamkniętych.",
      category: "prevention",
    },
    {
      id: "7",
      question: "Kiedy należy zgłosić się do lekarza z powodu przeziębienia?",
      options: ["Zawsze", "Nigdy", "Gdy objawy trwają dłużej niż 10 dni", "Tylko przy gorączce"],
      correctAnswer: 2,
      explanation:
        "Do lekarza należy się zgłosić, gdy objawy trwają dłużej niż 10 dni, gorączka przekracza 39°C lub pojawiają się trudności w oddychaniu.",
      category: "treatment",
    },
    {
      id: "8",
      question: "Czy witamina C zapobiega przeziębieniom?",
      options: ["Tak, zawsze", "Nie, to mit", "Tylko w dużych dawkach", "Tylko u sportowców"],
      correctAnswer: 1,
      explanation: "Witamina C nie zapobiega przeziębieniom, ale może nieznacznie skrócić czas trwania objawów u niektórych osób.",
      category: "myths",
    },
    {
      id: "9",
      question: "Jakie jest najlepsze miejsce do przechowywania leków przeciwgorączkowych?",
      options: ["W lodówce", "W temperaturze pokojowej", "W słońcu", "W łazience"],
      correctAnswer: 1,
      explanation: "Leki przeciwgorączkowe należy przechowywać w temperaturze pokojowej, z dala od wilgoci i światła słonecznego.",
      category: "treatment",
    },
    {
      id: "10",
      question: "Czy można zarazić się grypą od osoby, która nie ma objawów?",
      options: ["Nie", "Tak, w okresie inkubacji", "Tylko przez dotyk", "Tylko przez kichanie"],
      correctAnswer: 1,
      explanation:
        "Można zarazić się grypą od osoby w okresie inkubacji (1-2 dni przed pojawieniem się objawów) i przez kilka dni po ich ustąpieniu.",
      category: "prevention",
    },
    {
      id: "11",
      question: "Który napój jest najlepszy przy przeziębieniu?",
      options: ["Zimna woda", "Ciepła herbata z miodem", "Sok pomarańczowy", "Kawa"],
      correctAnswer: 1,
      explanation: "Ciepła herbata z miodem nawilża gardło, łagodzi kaszel i dostarcza energii. Miód ma właściwości przeciwbakteryjne.",
      category: "treatment",
    },
    {
      id: "12",
      question: "Czy stres wpływa na odporność organizmu?",
      options: ["Nie", "Tak, osłabia odporność", "Tylko długotrwały", "Tylko u dorosłych"],
      correctAnswer: 1,
      explanation: "Stres, szczególnie długotrwały, osłabia układ odpornościowy i zwiększa podatność na infekcje.",
      category: "prevention",
    },
    {
      id: "13",
      question: "Jak długo wirusy mogą przetrwać na powierzchniach?",
      options: ["Kilka minut", "Kilka godzin", "Kilka dni", "Tylko w powietrzu"],
      correctAnswer: 2,
      explanation: "Wirusy mogą przetrwać na powierzchniach od kilku godzin do kilku dni, w zależności od rodzaju wirusa i warunków.",
      category: "prevention",
    },
    {
      id: "14",
      question: "Czy można ćwiczyć podczas przeziębienia?",
      options: ["Tak, zawsze", "Nie, nigdy", "Tylko lekkie ćwiczenia", "Tylko na świeżym powietrzu"],
      correctAnswer: 2,
      explanation:
        "Podczas przeziębienia można wykonywać lekkie ćwiczenia, ale należy unikać intensywnego wysiłku, który może osłabić organizm.",
      category: "treatment",
    },
    {
      id: "15",
      question: "Który objaw wymaga natychmiastowej pomocy medycznej?",
      options: ["Katar", "Kaszel", "Trudności w oddychaniu", "Ból gardła"],
      correctAnswer: 2,
      explanation: "Trudności w oddychaniu, szczególnie z towarzyszącą gorączką, wymagają natychmiastowej pomocy medycznej.",
      category: "symptoms",
    },
    {
      id: "16",
      question: "Czy szczepienie przeciw grypie chroni przed przeziębieniem?",
      options: ["Tak", "Nie", "Tylko częściowo", "Tylko u dzieci"],
      correctAnswer: 1,
      explanation:
        "Szczepienie przeciw grypie chroni tylko przed grypą, nie przed przeziębieniem, które wywoływane jest przez inne wirusy.",
      category: "myths",
    },
  ],
  SCORING: {
    EXCELLENT: 90,
    GOOD: 70,
    NEEDS_IMPROVEMENT: 50,
  },
  MESSAGES: {
    EXCELLENT: "Doskonały wynik! Masz bardzo dobrą wiedzę na temat grypy i przeziębień.",
    GOOD: "Dobry wynik! Twoja wiedza jest na dobrym poziomie.",
    NEEDS_IMPROVEMENT: "Warto powtórzyć materiał. Spróbuj ponownie!",
  },
} as const;
