import dayjs from "dayjs";
import { Todo, TodoState, TodoAction } from "../types";
import { ActionButton, PrimaryButton } from "@/components/shared";
import {
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Typography,
  Box,
  Chip,
  Stack,
  LinearProgress,
  IconButton,
  TextField,
  Divider,
  Tooltip,
  Avatar,
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Add,
  Schedule,
  Category,
  Flag,
  CheckCircle,
  RadioButtonUnchecked,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useState } from "react";

interface TodoItemProps {
  todo: Todo;
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
  getDueDateStatus: (dueDate: string) => { status: string; color: string; label: string };
  formatTime: (minutes: number) => string;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddSubtask: (todoId: string, subtaskText: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

export const TodoItem = ({
  todo,
  state,
  dispatch,
  getPriorityColor,
  getPriorityLabel,
  getDueDateStatus,
  formatTime,
  onToggleTodo,
  onDeleteTodo,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TodoItemProps) => {
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const dueDateStatus = getDueDateStatus(todo.dueDate);
  const isExpanded = state.expandedTodo === todo.id;
  const completedSubtasks = todo.subtasks.filter((st) => st.completed).length;
  const subtaskProgress = todo.subtasks.length > 0 ? (completedSubtasks / todo.subtasks.length) * 100 : 0;

  const getPriorityColorValue = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      onAddSubtask(todo.id, newSubtaskText.trim());
      setNewSubtaskText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSubtask();
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: 3,
        border: "1px solid",
        borderColor: todo.completed ? "success.light" : todo.inProgress ? "warning.light" : "grey.200",
        backgroundColor: todo.completed ? "success.50" : todo.inProgress ? "warning.50" : "background.paper",
        "&:hover": {
          elevation: 8,
          transform: "translateY(-4px)",
          borderColor: todo.completed ? "success.main" : todo.inProgress ? "warning.main" : "primary.light",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: todo.completed
            ? "linear-gradient(90deg, #4caf50, #8bc34a)"
            : todo.inProgress
            ? "linear-gradient(90deg, #ff9800, #ffc107)"
            : "linear-gradient(90deg, #2196f3, #03a9f4)",
          borderRadius: "12px 12px 0 0",
        },
      }}
    >
      {/* Edit Icon - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <IconButton
          size="small"
          onClick={() => dispatch({ type: "SET_EDITING_TODO", payload: todo.id })}
          sx={{
            color: "black",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ pb: 1, pt: 2, px: 2 }}>
        {/* Main Content */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
            icon={<RadioButtonUnchecked />}
            checkedIcon={<CheckCircle />}
            color="primary"
            size="small"
            sx={{
              mt: 0.25,
              "& .MuiSvgIcon-root": {
                fontSize: 20,
              },
              "&.Mui-checked": {
                color: "success.main",
              },
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "text.secondary" : "text.primary",
                mb: 1,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              {todo.text}
            </Typography>

            {todo.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.4,
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                {todo.description}
              </Typography>
            )}

            {/* Tags */}
            {todo.tags.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.5 }}>
                {todo.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{
                      fontSize: "0.7rem",
                      borderRadius: 1.5,
                      height: 20,
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Meta Information */}
            <Stack spacing={1} sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                <Chip
                  icon={<Flag />}
                  label={getPriorityLabel(todo.priority)}
                  size="small"
                  color={getPriorityColorValue(todo.priority) as any}
                  variant="filled"
                  sx={{
                    borderRadius: 1.5,
                    height: 22,
                    fontSize: "0.7rem",
                    "& .MuiChip-icon": {
                      fontSize: 12,
                    },
                  }}
                />
                <Chip
                  icon={<Category />}
                  label={todo.category}
                  size="small"
                  variant="filled"
                  color="info"
                  sx={{
                    borderRadius: 1.5,
                    height: 22,
                    fontSize: "0.7rem",
                    "& .MuiChip-icon": {
                      fontSize: 12,
                    },
                  }}
                />
                <Chip
                  label={dueDateStatus.label}
                  size="small"
                  color={dueDateStatus.status === "overdue" ? "error" : dueDateStatus.status === "today" ? "warning" : "default"}
                  variant="filled"
                  sx={{
                    borderRadius: 1.5,
                    height: 22,
                    fontSize: "0.7rem",
                  }}
                />
              </Stack>

              <Box
                sx={{
                  p: 1,
                  bgcolor: "grey.50",
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" color="text.secondary">
                  <Typography variant="caption" display="flex" alignItems="center" gap={0.25} fontWeight="medium" fontSize="0.7rem">
                    <Schedule fontSize="inherit" />
                    {dayjs(todo.dueDate).format("DD.MM.YYYY")}
                  </Typography>
                  {todo.estimatedTime && (
                    <Typography variant="caption" display="flex" alignItems="center" gap={0.25} fontWeight="medium" fontSize="0.7rem">
                      ⏱️ {formatTime(todo.estimatedTime)}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Subtasks Section */}
            <Box sx={{ mb: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="600" color="text.primary" fontSize="0.8rem">
                  Podzadania {todo.subtasks.length > 0 && `(${completedSubtasks}/${todo.subtasks.length})`}
                </Typography>
                {todo.subtasks.length > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={subtaskProgress}
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                      },
                    }}
                  />
                )}
              </Stack>

              {todo.subtasks.length > 0 ? (
                <>
                  <List dense sx={{ py: 0 }}>
                    {todo.subtasks.slice(0, 3).map((subtask) => (
                      <ListItem
                        key={subtask.id}
                        sx={{
                          py: 0.25,
                          px: 0.75,
                          borderRadius: 0.75,
                          "&:hover": {
                            bgcolor: "grey.100",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Checkbox
                            checked={subtask.completed}
                            onChange={() => onToggleSubtask(todo.id, subtask.id)}
                            size="small"
                            sx={{
                              "&.Mui-checked": {
                                color: "success.main",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 16,
                              },
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: subtask.completed ? "line-through" : "none",
                                color: subtask.completed ? "text.secondary" : "text.primary",
                                fontSize: "0.75rem",
                              }}
                            >
                              {subtask.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  {todo.subtasks.length > 3 && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 3, fontSize: "0.7rem" }}>
                      +{todo.subtasks.length - 3} więcej...
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3, fontStyle: "italic", fontSize: "0.7rem" }}>
                  Brak podzadań
                </Typography>
              )}

              {/* Quick Add Subtask Button */}
              <Box sx={{ mt: 0.75, ml: 3 }}>
                <IconButton
                  size="small"
                  onClick={() => dispatch({ type: "SET_EXPANDED_TODO", payload: todo.id })}
                  sx={{
                    color: "primary.main",
                    fontSize: "0.7rem",
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  }}
                >
                  <Add fontSize="inherit" />
                  <Typography variant="caption" sx={{ ml: 0.25, fontSize: "0.7rem" }}>
                    Dodaj podzadanie
                  </Typography>
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Stack direction="row" spacing={0.25}>
            <IconButton
              size="small"
              onClick={() => dispatch({ type: "SET_EXPANDED_TODO", payload: isExpanded ? null : todo.id })}
              sx={{
                color: "black",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </Stack>

          <IconButton
            size="small"
            onClick={() => onDeleteTodo(todo.id)}
            sx={{
              color: "black",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      </CardActions>

      {/* Expanded Content */}
      <Collapse in={isExpanded}>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
          {/* Add Subtask */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.primary", fontSize: "0.85rem" }}>
              Dodaj podzadanie
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Wpisz nazwę podzadania..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={handleAddSubtask}
                      disabled={!newSubtaskText.trim()}
                      sx={{
                        bgcolor: newSubtaskText.trim() ? "primary.main" : "grey.300",
                        color: "white",
                        "&:hover": {
                          bgcolor: newSubtaskText.trim() ? "primary.dark" : "grey.400",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Add />
                    </IconButton>
                  ),
                }}
              />
            </Stack>
            {newSubtaskText.trim() && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontSize: "0.7rem" }}>
                Naciśnij Enter lub kliknij + aby dodać
              </Typography>
            )}
          </Box>

          {/* All Subtasks */}
          {todo.subtasks.length > 0 && (
            <List dense>
              {todo.subtasks.map((subtask) => (
                <ListItem
                  key={subtask.id}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1.5,
                    mb: 0.75,
                    border: "1px solid",
                    borderColor: "grey.200",
                    py: 0.5,
                    "&:hover": {
                      borderColor: "primary.light",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox
                      checked={subtask.completed}
                      onChange={() => onToggleSubtask(todo.id, subtask.id)}
                      size="small"
                      sx={{
                        "&.Mui-checked": {
                          color: "success.main",
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: 16,
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: subtask.completed ? "line-through" : "none",
                          color: subtask.completed ? "text.secondary" : "text.primary",
                          fontWeight: 500,
                          fontSize: "0.8rem",
                        }}
                      >
                        {subtask.text}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteSubtask(todo.id, subtask.id)}
                      sx={{
                        color: "black",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {/* Additional Info */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "white",
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight="medium" fontSize="0.7rem">
                📅 Utworzone: {dayjs(todo.createdAt).format("DD.MM.YYYY HH:mm")}
              </Typography>
              {todo.completedAt && (
                <Typography variant="caption" color="text.secondary" fontWeight="medium" fontSize="0.7rem">
                  ✅ Ukończone: {dayjs(todo.completedAt).format("DD.MM.YYYY HH:mm")}
                </Typography>
              )}
              {todo.recurring && (
                <Typography variant="caption" color="text.secondary" fontWeight="medium" fontSize="0.7rem">
                  🔄 Powtarzanie: {todo.recurring.type} co {todo.recurring.interval}
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};
