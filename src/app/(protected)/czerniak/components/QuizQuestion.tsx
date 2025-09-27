import React, { useReducer } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
  Alert,
  LinearProgress,
} from "@mui/material";
import { QuizQuestion as QuizQuestionType } from "../types";

// Answer state management
interface AnswerState {
  selectedAnswer: string | string[] | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
}

type AnswerAction =
  | { type: "SELECT_ANSWER"; payload: string | string[] }
  | { type: "SUBMIT_ANSWER"; payload: { correctAnswer: string | string[] } };

const answerReducer = (state: AnswerState, action: AnswerAction): AnswerState => {
  console.log("action", action);
  switch (action.type) {
    case "SELECT_ANSWER":
      return {
        ...state,
        selectedAnswer: action.payload,
        isSubmitted: false,
        isCorrect: null,
      };
    case "SUBMIT_ANSWER":
      const isCorrect =
        Array.isArray(action.payload.correctAnswer) && Array.isArray(state.selectedAnswer)
          ? JSON.stringify([...action.payload.correctAnswer].sort()) === JSON.stringify([...state.selectedAnswer].sort())
          : state.selectedAnswer === action.payload.correctAnswer;
      return {
        ...state,
        isSubmitted: true,
        isCorrect,
      };
    default:
      return state;
  }
};

interface QuizQuestionProps {
  question: QuizQuestionType;
  currentAnswer: string | string[] | null;
  showExplanation: boolean;
  onAnswerSelect: (answer: string) => void;
  onMultipleAnswerSelect: (answers: string[]) => void;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  timeSpent: number;
}

