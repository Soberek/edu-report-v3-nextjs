import dayjs from "dayjs";
import { TodoState, TodoAction, FormState, FormAction } from "../types";

// Initial state
export const initialState: TodoState = {
  todos: [],
  filter: "all",
  searchTerm: "",
  sortBy: "dueDate",
  sortOrder: "asc",
  selectedCategory: "all",
  selectedPriority: "all",
  showCompleted: true,
  viewMode: "list",
  editingTodo: null,
  expandedTodo: null,
  showAddForm: false,
  timeTracking: {},
};

export const initialFormState: FormState = {
  newTodo: "",
  selectedDate: dayjs().format("YYYY-MM-DD"),
  priority: "medium",
  category: "",
  description: "",
  tags: "",
  estimatedTime: "",
  reminder: "",
  recurringType: "none",
  recurringInterval: 1,
  recurringEndDate: "",
};

// Todo reducer function
export const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload };

    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };

    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? { ...todo, ...action.payload.updates } : todo)),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        timeTracking: Object.fromEntries(Object.entries(state.timeTracking).filter(([key]) => key !== action.payload)),
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload) {
            const updated = { ...todo, completed: !todo.completed };
            if (updated.completed) {
              updated.completedAt = dayjs().toISOString();
              updated.inProgress = false; // Reset inProgress when completed
            } else {
              updated.completedAt = undefined;
            }
            return updated;
          }
          return todo;
        }),
      };

    case "ADD_SUBTASK":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.todoId ? { ...todo, subtasks: [...todo.subtasks, action.payload.subtask] } : todo
        ),
      };

    case "TOGGLE_SUBTASK":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.todoId
            ? {
                ...todo,
                subtasks: todo.subtasks.map((subtask) =>
                  subtask.id === action.payload.subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                ),
              }
            : todo
        ),
      };

    case "DELETE_SUBTASK":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.todoId
            ? { ...todo, subtasks: todo.subtasks.filter((subtask) => subtask.id !== action.payload.subtaskId) }
            : todo
        ),
      };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };

    case "SET_SORT_ORDER":
      return { ...state, sortOrder: action.payload };

    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };

    case "SET_SELECTED_PRIORITY":
      return { ...state, selectedPriority: action.payload };

    case "SET_SHOW_COMPLETED":
      return { ...state, showCompleted: action.payload };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "SET_EDITING_TODO":
      return { ...state, editingTodo: action.payload };

    case "SET_EXPANDED_TODO":
      return { ...state, expandedTodo: action.payload };

    case "SET_SHOW_ADD_FORM":
      return { ...state, showAddForm: action.payload };

    case "START_TIME_TRACKING":
      return {
        ...state,
        timeTracking: {
          ...state.timeTracking,
          [action.payload.todoId]: { startTime: action.payload.startTime, isRunning: true },
        },
      };

    case "STOP_TIME_TRACKING":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.todoId ? { ...todo, actualTime: (todo.actualTime || 0) + action.payload.elapsedTime } : todo
        ),
        timeTracking: {
          ...state.timeTracking,
          [action.payload.todoId]: { isRunning: false },
        },
      };

    default:
      return state;
  }
};

// Form reducer function
export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_NEW_TODO":
      return { ...state, newTodo: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_ESTIMATED_TIME":
      return { ...state, estimatedTime: action.payload };
    case "SET_REMINDER":
      return { ...state, reminder: action.payload };
    case "SET_RECURRING_TYPE":
      return { ...state, recurringType: action.payload };
    case "SET_RECURRING_INTERVAL":
      return { ...state, recurringInterval: action.payload };
    case "SET_RECURRING_END_DATE":
      return { ...state, recurringEndDate: action.payload };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
};
