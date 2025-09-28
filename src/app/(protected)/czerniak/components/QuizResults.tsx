import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { CheckCircle, Cancel, Timer, Star } from "@mui/icons-material";
import { QuizSession, QuizResult, QuizQuestion } from "../types";

interface QuizResultsProps {
  session: QuizSession;
  questions: QuizQuestion[];
  onRestart: () => void;
  onReview: () => void;
  onReturnToFirst: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ session, questions, onRestart, onReview, onReturnToFirst }) => {
  const scorePercentage = (session.totalScore / session.maxScore) * 100;
  const correctAnswers = session.results.filter((r) => r.isCorrect).length;
  const totalTime = session.endTime ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000) : 0;

  const getScoreGrade = () => {
    if (scorePercentage >= 90) return { grade: "A", color: "success", text: "Doskonały!", icon: "🏆" };
    if (scorePercentage >= 80) return { grade: "B", color: "info", text: "Bardzo dobry!", icon: "🥇" };
    if (scorePercentage >= 70) return { grade: "C", color: "warning", text: "Dobry!", icon: "🥈" };
    if (scorePercentage >= 50) return { grade: "D", color: "warning", text: "Zadowalający", icon: "🥉" };
    if (scorePercentage >= 30) return { grade: "E", color: "error", text: "Dostateczny", icon: "📚" };
    return { grade: "F", color: "error", text: "Niedostateczny", icon: "❌" };
  };

  const grade = getScoreGrade();

  return (
    <Box>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          {grade.icon} Wyniki Quizu
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Quiz zakończony pomyślnie!
        </Typography>
      </Box>

      {/* Score Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h2" fontWeight={700} color="primary.main">
                {session.totalScore}/{session.maxScore}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Poprawne odpowiedzi
              </Typography>
              <LinearProgress variant="determinate" value={scorePercentage} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary" mt={1}>
                {scorePercentage.toFixed(1)}% poprawnych odpowiedzi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h2" fontWeight={700} color="success.main">
                {grade.grade}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Ocena
              </Typography>
              <Chip
                label={grade.text}
                color={grade.color as "primary" | "secondary" | "success" | "warning" | "error" | "info"}
                sx={{ mt: 2 }}
                icon={<Star />}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h2" fontWeight={700} color="info.main">
                {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, "0")}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Czas wykonania
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Średnio {Math.floor(totalTime / session.maxScore)}s na pytanie
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Analiza wyników
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircle color="success" />
                <Typography variant="body1">
                  Poprawne odpowiedzi: <strong>{correctAnswers}</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Cancel color="error" />
                <Typography variant="body1">
                  Niepoprawne odpowiedzi: <strong>{session.maxScore - correctAnswers}</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            {scorePercentage >= 80
              ? "Gratulacje! Masz doskonałą wiedzę na temat czerniaka i jego wykrywania."
              : scorePercentage >= 50
              ? "Dobry wynik! Rozważ powtórzenie materiału, aby jeszcze lepiej poznać temat czerniaka."
              : scorePercentage >= 30
              ? "Warto powtórzyć materiał o czerniaku. Regularne badania skóry są kluczowe dla wczesnego wykrycia."
              : "Zdecydowanie polecam powtórzenie materiału o czerniaku. Wiedza na ten temat może uratować życie."}
          </Typography>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Szczegółowe wyniki
          </Typography>

          <List>
            {session.results.map((result, index) => {
              const question = questions.find((q) => q.id === result.questionId);
              if (!question) return null;

              const correctAnswer = Array.isArray(question.correctAnswer) ? question.correctAnswer.join(", ") : question.correctAnswer;

              return (
                <ListItem key={index} divider sx={{ flexDirection: "column", alignItems: "flex-start", py: 2 }}>
                  <Box display="flex" alignItems="center" width="100%" mb={1}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {result.isCorrect ? <CheckCircle color="success" /> : <Cancel color="error" />}
                    </ListItemIcon>
                    <Typography variant="h6" fontWeight={600}>
                      Pytanie {index + 1}
                    </Typography>
                  </Box>

                  <Box width="100%" ml={5}>
                    <Typography variant="body1" fontWeight={500} mb={1}>
                      {question.question}
                    </Typography>

                    <Box mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Twoja odpowiedź:</strong>{" "}
                        <span style={{ color: result.isCorrect ? "green" : "red", fontWeight: 600 }}>
                          {Array.isArray(result.userAnswer) ? result.userAnswer.join(", ") : result.userAnswer}
                        </span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Poprawna odpowiedź:</strong> <span style={{ color: "green", fontWeight: 600 }}>{correctAnswer}</span>
                      </Typography>
                    </Box>

                    <Alert severity={result.isCorrect ? "success" : "error"} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Wyjaśnienie:</strong> {question.explanation}
                      </Typography>
                    </Alert>

                    <Typography variant="caption" color="text.secondary">
                      Czas: {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, "0")} | Punkty:{" "}
                      {result.points}/1 | Kategoria: {question.category} | Trudność: {question.difficulty}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {scorePercentage < 50 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            💡 Rekomendacje
          </Typography>
          <Typography variant="body2">
            • Przeczytaj ponownie materiały edukacyjne o czerniaku
            <br />
            • Poznaj system ABCDE do oceny znamion
            <br />
            • Regularnie badaj swoją skórę
            <br />• Umów się na badanie dermatoskopowe
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <Button variant="contained" size="large" onClick={onRestart} color="primary">
          🔄 Rozpocznij ponownie
        </Button>
        <Button variant="outlined" size="large" onClick={onReturnToFirst} color="info">
          ⬅️ Wróć do pierwszego pytania
        </Button>
        <Button variant="outlined" size="large" onClick={onReview} color="secondary">
          📚 Przejrzyj materiały
        </Button>
      </Box>
    </Box>
  );
};
