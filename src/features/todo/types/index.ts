export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  inProgress?: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  description?: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  subtasks: Subtask[];
  attachments: string[];
  reminder?: string;
  recurring?: {
    type: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  filter: "all" | "pending" | "completed";
  searchTerm: string;
  sortBy: "dueDate" | "priority" | "createdAt" | "category";
  sortOrder: "asc" | "desc";
  selectedCategory: string;
  selectedPriority: string;
  showCompleted: boolean;
  viewMode: "list" | "grid" | "kanban";
  editingTodo: string | null;
  expandedTodo: string | null;
  showAddForm: boolean;
  timeTracking: Record<string, { startTime?: number; isRunning: boolean }>;
}

export interface FormState {
  newTodo: string;
  selectedDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  description: string;
  tags: string;
  estimatedTime: string;
  reminder: string;
  recurringType: "daily" | "weekly" | "monthly" | "yearly" | "none";
  recurringInterval: number;
  recurringEndDate: string;
}

export type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: { id: string; updates: Partial<Todo> } }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "ADD_SUBTASK"; payload: { todoId: string; subtask: Subtask } }
  | { type: "TOGGLE_SUBTASK"; payload: { todoId: string; subtaskId: string } }
  | { type: "DELETE_SUBTASK"; payload: { todoId: string; subtaskId: string } }
  | { type: "SET_FILTER"; payload: "all" | "pending" | "completed" }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_SORT_BY"; payload: "dueDate" | "priority" | "createdAt" | "category" }
  | { type: "SET_SORT_ORDER"; payload: "asc" | "desc" }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_SELECTED_PRIORITY"; payload: string }
  | { type: "SET_SHOW_COMPLETED"; payload: boolean }
  | { type: "SET_VIEW_MODE"; payload: "list" | "grid" | "kanban" }
  | { type: "SET_EDITING_TODO"; payload: string | null }
  | { type: "SET_EXPANDED_TODO"; payload: string | null }
  | { type: "SET_SHOW_ADD_FORM"; payload: boolean }
  | { type: "START_TIME_TRACKING"; payload: { todoId: string; startTime: number } }
  | { type: "STOP_TIME_TRACKING"; payload: { todoId: string; elapsedTime: number } };

export type FormAction =
  | { type: "SET_NEW_TODO"; payload: string }
  | { type: "SET_SELECTED_DATE"; payload: string }
  | { type: "SET_PRIORITY"; payload: "low" | "medium" | "high" }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_TAGS"; payload: string }
  | { type: "SET_ESTIMATED_TIME"; payload: string }
  | { type: "SET_REMINDER"; payload: string }
  | { type: "SET_RECURRING_TYPE"; payload: "daily" | "weekly" | "monthly" | "yearly" | "none" }
  | { type: "SET_RECURRING_INTERVAL"; payload: number }
  | { type: "SET_RECURRING_END_DATE"; payload: string }
  | { type: "RESET_FORM" };
