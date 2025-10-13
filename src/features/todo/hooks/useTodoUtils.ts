import dayjs from "dayjs";
import { Todo, TodoState } from "../types";

export const useTodoUtils = (state: TodoState) => {
  const filteredTodos = state.todos
    .filter((todo) => {
      // Filter by completion status
      if (state.filter === "completed" && !todo.completed) return false;
      if (state.filter === "pending" && todo.completed) return false;

      // Filter by search term
      if (
        state.searchTerm &&
        !todo.text.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
        !todo.description?.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
        !todo.tags.some((tag) => tag.toLowerCase().includes(state.searchTerm.toLowerCase()))
      ) {
        return false;
      }

      // Filter by category
      if (state.selectedCategory !== "all" && todo.category !== state.selectedCategory) return false;

      // Filter by priority
      if (state.selectedPriority !== "all" && todo.priority !== state.selectedPriority) return false;

      // Filter by show completed
      if (!state.showCompleted && todo.completed) return false;

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (state.sortBy) {
        case "dueDate":
          comparison = dayjs(a.dueDate).diff(dayjs(b.dueDate));
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case "createdAt":
          comparison = dayjs(a.createdAt).diff(dayjs(b.createdAt));
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return state.sortOrder === "asc" ? comparison : -comparison;
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Wysoki";
      case "medium":
        return "Średni";
      case "low":
        return "Niski";
      default:
        return "Średni";
    }
  };

  const getCategories = () => {
    const categories = [...new Set(state.todos.map((todo) => todo.category))];
    return categories.sort();
  };

  const getProgressStats = () => {
    const total = state.todos.length;
    const completed = state.todos.filter((todo) => todo.completed).length;
    const overdue = state.todos.filter((todo) => !todo.completed && dayjs(todo.dueDate).isBefore(dayjs(), "day")).length;
    const today = state.todos.filter((todo) => !todo.completed && dayjs(todo.dueDate).isSame(dayjs(), "day")).length;

    return { total, completed, overdue, today, progress: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDueDateStatus = (dueDate: string) => {
    const due = dayjs(dueDate);
    const now = dayjs();
    const diff = due.diff(now, "day");

    if (diff < 0) return { status: "overdue", color: "text-red-600 bg-red-50", label: "Przeterminowane" };
    if (diff === 0) return { status: "today", color: "text-orange-600 bg-orange-50", label: "Dziś" };
    if (diff === 1) return { status: "tomorrow", color: "text-yellow-600 bg-yellow-50", label: "Jutro" };
    if (diff <= 7) return { status: "week", color: "text-blue-600 bg-blue-50", label: "Ten tydzień" };
    return { status: "future", color: "text-gray-600 bg-gray-50", label: "Przyszłe" };
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = dayjs().startOf("month");
    const endOfMonth = dayjs().endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days = [];
    let current = startDate;

    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  };

  return {
    filteredTodos,
    getPriorityColor,
    getPriorityLabel,
    getCategories,
    getProgressStats,
    formatTime,
    getDueDateStatus,
    generateCalendarDays,
  };
};
