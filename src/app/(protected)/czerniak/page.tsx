"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Card, CardContent, Button, Chip, LinearProgress, Alert, Container } from "@mui/material";
import { Quiz, School, Info, Assessment, Visibility } from "@mui/icons-material";

// Import components and data
import { QuizQuestionComponent } from "./components/QuizQuestion";
import { QuizResults } from "./components/QuizResults";
import { EducationalContentComponent } from "./components/EducationalContent";
import { MelanomaCasesQuiz } from "./components/MelanomaCasesQuiz";
import { useQuiz } from "./hooks/useQuiz";
import { QUIZ_QUESTIONS, MELANOMA_CASES, ABCDE_FEATURES, EDUCATIONAL_CONTENT } from "./data/quizData";
import { QuizSettings } from "./types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`quiz-tabpanel-${index}`} aria-labelledby={`quiz-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function MelanomaQuiz() {
  const [currentTab, setCurrentTab] = useState(0);
  const [quizSettings] = useState<QuizSettings>({
    questionCount: QUIZ_QUESTIONS.length,
    difficulty: "mixed",
    categories: ["diagnosis", "symptoms", "prevention", "treatment", "risk-factors"],
    showExplanations: true,
    allowRetry: true,
  });

  const {
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
  } = useQuiz(QUIZ_QUESTIONS, quizSettings);

  // Timer effect
  useEffect(() => {
    if (!showExplanation && currentQuestion) {
      const interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showExplanation, currentQuestion, setTimeSpent]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleQuizComplete = () => {
    setCurrentTab(3); // Go to results tab
  };

  const handleRestartQuiz = () => {
    resetQuiz();
    setCurrentTab(0);
  };

  const handleReviewMaterials = () => {
    setCurrentTab(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight={700} mb={2}>
          🩺 Quiz o Czerniaku
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Sprawdź swoją wiedzę o najgroźniejszym nowotworze skóry
        </Typography>

        {/* Progress Bar for Quiz */}
        {currentTab === 0 && (
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Postęp quizu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {session.currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        )}

        {/* Score Display */}
        {session.results.length > 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight={600}>
              Aktualny wynik: {session.totalScore} / {session.maxScore}({scorePercentage.toFixed(1)}%)
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="quiz tabs">
          <Tab icon={<Quiz />} label="Quiz" id="quiz-tab-0" aria-controls="quiz-tabpanel-0" />
          <Tab icon={<School />} label="Materiały edukacyjne" id="quiz-tab-1" aria-controls="quiz-tabpanel-1" />
          <Tab icon={<Visibility />} label="Analiza przypadków" id="quiz-tab-2" aria-controls="quiz-tabpanel-2" />
          <Tab
            icon={<Assessment />}
            label="Wyniki"
            id="quiz-tab-3"
            aria-controls="quiz-tabpanel-3"
            disabled={session.results.length === 0}
          />
        </Tabs>
      </Box>

      {/* Quiz Tab */}
      <TabPanel value={currentTab} index={0}>
        {currentQuestion ? (
          <QuizQuestionComponent
            question={currentQuestion}
            currentAnswer={currentAnswer}
            showExplanation={showExplanation}
            onAnswerSelect={selectAnswer}
            onMultipleAnswerSelect={selectMultipleAnswers}
            onSubmit={submitAnswer}
            onNext={() => {
              if (isLastQuestion) {
                handleQuizComplete();
              } else {
                nextQuestion();
              }
            }}
            onPrevious={previousQuestion}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            timeSpent={timeSpent}
          />
        ) : (
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h5" mb={2}>
                🎯 Witaj w Quizie o Czerniaku!
              </Typography>
              <Typography variant="body1" mb={3}>
                Ten quiz pomoże Ci sprawdzić wiedzę o czerniaku, jego objawach, zapobieganiu i wczesnym wykrywaniu. Odpowiedz na{" "}
                {QUIZ_QUESTIONS.length} pytań i sprawdź swoją wiedzę!
              </Typography>
              <Button variant="contained" size="large" onClick={() => setCurrentTab(0)} startIcon={<Quiz />}>
                Rozpocznij quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Educational Content Tab */}
      <TabPanel value={currentTab} index={1}>
        <EducationalContentComponent content={EDUCATIONAL_CONTENT} abcdeFeatures={ABCDE_FEATURES} />
      </TabPanel>

      {/* Melanoma Cases Analysis Tab */}
      <TabPanel value={currentTab} index={2}>
        <MelanomaCasesQuiz cases={MELANOMA_CASES} abcdeFeatures={ABCDE_FEATURES} />
      </TabPanel>

      {/* Results Tab */}
      <TabPanel value={currentTab} index={3}>
        {session.completed ? (
          <QuizResults session={session} onRestart={handleRestartQuiz} onReview={handleReviewMaterials} />
        ) : (
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h5" mb={2}>
                📊 Wyniki będą dostępne po zakończeniu quizu
              </Typography>
              <Typography variant="body1" mb={3}>
                Ukończ quiz, aby zobaczyć szczegółowe wyniki i analizę.
              </Typography>
              <Button variant="contained" onClick={() => setCurrentTab(0)}>
                Wróć do quizu
              </Button>
            </CardContent>
          </Card>
        )}
      </TabPanel>

      {/* Quick Stats */}
      <Box mt={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              📈 Statystyki quizu
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
              <Chip label={`${QUIZ_QUESTIONS.length} pytań`} color="primary" variant="outlined" />
              <Chip label={`${QUIZ_QUESTIONS.filter((q) => q.difficulty === "easy").length} łatwe`} color="success" variant="outlined" />
              <Chip
                label={`${QUIZ_QUESTIONS.filter((q) => q.difficulty === "medium").length} średnie`}
                color="warning"
                variant="outlined"
              />
              <Chip label={`${QUIZ_QUESTIONS.filter((q) => q.difficulty === "hard").length} trudne`} color="error" variant="outlined" />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
