// Quiz Types and Interfaces
export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "image-analysis" | "scenario";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  imageUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  category: "prevention" | "diagnosis" | "treatment" | "symptoms" | "risk-factors";
  tags: string[];
}

export interface QuizResult {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

export interface QuizSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  results: QuizResult[];
  totalScore: number;
  maxScore: number;
  completed: boolean;
}

export interface EducationalContent {
  title: string;
  content: string;
  type: "info" | "warning" | "tip" | "fact";
  icon: string;
}

// ABCDE Features for melanoma detection
export interface ABCDEFeature {
  key: "A" | "B" | "C" | "D" | "E";
  name: string;
  description: string;
  icon: string;
  details: string;
}

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

export interface QuizSettings {
  questionCount: number;
  timeLimit?: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  categories: string[];
  showExplanations: boolean;
  allowRetry: boolean;
}
