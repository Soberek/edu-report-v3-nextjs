import React, { useCallback, useMemo, useReducer } from "react";
import { QuizSession, QuizResult, QuizSettings, QuizQuestion } from "../types";

// Quiz State Type
interface QuizState {
  session: QuizSession;
  currentAnswer: string | string[] | null;
  showExplanation: boolean;
  timeSpent: number;
}

// Quiz Action Types
type QuizAction =
  | { type: "SET_CURRENT_ANSWER"; payload: string | string[] | null }
  | { type: "SET_SHOW_EXPLANATION"; payload: boolean }
  | { type: "SET_TIME_SPENT"; payload: number }
  | {
      type: "SUBMIT_ANSWER";
      payload: { questionId: string; userAnswer: string | string[]; isCorrect: boolean; timeSpent: number; points: number };
    }
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "RESET_QUIZ"; payload: { questionsLength: number } }
  | { type: "COMPLETE_QUIZ" }
  | { type: "RETURN_TO_FIRST" };

// Quiz Reducer
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "SET_CURRENT_ANSWER":
      return { ...state, currentAnswer: action.payload };

    case "SET_SHOW_EXPLANATION":
      return { ...state, showExplanation: action.payload };

    case "SET_TIME_SPENT":
      return { ...state, timeSpent: action.payload };

    case "SUBMIT_ANSWER": {
      const newResult: QuizResult = {
        questionId: action.payload.questionId,
        userAnswer: action.payload.userAnswer,
        isCorrect: action.payload.isCorrect,
        timeSpent: action.payload.timeSpent,
        points: action.payload.points,
      };

      const newResults = [...state.session.results, newResult];
      const newTotalScore = newResults.reduce((sum, result) => sum + result.points, 0);

      return {
        ...state,
        session: {
          ...state.session,
          results: newResults,
          totalScore: newTotalScore,
        },
        showExplanation: true,
      };
    }

    case "NEXT_QUESTION": {
      const isLastQuestion = state.session.currentQuestionIndex === state.session.maxScore - 1;
      return {
        ...state,
        session: {
          ...state.session,
          currentQuestionIndex: isLastQuestion ? state.session.currentQuestionIndex : state.session.currentQuestionIndex + 1,
          completed: isLastQuestion,
        },
        showExplanation: false,
        currentAnswer: null,
        timeSpent: 0,
      };
    }

    case "PREVIOUS_QUESTION": {
      const isFirstQuestion = state.session.currentQuestionIndex === 0;
      if (isFirstQuestion) return state;

      return {
        ...state,
        session: {
          ...state.session,
          currentQuestionIndex: state.session.currentQuestionIndex - 1,
        },
        showExplanation: false,
        currentAnswer: null,
        timeSpent: 0,
      };
    }

    case "RESET_QUIZ":
      return {
        session: {
          id: Date.now().toString(),
          startTime: new Date(),
          currentQuestionIndex: 0,
          results: [],
          totalScore: 0,
          maxScore: action.payload.questionsLength,
          completed: false,
        },
        currentAnswer: null,
        showExplanation: false,
        timeSpent: 0,
      };

    case "COMPLETE_QUIZ":
      return {
        ...state,
        session: {
          ...state.session,
          completed: true,
        },
      };

    case "RETURN_TO_FIRST":
      return {
        ...state,
        session: {
          ...state.session,
          currentQuestionIndex: 0,
        },
        showExplanation: false,
        currentAnswer: null,
        timeSpent: 0,
      };

    default:
      return state;
  }
};

