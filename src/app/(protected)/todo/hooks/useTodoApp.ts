import { useReducer, useEffect } from "react";
import dayjs from "dayjs";
import { Todo, Subtask, TodoState, TodoAction, FormState, FormAction } from "../types";
import { todoReducer, formReducer, initialState, initialFormState } from "../reducers/todoReducer";

export const useTodoApp = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("edu-report-todos");
    if (savedTodos) {
      dispatch({ type: "SET_TODOS", payload: JSON.parse(savedTodos) });
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("edu-report-todos", JSON.stringify(state.todos));
  }, [state.todos]);

  const addTodo = (updates: Partial<Todo>) => {
    const todo: Todo = {
      id: Date.now().toString(),
      text: updates.text || "",
      completed: false,
      inProgress: false,
      dueDate: updates.dueDate || dayjs().format("YYYY-MM-DD"),
      priority: updates.priority || "medium",
      category: updates.category || "Ogólne",
      description: updates.description || undefined,
      tags: updates.tags || [],
      createdAt: dayjs().toISOString(),
      estimatedTime: updates.estimatedTime || undefined,
      reminder: updates.reminder || undefined,
      recurring: updates.recurring || undefined,
      subtasks: [],
      attachments: [],
    };
    dispatch({ type: "ADD_TODO", payload: todo });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    dispatch({ type: "UPDATE_TODO", payload: { id, updates } });
  };

  const addSubtask = (todoId: string, subtaskText: string) => {
    if (subtaskText.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        text: subtaskText.trim(),
        completed: false,
      };
      dispatch({ type: "ADD_SUBTASK", payload: { todoId, subtask } });
    }
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    dispatch({ type: "TOGGLE_SUBTASK", payload: { todoId, subtaskId } });
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    dispatch({ type: "DELETE_SUBTASK", payload: { todoId, subtaskId } });
  };

  const startTimeTracking = (todoId: string) => {
    dispatch({ type: "START_TIME_TRACKING", payload: { todoId, startTime: Date.now() } });
  };

  const stopTimeTracking = (todoId: string) => {
    const tracking = state.timeTracking[todoId];
    if (tracking && tracking.startTime) {
      const elapsed = Math.round((Date.now() - tracking.startTime) / 60000); // minutes
      dispatch({ type: "STOP_TIME_TRACKING", payload: { todoId, elapsedTime: elapsed } });
    }
  };

  const getElapsedTime = (todoId: string) => {
    const tracking = state.timeTracking[todoId];
    if (tracking && tracking.isRunning && tracking.startTime) {
      return Math.round((Date.now() - tracking.startTime) / 60000);
    }
    return 0;
  };

  const getTodoById = (id: string) => {
    return state.todos.find((todo) => todo.id === id) || null;
  };

  return {
    state,
    dispatch,
    formState,
    formDispatch,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    startTimeTracking,
    stopTimeTracking,
    getElapsedTime,
    getTodoById,
  };
};
