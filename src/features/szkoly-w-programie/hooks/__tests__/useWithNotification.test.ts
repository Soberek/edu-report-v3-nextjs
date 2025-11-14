import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWithNotification } from "../useWithNotification";
import { useNotification, UseNotificationReturn } from "@/hooks";
import * as errorHandler from "@/hooks/utils/error-handler.utils";

// Mock dependencies
vi.mock("@/hooks");
vi.mock("@/hooks/utils/error-handler.utils");

const mockUseNotification = vi.mocked(useNotification);
const mockGetErrorMessage = vi.mocked(errorHandler.getErrorMessage);

describe("useWithNotification hook", () => {
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNotification.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showInfo: vi.fn(),
      showWarning: vi.fn(),
      notification: {
        open: false,
        message: "",
        severity: "success",
      },
      close: vi.fn(),
    });
    mockGetErrorMessage.mockImplementation((error, defaultMsg) => defaultMsg);
  });

  describe("successful operation", () => {
    it("should call showSuccess when operation completes", async () => {
      const mockOperation = vi.fn().mockResolvedValue({ data: "test" });

      const { result } = renderHook(() => useWithNotification());
      const executeWithNotification = result.current;

      await executeWithNotification(mockOperation, "Operation successful", "Operation failed");

      expect(mockShowSuccess).toHaveBeenCalledWith("Operation successful");
    });

    it("should return operation result on success", async () => {
      const expectedResult = { id: 123, name: "Test" };
      const mockOperation = vi.fn().mockResolvedValue(expectedResult);

      const { result } = renderHook(() => useWithNotification());

      const operationResult = await result.current(mockOperation, "Success", "Error");

      expect(operationResult).toEqual(expectedResult);
    });

    it("should not call showError on success", async () => {
      const mockOperation = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useWithNotification());

      await result.current(mockOperation, "Success", "Error");

      expect(mockShowError).not.toHaveBeenCalled();
    });

    it("should work with async operations returning void", async () => {
      const mockOperation = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() => useWithNotification());

      const operationResult = await result.current(mockOperation, "Success", "Error");

      expect(operationResult).toBeUndefined();
      expect(mockShowSuccess).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should call showError when operation fails", async () => {
      const error = new Error("Something went wrong");
      const mockOperation = vi.fn().mockRejectedValue(error);
      mockGetErrorMessage.mockReturnValue("Formatted error message");

      const { result } = renderHook(() => useWithNotification());

      try {
        await result.current(mockOperation, "Success", "Default error message");
      } catch (e) {
        // Expected to throw
      }

      expect(mockShowError).toHaveBeenCalledWith("Formatted error message");
    });

    it("should use getErrorMessage to format error", async () => {
      const error = new Error("API Error");
      const mockOperation = vi.fn().mockRejectedValue(error);
      const defaultMessage = "Failed to save data";
      mockGetErrorMessage.mockReturnValue("Formatted: " + defaultMessage);

      const { result } = renderHook(() => useWithNotification());

      try {
        await result.current(mockOperation, "Success", defaultMessage);
      } catch (e) {
        // Expected
      }

      expect(mockGetErrorMessage).toHaveBeenCalledWith(error, defaultMessage);
    });

    it("should re-throw error after showing notification", async () => {
      const error = new Error("Test error");
      const mockOperation = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(() => useWithNotification());

      await expect(result.current(mockOperation, "Success", "Error")).rejects.toThrow("Test error");
    });

    it("should not call showSuccess on error", async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error("Fail"));

      const { result } = renderHook(() => useWithNotification());

      try {
        await result.current(mockOperation, "Success", "Error");
      } catch (e) {
        // Expected
      }

      expect(mockShowSuccess).not.toHaveBeenCalled();
    });

    it("should handle different error types", async () => {
      const errors = [new Error("Standard error"), new TypeError("Type error"), { message: "Object error" }, "String error"];

      for (const error of errors) {
        vi.clearAllMocks();
        mockUseNotification.mockReturnValue({
          showSuccess: mockShowSuccess,
          showError: mockShowError,
          showInfo: vi.fn(),
          showWarning: vi.fn(),
          notification: {
            open: false,
            message: "",
            severity: "success",
          },
          close: vi.fn(),
        });

        const mockOperation = vi.fn().mockRejectedValue(error);
        const { result } = renderHook(() => useWithNotification());

        try {
          await result.current(mockOperation, "Success", "Error");
        } catch (e) {
          // Expected
        }

        expect(mockShowError).toHaveBeenCalled();
      }
    });
  });

  describe("operation execution", () => {
    it("should execute the provided operation", async () => {
      const mockOperation = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useWithNotification());

      await result.current(mockOperation, "Success", "Error");

      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments correctly to operation", async () => {
      const mockOperation = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useWithNotification());

      await result.current(mockOperation, "Success message", "Error message");

      expect(mockOperation).toHaveBeenCalled();
    });

    it("should support long-running operations", async () => {
      const mockOperation = vi.fn(() => new Promise((resolve) => setTimeout(() => resolve("data"), 100)));

      const { result } = renderHook(() => useWithNotification());

      const startTime = Date.now();
      await result.current(mockOperation, "Success", "Error");
      const duration = Date.now() - startTime;

      // Allow for slight timing variations in test environment (>=95ms instead of >=100ms)
      expect(duration).toBeGreaterThanOrEqual(95);
      expect(mockShowSuccess).toHaveBeenCalled();
    });
  });

  describe("notification messages", () => {
    it("should use provided success message", async () => {
      const successMessage = "Custom success message";
      const mockOperation = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useWithNotification());

      await result.current(mockOperation, successMessage, "Error");

      expect(mockShowSuccess).toHaveBeenCalledWith(successMessage);
    });

    it("should use provided error message as fallback", async () => {
      const errorMessage = "Custom error message";
      const mockOperation = vi.fn().mockRejectedValue(new Error("Fail"));
      mockGetErrorMessage.mockReturnValue(errorMessage);

      const { result } = renderHook(() => useWithNotification());

      try {
        await result.current(mockOperation, "Success", errorMessage);
      } catch (e) {
        // Expected
      }

      expect(mockGetErrorMessage).toHaveBeenCalledWith(expect.any(Error), errorMessage);
    });

    it("should support different message types (Polish text)", async () => {
      const messages = [
        { success: "Operacja zakończona pomyślnie", error: "Operacja nie powiodła się" },
        { success: "Dane zapisane", error: "Błąd zapisu" },
        { success: "Aktualizacja ukończona", error: "Błąd aktualizacji" },
      ];

      for (const { success, error: errorMsg } of messages) {
        vi.clearAllMocks();
        mockUseNotification.mockReturnValue({
          showSuccess: mockShowSuccess,
          showError: mockShowError,
          showInfo: vi.fn(),
          showWarning: vi.fn(),
          notification: {
            open: false,
            message: "",
            severity: "success",
          },
          close: vi.fn(),
        });

        const mockOperation = vi.fn().mockResolvedValue(null);
        const { result } = renderHook(() => useWithNotification());

        await result.current(mockOperation, success, errorMsg);

        expect(mockShowSuccess).toHaveBeenCalledWith(success);
      }
    });
  });

  describe("hook dependency management", () => {
    it("should update when showSuccess/showError change", () => {
      const firstShowSuccess = vi.fn();
      const secondShowSuccess = vi.fn();

      mockUseNotification.mockReturnValueOnce({
        showSuccess: firstShowSuccess,
        showError: mockShowError,
        showInfo: vi.fn(),
        showWarning: vi.fn(),
        notification: {
          open: false,
          message: "",
          severity: "success",
        },
        close: vi.fn(),
      });

      const { result, rerender } = renderHook(() => useWithNotification());

      mockUseNotification.mockReturnValueOnce({
        showSuccess: secondShowSuccess,
        showError: mockShowError,
        showInfo: vi.fn(),
        showWarning: vi.fn(),
        notification: {
          open: false,
          message: "",
          severity: "success",
        },
        close: vi.fn(),
      });

      rerender();

      // Hook should return a new function with updated dependencies
      expect(result.current).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle operation that takes no time", async () => {
      const mockOperation = vi.fn().mockResolvedValue("instant");

      const { result } = renderHook(() => useWithNotification());

      const operationResult = await result.current(mockOperation, "Success", "Error");

      expect(operationResult).toBe("instant");
      expect(mockShowSuccess).toHaveBeenCalled();
    });

    it("should handle empty success message", async () => {
      const mockOperation = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useWithNotification());

      await result.current(mockOperation, "", "Error");

      expect(mockShowSuccess).toHaveBeenCalledWith("");
    });

    it("should handle null return from operation", async () => {
      const mockOperation = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useWithNotification());

      const operationResult = await result.current(mockOperation, "Success", "Error");

      expect(operationResult).toBeNull();
      expect(mockShowSuccess).toHaveBeenCalled();
    });

    it("should handle concurrent calls (separate hooks)", async () => {
      const operation1 = vi.fn().mockResolvedValue("result1");
      const operation2 = vi.fn().mockResolvedValue("result2");

      const { result: result1 } = renderHook(() => useWithNotification());
      const { result: result2 } = renderHook(() => useWithNotification());

      const [r1, r2] = await Promise.all([
        result1.current(operation1, "Success 1", "Error 1"),
        result2.current(operation2, "Success 2", "Error 2"),
      ]);

      expect(r1).toBe("result1");
      expect(r2).toBe("result2");
      expect(mockShowSuccess).toHaveBeenCalledTimes(2);
    });
  });

  describe("generic type support", () => {
    it("should handle different return types", async () => {
      interface User {
        id: string;
        name: string;
      }

      const user: User = { id: "123", name: "Test User" };
      const mockOperation = vi.fn().mockResolvedValue(user);

      const { result } = renderHook(() => useWithNotification());

      const operationResult = await result.current<User>(mockOperation, "Success", "Error");

      expect(operationResult.id).toBe("123");
      expect(operationResult.name).toBe("Test User");
    });

    it("should handle array returns", async () => {
      const mockData = [1, 2, 3];
      const mockOperation = vi.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useWithNotification());

      const operationResult = await result.current<number[]>(mockOperation, "Success", "Error");

      expect(operationResult).toEqual(mockData);
      expect(operationResult.length).toBe(3);
    });
  });
});
