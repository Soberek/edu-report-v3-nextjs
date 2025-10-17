import { useState, useEffect } from "react";

/**
 * Debounce a value with a delay
 * Useful for debouncing search inputs, filter values, or other reactive values
 * The debounced value updates after the specified delay of inactivity
 * @template T The type of value to debounce
 * @param value The value to debounce
 * @param delay Delay in milliseconds before updating the debounced value
 * @returns The debounced value (updates with delay)
 * @example
 * const searchTerm = "hello world";
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * // debouncedSearchTerm will update 500ms after searchTerm changes
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Debounce a callback function with a delay
 * Useful for debouncing API calls, form submissions, or expensive operations
 * Cancels previous pending calls if triggered again before the delay expires
 * @template T The callback function type
 * @param callback The async/sync function to debounce
 * @param delay Delay in milliseconds before executing the callback
 * @returns Debounced version of the callback
 * @example
 * const debouncedSearch = useDebouncedCallback(
 *   (query: string) => apiSearch(query),
 *   500
 * );
 * // Multiple rapid calls will only execute the last one after 500ms
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(callback: T, delay: number): T => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};
