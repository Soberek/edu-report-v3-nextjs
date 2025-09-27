import { useState, useCallback, useMemo } from "react";
import { QuizSession, QuizResult, QuizSettings, QuizQuestion } from "../types";

export const useQuiz = (questions: QuizQuestion[], settings: QuizSettings) => {
  const [session, setSession] = useState<QuizSession>({
    id: Date.now().toString(),
    startTime: new Date(),
    currentQuestionIndex: 0,
    results: [],
    totalScore: 0,
    maxScore: questions.length,
    completed: false,
  });

  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const currentQuestion = questions[session.currentQuestionIndex];
  const isLastQuestion = session.currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = session.currentQuestionIndex === 0;

  const submitAnswer = useCallback(() => {
    if (!currentAnswer || !currentQuestion) return;

    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? JSON.stringify([...currentAnswer].sort()) === JSON.stringify([...currentQuestion.correctAnswer].sort())
      : currentAnswer === currentQuestion.correctAnswer;

    const points = isCorrect ? 1 : 0;
    const newResult: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: currentAnswer,
      isCorrect,
      timeSpent,
      points,
    };

    const newResults = [...session.results, newResult];
    const newTotalScore = newResults.reduce((sum, result) => sum + result.points, 0);

    setSession((prev) => ({
      ...prev,
      results: newResults,
      totalScore: newTotalScore,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
      completed: isLastQuestion,
    }));

    setShowExplanation(true);
    setCurrentAnswer(null);
    setTimeSpent(0);
  }, [currentAnswer, currentQuestion, timeSpent, session.results, isLastQuestion]);

  const nextQuestion = useCallback(() => {
    setShowExplanation(false);
    setCurrentAnswer(null);
    setTimeSpent(0);
  }, []);

  const previousQuestion = useCallback(() => {
    if (isFirstQuestion) return;
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex - 1,
    }));
    setShowExplanation(false);
    setCurrentAnswer(null);
    setTimeSpent(0);
  }, [isFirstQuestion]);

  const resetQuiz = useCallback(() => {
    setSession({
      id: Date.now().toString(),
      startTime: new Date(),
      currentQuestionIndex: 0,
      results: [],
      totalScore: 0,
      maxScore: questions.length,
      completed: false,
    });
    setCurrentAnswer(null);
    setShowExplanation(false);
    setTimeSpent(0);
  }, [questions.length]);

  const selectAnswer = useCallback(
    (answer: string) => {
      if (showExplanation) return;
      setCurrentAnswer(answer);
    },
    [showExplanation]
  );

  const selectMultipleAnswers = useCallback(
    (answers: string[]) => {
      if (showExplanation) return;
      setCurrentAnswer(answers);
    },
    [showExplanation]
  );

  const progress = useMemo(() => {
    return ((session.currentQuestionIndex + 1) / questions.length) * 100;
  }, [session.currentQuestionIndex, questions.length]);

  const scorePercentage = useMemo(() => {
    return session.maxScore > 0 ? (session.totalScore / session.maxScore) * 100 : 0;
  }, [session.totalScore, session.maxScore]);

  const getScoreGrade = useCallback(() => {
    if (scorePercentage >= 90) return { grade: "A", color: "success", text: "Doskonały!" };
    if (scorePercentage >= 80) return { grade: "B", color: "info", text: "Bardzo dobry!" };
    if (scorePercentage >= 70) return { grade: "C", color: "warning", text: "Dobry!" };
    if (scorePercentage >= 60) return { grade: "D", color: "warning", text: "Zadowalający" };
    return { grade: "F", color: "error", text: "Wymaga poprawy" };
  }, [scorePercentage]);

  return {
    session,
    currentQuestion,
    currentAnswer,
    showExplanation,
    timeSpent,
    progress,
    scorePercentage,
    isLastQuestion,
    isFirstQuestion,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    selectAnswer,
    selectMultipleAnswers,
    getScoreGrade,
    setTimeSpent,
  };
};
