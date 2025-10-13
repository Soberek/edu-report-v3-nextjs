import { TodoState, TodoAction } from "../types";
import { ActionButton } from "@/components/shared";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Search, FilterList, ViewList, ViewModule, ViewKanban } from "@mui/icons-material";

interface TodoControlsProps {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  categories: string[];
}

export const TodoControls = ({ state, dispatch, categories }: TodoControlsProps) => {
  const pendingCount = state.todos.filter((t) => !t.completed).length;
  const completedCount = state.todos.filter((t) => t.completed).length;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Stack spacing={3}>
        {/* Search Section */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Search fontSize="small" />
            Wyszukiwanie i filtrowanie
          </Typography>
          <Stack spacing={2}>
            {/* Search Field - Full Width */}
            <TextField
              fullWidth
              placeholder="Szukaj zadań..."
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              size="small"
            />

            {/* Filters Row - Responsive Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 2,
                alignItems: "center",
              }}
            >
              <FormControl size="small" fullWidth>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={state.selectedCategory}
                  onChange={(e) => dispatch({ type: "SET_SELECTED_CATEGORY", payload: e.target.value })}
                  label="Kategoria"
                >
                  <MenuItem value="all">Wszystkie kategorie</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Priorytet</InputLabel>
                <Select
                  value={state.selectedPriority}
                  onChange={(e) => dispatch({ type: "SET_SELECTED_PRIORITY", payload: e.target.value })}
                  label="Priorytet"
                >
                  <MenuItem value="all">Wszystkie priorytety</MenuItem>
                  <MenuItem value="high">Wysoki</MenuItem>
                  <MenuItem value="medium">Średni</MenuItem>
                  <MenuItem value="low">Niski</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Sortowanie</InputLabel>
                <Select
                  value={state.sortBy}
                  onChange={(e) =>
                    dispatch({ type: "SET_SORT_BY", payload: e.target.value as "dueDate" | "priority" | "createdAt" | "category" })
                  }
                  label="Sortowanie"
                >
                  <MenuItem value="dueDate">Po dacie</MenuItem>
                  <MenuItem value="priority">Po priorytecie</MenuItem>
                  <MenuItem value="createdAt">Po dacie utworzenia</MenuItem>
                  <MenuItem value="category">Po kategorii</MenuItem>
                </Select>
              </FormControl>

              <ActionButton
                onClick={() => dispatch({ type: "SET_SORT_ORDER", payload: state.sortOrder === "asc" ? "desc" : "asc" })}
                variant="outlined"
                size="small"
                startIcon={<FilterList />}
                fullWidth
              >
                {state.sortOrder === "asc" ? "Rosnąco" : "Malejąco"}
              </ActionButton>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* View Mode and Filters */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ViewList fontSize="small" />
            Widok i filtry
          </Typography>

          <Stack spacing={2}>
            {/* View Mode Toggle */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <ActionButton
                  onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "list" })}
                  variant={state.viewMode === "list" ? "contained" : "outlined"}
                  size="small"
                  startIcon={<ViewList />}
                >
                  Lista
                </ActionButton>
                <ActionButton
                  onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "grid" })}
                  variant={state.viewMode === "grid" ? "contained" : "outlined"}
                  size="small"
                  startIcon={<ViewModule />}
                >
                  Siatka
                </ActionButton>
                <ActionButton
                  onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "kanban" })}
                  variant={state.viewMode === "kanban" ? "contained" : "outlined"}
                  size="small"
                  startIcon={<ViewKanban />}
                >
                  Kanban
                </ActionButton>
              </Stack>
            </Box>

            {/* Filter Options */}
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.showCompleted}
                    onChange={(e) => dispatch({ type: "SET_SHOW_COMPLETED", payload: e.target.checked })}
                    size="small"
                  />
                }
                label="Pokaż ukończone"
                sx={{ alignSelf: "flex-start" }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Chip
                  label={`Wszystkie (${state.todos.length})`}
                  onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}
                  color={state.filter === "all" ? "primary" : "default"}
                  variant={state.filter === "all" ? "filled" : "outlined"}
                  size="small"
                />
                <Chip
                  label={`Do zrobienia (${pendingCount})`}
                  onClick={() => dispatch({ type: "SET_FILTER", payload: "pending" })}
                  color={state.filter === "pending" ? "warning" : "default"}
                  variant={state.filter === "pending" ? "filled" : "outlined"}
                  size="small"
                />
                <Chip
                  label={`Ukończone (${completedCount})`}
                  onClick={() => dispatch({ type: "SET_FILTER", payload: "completed" })}
                  color={state.filter === "completed" ? "success" : "default"}
                  variant={state.filter === "completed" ? "filled" : "outlined"}
                  size="small"
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
