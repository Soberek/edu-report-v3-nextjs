export interface Slide {
  slideNumber: number;
  title: string;
  content: string[];
  type:
    | "introduction"
    | "definition"
    | "transmission"
    | "symptoms"
    | "comparison"
    | "complications"
    | "treatment"
    | "homeRemedies"
    | "prevention"
    | "medical"
    | "summary";
}

export interface PresentationData {
  title: string;
  description: string;
  totalSlides: number;
  slides: Slide[];
  metadata: {
    author: string;
    createdDate: string;
    language: string;
    topic: string;
    targetAudience: string;
  };
}

export const PRESENTATION_DATA: PresentationData = {
  title: "Grypa i Przeziębienie - Przewodnik po Infekcjach Sezonowych",
  description: "Kompleksowa prezentacja o różnicach, objawach, leczeniu i profilaktyce grypy oraz przeziębienia",
  totalSlides: 15,
  slides: [
    {
      slideNumber: 1,
      title: "Wprowadzenie 🌡️",
      content: [
        "Grypa i przeziębienie to najczęstsze infekcje sezonowe dróg oddechowych",
        "Dotykają miliony ludzi rocznie na całym świecie",
        "Choć podobne, różnią się znacząco przebiegiem i powikłaniami",
        "Właściwa wiedza pomaga w skutecznym leczeniu i profilaktyce",
      ],
      type: "introduction",
    },
    {
      slideNumber: 2,
      title: "Czym jest grypa? 🦠",
      content: [
        "Ostra choroba zakaźna wywoływana przez wirusy grypy typu A, B i C",
        "Atakuje zarówno górne, jak i dolne drogi oddechowe",
        "Występuje sezonowo (jesień-zima-wiosna)",
        "Może prowadzić do poważnych powikłań i hospitalizacji",
        "Rocznie choruje 5-10% dorosłych i 20-30% dzieci",
      ],
      type: "definition",
    },
    {
      slideNumber: 3,
      title: "Czym jest przeziębienie? 🤧",
      content: [
        "Łagodna infekcja wirusowa górnych dróg oddechowych",
        "Wywoływana głównie przez rinowirusy (40% przypadków)",
        "Także koronawirusy sezonowe i inne wirusy",
        "Najczęstsza choroba zakaźna u ludzi",
        "Rzadko prowadzi do poważnych powikłań",
      ],
      type: "definition",
    },
    {
      slideNumber: 4,
      title: "Drogi zakażenia 💨",
      content: [
        "🔸 Głównie drogą kropelkową: kichanie, kaszel, rozmowa",
        "🔸 Przez dotyk zakażonych powierzchni, a następnie twarzy",
        "🔸 Wirus grypy przetrwa kilka godzin na przedmiotach",
        "🔸 Jedna osoba chora na grypę zaraża średnio 4 kolejne",
        "🔸 Największa zaraźliwość w pierwszych dniach choroby",
      ],
      type: "transmission",
    },
    {
      slideNumber: 5,
      title: "Objawy grypy 🌡️",
      content: [
        "🔥 Nagły początek choroby (w ciągu kilku godzin)",
        "🔥 Wysoka gorączka (39-40°C)",
        "🔥 Silne dreszcze i bóle mięśni",
        "🔥 Intensywny ból głowy",
        "🔥 Suchy kaszel i ból gardła",
        "🔥 Skrajne osłabienie i uczucie rozbicia",
      ],
      type: "symptoms",
    },
    {
      slideNumber: 6,
      title: "Objawy przeziębienia 😷",
      content: [
        "🌿 Stopniowy rozwój objawów (dni)",
        "🌿 Łagodna gorączka (poniżej 38°C)",
        "🌿 Katar i zatkany nos",
        "🌿 Kichanie i łagodny kaszel",
        "🌿 Ból gardła",
        "🌿 Niewielkie osłabienie",
      ],
      type: "symptoms",
    },
    {
      slideNumber: 7,
      title: "Kluczowe różnice 🔍",
      content: [
        "| Cecha | Przeziębienie | Grypa |",
        "|-------|---------------|-------|",
        "| Początek | Stopniowy | Nagły |",
        "| Gorączka | <38°C | >39°C |",
        "| Czas trwania | 7-10 dni | 2-7 dni (+ tydzień osłabienia) |",
        "| Powikłania | Rzadkie | Częste i groźne |",
        "| Ogólne samopoczucie | Umiarkowanie złe | Bardzo złe |",
      ],
      type: "comparison",
    },
    {
      slideNumber: 8,
      title: "Powikłania grypy ⚠️",
      content: [
        "🚨 **Oddechowe:** zapalenie płuc, zapalenie oskrzeli",
        "🚨 **Neurologiczne:** zapalenie mózgu, zespół Guillaina-Barré",
        "🚨 **Kardiologiczne:** zapalenie mięśnia sercowego",
        "🚨 **Inne:** zapalenie zatok, ucha środkowego",
        "🚨 **Zaostrzenie chorób przewlekłych**",
        "Szczególnie groźne dla seniorów, dzieci i osób przewlekle chorych",
      ],
      type: "complications",
    },
    {
      slideNumber: 9,
      title: "Powikłania przeziębienia 😵",
      content: [
        "✅ Rzadko poważne powikłania",
        "• Zapalenie zatok przynosowych",
        "• Zapalenie ucha środkowego",
        "• Zaostrzenie astmy oskrzelowej",
        "• Przedłużający się kaszel",
        "Większość przypadków mija bez następstw",
      ],
      type: "complications",
    },
    {
      slideNumber: 10,
      title: "Leczenie grypy 💊",
      content: [
        "💊 **Leki przeciwwirusowe** (oseltamiwir) - w ciężkich przypadkach",
        "💊 **Przeciwgorączkowe:** paracetamol, ibuprofen",
        "💊 **Objawowe:** na kaszel, ból gardła, katar",
        "🛏️ **Odpoczynek w łóżku** - obowiązkowy",
        "💧 **Nawadnianie** - min. 2L płynów dziennie",
        "🏠 **Izolacja** - unikanie kontaktu ze zdrowymi",
      ],
      type: "treatment",
    },
    {
      slideNumber: 11,
      title: "Leczenie przeziębienia 🌿",
      content: [
        "🌿 **Leczenie objawowe:**",
        "• Leki na katar i zatkany nos",
        "• Pastylki na ból gardła",
        "• Syropy przeciwkaszlowe",
        "💚 **Naturalne metody:**",
        "• Ciepłe napoje z miodem i cytryną",
        "• Inhalacje z olejkami eterycznymi",
        "• Odpoczynek i sen",
      ],
      type: "treatment",
    },
    {
      slideNumber: 12,
      title: "Domowe sposoby 🏠",
      content: [
        "🍲 **Rosół** - tradycyjny sposób na wzmocnienie",
        "🧄 **Czosnek i cebula** - właściwości przeciwwirusowe",
        "🍯 **Miód z mlekiem** - łagodzi kaszel",
        "🫖 **Herbatki z lipy, mięty** - działanie napotne",
        "🛁 **Ciepłe kąpiele i inhalacje** - ułatwiają oddychanie",
        "🧊 **Kompres na czoło** - obniża gorączkę",
      ],
      type: "homeRemedies",
    },
    {
      slideNumber: 13,
      title: "Profilaktyka 🛡️",
      content: [
        "💉 **Szczepienia przeciw grypie** - najskuteczniejsza ochrona",
        "🧼 **Częste mycie rąk** - mydłem przez min. 20 sekund",
        "😷 **Unikanie kontaktu z chorymi** - dystans społeczny",
        "💪 **Wzmacnianie odporności:** zdrowa dieta, sen, sport",
        "🌡️ **Ubranie według pogody** - unikanie przechłodzenia",
        "🚭 **Nieprzebywanie w zadymionych pomieszczeniach**",
      ],
      type: "prevention",
    },
    {
      slideNumber: 14,
      title: "Kiedy udać się do lekarza? 🏥",
      content: [
        "🚨 **Objawy alarmowe u dorosłych:**",
        "• Trudności w oddychaniu, ból w klatce piersiowej",
        "• Gorączka >40°C utrzymująca się >3 dni",
        "• Krwioplucie, zaburzenia świadomości",
        "👶 **U dzieci dodatkowo:**",
        "• Zasinienie ust, odmowa jedzenia/picia",
        "• Apatia, drgawki, odwodnienie",
        "**Zawsze w grupach ryzyka: seniorzy, przewlekle chorzy**",
      ],
      type: "medical",
    },
    {
      slideNumber: 15,
      title: "Podsumowanie ✅",
      content: [
        "🔑 **Kluczowe różnice:** grypa = nagle + ciężko, przeziębienie = stopniowo + łagodnie",
        "💉 **Profilaktyka:** szczepienia na grypę, higiena rąk",
        "🏠 **Leczenie:** odpoczynek, nawadnianie, leki objawowe",
        "⚠️ **Powikłania grypy mogą być groźne** - szczególnie w grupach ryzyka",
        "👨‍⚕️ **Konsultacja lekarska** przy niepokojących objawach",
        "Dbaj o siebie i bądź odpowiedzialny za innych! 💚",
      ],
      type: "summary",
    },
  ],
  metadata: {
    author: "AI Assistant",
    createdDate: "2025-09-30",
    language: "pl",
    topic: "Medycyna - Infekcje sezonowe",
    targetAudience: "Ogólna edukacja zdrowotna",
  },
};

export const TAB_CONFIG = {
  PRESENTATION: {
    label: "Prezentacja",
    icon: "📊",
    description: "Interaktywna prezentacja o grypie i przeziębieniu",
  },
  QUIZ: {
    label: "Quiz",
    icon: "❓",
    description: "Test wiedzy o infekcjach sezonowych",
  },
  RESOURCES: {
    label: "Materiały",
    icon: "📚",
    description: "Dodatkowe materiały edukacyjne",
  },
  COMPARISON: {
    label: "Porównanie",
    icon: "⚖️",
    description: "Szczegółowe porównanie objawów i leczenia",
  },
} as const;
