/**
 * Standard API response structure
 * @template T The type of data returned in the response
 */
export interface ApiResponse<T = unknown> {
  /** The response data payload */
  data: T;
  /** Whether the request was successful */
  success: boolean;
  /** Optional success message */
  message?: string;
  /** Optional error message if success is false */
  error?: string;
}

/**
 * Standard API error structure
 */
export interface ApiError {
  /** Error message description */
  message: string;
  /** HTTP status code (if applicable) */
  status?: number;
  /** Error code for programmatic handling */
  code?: string;
}

/**
 * Create a standardized API response
 * @template T The type of data in the response
 * @param data The response data payload
 * @param success Whether the operation was successful (default: true)
 * @param message Optional success or informational message
 * @returns Formatted ApiResponse object
 * @example
 * const response = createApiResponse({ user: { id: 1, name: "John" } }, true);
 * // { data: { user: {...} }, success: true }
 */
export const createApiResponse = <T>(data: T, success: boolean = true, message?: string): ApiResponse<T> => ({
  data,
  success,
  message,
});

/**
 * Create a standardized API error
 * @param message Error message description
 * @param status HTTP status code (optional)
 * @param code Error code for programmatic handling (optional)
 * @returns Formatted ApiError object
 * @example
 * const error = createApiError("User not found", 404, "USER_NOT_FOUND");
 */
export const createApiError = (message: string, status?: number, code?: string): ApiError => ({
  message,
  status,
  code,
});

/**
 * Handle and normalize various error types into standardized ApiError format
 * Supports Axios-like errors with response/request structure
 * @param error The error object to handle (can be any type)
 * @returns Normalized ApiError with message, status, and optional code
 * @example
 * try { await apiCall(); } catch(e) {
 *   const err = handleApiError(e);
 *   console.log(err.message, err.status);
 * }
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as { response: { data?: { message?: string; code?: string }; status: number } };
    // Server responded with error status
    return {
      message: apiError.response.data?.message || "Wystąpił błąd serwera",
      status: apiError.response.status,
      code: apiError.response.data?.code,
    };
  } else if (error && typeof error === "object" && "request" in error) {
    // Request was made but no response received
    return {
      message: "Brak połączenia z serwerem",
      status: 0,
    };
  } else {
    // Something else happened
    const message =
      error && typeof error === "object" && "message" in error ? (error as { message: string }).message : "Wystąpił nieoczekiwany błąd";
    return {
      message,
    };
  }
};

/**
 * Retry an API call with exponential backoff
 * Waits delay * attempt milliseconds between retries
 * @template T The return type of the API call
 * @param apiCall The async function to retry
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param delay Base delay in milliseconds between retries (default: 1000)
 * @returns Promise resolving to the result of apiCall
 * @throws Throws the error from the final failed attempt
 * @example
 * const data = await retryApiCall(() => fetch('/api/data'), 3, 1000);
 */
export const retryApiCall = async <T>(apiCall: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

/**
 * Create a debounced version of an API call function
 * Delays execution and cancels previous calls if triggered again
 * @template T The API call function type
 * @param apiCall The async function to debounce
 * @param delay Debounce delay in milliseconds (default: 300)
 * @returns Debounced version of the function
 * @example
 * const debouncedSearch = debounceApiCall(
 *   (query: string) => fetch(`/api/search?q=${query}`),
 *   500
 * );
 * // Calling multiple times quickly will only execute once after 500ms
 */
export const debounceApiCall = <T extends (...args: unknown[]) => Promise<unknown>>(apiCall: T, delay: number = 300): T => {
  let timeoutId: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    return new Promise<ReturnType<T> extends Promise<infer U> ? U : never>((resolve, reject) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        try {
          const result = await apiCall(...args);
          resolve(result as ReturnType<T> extends Promise<infer U> ? U : never);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }) as T;
};

/**
 * Create a simple fetch-based API client with built-in error handling
 * @param baseURL The base URL for all API requests (e.g., "https://api.example.com")
 * @returns API client object with get, post, put, delete methods
 * @example
 * const client = createApiClient("https://api.example.com");
 * const response = await client.get<User>("/users/1");
 * const created = await client.post<User>("/users", { name: "John" });
 */
export const createApiClient = (baseURL: string) => {
  const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const url = `${baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return createApiResponse(data, true);
    } catch (error) {
      const apiError = handleApiError(error);
      return createApiResponse(null as T, false, apiError.message);
    }
  };

  return {
    /**
     * GET request
     * @template T Response data type
     * @param endpoint API endpoint path
     * @returns Promise resolving to ApiResponse with data
     */
    get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

    /**
     * POST request
     * @template T Response data type
     * @param endpoint API endpoint path
     * @param data Request body data
     * @returns Promise resolving to ApiResponse with data
     */
    post: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      }),

    /**
     * PUT request
     * @template T Response data type
     * @param endpoint API endpoint path
     * @param data Request body data
     * @returns Promise resolving to ApiResponse with data
     */
    put: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      }),

    /**
     * DELETE request
     * @template T Response data type
     * @param endpoint API endpoint path
     * @returns Promise resolving to ApiResponse with data
     */
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
  };
};