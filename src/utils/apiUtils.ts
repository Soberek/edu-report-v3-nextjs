export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const createApiResponse = <T>(data: T, success: boolean = true, message?: string): ApiResponse<T> => ({
  data,
  success,
  message,
});

export const createApiError = (message: string, status?: number, code?: string): ApiError => ({
  message,
  status,
  code,
});

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
    get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
    post: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
  };
};
