import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEducationalTasks, educationalTasksReducer, actions, taskUtils } from "../useEducationalTasks";
import type { EducationalTask, CreateEducationalTaskFormData } from "@/types";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";

// Mock the dependencies
const mockUser = {
  uid: "user-123",
  email: "test@example.com",
  displayName: "Test User",
} as any;

const mockFirebaseData = {
  data: [],
  loading: false,
  error: null,
  refetch: vi.fn(),
  createItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
};

const mockTask: EducationalTask = {
  id: "task-1",
  title: "Test Task",
  programName: "Test Program",
  date: "2025-01-15",
  schoolId: "school-1",
  taskNumber: "1/2025",
  referenceNumber: "TEST.001.2025",
  activities: [
    {
      type: "prelekcja",
      title: "Test Activity",
      actionCount: 1,
      audienceCount: 30,
      description: "Test description",
      audienceGroups: [
        {
          id: "group-1",
          name: "Grupa I",
          type: "dorośli",
          count: 30,
        },
      ],
    },
  ],
  createdBy: "user-123",
  createdAt: "2025-01-15T10:00:00Z",
};

const mockTaskData: CreateEducationalTaskFormData = {
  title: "New Task",
  programName: "New Program",
  date: "2025-02-15",
  schoolId: "school-2",
  taskNumber: "2/2025",
  referenceNumber: "TEST.002.2025",
      activities: [
        {
          type: "prelekcja",
          title: "New Activity",
          actionCount: 1,
          audienceCount: 25,
          description: "New description",
          audienceGroups: [
            {
              id: "group-2",
              name: "Grupa II",
              type: "dzieci",
              count: 25,
            },
          ],
          materials: [
            {
              id: "ulotka_zdrowie_psychiczne",
              name: "Ulotka - Zdrowie psychiczne młodzieży",
              type: "ulotka",
              distributedCount: 50,
              description: "Materiały edukacyjne o zdrowiu psychicznym młodzieży",
            },
            {
              id: "plakat_aktywnosc_fizyczna",
              name: "Plakat - Aktywność fizyczna",
              type: "plakat",
              distributedCount: 10,
              description: "Promocja aktywności fizycznej wśród młodzieży",
            },
          ],
        },
      ],
};

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(() => ({
    user: mockUser,
    loading: false,
  })),
}));

vi.mock("@/hooks/useFirebaseData", () => ({
  useFirebaseData: vi.fn(() => mockFirebaseData),
}));

