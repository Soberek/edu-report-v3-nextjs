"use client";

import { Box, Typography, Chip } from "@mui/material";

type Priority = "low" | "medium" | "high";

interface TodoItem {
  id: number;
  text: string;
  done?: boolean;
  priority?: Priority;
  subtasks?: string[];
  date?: string;
}

const ITEMS: TodoItem[] = [
  {
    id: 1,
    text: "Zeby od razu miernik budzetowy generowal sie do wzoru wsse .xlsx",
    done: false,
    priority: "low",
  },
  {
    id: 2,
    text: "Przenieść generowanie dokumentów do edureportv2 i od razu ulepszyć",
    done: true,
    priority: "high",
  },
  {
    id: 3,
    text: "Bazę zadań edukacyjnych przenieść do edureportv2 z excela, wtedy bede mógł sprawdzać czy izrz numer już istnieje, generować rejestry zadań, wizytacji, raporty, ogolnie jedno zrodlo prawdy \n - bede mogl pozniej wyodrebnic dane np. odnosnie bezpiecznych wakacji i zrobic z tego sprawozdanie",
    subtasks: [""],
  },
  {
    id: 4,
    text: "Scrapowanie świąt nietypowych z internetu, tworzenie listy i wyswietlanie uzytkownikowi, nastepnie mogę zrobić prompt do openai aby wybral tylko te ktore sa edukacyjne i zaproponował treść do posta na social media",
    done: true,
    priority: "medium",
  },
  {
    id: 5,
    text: "Przenieść edureportv2 na nextjs 13 app router",
    done: true,
  },
];

interface TodoItem {
  id: number;
  text: string;
  done?: boolean;
  priority?: Priority;
  subtasks?: string[];
  date?: string;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "#d32f2f",
  medium: "#fbc02d",
  low: "#388e3c",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  high: "Wysoki",
  medium: "Średni",
  low: "Niski",
};

const PRIORITIES: Priority[] = ["high", "medium", "low"];

export default function Todo() {
  // Group items by priority
  const grouped: Record<Priority, TodoItem[]> = {
    high: [],
    medium: [],
    low: [],
  };
  ITEMS.forEach((item) => {
    if (item.priority) {
      grouped[item.priority].push(item);
    } else {
      grouped.low.push(item); // Default to low if no priority
    }
  });

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: "32px auto",
        background: "#f7f9fc",
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={700}>
        TODO List
      </Typography>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textDecoration: "underline",
          color: "#1976d2",
          mb: 3,
        }}
      >
        🤖 Co mogę jeszcze zautomatyzować?
      </Typography>

      {PRIORITIES.map((priority) => (
        <Box key={priority} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: PRIORITY_COLORS[priority],
              fontWeight: 700,
              mb: 2,
            }}
          >
            {PRIORITY_LABELS[priority]}
          </Typography>
          {grouped[priority].length === 0 ? (
            <Typography variant="body2" sx={{ color: "#888", mb: 2 }}>
              Brak zadań
            </Typography>
          ) : (
            grouped[priority]
              .sort((a, b) => Number(a.done) - Number(b.done))
              .map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    background: item.done ? "#e0e0e0" : "#fff",
                    borderRadius: 2,
                    boxShadow: item.done ? 0 : 1,
                    p: 2,
                    opacity: item.done ? 0.6 : 1,
                    transition: "background 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      accentColor: "#1976d2",
                      transform: "scale(1.3)",
                      marginRight: "8px",
                    }}
                    checked={item.done}
                    readOnly
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: item.done ? "line-through" : "none",
                        fontWeight: item.priority === "high" ? 700 : 400,
                        color: item.priority === "high" ? "#d32f2f" : "inherit",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item.text}
                    </Typography>
                    {item.subtasks && item.subtasks.length > 0 && (
                      <Box sx={{ ml: 2, mt: 1 }}>
                        {item.subtasks.map((sub, idx) => (
                          <Typography key={idx} variant="body2" sx={{ color: "#616161" }}>
                            • {sub}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                  {item.priority && (
                    <Chip
                      label={item.priority.toUpperCase()}
                      sx={{
                        background: PRIORITY_COLORS[item.priority],
                        color: "#fff",
                        fontWeight: 700,
                        mr: 1,
                      }}
                      size="small"
                    />
                  )}
                  {item.date && (
                    <Typography variant="caption" sx={{ minWidth: 120, ml: 1 }}>
                      Dodano: {item.date.split("-").reverse().join("-")}
                    </Typography>
                  )}
                </Box>
              ))
          )}
        </Box>
      ))}
    </Box>
  );
}
