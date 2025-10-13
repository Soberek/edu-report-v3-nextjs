import React, { useState, useCallback } from "react";
import { Box, Card, CardContent, Typography, Button, Chip, Grid, Checkbox, Alert, LinearProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MelanomaCase, ABCDEFeature } from "../types";

interface MelanomaCasesQuizProps {
  cases: MelanomaCase[];
  abcdeFeatures: ABCDEFeature[];
}

interface CaseResult {
  caseId: string;
  selectedFeatures: string[];
  isChecked: boolean;
  score: number | null;
}

export const MelanomaCasesQuiz: React.FC<MelanomaCasesQuizProps> = ({ cases, abcdeFeatures }) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [caseResults, setCaseResults] = useState<CaseResult[]>(
    cases.map((case_) => ({
      caseId: case_.id,
      selectedFeatures: [],
      isChecked: false,
      score: null,
    }))
  );
  const [showAnswers, setShowAnswers] = useState(false);

  const currentCase = cases[currentCaseIndex];
  const currentResult = caseResults[currentCaseIndex];

  const handleFeatureToggle = useCallback(
    (featureKey: string) => {
      if (currentResult.isChecked) return;

      setCaseResults((prev) =>
        prev.map((result, index) =>
          index === currentCaseIndex
            ? {
                ...result,
                selectedFeatures: result.selectedFeatures.includes(featureKey)
                  ? result.selectedFeatures.filter((f) => f !== featureKey)
                  : [...result.selectedFeatures, featureKey],
              }
            : result
        )
      );
    },
    [currentCaseIndex, currentResult.isChecked]
  );

  const handleCheckCase = useCallback(() => {
    const correctFeatures = Array.from(currentCase.correctFeatures);
    const selectedFeatures = currentResult.selectedFeatures;

    const correctSelected = selectedFeatures.filter((feature) => correctFeatures.includes(feature)).length;

    const incorrectSelected = selectedFeatures.filter((feature) => !correctFeatures.includes(feature)).length;

    // const missedCorrect = correctFeatures.filter((feature) => !selectedFeatures.includes(feature)).length;

    // Calculate score: correct selections - incorrect selections
    const score = Math.max(0, correctSelected - incorrectSelected);

    setCaseResults((prev) =>
      prev.map((result, index) =>
        index === currentCaseIndex
          ? {
              ...result,
              isChecked: true,
              score,
            }
          : result
      )
    );
  }, [currentCase, currentResult.selectedFeatures, currentCaseIndex]);

  const handleResetCase = useCallback(() => {
    setCaseResults((prev) =>
      prev.map((result, index) =>
        index === currentCaseIndex
          ? {
              ...result,
              selectedFeatures: [],
              isChecked: false,
              score: null,
            }
          : result
      )
    );
  }, [currentCaseIndex]);

  const handleNextCase = useCallback(() => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(currentCaseIndex + 1);
    }
  }, [currentCaseIndex, cases.length]);

  const handlePreviousCase = useCallback(() => {
    if (currentCaseIndex > 0) {
      setCurrentCaseIndex(currentCaseIndex - 1);
    }
  }, [currentCaseIndex]);

  const totalScore = caseResults.reduce((sum, result) => sum + (result.score || 0), 0);
  const maxScore = cases.reduce((sum, case_) => sum + case_.correctFeatures.size, 0);
  const completedCases = caseResults.filter((result) => result.isChecked).length;

  const getFeatureStatus = (featureKey: string) => {
    if (!currentResult.isChecked) return "default";

    const isCorrect = currentCase.correctFeatures.has(featureKey);
    const isSelected = currentResult.selectedFeatures.includes(featureKey);

    if (isCorrect && isSelected) return "success";
    if (isCorrect && !isSelected) return "info";
    if (!isCorrect && isSelected) return "error";
    return "default";
  };

  const progress = ((currentCaseIndex + 1) / cases.length) * 100;

  return (
    <Box>
      {/* Compact Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          🔍 Analiza przypadków czerniaka
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Chip label={`${currentCaseIndex + 1}/${cases.length}`} color="primary" size="small" />
          <Chip label={`${totalScore}/${maxScore}`} color="info" size="small" />
        </Box>
      </Box>

      {/* Compact Progress */}
      <Box mb={2}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
        <Typography variant="caption" color="text.secondary" mt={0.5}>
          {completedCases}/{cases.length} ukończonych
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Compact Image Section */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "fit-content" }}>
            <Box sx={{ position: "relative", width: "100%", pt: "60%", bgcolor: "grey.100" }}>
              <img
                src={currentCase.imageUrl}
                alt={`Przypadek ${currentCase.id}`}
                style={{
                  position: "absolute",
                  inset: "0",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                {currentCase.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {currentCase.diagnosis}
              </Typography>

              {currentResult.isChecked && (
                <Alert severity="info" sx={{ mt: 1, py: 1 }}>
                  <Typography variant="caption" fontWeight={600}>
                    Wyjaśnienie:
                  </Typography>
                  <Typography variant="caption" display="block">
                    {currentCase.explanation}
                  </Typography>
                </Alert>
              )}

              {/* Compact Navigation */}
              <Box display="flex" gap={1} mt={2} justifyContent="space-between">
                <Button size="small" onClick={handlePreviousCase} disabled={currentCaseIndex === 0}>
                  ←
                </Button>
                <Button size="small" onClick={handleNextCase} disabled={currentCaseIndex === cases.length - 1}>
                  →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Compact ABCDE Section */}
        <Grid size={{ xs: 7 }}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Wybierz cechy ABCDE:
              </Typography>

              {/* Compact ABCDE Grid */}
              <Grid container spacing={1} mb={2}>
                {abcdeFeatures.map((feature) => {
                  const isSelected = currentResult.selectedFeatures.includes(feature.key);
                  const status = getFeatureStatus(feature.key);

                  return (
                    <Grid size={{ xs: 12 }} key={feature.key}>
                      <Card
                        variant="outlined"
                        onClick={() => handleFeatureToggle(feature.key)}
                        sx={{
                          cursor: currentResult.isChecked ? "default" : "pointer",
                          transition: "all 100ms ease",
                          p: 1,
                          "&:hover": !currentResult.isChecked
                            ? {
                                transform: "translateY(-1px)",
                                boxShadow: 1,
                              }
                            : {},
                          backgroundColor: isSelected ? "primary.50" : "white",
                          borderColor:
                            status === "success"
                              ? "success.main"
                              : status === "error"
                              ? "error.main"
                              : status === "info"
                              ? "info.main"
                              : "grey.300",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleFeatureToggle(feature.key)}
                            disabled={currentResult.isChecked}
                            color="primary"
                            size="small"
                          />
                          <Box flex="1" minWidth={0}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {feature.icon} {feature.key} - {feature.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {feature.description}
                            </Typography>
                          </Box>
                          {currentResult.isChecked && (
                            <Chip
                              label={status === "success" ? "✓" : status === "error" ? "✗" : status === "info" ? "○" : ""}
                              color={status as "primary" | "secondary" | "success" | "warning" | "error" | "info"}
                              size="small"
                              sx={{ minWidth: 24, height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Compact Action Bar */}
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" mb={1}>
                <Button
                  size="small"
                  onClick={handleCheckCase}
                  disabled={currentResult.isChecked || currentResult.selectedFeatures.length === 0}
                >
                  Sprawdź
                </Button>

                <Button
                  size="small"
                  onClick={handleResetCase}
                  disabled={!currentResult.isChecked && currentResult.selectedFeatures.length === 0}
                >
                  Reset
                </Button>

                <Button
                  size="small"
                  onClick={() => setShowAnswers(!showAnswers)}
                  startIcon={showAnswers ? <VisibilityOff /> : <Visibility />}
                >
                  {showAnswers ? "Ukryj" : "Pokaż"}
                </Button>

                {currentResult.isChecked && (
                  <Box ml="auto">
                    <Typography variant="caption" fontWeight={600}>
                      {currentResult.score}/{currentCase.correctFeatures.size} pkt
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Compact Answer Display */}
              {showAnswers && (
                <Alert severity="info" sx={{ py: 1 }}>
                  <Typography variant="caption" fontWeight={600}>
                    Poprawne: {Array.from(currentCase.correctFeatures).join(", ")}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compact Summary Stats */}
      {completedCases > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              📊 Podsumowanie
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    {completedCases}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ukończone
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    {totalScore}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Punkty
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700} color="info.main">
                    {maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dokładność
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