describe("useEducationalTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFirebaseData.data = [];
    mockFirebaseData.loading = false;
    mockFirebaseData.error = null;

    // Reset mocks to default values
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      loading: false,
    });
    vi.mocked(useFirebaseData).mockReturnValue(mockFirebaseData);
  });

  describe("initial state", () => {
    it("should return initial state", () => {
      const { result } = renderHook(() => useEducationalTasks());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.createTask).toBe("function");
      expect(typeof result.current.updateTask).toBe("function");
      expect(typeof result.current.deleteTask).toBe("function");
      expect(typeof result.current.clearError).toBe("function");
      expect(typeof result.current.refetch).toBe("function");
    });
  });

  describe("Firebase data sync", () => {
    it("should update tasks when Firebase data changes", () => {
      // Mock Firebase data with tasks
      vi.mocked(useFirebaseData).mockReturnValue({
        ...mockFirebaseData,
        data: [mockTask],
      });

      const { result } = renderHook(() => useEducationalTasks());

      expect(result.current.tasks).toEqual([mockTask]);
    });

    it("should handle multiple tasks from Firebase", () => {
      const tasks = [mockTask, { ...mockTask, id: "task-2", title: "Task 2" }];

      // Mock Firebase data with multiple tasks
      vi.mocked(useFirebaseData).mockReturnValue({
        ...mockFirebaseData,
        data: tasks,
      });

      const { result } = renderHook(() => useEducationalTasks());

      expect(result.current.tasks).toEqual(tasks);
    });
  });

  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      mockFirebaseData.createItem.mockResolvedValue(mockTask);

      let createdTask: EducationalTask | null | undefined;
      await act(async () => {
        createdTask = await result.current.createTask(mockTaskData);
      });

      expect(mockFirebaseData.createItem).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockTaskData,
          id: expect.any(String),
          createdBy: "user-123",
          createdAt: expect.any(String),
        })
      );

      expect(createdTask).toEqual(mockTask);
      expect(result.current.tasks).toContain(mockTask);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should handle createTask error", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      const errorMessage = "Firebase error";
      mockFirebaseData.createItem.mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        try {
          await result.current.createTask(mockTaskData);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });

    it("should throw error when user is not logged in", async () => {
      // Mock no user
      vi.mocked(useUser).mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() => useEducationalTasks());

      await act(async () => {
        try {
          await result.current.createTask(mockTaskData);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe("Użytkownik nie jest zalogowany");
        }
      });

      expect(result.current.error).toBe("Użytkownik nie jest zalogowany");
    });
  });

  describe("updateTask", () => {
    it("should update an existing task successfully", async () => {
      // Mock Firebase data with initial task
      vi.mocked(useFirebaseData).mockReturnValue({
        ...mockFirebaseData,
        data: [mockTask],
      });

      const { result } = renderHook(() => useEducationalTasks());

      const updatedTask = { ...mockTask, title: "Updated Task" };
      mockFirebaseData.updateItem.mockResolvedValue(true);

      let resultTask: EducationalTask | null | undefined;
      await act(async () => {
        resultTask = await result.current.updateTask("task-1", {
          ...mockTaskData,
          title: "Updated Task",
        });
      });

      expect(mockFirebaseData.updateItem).toHaveBeenCalledWith(
        "task-1",
        expect.objectContaining({
          ...mockTaskData,
          title: "Updated Task",
          id: "task-1",
          createdBy: "user-123",
          updatedAt: expect.any(String),
        })
      );

      expect(resultTask).toEqual(
        expect.objectContaining({
          ...mockTaskData,
          title: "Updated Task",
          id: "task-1",
        })
      );
      expect(result.current.tasks[0].title).toBe("Updated Task");
    });

    it("should handle updateTask error", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      const errorMessage = "Update error";
      mockFirebaseData.updateItem.mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        try {
          await result.current.updateTask("task-1", mockTaskData);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });

    it("should throw error when user is not logged in", async () => {
      // Mock no user
      vi.mocked(useUser).mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() => useEducationalTasks());

      await act(async () => {
        try {
          await result.current.updateTask("task-1", mockTaskData);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe("Użytkownik nie jest zalogowany");
        }
      });

      expect(result.current.error).toBe("Użytkownik nie jest zalogowany");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      // Mock Firebase data with initial task
      vi.mocked(useFirebaseData).mockReturnValue({
        ...mockFirebaseData,
        data: [mockTask],
      });

      const { result } = renderHook(() => useEducationalTasks());

      mockFirebaseData.deleteItem.mockResolvedValue(true);

      await act(async () => {
        await result.current.deleteTask("task-1");
      });

      expect(mockFirebaseData.deleteItem).toHaveBeenCalledWith("task-1");
      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should handle deleteTask error", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      const errorMessage = "Delete error";
      mockFirebaseData.deleteItem.mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        try {
          await result.current.deleteTask("task-1");
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });

    it("should throw error when user is not logged in", async () => {
      // Mock no user
      vi.mocked(useUser).mockReturnValue({
        user: null,
        loading: false,
      });

      const { result } = renderHook(() => useEducationalTasks());

      await act(async () => {
        try {
          await result.current.deleteTask("task-1");
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe("Użytkownik nie jest zalogowany");
        }
      });

      expect(result.current.error).toBe("Użytkownik nie jest zalogowany");
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      const { result } = renderHook(() => useEducationalTasks());

      // Set an error first
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("loading state", () => {
    it("should combine local and Firebase loading states", () => {
      // Mock Firebase loading state
      vi.mocked(useFirebaseData).mockReturnValue({
        ...mockFirebaseData,
        loading: true,
      });

      const { result } = renderHook(() => useEducationalTasks());

      expect(result.current.loading).toBe(true);

      // Mock Firebase not loading
      vi.mocked(useFirebaseData).mockReturnValue({
        ...mockFirebaseData,
        loading: false,
      });

      const { result: result2 } = renderHook(() => useEducationalTasks());

      expect(result2.current.loading).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should handle non-Error objects in catch blocks", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      mockFirebaseData.createItem.mockRejectedValue("String error");

      await act(async () => {
        try {
          await result.current.createTask(mockTaskData);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("Błąd podczas tworzenia zadania");
    });

    it("should handle update error with non-Error objects", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      mockFirebaseData.updateItem.mockRejectedValue({ message: "Object error" });

      await act(async () => {
        try {
          await result.current.updateTask("task-1", mockTaskData);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("Błąd podczas aktualizacji zadania");
    });

    it("should handle delete error with non-Error objects", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      mockFirebaseData.deleteItem.mockRejectedValue(null);

      await act(async () => {
        try {
          await result.current.deleteTask("task-1");
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("Błąd podczas usuwania zadania");
    });
  });

  describe("task ID generation", () => {
    it("should generate unique task IDs", async () => {
      const { result } = renderHook(() => useEducationalTasks());

      mockFirebaseData.createItem.mockImplementation((task) => Promise.resolve(task));

      let firstTask: EducationalTask | null | undefined;
      let secondTask: EducationalTask | null | undefined;

      await act(async () => {
        firstTask = await result.current.createTask(mockTaskData);
      });

      await act(async () => {
        secondTask = await result.current.createTask(mockTaskData);
      });

      expect(firstTask?.id).toBeDefined();
      expect(secondTask?.id).toBeDefined();
      expect(firstTask?.id).not.toBe(secondTask?.id);
    });
  });

  describe("refetch", () => {
    it("should call Firebase refetch function", () => {
      const { result } = renderHook(() => useEducationalTasks());

      act(() => {
        result.current.refetch();
      });

      expect(mockFirebaseData.refetch).toHaveBeenCalled();
    });
  });
});

// Test the reducer separately for better testability
describe("educationalTasksReducer", () => {
  const initialState = {
    loading: false,
    error: null,
    tasks: [],
  };

  it("should handle SET_LOADING action", () => {
    const action = actions.setLoading(true);
    const newState = educationalTasksReducer(initialState, action);
    expect(newState.loading).toBe(true);
  });

  it("should handle SET_ERROR action", () => {
    const action = actions.setError("Test error");
    const newState = educationalTasksReducer(initialState, action);
    expect(newState.error).toBe("Test error");
    expect(newState.loading).toBe(false);
  });

  it("should handle SET_TASKS action", () => {
    const tasks = [mockTask];
    const action = actions.setTasks(tasks);
    const newState = educationalTasksReducer(initialState, action);
    expect(newState.tasks).toEqual(tasks);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(null);
  });

  it("should handle ADD_TASK action", () => {
    const action = actions.addTask(mockTask);
    const newState = educationalTasksReducer(initialState, action);
    expect(newState.tasks).toContain(mockTask);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(null);
  });

  it("should handle UPDATE_TASK action", () => {
    const initialStateWithTask = { ...initialState, tasks: [mockTask] };
    const updatedTask = { ...mockTask, title: "Updated Task" };
    const action = actions.updateTask(updatedTask);
    const newState = educationalTasksReducer(initialStateWithTask, action);
    expect(newState.tasks[0].title).toBe("Updated Task");
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(null);
  });

  it("should handle DELETE_TASK action", () => {
    const initialStateWithTask = { ...initialState, tasks: [mockTask] };
    const action = actions.deleteTask("task-1");
    const newState = educationalTasksReducer(initialStateWithTask, action);
    expect(newState.tasks).toEqual([]);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(null);
  });
});

// Test utility functions separately
describe("taskUtils", () => {
  it("should generate unique task IDs", () => {
    const id1 = taskUtils.generateTaskId();
    const id2 = taskUtils.generateTaskId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^task_\d+_[a-z0-9]+$/);
  });

  it("should create task from data", () => {
    const task = taskUtils.createTaskFromData(mockTaskData, "user-123");
    expect(task).toEqual({
      ...mockTaskData,
      id: expect.any(String),
      createdBy: "user-123",
      createdAt: expect.any(String),
    });
  });

  it("should update task from data", () => {
    const task = taskUtils.updateTaskFromData("task-1", mockTaskData, "user-123");
    expect(task).toEqual({
      ...mockTaskData,
      id: "task-1",
      createdBy: "user-123",
      updatedAt: expect.any(String),
      createdAt: "",
    });
  });

  it("should get error message from Error object", () => {
    const error = new Error("Test error");
    const message = taskUtils.getErrorMessage(error, "Default message");
    expect(message).toBe("Test error");
  });

  it("should get default message for non-Error objects", () => {
    const message = taskUtils.getErrorMessage("String error", "Default message");
    expect(message).toBe("Default message");
  });
});
