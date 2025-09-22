/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useReducer } from "react";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography, Chip, Alert } from "@mui/material";
type Feature = {
  key: string;
  label: string;
};

const FEATURES: Feature[] = [
  { key: "A", label: "Asymetria (A) 🔺" },
  { key: "B", label: "Nieregularna granica (B) ✂️" },
  { key: "C", label: "Różnorodność kolorów (C) 🌈" },
  { key: "D", label: "Średnica > 6mm (D) 📏" },
  { key: "E", label: "Zmiana w czasie (E) ⏳" },
];

const CASES = [
  {
    id: 1,
    imageUrl: "czerniak-1.jpg",
    correctFeatures: new Set(["A", "B", "D", "E"]),
  },
  {
    id: 2,
    imageUrl: "czerniak-2.jpg",
    correctFeatures: new Set(["B", "C"]),
  },
  {
    id: 3,
    imageUrl: "czerniak-3.jpg",
    correctFeatures: new Set(["A", "C", "E"]),
  },
];

type State = {
  caseIndex: number;
  selectedByCase: string[][];
  checkedByCase: boolean[];
  scoreByCase: (number | null)[];
  overallScore: number | null;
};

type Action =
  | { type: "TOGGLE_FEATURE"; key: string }
  | { type: "CHECK_CASE" }
  | { type: "RESET_CASE" }
  | { type: "GO_TO_CASE"; index: number };

function computeOverallScore(scores: (number | null)[]) {
  return scores.reduce<number>((acc, s) => acc + (s ?? 0), 0);
}

const initialState = (): State => {
  return {
    caseIndex: 0, // bieżący przypadek
    selectedByCase: CASES.map(() => [] as string[]), // wybrane cechy dla każdego przypadku
    checkedByCase: CASES.map(() => false), // czy przypadek został sprawdzony
    scoreByCase: CASES.map(() => null), // punkty za każdy przypadek
    overallScore: 0, // łączny wynik
  };
};

function reducer(state: State, action: Action): State {
  console.log("Dispatching action:", action);
  switch (action.type) {
    // przełączanie cechy dla bieżącego przypadku
    case "TOGGLE_FEATURE": {
      const idx = state.caseIndex;
      if (state.checkedByCase[idx]) return state; // don't allow toggling after check
      const selected = state.selectedByCase[idx]; // bieżące wybrane cechy

      // przełącz cechę
      // jeśli już wybrana, usuń ją, w przeciwnym razie dodaj
      const nextSelected = selected.includes(action.key) ? selected.filter((k) => k !== action.key) : [...selected, action.key];

      // zaktualizuj stan
      const selectedByCase = [...state.selectedByCase];

      // aktualizuj tylko bieżący przypadek
      selectedByCase[idx] = nextSelected;

      return { ...state, selectedByCase };
    }

    case "CHECK_CASE": {
      const idx = state.caseIndex;
      const selected = state.selectedByCase[idx];
      const correctPicked = selected.filter((k) => CASES[idx].correctFeatures.has(k)).length;

      const checkedByCase = [...state.checkedByCase];
      checkedByCase[idx] = true;

      const scoreByCase = [...state.scoreByCase];
      scoreByCase[idx] = correctPicked;

      const overallScore = computeOverallScore(scoreByCase);

      return { ...state, checkedByCase, scoreByCase, overallScore };
    }

    case "RESET_CASE": {
      const idx = state.caseIndex;

      const selectedByCase = [...state.selectedByCase];
      selectedByCase[idx] = [];

      const checkedByCase = [...state.checkedByCase];
      checkedByCase[idx] = false;

      const scoreByCase = [...state.scoreByCase];
      scoreByCase[idx] = null;

      const overallScore = computeOverallScore(scoreByCase);

      return { ...state, selectedByCase, checkedByCase, scoreByCase, overallScore };
    }

    case "GO_TO_CASE": {
      const safe = Math.max(0, Math.min(action.index, CASES.length - 1));
      return { ...state, caseIndex: safe };
    }

    default:
      return state;
  }
}