export const useQuiz = (questions: QuizQuestion[]) => {
  const [state, dispatch] = useReducer(quizReducer, {
    session: {
      id: Date.now().toString(),
      startTime: new Date(),
      currentQuestionIndex: 0,
      results: [],
      totalScore: 0,
      maxScore: questions.length,
      completed: false,
    },
    currentAnswer: null,
    showExplanation: false,
    timeSpent: 0,
  });

  const currentQuestion = questions[state.session.currentQuestionIndex];
  const isLastQuestion = state.session.currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = state.session.currentQuestionIndex === 0;

  // Load previous answer when navigating to an already answered question
  React.useEffect(() => {
    const existingResult = state.session.results.find((result) => result.questionId === currentQuestion?.id);
    if (existingResult) {
      dispatch({ type: "SET_CURRENT_ANSWER", payload: existingResult.userAnswer });
      dispatch({ type: "SET_SHOW_EXPLANATION", payload: true });
    } else {
      dispatch({ type: "SET_CURRENT_ANSWER", payload: null });
      dispatch({ type: "SET_SHOW_EXPLANATION", payload: false });
    }
    dispatch({ type: "SET_TIME_SPENT", payload: 0 });
  }, [state.session.currentQuestionIndex, currentQuestion?.id, state.session.results]);

  const submitAnswer = useCallback(() => {
    if (!state.currentAnswer || !currentQuestion) return;

    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? JSON.stringify([...state.currentAnswer].sort()) === JSON.stringify([...currentQuestion.correctAnswer].sort())
      : state.currentAnswer === currentQuestion.correctAnswer;

    const points = isCorrect ? 1 : 0;

    dispatch({
      type: "SUBMIT_ANSWER",
      payload: {
        questionId: currentQuestion.id,
        userAnswer: state.currentAnswer,
        isCorrect,
        timeSpent: state.timeSpent,
        points,
      },
    });
  }, [state.currentAnswer, currentQuestion, state.timeSpent]);

  const nextQuestion = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const previousQuestion = useCallback(() => {
    dispatch({ type: "PREVIOUS_QUESTION" });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: "RESET_QUIZ", payload: { questionsLength: questions.length } });
  }, [questions.length]);

  const returnToFirst = useCallback(() => {
    dispatch({ type: "RETURN_TO_FIRST" });
  }, []);

  const selectAnswer = useCallback(
    (answer: string) => {
      if (state.showExplanation) return;
      dispatch({ type: "SET_CURRENT_ANSWER", payload: answer });
    },
    [state.showExplanation]
  );

  const selectMultipleAnswers = useCallback(
    (answers: string[]) => {
      if (state.showExplanation) return;
      dispatch({ type: "SET_CURRENT_ANSWER", payload: answers });
    },
    [state.showExplanation]
  );

  const progress = useMemo(() => {
    return ((state.session.currentQuestionIndex + 1) / questions.length) * 100;
  }, [state.session.currentQuestionIndex, questions.length]);

  const scorePercentage = useMemo(() => {
    return state.session.maxScore > 0 ? (state.session.totalScore / state.session.maxScore) * 100 : 0;
  }, [state.session.totalScore, state.session.maxScore]);

  const getScoreGrade = useCallback(() => {
    if (scorePercentage >= 90) return { grade: "A", color: "success", text: "Doskonały!" };
    if (scorePercentage >= 80) return { grade: "B", color: "info", text: "Bardzo dobry!" };
    if (scorePercentage >= 70) return { grade: "C", color: "warning", text: "Dobry!" };
    if (scorePercentage >= 50) return { grade: "D", color: "warning", text: "Zadowalający" };
    if (scorePercentage >= 30) return { grade: "E", color: "error", text: "Dostateczny" };
    return { grade: "F", color: "error", text: "Niedostateczny" };
  }, [scorePercentage]);

  const setTimeSpent = useCallback((time: number) => {
    dispatch({ type: "SET_TIME_SPENT", payload: time });
  }, []);

  return {
    session: state.session,
    currentQuestion,
    currentAnswer: state.currentAnswer,
    showExplanation: state.showExplanation,
    timeSpent: state.timeSpent,
    progress,
    scorePercentage,
    isLastQuestion,
    isFirstQuestion,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    returnToFirst,
    selectAnswer,
    selectMultipleAnswers,
    getScoreGrade,
    setTimeSpent,
  };
};
