"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import { CheckCircle, Cancel, Refresh, Quiz, EmojiEvents, TrendingUp } from "@mui/icons-material";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: "symptoms" | "treatment" | "prevention" | "differences" | "complications";
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Który objaw jest najbardziej charakterystyczny dla grypy?",
    options: ["Stopniowy rozwój objawów", "Nagły początek z wysoką gorączką", "Głównie katar i kichanie", "Łagodne osłabienie"],
    correctAnswer: 1,
    explanation: "Grypa charakteryzuje się nagłym początkiem choroby z wysoką gorączką (39-40°C), co odróżnia ją od przeziębienia.",
    category: "symptoms",
  },
  {
    id: 2,
    question: "Jak długo trwa zwykle przeziębienie?",
    options: ["2-3 dni", "7-10 dni", "2-3 tygodnie", "1 miesiąc"],
    correctAnswer: 1,
    explanation: "Przeziębienie trwa zwykle 7-10 dni, podczas gdy grypa może trwać 2-7 dni plus tydzień osłabienia.",
    category: "differences",
  },
  {
    id: 3,
    question: "Która droga zakażenia jest najczęstsza dla wirusów grypy?",
    options: ["Przez skórę", "Drogą kropelkową", "Przez pokarm", "Przez wodę"],
    correctAnswer: 1,
    explanation: "Wirusy grypy przenoszą się głównie drogą kropelkową - przez kichanie, kaszel i rozmowę.",
    category: "prevention",
  },
  {
    id: 4,
    question: "Kiedy należy udać się do lekarza z objawami grypy?",
    options: [
      "Zawsze przy pierwszym objawie",
      "Gdy gorączka przekracza 40°C i utrzymuje się >3 dni",
      "Tylko u osób starszych",
      "Nigdy, grypa przechodzi sama",
    ],
    correctAnswer: 1,
    explanation:
      "Do lekarza należy udać się gdy gorączka przekracza 40°C i utrzymuje się dłużej niż 3 dni, lub przy innych objawach alarmowych.",
    category: "treatment",
  },
  {
    id: 5,
    question: "Które powikłanie jest najgroźniejsze w przypadku grypy?",
    options: ["Katar", "Zapalenie płuc", "Ból gardła", "Kichanie"],
    correctAnswer: 1,
    explanation: "Zapalenie płuc to jedno z najgroźniejszych powikłań grypy, szczególnie u osób z grup ryzyka.",
    category: "complications",
  },
  {
    id: 6,
    question: "Jaka jest najskuteczniejsza metoda profilaktyki grypy?",
    options: ["Witamina C", "Szczepienia przeciw grypie", "Czosnek", "Echinacea"],
    correctAnswer: 1,
    explanation: "Szczepienia przeciw grypie to najskuteczniejsza metoda profilaktyki, zmniejszająca ryzyko zachorowania o 40-60%.",
    category: "prevention",
  },
  {
    id: 7,
    question: "Który objaw NIE jest typowy dla przeziębienia?",
    options: ["Katar", "Kichanie", "Wysoka gorączka (39-40°C)", "Ból gardła"],
    correctAnswer: 2,
    explanation:
      "Wysoka gorączka (39-40°C) jest charakterystyczna dla grypy, nie dla przeziębienia, które ma łagodną gorączkę poniżej 38°C.",
    category: "symptoms",
  },
  {
    id: 8,
    question: "Jak często należy myć ręce, aby zmniejszyć ryzyko zakażenia?",
    options: ["Raz dziennie", "Tylko po wyjściu z toalety", "Często, mydłem przez min. 20 sekund", "Tylko gdy są brudne"],
    correctAnswer: 2,
    explanation:
      "Ręce należy myć często, mydłem przez minimum 20 sekund, szczególnie po kontakcie z chorymi lub zakażonymi powierzchniami.",
    category: "prevention",
  },
  {
    id: 9,
    question: "Które wirusy najczęściej wywołują przeziębienie?",
    options: ["Wirusy grypy", "Rinowirusy", "Adenowirusy", "Wirusy opryszczki"],
    correctAnswer: 1,
    explanation: "Rinowirusy odpowiadają za około 40% przypadków przeziębienia, podczas gdy wirusy grypy wywołują grypę.",
    category: "differences",
  },
  {
    id: 10,
    question: "Jak długo wirus grypy może przetrwać na powierzchniach?",
    options: ["Kilka minut", "Kilka godzin", "Kilka dni", "Kilka tygodni"],
    correctAnswer: 1,
    explanation: "Wirus grypy może przetrwać na powierzchniach przez kilka godzin, dlatego ważne jest regularne czyszczenie powierzchni.",
    category: "prevention",
  },
  {
    id: 11,
    question: "Który lek jest najskuteczniejszy w leczeniu grypy?",
    options: ["Antybiotyki", "Leki przeciwwirusowe", "Witamina C", "Paracetamol"],
    correctAnswer: 1,
    explanation:
      "Leki przeciwwirusowe (jak oseltamiwir) są najskuteczniejsze w leczeniu grypy, ale działają tylko w pierwszych 48 godzinach.",
    category: "treatment",
  },
  {
    id: 12,
    question: "Która grupa osób jest najbardziej narażona na powikłania grypy?",
    options: ["Młodzi dorośli", "Seniorzy i osoby przewlekle chore", "Dzieci w wieku szkolnym", "Sportowcy"],
    correctAnswer: 1,
    explanation: "Seniorzy, osoby przewlekle chore, kobiety w ciąży i małe dzieci są najbardziej narażone na powikłania grypy.",
    category: "complications",
  },
  {
    id: 13,
    question: "Czy antybiotyki pomagają w leczeniu grypy?",
    options: ["Tak, zawsze", "Nie, grypa to infekcja wirusowa", "Tylko w ciężkich przypadkach", "Tylko u dzieci"],
    correctAnswer: 1,
    explanation: "Antybiotyki nie pomagają w leczeniu grypy, ponieważ to infekcja wirusowa. Antybiotyki działają tylko na bakterie.",
    category: "treatment",
  },
  {
    id: 14,
    question: "Który objaw jest charakterystyczny dla przeziębienia, ale rzadki w grypie?",
    options: ["Gorączka", "Ból głowy", "Katar i kichanie", "Bóle mięśni"],
    correctAnswer: 2,
    explanation: "Katar i kichanie są bardzo charakterystyczne dla przeziębienia, podczas gdy w grypie występują rzadziej.",
    category: "symptoms",
  },
  {
    id: 15,
    question: "Jak często należy szczepić się przeciw grypie?",
    options: ["Raz w życiu", "Co 2 lata", "Co roku", "Tylko w czasie pandemii"],
    correctAnswer: 2,
    explanation:
      "Szczepienia przeciw grypie należy powtarzać co roku, ponieważ wirusy grypy mutują i skład szczepionki jest aktualizowany.",
    category: "prevention",
  },
  {
    id: 16,
    question: "Które powikłanie może wystąpić po grypie u dzieci?",
    options: ["Zapalenie wyrostka", "Zespół Reye'a", "Zapalenie stawów", "Cukrzyca"],
    correctAnswer: 1,
    explanation:
      "Zespół Reye'a to rzadkie, ale groźne powikłanie, które może wystąpić u dzieci po grypie, szczególnie przy podawaniu aspiryny.",
    category: "complications",
  },
  {
    id: 17,
    question: "Która temperatura gorączki jest typowa dla grypy?",
    options: ["37-38°C", "38-39°C", "39-40°C", "Powyżej 40°C"],
    correctAnswer: 2,
    explanation: "Grypa charakteryzuje się wysoką gorączką 39-40°C, podczas gdy przeziębienie ma łagodną gorączkę poniżej 38°C.",
    category: "symptoms",
  },
  {
    id: 18,
    question: "Czy można zachorować na grypę mimo szczepienia?",
    options: [
      "Nie, szczepienie daje 100% ochrony",
      "Tak, ale objawy będą łagodniejsze",
      "Tylko u osób starszych",
      "Tylko w pierwszym roku",
    ],
    correctAnswer: 1,
    explanation:
      "Szczepienie nie daje 100% ochrony, ale znacznie zmniejsza ryzyko zachorowania i łagodzi objawy jeśli dojdzie do infekcji.",
    category: "prevention",
  },
  {
    id: 19,
    question: "Który domowy sposób może pomóc w leczeniu przeziębienia?",
    options: ["Aspiryna u dzieci", "Miód z mlekiem", "Alkohol", "Zimne kąpiele"],
    correctAnswer: 1,
    explanation: "Miód z mlekiem to tradycyjny, bezpieczny sposób łagodzenia objawów przeziębienia, szczególnie kaszlu.",
    category: "treatment",
  },
  {
    id: 20,
    question: "Kiedy szczyt sezonu grypowego w Polsce?",
    options: ["Lato (czerwiec-sierpień)", "Jesień (wrzesień-listopad)", "Zima (grudzień-luty)", "Wiosna (marzec-maj)"],
    correctAnswer: 2,
    explanation: "Szczyt sezonu grypowego w Polsce przypada na zimę (grudzień-luty), dlatego szczepienia zaleca się jesienią.",
    category: "prevention",
  },
];

interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  showResults: boolean;
  isCompleted: boolean;
}

export const InteractiveQuiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: new Array(QUIZ_QUESTIONS.length).fill(null),
    showResults: false,
    isCompleted: false,
  });

  const progress = useMemo(() => ((quizState.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100, [quizState.currentQuestion]);

  const score = useMemo(() => {
    if (!quizState.showResults) return 0;
    return quizState.answers.reduce((acc: number, answer, index) => {
      return acc + (answer === QUIZ_QUESTIONS[index].correctAnswer ? 1 : 0);
    }, 0);
  }, [quizState.answers, quizState.showResults]);

  const percentage = useMemo(() => Math.round((score / QUIZ_QUESTIONS.length) * 100), [score]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setQuizState((prev) => ({
      ...prev,
      answers: prev.answers.map((answer, index) => (index === prev.currentQuestion ? answerIndex : answer)),
    }));
  }, []);

  const handleNext = useCallback(() => {
    setQuizState((prev) => {
      if (prev.currentQuestion < QUIZ_QUESTIONS.length - 1) {
        return { ...prev, currentQuestion: prev.currentQuestion + 1 };
      } else {
        return { ...prev, showResults: true, isCompleted: true };
      }
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  }, []);

  const handleRestart = useCallback(() => {
    setQuizState({
      currentQuestion: 0,
      answers: new Array(QUIZ_QUESTIONS.length).fill(null),
      showResults: false,
      isCompleted: false,
    });
  }, []);

  const getCategoryColor = useCallback((category: QuizQuestion["category"]) => {
    const colors = {
      symptoms: "error",
      treatment: "success",
      prevention: "info",
      differences: "warning",
      complications: "error",
    } as const;
    return colors[category] || "default";
  }, []);

  const getCategoryLabel = useCallback((category: QuizQuestion["category"]) => {
    const labels = {
      symptoms: "Objawy",
      treatment: "Leczenie",
      prevention: "Profilaktyka",
      differences: "Różnice",
      complications: "Powikłania",
    };
    return labels[category] || category;
  }, []);

  const getScoreMessage = useCallback((percentage: number) => {
    if (percentage >= 90) return { message: "Doskonały wynik! 🎉", color: "success" as const };
    if (percentage >= 70) return { message: "Bardzo dobry wynik! 👏", color: "info" as const };
    if (percentage >= 50) return { message: "Dobry wynik! 👍", color: "warning" as const };
    return { message: "Spróbuj ponownie! 💪", color: "error" as const };
  }, []);

  const currentQuestion = QUIZ_QUESTIONS[quizState.currentQuestion];
  const currentAnswer = quizState.answers[quizState.currentQuestion];
  const scoreMessage = getScoreMessage(percentage);

  if (quizState.showResults) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Card>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <EmojiEvents sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Quiz zakończony!
              </Typography>
              <Typography variant="h2" color="primary" fontWeight="bold">
                {score}/{QUIZ_QUESTIONS.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                ({percentage}%)
              </Typography>
            </Box>

            <Alert severity={scoreMessage.color} sx={{ mb: 3 }}>
              <Typography variant="h6">{scoreMessage.message}</Typography>
            </Alert>

            <Button variant="contained" size="large" startIcon={<Refresh />} onClick={handleRestart} sx={{ mb: 3 }}>
              Rozwiąż ponownie
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Szczegółowe wyniki:
            </Typography>

            <Stack spacing={2}>
              {QUIZ_QUESTIONS.map((question, index) => {
                const userAnswer = quizState.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <Paper key={question.id} sx={{ p: 2, textAlign: "left" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      {isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}
                      <Typography variant="subtitle1" fontWeight="bold">
                        Pytanie {index + 1}
                      </Typography>
                      <Chip label={getCategoryLabel(question.category)} color={getCategoryColor(question.category)} size="small" />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {question.question}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      <strong>Twoja odpowiedź:</strong> {userAnswer !== null ? question.options[userAnswer] : "Brak odpowiedzi"}
                    </Typography>

                    {!isCorrect && (
                      <Typography variant="body2" color="success.main">
                        <strong>Poprawna odpowiedź:</strong> {question.options[question.correctAnswer]}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
                      {question.explanation}
                    </Typography>
                  </Paper>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Quiz color="primary" />
              <Typography variant="h5" fontWeight="bold">
                Quiz: Grypa vs Przeziębienie
              </Typography>
            </Box>

            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Pytanie {quizState.currentQuestion + 1} z {QUIZ_QUESTIONS.length}
              </Typography>
              <Chip label={getCategoryLabel(currentQuestion.category)} color={getCategoryColor(currentQuestion.category)} size="small" />
            </Box>
          </Box>

          {/* Question */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {currentQuestion.question}
          </Typography>

          {/* Options */}
          <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
            <RadioGroup value={currentAnswer ?? ""} onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}>
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option}
                  sx={{
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button variant="outlined" onClick={handlePrevious} disabled={quizState.currentQuestion === 0}>
              Poprzednie
            </Button>

            <Button variant="contained" onClick={handleNext} disabled={currentAnswer === null}>
              {quizState.currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Zakończ" : "Następne"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
