export const TASK_TYPES = {
  STOISKO_INFORMACYJNE_EDUKACYJNE: {
    id: "educational_info_stand",
    label: "stoisko informacyjne-edukacyjne",
  },
  SPRAWOZDANIE: { id: "report", label: "sprawozdanie" },
  SPRAWOZDANIE_MIESIECZNE: {
    id: "monthly_report",
    label: "sprawozdanie miesięczne",
  },
  PRELEKCJA: { id: "lecture", label: "prelekcja" },
  WYKLAD: { id: "presentation", label: "wykład" },
  PUBLIKACJA_MEDIA: { id: "media_publication", label: "publikacja media" },
  LIST_INTENCYJNY: { id: "intent_letter", label: "list intencyjny" },
  WIZYTACJA: { id: "visitation", label: "wizytacja" },
  GRY_I_ZABAWY: { id: "games", label: "gry i zabawy" },
  INSTRUKTAZ: { id: "instruction", label: "instruktaż" },
  DYSTRYBUCJA: { id: "distribution", label: "dystrybucja" },
  INSTRUKTAZ_INDYWIDUALNY: {
    id: "individual_instruction",
    label: "instruktaż indywidualny",
  },
  NARADA: { id: "meeting", label: "narada" },
  SZKOLENIE: { id: "training", label: "szkolenie" },
  KONFERENCJA: { id: "conference", label: "konferencja" },
  PORADNICTWO: { id: "counseling", label: "poradnictwo" },
  WARSZTATY: { id: "workshop", label: "warsztaty" },
  KONKURS: { id: "contest", label: "konkurs" },
  INNY: { id: "other", label: "inny" },
  HAPPENING_ULICZNY: { id: "street_happening", label: "happening uliczny" },
} as const;

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];
