import React from "react";
import { Todo, TodoState, TodoAction } from "../types";
import { TodoItem } from "./TodoItem";
import { Box, Paper, Typography, Stack, Chip, Divider } from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import dayjs from "dayjs";

interface TodoKanbanProps {
  todos: Todo[];
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

interface KanbanColumn {
  id: string;
  title: string;
  todos: Todo[];
  color: string;
}

export const TodoKanban = ({
  todos,
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
}: TodoKanbanProps) => {
  // Group todos by status
  const todoTodos = todos.filter((todo) => !todo.completed && !todo.inProgress);
  const inProgressTodos = todos.filter((todo) => !todo.completed && todo.inProgress);
  const completedTodos = todos.filter((todo) => todo.completed);

  const columns: KanbanColumn[] = [
    {
      id: "todo",
      title: "Do zrobienia",
      todos: todoTodos,
      color: "primary",
    },
    {
      id: "inProgress",
      title: "W trakcie",
      todos: inProgressTodos,
      color: "warning",
    },
    {
      id: "completed",
      title: "Zrobione",
      todos: completedTodos,
      color: "success",
    },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Find the todo being moved by ID
    const todo = todos.find((t) => t.id === draggableId);
    if (!todo) {
      return;
    }

    // Determine new status based on destination column
    let newCompleted = todo.completed;
    let newInProgress = todo.inProgress || false;

    if (destination.droppableId === "completed") {
      newCompleted = true;
      newInProgress = false;
    } else if (destination.droppableId === "inProgress") {
      newCompleted = false;
      newInProgress = true;
    } else if (destination.droppableId === "todo") {
      newCompleted = false;
      newInProgress = false;
    }

    // Update the todo
    if (newCompleted !== todo.completed || newInProgress !== (todo.inProgress || false)) {
      dispatch({
        type: "UPDATE_TODO",
        payload: {
          id: todo.id,
          updates: {
            completed: newCompleted,
            inProgress: newInProgress,
          },
        },
      });
    }
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
            minHeight: "600px",
          }}
        >
          {columns.map((column) => (
            <Paper
              key={column.id}
              elevation={1}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                minHeight: "500px",
                backgroundColor: "grey.50",
              }}
            >
              {/* Column Header */}
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {column.title}
                  </Typography>
                  <Chip
                    label={column.todos.length}
                    size="small"
                    color={column.color as "primary" | "warning" | "success"}
                    variant="filled"
                  />
                </Stack>
                <Divider />
              </Box>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      flex: 1,
                      minHeight: "400px",
                      backgroundColor: snapshot.isDraggingOver ? "action.hover" : "transparent",
                      borderRadius: 1,
                      p: 1,
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <Stack spacing={2}>
                      {column.todos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                transform: snapshot.isDragging ? "rotate(5deg)" : "none",
                                transition: "transform 0.2s ease",
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              {column.id === "completed" ? (
                                // Kompaktowa wersja dla zrobionych zadań
                                <Box
                                  sx={{
                                    p: 1.5,
                                    backgroundColor: "success.light",
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "success.main",
                                    cursor: "grab",
                                    "&:active": {
                                      cursor: "grabbing",
                                    },
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: "text.secondary",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {todo.text}
                                  </Typography>
                                  {todo.dueDate && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontSize: "0.75rem",
                                        display: "block",
                                        mt: 0.5,
                                      }}
                                    >
                                      {dayjs(todo.dueDate).format("DD.MM.YYYY")}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                // Pełna wersja dla pozostałych kolumn
                                <TodoItem
                                  todo={todo}
                                  state={state}
                                  dispatch={dispatch}
                                  getPriorityColor={getPriorityColor}
                                  getPriorityLabel={getPriorityLabel}
                                  getDueDateStatus={getDueDateStatus}
                                  formatTime={formatTime}
                                  onToggleTodo={onToggleTodo}
                                  onDeleteTodo={onDeleteTodo}
                                  onAddSubtask={onAddSubtask}
                                  onToggleSubtask={onToggleSubtask}
                                  onDeleteSubtask={onDeleteSubtask}
                                />
                              )}
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {column.todos.length === 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "100px",
                            color: "text.secondary",
                            fontStyle: "italic",
                          }}
                        >
                          Brak zadań
                        </Box>
                      )}
                    </Stack>
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};
