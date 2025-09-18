import { useCallback, useReducer, useRef, useEffect } from "react";

/**
 * Represents a photo from the Unsplash API
 */
export interface UnsplashPhoto {
  /** Unique identifier for the photo */
  id: string;
  /** Collection of URLs for different photo sizes */
  urls: {
    /** Small size photo URL */
    small: string;
    /** Regular size photo URL */
    regular: string;
    /** Allow for other URL sizes returned by the API */
    [key: string]: string;
  };
  /** Photo description provided by the author */
  description?: string;
  /** Auto-generated alternative description for accessibility */
  alt_description?: string;
  /** Additional properties from Unsplash API */
  [key: string]: unknown;
}

/**
 * State interface for the Unsplash photo hook
 */
interface UnsplashState {
  /** Collection of photos retrieved from Unsplash */
  photos: UnsplashPhoto[];
  /** Loading state indicator */
  loading: boolean;
  /** Error message if fetch fails */
  error: string | null;
}

/**
 * Action types for the reducer
 */
type UnsplashAction = { type: "FETCH_START" } | { type: "FETCH_SUCCESS"; photos: UnsplashPhoto[] } | { type: "FETCH_ERROR"; error: string };

/**
 * Initial state for the reducer
 */
const initialState: UnsplashState = {
  photos: [],
  loading: false,
  error: null,
};

/**
 * Reducer function to manage state updates
 */
function unsplashReducer(state: UnsplashState, action: UnsplashAction): UnsplashState {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        photos: action.photos,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

/**
 * Custom hook for fetching and managing Unsplash photos
 */
export function useUnsplashPhotos() {
  const [state, dispatch] = useReducer(unsplashReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchPhotoByTag = useCallback(async (tag: string): Promise<UnsplashPhoto | null> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    dispatch({ type: "FETCH_START" });

    try {
      const response = await fetch(`/api/unsplash?tag=${encodeURIComponent(tag)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Failed to fetch photo for tag "${tag}" (${response.status}): ${errorText}`);
      }

      const photo: UnsplashPhoto = await response.json();
      dispatch({ type: "FETCH_SUCCESS", photos: [photo] });
      return photo;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      dispatch({ type: "FETCH_ERROR", error: errorMessage });
      return null;
    }
  }, []);

  return {
    photos: state.photos,
    loading: state.loading,
    error: state.error,
    fetchPhotoByTag,
  };
}
