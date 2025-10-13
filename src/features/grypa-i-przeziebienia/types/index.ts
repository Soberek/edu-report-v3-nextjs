/**
 * Types for the Flu and Cold Education Module
 */

export interface SymptomComparison {
  readonly feature: string;
  readonly cold: string;
  readonly flu: string;
  readonly covid19: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctAnswer: number;
  readonly explanation: string;
  readonly category: "symptoms" | "treatment" | "prevention" | "myths";
}

export interface TreatmentMethod {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly effectiveness: "high" | "medium" | "low";
  readonly category: "prevention" | "treatment" | "supportive";
}

export interface MythFact {
  readonly id: string;
  readonly myth: string;
  readonly fact: string;
  readonly explanation: string;
}

export interface RedFlag {
  readonly id: string;
  readonly symptom: string;
  readonly urgency: "immediate" | "urgent" | "consult";
  readonly description: string;
}

export interface PreventionTip {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: "hygiene" | "lifestyle" | "vaccination" | "environment";
  readonly icon: string;
}

export interface CommonMistake {
  readonly id: string;
  readonly mistake: string;
  readonly consequences: string;
  readonly correctApproach: string;
}

export interface LessonSection {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly content: React.ReactNode;
  readonly estimatedTime: number; // in minutes
}

export interface QuizState {
  readonly currentQuestion: number;
  readonly selectedAnswers: number[];
  readonly showResults: boolean;
  readonly quizCompleted: boolean;
}

export interface QuizResult {
  readonly score: number;
  readonly total: number;
  readonly percentage: number;
  readonly correctAnswers: number[];
  readonly incorrectAnswers: number[];
}
