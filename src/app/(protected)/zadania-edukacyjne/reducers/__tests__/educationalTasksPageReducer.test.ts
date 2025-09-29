import { describe, it, expect } from "vitest";
import { educationalTasksPageReducer } from "../educationalTasksPageReducer";
import { INITIAL_PAGE_STATE } from "../../types";
import { actions } from "../educationalTasksPageReducer";
import type { EducationalTask } from "@/types";

// Mock data for tests
const mockEducationalTask: EducationalTask = {
  id: "test-task-1",
  title: "Test Task",
  programName: "Test Program",
  date: "2025-01-15",
  schoolId: "school-1",
  taskNumber: "1/2025",
  referenceNumber: "TEST.001.2025",
  activities: [],
  createdBy: "user-1",
  createdAt: "2025-01-15T10:00:00Z",
};

describe("educationalTasksPageReducer", () => {
  it("should initialize with correct initial state", () => {
    const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, { type: "RESET_STATE" } as any);

    expect(state).toEqual(INITIAL_PAGE_STATE);
    expect(state.openForm).toBe(false);
    expect(state.editTask).toBe(null);
    expect(state.expandedTasks.size).toBe(0);
    expect(state.filters).toEqual({
      year: "",
      month: "",
      program: "",
      activityType: "",
    });
  });

  describe("SET_FORM_OPEN", () => {
    it("should open form when true", () => {
      const action = actions.setFormOpen(true);
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.openForm).toBe(true);
    });

    it("should close form when false", () => {
      const initialState = { ...INITIAL_PAGE_STATE, openForm: true };
      const action = actions.setFormOpen(false);
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.openForm).toBe(false);
    });

    it("should not affect other state properties", () => {
      const action = actions.setFormOpen(true);
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.editTask).toBe(null);
      expect(state.expandedTasks.size).toBe(0);
      expect(state.filters).toEqual(INITIAL_PAGE_STATE.filters);
    });
  });

  describe("SET_FORM_CLOSED", () => {
    it("should close form and reset edit task", () => {
      const initialState = {
        ...INITIAL_PAGE_STATE,
        openForm: true,
        editTask: mockEducationalTask,
      };

      const action = actions.setFormClosed();
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.openForm).toBe(false);
      expect(state.editTask).toBe(null);
    });

    it("should work when form is already closed", () => {
      const action = actions.setFormClosed();
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.openForm).toBe(false);
      expect(state.editTask).toBe(null);
    });
  });

  describe("SET_EDIT_TASK", () => {
    it("should set edit task and open form", () => {
      const action = actions.setEditTask(mockEducationalTask);
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.editTask).toEqual(mockEducationalTask);
      expect(state.openForm).toBe(true);
    });

    it("should clear edit task when null", () => {
      const initialState = {
        ...INITIAL_PAGE_STATE,
        editTask: mockEducationalTask,
      };

      const action = actions.setEditTask(null);
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.editTask).toBe(null);
    });

    it("should open form when setting task even if currently closed", () => {
      const initialState = { ...INITIAL_PAGE_STATE, openForm: false };

      const action = actions.setEditTask(mockEducationalTask);
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.openForm).toBe(true);
      expect(state.editTask).toEqual(mockEducationalTask);
    });
  });

  describe("TOGGLE_TASK_EXPANSION", () => {
    it("should add task to expanded set when not present", () => {
      const taskId = "test-task-1";
      const action = actions.toggleTaskExpansion(taskId);
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.expandedTasks.has(taskId)).toBe(true);
    });

    it("should remove task from expanded set when already present", () => {
      const taskId = "test-task-1";
      const initialState = {
        ...INITIAL_PAGE_STATE,
        expandedTasks: new Set([taskId]),
      };

      const action = actions.toggleTaskExpansion(taskId);
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.expandedTasks.has(taskId)).toBe(false);
    });

    it("should maintain other expanded tasks", () => {
      const taskId1 = "test-task-1";
      const taskId2 = "test-task-2";
      const initialState = {
        ...INITIAL_PAGE_STATE,
        expandedTasks: new Set([taskId1]),
      };

      const action = actions.toggleTaskExpansion(taskId2);
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.expandedTasks.has(taskId1)).toBe(true);
      expect(state.expandedTasks.has(taskId2)).toBe(true);
    });
  });

  describe("SET_FILTER", () => {
    it("should set year filter", () => {
      const action = actions.setFilter("year", "2025");
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.filters.year).toBe("2025");
      expect(state.filters.month).toBe("");
    });

    it("should set month filter", () => {
      const action = actions.setFilter("month", "1");
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.filters.month).toBe("1");
      expect(state.filters.year).toBe("");
    });

    it("should set program filter", () => {
      const action = actions.setFilter("program", "Test Program");
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.filters.program).toBe("Test Program");
      expect(state.filters.activityType).toBe("");
    });

    it("should set activityType filter", () => {
      const action = actions.setFilter("activityType", "prelekcja");
      const state = educationalTasksPageReducer(INITIAL_PAGE_STATE, action);

      expect(state.filters.activityType).toBe("prelekcja");
    });

    it("should clear filter when empty string", () => {
      const initialState = {
        ...INITIAL_PAGE_STATE,
        filters: {
          year: "2025",
          month: "1",
          program: "Test Program",
          activityType: "prelekcja",
        },
      };

      const action = actions.setFilter("year", "");
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.filters.year).toBe("");
      // Other filters should remain unchanged
      expect(state.filters.month).toBe("1");
      expect(state.filters.program).toBe("Test Program");
      expect(state.filters.activityType).toBe("prelekcja");
    });
  });

  describe("RESET_FILTERS", () => {
    it("should reset all filters to empty strings", () => {
      const initialState = {
        ...INITIAL_PAGE_STATE,
        filters: {
          year: "2025",
          month: "1",
          program: "Test Program",
          activityType: "prelekcja",
        },
      };

      const action = actions.resetFilters();
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.filters).toEqual({
        year: "",
        month: "",
        program: "",
        activityType: "",
      });
    });

    it("should not affect other state properties", () => {
      const initialState = {
        ...INITIAL_PAGE_STATE,
        openForm: true,
        editTask: mockEducationalTask,
        expandedTasks: new Set(["task-1"]),
        filters: {
          year: "2025",
          month: "1",
          program: "Test Program",
          activityType: "prelekcja",
        },
      };

      const action = actions.resetFilters();
      const state = educationalTasksPageReducer(initialState, action);

      expect(state.openForm).toBe(true);
      expect(state.editTask).toEqual(mockEducationalTask);
      expect(state.expandedTasks.has("task-1")).toBe(true);
    });
  });

  describe("RESET_STATE", () => {
    it("should reset to initial state", () => {
      const initialState = {
        ...INITIAL_PAGE_STATE,
        openForm: true,
        editTask: mockEducationalTask,
        expandedTasks: new Set(["task-1"]),
        filters: {
          year: "2025",
          month: "1",
          program: "Test Program",
          activityType: "prelekcja",
        },
      };

      const action = actions.resetState();
      const state = educationalTasksPageReducer(initialState, action);

      expect(state).toEqual(INITIAL_PAGE_STATE);
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple actions in sequence", () => {
      let state = INITIAL_PAGE_STATE;

      // Open form
      state = educationalTasksPageReducer(state, actions.setFormOpen(true));
      expect(state.openForm).toBe(true);

      // Set edit task (should keep form open)
      state = educationalTasksPageReducer(state, actions.setEditTask(mockEducationalTask));
      expect(state.openForm).toBe(true);
      expect(state.editTask).toEqual(mockEducationalTask);

      // Add filters
      state = educationalTasksPageReducer(state, actions.setFilter("year", "2025"));
      state = educationalTasksPageReducer(state, actions.setFilter("program", "Test Program"));

      // Expand a task
      state = educationalTasksPageReducer(state, actions.toggleTaskExpansion("task-1"));

      expect(state.filters.year).toBe("2025");
      expect(state.filters.program).toBe("Test Program");
      expect(state.expandedTasks.has("task-1")).toBe(true);
      expect(state.openForm).toBe(true);
      expect(state.editTask).toEqual(mockEducationalTask);
    });

    it("should handle rapid toggle operations", () => {
      const taskId = "test-task-1";
      let state = INITIAL_PAGE_STATE;

      // Toggle on
      state = educationalTasksPageReducer(state, actions.toggleTaskExpansion(taskId));
      expect(state.expandedTasks.has(taskId)).toBe(true);

      // Toggle off
      state = educationalTasksPageReducer(state, actions.toggleTaskExpansion(taskId));
      expect(state.expandedTasks.has(taskId)).toBe(false);

      // Toggle on again
      state = educationalTasksPageReducer(state, actions.toggleTaskExpansion(taskId));
      expect(state.expandedTasks.has(taskId)).toBe(true);
    });
  });
});
