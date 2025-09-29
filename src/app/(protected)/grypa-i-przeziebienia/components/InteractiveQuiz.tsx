import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Alert,
  AlertTitle,
  Chip,
  LinearProgress,
  Grid,
} from "@mui/material";
import { CheckCircle, Cancel, Quiz, EmojiEvents } from "@mui/icons-material";
import { QUIZ_CONSTANTS } from "../constants";
import type { QuizQuestion, QuizState, QuizResult } from "../types";

interface InteractiveQuizProps {
  readonly title?: string;
  readonly showTitle?: boolean;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ title = "🧠 Quiz sprawdzający wiedzę", showTitle = true }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: [],
    showResults: false,
    quizCompleted: false,
  });

  const quizQuestions = QUIZ_CONSTANTS.QUESTIONS;

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setQuizState((prev) => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestion] = answerIndex;
      return {
        ...prev,
        selectedAnswers: newAnswers,
      };
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    setQuizState((prev) => {
      if (prev.currentQuestion < quizQuestions.length - 1) {
        return { ...prev, currentQuestion: prev.currentQuestion + 1 };
      } else {
        return { ...prev, showResults: true, quizCompleted: true };
      }
    });
  }, [quizQuestions.length]);

  const handlePreviousQuestion = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  }, []);

  const handleRestartQuiz = useCallback(() => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: [],
      showResults: false,
      quizCompleted: false,
    });
  }, []);

  const quizResult = useMemo((): QuizResult => {
    const correctAnswers: number[] = [];
    const incorrectAnswers: number[] = [];

    quizQuestions.forEach((question, index) => {
      if (quizState.selectedAnswers[index] === question.correctAnswer) {
        correctAnswers.push(index);
      } else {
        incorrectAnswers.push(index);
      }
    });

    const score = correctAnswers.length;
    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    return {
      score,
      total,
      percentage,
      correctAnswers,
      incorrectAnswers,
    };
  }, [quizQuestions, quizState.selectedAnswers]);

  const getScoreColor = useCallback((percentage: number) => {
    if (percentage >= QUIZ_CONSTANTS.SCORING.EXCELLENT) return "success";
    if (percentage >= QUIZ_CONSTANTS.SCORING.GOOD) return "warning";
    return "error";
  }, []);

  const getScoreMessage = useCallback((percentage: number) => {
    if (percentage >= QUIZ_CONSTANTS.SCORING.EXCELLENT) return QUIZ_CONSTANTS.MESSAGES.EXCELLENT;
    if (percentage >= QUIZ_CONSTANTS.SCORING.GOOD) return QUIZ_CONSTANTS.MESSAGES.GOOD;
    return QUIZ_CONSTANTS.MESSAGES.NEEDS_IMPROVEMENT;
  }, []);

  const currentQuestionData = quizQuestions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizQuestions.length) * 100;

  if (quizState.showResults) {
    const scoreColor = getScoreColor(quizResult.percentage);
    const scoreMessage = getScoreMessage(quizResult.percentage);

    return (
      <Box sx={{ mb: 4 }}>
        {showTitle && (
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
            {title}
          </Typography>
        )}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 6,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            border: "2px solid",
            borderColor: `${scoreColor}.main`,
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 6 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${
                  scoreColor === "success" ? "#4caf50" : scoreColor === "warning" ? "#ff9800" : "#f44336"
                } 0%, ${scoreColor === "success" ? "#66bb6a" : scoreColor === "warning" ? "#ffb74d" : "#ef5350"} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: 4,
              }}
            >
              <EmojiEvents sx={{ fontSize: 60, color: "white" }} />
            </Box>

            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: `${scoreColor}.main`, mb: 2 }}>
              {scoreMessage}
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "text.secondary", mb: 3 }}>
              Twój wynik: {quizResult.score}/{quizResult.total} ({quizResult.percentage}%)
            </Typography>

            <Chip
              label={`${quizResult.score}/${quizResult.total} poprawnych odpowiedzi`}
              color={scoreColor}
              size="medium"
              sx={{
                mb: 4,
                fontSize: "1.2rem",
                py: 3,
                px: 2,
                fontWeight: 700,
                height: "auto",
              }}
            />

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleRestartQuiz}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: 4,
                  "&:hover": {
                    background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                🔄 Rozwiąż quiz ponownie
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {quizQuestions.map((question, index) => {
            const userAnswer = quizState.selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const correctAnswer = question.options[question.correctAnswer];

            return (
              <Grid size={{ xs: 12, md: 6 }} key={question.id}>
                <Card
                  sx={{
                    border: `3px solid`,
                    borderColor: isCorrect ? "success.main" : "error.main",
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    background: isCorrect
                      ? "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)"
                      : "linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: isCorrect ? "success.main" : "error.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        {isCorrect ? (
                          <CheckCircle sx={{ color: "white", fontSize: 24 }} />
                        ) : (
                          <Cancel sx={{ color: "white", fontSize: 24 }} />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isCorrect ? "success.dark" : "error.dark" }}>
                        Pytanie {index + 1}
                      </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, lineHeight: 1.4, color: "primary.dark" }}>
                      {question.question}
                    </Typography>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: "white", borderRadius: 2, border: "1px solid", borderColor: "grey.300" }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                        <strong>Twoja odpowiedź:</strong>
                      </Typography>
                      <Typography variant="body1" sx={{ color: isCorrect ? "success.dark" : "error.dark", fontWeight: 500 }}>
                        {userAnswer !== undefined ? question.options[userAnswer] : "Brak odpowiedzi"}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2, p: 2, backgroundColor: "success.light", borderRadius: 2, opacity: 0.9 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                        <strong>Poprawna odpowiedź:</strong>
                      </Typography>
                      <Typography variant="body1" sx={{ color: "success.dark", fontWeight: 500 }}>
                        {correctAnswer}
                      </Typography>
                    </Box>

                    <Box sx={{ p: 2, backgroundColor: "info.light", borderRadius: 2, opacity: 0.9 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "info.dark" }}>
                        <strong>Wyjaśnienie:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: "info.dark", lineHeight: 1.5 }}>
                        {question.explanation}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {showTitle && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
          {title}
        </Typography>
      )}

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <AlertTitle>Sprawdź swoją wiedzę!</AlertTitle>
        Rozwiąż quiz, aby sprawdzić, ile wiesz o infekcjach wirusowych. Każde pytanie ma tylko jedną poprawną odpowiedź.
      </Alert>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "1px solid",
          borderColor: "primary.light",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Quiz sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                Pytanie {quizState.currentQuestion + 1} z {quizQuestions.length}
              </Typography>
            </Box>
            <Chip label={`${Math.round(progress)}%`} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 4,
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 6,
                background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
              },
            }}
          />

          <Card
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: 2,
              border: "2px solid",
              borderColor: "primary.light",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                lineHeight: 1.4,
                color: "primary.dark",
                textAlign: "center",
              }}
            >
              {currentQuestionData.question}
            </Typography>
          </Card>

          <FormControl component="fieldset" sx={{ width: "100%", mb: 4 }}>
            <RadioGroup
              value={quizState.selectedAnswers[quizState.currentQuestion] ?? ""}
              onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}
            >
              {currentQuestionData.options.map((option, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: quizState.selectedAnswers[quizState.currentQuestion] === index ? "primary.main" : "grey.300",
                    backgroundColor: quizState.selectedAnswers[quizState.currentQuestion] === index ? "primary.light" : "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: quizState.selectedAnswers[quizState.currentQuestion] === index ? "primary.light" : "primary.light",
                      opacity: 0.8,
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <FormControlLabel
                    value={index}
                    control={
                      <Radio
                        sx={{
                          color: "primary.main",
                          "&.Mui-checked": {
                            color: "primary.main",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: quizState.selectedAnswers[quizState.currentQuestion] === index ? 600 : 500,
                          color: quizState.selectedAnswers[quizState.currentQuestion] === index ? "primary.dark" : "text.primary",
                          p: 1,
                        }}
                      >
                        {option}
                      </Typography>
                    }
                    sx={{
                      width: "100%",
                      m: 0,
                      p: 2,
                    }}
                  />
                </Card>
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handlePreviousQuestion}
              disabled={quizState.currentQuestion === 0}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1rem",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              ← Poprzednie
            </Button>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              disabled={quizState.selectedAnswers[quizState.currentQuestion] === undefined}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                boxShadow: 3,
                "&:hover": {
                  background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                  boxShadow: 4,
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "grey.400",
                  color: "white",
                },
              }}
            >
              {quizState.currentQuestion === quizQuestions.length - 1 ? "🏁 Zakończ quiz" : "Następne →"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
