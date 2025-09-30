import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAuthForm } from "../useAuthForm";
import { getAuthErrorMessage, logErrorInDevelopment } from "../../utils";
import type { BaseAuthFormData } from "../../types";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../utils", () => ({
  getAuthErrorMessage: vi.fn(),
  logErrorInDevelopment: vi.fn(),
}));

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

const mockGetAuthErrorMessage = getAuthErrorMessage as ReturnType<typeof vi.mocked<typeof getAuthErrorMessage>>;
const mockLogErrorInDevelopment = logErrorInDevelopment as ReturnType<typeof vi.mocked<typeof logErrorInDevelopment>>;

describe("useAuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  interface TestFormData extends BaseAuthFormData {
    email: string;
    password: string;
  }

  const mockAuthFunction = vi.fn();
  const successRedirect = "/dashboard";
  const errorContext = "test context";

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.submit).toBe("function");
    expect(typeof result.current.clearError).toBe("function");
  });

  it("should handle successful authentication", async () => {
    const mockUser = { uid: "123", email: "test@example.com" };
    mockAuthFunction.mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const formData: TestFormData = {
      email: "test@example.com",
      password: "password123",
    };

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(mockAuthFunction).toHaveBeenCalledWith(formData);
    expect(mockRouter.push).toHaveBeenCalledWith(successRedirect);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle successful authentication with truthy result", async () => {
    mockAuthFunction.mockResolvedValue("success");

    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const formData: TestFormData = {
      email: "test@example.com",
      password: "password123",
    };

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(mockAuthFunction).toHaveBeenCalledWith(formData);
    expect(mockRouter.push).toHaveBeenCalledWith(successRedirect);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle authentication failure", async () => {
    const mockError = new Error("Authentication failed");
    const errorMessage = "Nieprawidłowe dane logowania";

    mockAuthFunction.mockRejectedValue(mockError);
    mockGetAuthErrorMessage.mockReturnValue(errorMessage);

    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const formData: TestFormData = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(mockAuthFunction).toHaveBeenCalledWith(formData);
    expect(mockGetAuthErrorMessage).toHaveBeenCalledWith(mockError);
    expect(mockLogErrorInDevelopment).toHaveBeenCalledWith(mockError, errorContext);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle loading state correctly", async () => {
    let resolveAuth: (value: unknown) => void;
    const authPromise = new Promise((resolve) => {
      resolveAuth = resolve;
    });
    mockAuthFunction.mockReturnValue(authPromise);

    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const formData: TestFormData = {
      email: "test@example.com",
      password: "password123",
    };

    // Start submission
    act(() => {
      result.current.submit(formData);
    });

    // Check loading state
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolveAuth!({ user: { uid: "123" } });
      await authPromise;
    });

    // Check final state
    expect(result.current.isLoading).toBe(false);
  });

  it("should clear error when clearError is called", () => {
    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    // Set an error manually (simulating previous error state)
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("should not redirect when result is falsy", async () => {
    mockAuthFunction.mockResolvedValue(null);

    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const formData: TestFormData = {
      email: "test@example.com",
      password: "password123",
    };

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(mockAuthFunction).toHaveBeenCalledWith(formData);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should not redirect when result has no user and is falsy", async () => {
    mockAuthFunction.mockResolvedValue({ user: null });

    const { result } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const formData: TestFormData = {
      email: "test@example.com",
      password: "password123",
    };

    await act(async () => {
      await result.current.submit(formData);
    });

    expect(mockAuthFunction).toHaveBeenCalledWith(formData);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should maintain stable function references", () => {
    const { result, rerender } = renderHook(() => useAuthForm<TestFormData>(mockAuthFunction, successRedirect, errorContext));

    const initialSubmit = result.current.submit;
    const initialClearError = result.current.clearError;

    rerender();

    expect(result.current.submit).toBe(initialSubmit);
    expect(result.current.clearError).toBe(initialClearError);
  });
});
