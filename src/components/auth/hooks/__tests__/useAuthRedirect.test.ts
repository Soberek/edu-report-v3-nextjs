import { renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { User } from "firebase/auth";
import { useAuthRedirect } from "../useAuthRedirect";
import { useUser } from "@/hooks/useUser";
import { SHARED_AUTH_CONSTANTS } from "../../constants";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}));

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

const mockUseUser = useUser as ReturnType<typeof vi.mocked<typeof useUser>>;

describe("useAuthRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it("should return shouldRedirect false when user is not authenticated", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const { result } = renderHook(() => useAuthRedirect());

    expect(result.current.shouldRedirect).toBe(false);
    expect(result.current.redirectPath).toBe(SHARED_AUTH_CONSTANTS.ROUTES.HOME);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("should return shouldRedirect true when user is authenticated", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect());

    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe(SHARED_AUTH_CONSTANTS.ROUTES.HOME);
  });

  it("should use custom redirect path when provided", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;
    const customRedirect = "/custom-path";
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect(customRedirect));

    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe(customRedirect);
  });

  it("should use custom default redirect when provided", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;
    const customDefault = "/custom-default";
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect(undefined, customDefault));

    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe(customDefault);
  });

  it("should prioritize custom redirect over default redirect", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;
    const customRedirect = "/custom-path";
    const customDefault = "/custom-default";
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect(customRedirect, customDefault));

    expect(result.current.shouldRedirect).toBe(true);
    expect(result.current.redirectPath).toBe(customRedirect);
  });

  it("should handle user with undefined uid", () => {
    const mockUser = { uid: undefined, email: "test@example.com" } as unknown as User;
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect());

    expect(result.current.shouldRedirect).toBe(false);
    expect(result.current.redirectPath).toBe(SHARED_AUTH_CONSTANTS.ROUTES.HOME);
  });

  it("should handle user with empty string uid", () => {
    const mockUser = { uid: "", email: "test@example.com" } as User;
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect());

    expect(result.current.shouldRedirect).toBe(false);
    expect(result.current.redirectPath).toBe(SHARED_AUTH_CONSTANTS.ROUTES.HOME);
  });

  it("should handle user object without uid property", () => {
    const mockUser = { email: "test@example.com" } as User;
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useAuthRedirect());

    expect(result.current.shouldRedirect).toBe(false);
    expect(result.current.redirectPath).toBe(SHARED_AUTH_CONSTANTS.ROUTES.HOME);
  });

  it("should call router.push when user becomes authenticated", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;

    // Start with no user
    mockUseUser.mockReturnValue({ user: null, loading: false });
    const { rerender } = renderHook(() => useAuthRedirect());

    // User becomes authenticated
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });
    rerender();

    expect(mockRouter.push).toHaveBeenCalledWith(SHARED_AUTH_CONSTANTS.ROUTES.HOME);
  });

  it("should call router.push with custom redirect when user becomes authenticated", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;
    const customRedirect = "/dashboard";

    // Start with no user
    mockUseUser.mockReturnValue({ user: null, loading: false });
    const { rerender } = renderHook(() => useAuthRedirect(customRedirect));

    // User becomes authenticated
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });
    rerender();

    expect(mockRouter.push).toHaveBeenCalledWith(customRedirect);
  });

  it("should not call router.push when user is not authenticated", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    renderHook(() => useAuthRedirect());

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("should maintain stable return values", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result, rerender } = renderHook(() => useAuthRedirect());

    const initialShouldRedirect = result.current.shouldRedirect;
    const initialRedirectPath = result.current.redirectPath;

    rerender();

    expect(result.current.shouldRedirect).toBe(initialShouldRedirect);
    expect(result.current.redirectPath).toBe(initialRedirectPath);
  });
});