export const QuizQuestionComponent: React.FC<QuizQuestionProps> = ({
  question,
  currentAnswer,
  showExplanation,
  onAnswerSelect,
  onMultipleAnswerSelect,
  onSubmit,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
  timeSpent,
}) => {
  const [answerState, dispatch] = useReducer(answerReducer, {
    selectedAnswer: currentAnswer,
    isSubmitted: showExplanation,
    isCorrect: null,
  });

  const isMultipleChoice = question.type === "multiple-choice" || question.type === "scenario";
  const isTrueFalse = question.type === "true-false";
  const isImageAnalysis = question.type === "image-analysis";

  const handleAnswerChange = (answer: string) => {
    if (showExplanation) return;
    dispatch({ type: "SELECT_ANSWER", payload: answer });
    onAnswerSelect(answer);
  };

  const handleMultipleAnswerChange = (answer: string, checked: boolean) => {
    if (showExplanation) return;
    const currentAnswers = Array.isArray(answerState.selectedAnswer) ? answerState.selectedAnswer : [];
    const newAnswers = checked ? [...currentAnswers, answer] : currentAnswers.filter((a) => a !== answer);
    dispatch({ type: "SELECT_ANSWER", payload: newAnswers });
    onMultipleAnswerSelect(newAnswers);
  };

  const handleSubmit = () => {
    dispatch({ type: "SUBMIT_ANSWER", payload: { correctAnswer: question.correctAnswer } });
    // Don't call onSubmit() here - just check the answer
  };

  const getAnswerColor = (option: string) => {
    if (!answerState.isSubmitted) return "default";

    const isCorrect = Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option;
    const isSelected = Array.isArray(answerState.selectedAnswer)
      ? answerState.selectedAnswer.includes(option)
      : answerState.selectedAnswer === option;

    if (isCorrect && isSelected) return "success";
    if (isCorrect && !isSelected) return "info";
    if (!isCorrect && isSelected) return "error";
    return "default";
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Question Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Pytanie {question.id.replace("q", "")}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={question.difficulty}
              color={question.difficulty === "easy" ? "success" : question.difficulty === "medium" ? "warning" : "error"}
              size="small"
            />
            <Chip label={question.category} color="primary" size="small" />
          </Box>
        </Box>

        {/* Question Text */}
        <Typography variant="h5" mb={3} fontWeight={500}>
          {question.question}
        </Typography>

        {/* Image if present */}
        {question.imageUrl && (
          <Box mb={3} textAlign="center">
            <img
              src={question.imageUrl}
              alt="Question image"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
        )}

        {/* Answer Options */}
        <Box mb={3}>
          {isTrueFalse ? (
            <RadioGroup value={answerState.selectedAnswer || ""} onChange={(e) => handleAnswerChange(e.target.value)}>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio color={getAnswerColor(option) as any} />}
                  label={option}
                  disabled={answerState.isSubmitted}
                  sx={{
                    backgroundColor: answerState.isSubmitted
                      ? getAnswerColor(option) === "success"
                        ? "success.50"
                        : getAnswerColor(option) === "error"
                        ? "error.50"
                        : "transparent"
                      : "transparent",
                    borderRadius: answerState.isSubmitted ? 1 : 0,
                    px: answerState.isSubmitted ? 1 : 0,
                    py: answerState.isSubmitted ? 0.5 : 0,
                  }}
                />
              ))}
            </RadioGroup>
          ) : isMultipleChoice ? (
            <RadioGroup value={answerState.selectedAnswer || ""} onChange={(e) => handleAnswerChange(e.target.value)}>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio color={getAnswerColor(option) as any} />}
                  label={option}
                  disabled={answerState.isSubmitted}
                  sx={{
                    backgroundColor: answerState.isSubmitted
                      ? getAnswerColor(option) === "success"
                        ? "success.50"
                        : getAnswerColor(option) === "error"
                        ? "error.50"
                        : "transparent"
                      : "transparent",
                    borderRadius: answerState.isSubmitted ? 1 : 0,
                    px: answerState.isSubmitted ? 1 : 0,
                    py: answerState.isSubmitted ? 0.5 : 0,
                  }}
                />
              ))}
            </RadioGroup>
          ) : (
            <FormGroup>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={Array.isArray(answerState.selectedAnswer) ? answerState.selectedAnswer.includes(option) : false}
                      onChange={(e) => handleMultipleAnswerChange(option, e.target.checked)}
                      disabled={answerState.isSubmitted}
                      color={getAnswerColor(option) as any}
                    />
                  }
                  label={option}
                  sx={{
                    backgroundColor: answerState.isSubmitted
                      ? getAnswerColor(option) === "success"
                        ? "success.50"
                        : getAnswerColor(option) === "error"
                        ? "error.50"
                        : "transparent"
                      : "transparent",
                    borderRadius: answerState.isSubmitted ? 1 : 0,
                    px: answerState.isSubmitted ? 1 : 0,
                    py: answerState.isSubmitted ? 0.5 : 0,
                  }}
                />
              ))}
            </FormGroup>
          )}
        </Box>

        {/* Explanation */}
        {answerState.isSubmitted && (
          <Alert severity={answerState.isCorrect ? "success" : "error"} sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight={600} mb={1}>
              {answerState.isCorrect ? "✅ Poprawna odpowiedź!" : "❌ Niepoprawna odpowiedź"}
            </Typography>
            <Typography variant="body2">
              <strong>Wyjaśnienie:</strong> {question.explanation}
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2}>
            <Button onClick={onPrevious} disabled={isFirstQuestion}>
              ← Poprzednie
            </Button>
            <Button onClick={onNext} disabled={!answerState.isSubmitted}>
              Następne →
            </Button>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            {!answerState.isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={
                  !answerState.selectedAnswer || (Array.isArray(answerState.selectedAnswer) && answerState.selectedAnswer.length === 0)
                }
                color="primary"
                variant="contained"
              >
                Sprawdź odpowiedź
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onSubmit(); // Submit the current answer to quiz state
                  onNext(); // Move to next question
                }}
                color="primary"
                variant="contained"
              >
                {isLastQuestion ? "Zakończ quiz" : "Następne pytanie"}
              </Button>
            )}
          </Box>
        </Box>

        {/* Time Spent */}
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Czas na pytanie: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, "0")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
