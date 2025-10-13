// ABCDE Feature interface
export interface ABCDEFeature {
  key: "A" | "B" | "C" | "D" | "E";
  name: string;
  description: string;
  icon: string;
  details: string;
}

// Educational content interface
export interface EducationalContent {
  title: string;
  content: string;
  type: "info" | "warning" | "tip" | "fact";
  icon: string;
}

// Quiz question interface
export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "scenario";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: "diagnosis" | "symptoms" | "risk-factors" | "treatment" | "prevention";
  tags: string[];
}

// Melanoma case interface
export interface MelanomaCase {
  id: string;
  imageUrl: string;
  correctFeatures: Set<string>;
  description: string;
  diagnosis: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: "typical" | "atypical" | "early" | "advanced";
}