export default function Rak(): React.ReactNode {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const { caseIndex, selectedByCase, checkedByCase, scoreByCase, overallScore } = state;
  const currentCase = CASES[caseIndex];
  const isChecked = checkedByCase[caseIndex];
  const selected = selectedByCase[caseIndex];

  function toggleFeature(key: string) {
    dispatch({ type: "TOGGLE_FEATURE", key });
  }

  function handleCheck() {
    dispatch({ type: "CHECK_CASE" });
  }

  function handleReset() {
    dispatch({ type: "RESET_CASE" });
  }

  function goToCase(index: number) {
    dispatch({ type: "GO_TO_CASE", index });
  }

  return (
    <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 4 }} mt={6} mb={6} fontFamily="sans-serif">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h4" fontWeight={700}>
          Quiz: cechy czerniaka (ABCDE) 🔎🩺
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip label={`Przypadek ${caseIndex + 1} / ${CASES.length}`} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
          <Chip
            label={`Wynik: ${overallScore ?? 0} / ${CASES.reduce((acc, c) => acc + c.correctFeatures.size, 0)}`}
            color="info"
            variant="filled"
          />
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "420px 1fr" }} gap={3}>
        {/* Left column - image + navigation */}
        <Card variant="outlined" sx={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ position: "relative", width: "100%", pt: "85.66%", bgcolor: "grey.100" }}>
            <img
              src={currentCase.imageUrl}
              alt={`Zdjęcie przypadku #${currentCase.id}`}
              style={{
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover", // options are "cover", "contain", "fill"
              }}
            />
          </Box>

          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1, flex: "1 1 auto" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Przypadek #{currentCase.id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Zdjęcie demonstracyjne. Wybierz spośród cech po prawej.
            </Typography>

            <Box mt={2} display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <Button onClick={() => goToCase(caseIndex - 1)} disabled={caseIndex === 0} sx={{ minWidth: 110 }}>
                ⬅️ Poprzednie
              </Button>

              <Button onClick={() => goToCase(caseIndex + 1)} disabled={caseIndex === CASES.length - 1} sx={{ minWidth: 110 }}>
                Następne ➡️
              </Button>

              <Box flex="1 1 auto" />

              <Typography variant="caption" color="text.secondary">
                {caseIndex + 1} / {CASES.length}
              </Typography>
            </Box>

            <Box mt={1}>
              <Box sx={{ height: 8, bgcolor: "grey.200", borderRadius: 2, overflow: "hidden" }}>
                <Box
                  sx={{
                    width: `${((caseIndex + 1) / CASES.length) * 100}%`,
                    height: "100%",
                    bgcolor: "primary.main",
                    transition: "width 300ms ease",
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Right column - controls and feature list */}
        <Box>
          {overallScore !== null && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                Wynik całkowity: {overallScore} / {CASES.reduce((acc, c) => acc + c.correctFeatures.size, 0)} ⭐
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Punkty są sumowane z każdego przypadku.
              </Typography>
            </Alert>
          )}

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="body1" mb={1}>
                Wybierz cechy, które widzisz na zdjęciu (możesz wybrać kilka):
              </Typography>

              <Grid container spacing={2}>
                {FEATURES.map((f) => {
                  const isSelected = selected.includes(f.key);
                  const isCorrect = currentCase.correctFeatures.has(f.key);
                  const showCorrect = isChecked;

                  // determine visual state
                  const borderColor = showCorrect
                    ? isCorrect
                      ? "success.main"
                      : isSelected
                      ? "error.light"
                      : "grey.200"
                    : isSelected
                    ? "primary.light"
                    : "grey.200";

                  const bg = isSelected ? "primary.50" : "white";

                  return (
                    <Grid size={{ xs: 12 }} key={f.key}>
                      <Card
                        variant="outlined"
                        onClick={() => !isChecked && toggleFeature(f.key)}
                        sx={{
                          cursor: isChecked ? "default" : "pointer",
                          transition: "transform 150ms ease, box-shadow 150ms ease",
                          "&:hover": !isChecked ? { transform: "translateY(-4px)", boxShadow: 3 } : {},
                          backgroundColor: bg,
                          borderColor,
                          height: "100%",
                        }}
                      >
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox checked={isSelected} onChange={() => toggleFeature(f.key)} disabled={isChecked} color="primary" />
                            }
                            label={
                              <Typography variant="body2" sx={{ userSelect: "none" }}>
                                {f.label}
                              </Typography>
                            }
                            sx={{ flex: 1, m: 0 }}
                          />

                          {showCorrect && (
                            <Chip
                              label={isCorrect ? "✅ poprawne" : "❌ niepoprawne"}
                              color={isCorrect ? "success" : "default"}
                              size="small"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Button variant="contained" color="primary" onClick={handleCheck} disabled={isChecked || selected.length === 0}>
              Sprawdź ✅
            </Button>

            <Button variant="outlined" color="secondary" onClick={handleReset} disabled={!isChecked && selected.length === 0}>
              Reset 🔄
            </Button>

            <Box flex="1 1 auto" />

            {isChecked && (
              <Box textAlign="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Punkty: <span style={{ color: "#1976d2" }}>{scoreByCase[caseIndex]}</span> / {currentCase.correctFeatures.size} ⭐
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Wybrane: {selected.join(", ") || "brak"}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
