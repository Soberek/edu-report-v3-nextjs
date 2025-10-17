import { useState, useEffect, useCallback } from "react";

/**
 * React hook for managing localStorage with JSON serialization
 * Automatically syncs state with localStorage and handles SSR safely
 * @template T The type of value to store
 * @param key The localStorage key
 * @param initialValue Default value if nothing is stored
 * @returns Tuple of [storedValue, setValue, removeValue]
 * @example
 * const [user, setUser, removeUser] = useLocalStorage<User>("user", {});
 * setUser({ id: 1, name: "John" }); // Updates both state and localStorage
 * removeUser(); // Clears both state and localStorage
 *
 * // setValue also supports functional updates like useState:
 * setUser(prev => ({ ...prev, name: "Jane" }));
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};
