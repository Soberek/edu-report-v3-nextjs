import { useCallback, useReducer, useRef, useEffect, useState } from "react";

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
    /** Full size photo URL */
    full: string;
    /** Raw size photo URL */
    raw: string;
    /** Allow for other URL sizes returned by the API */
    [key: string]: string;
  };
  /** Photo description provided by the author */
  description?: string;
  /** Auto-generated alternative description for accessibility */
  alt_description?: string;
  /** Photo width in pixels */
  width?: number;
  /** Photo height in pixels */
  height?: number;
  /** Photo color (hex) */
  color?: string;
  /** Photo tags */
  tags?: Array<{ title: string }>;
  /** Additional properties from Unsplash API */
  [key: string]: unknown;
}

/**
 * Options for fetching photos
 */
export interface UnsplashFetchOptions {
  /** Number of photos to fetch (1-30) */
  count?: number;
  /** Photo orientation */
  orientation?: "landscape" | "portrait" | "squarish";
  /** Photo size preference */
  size?: "small" | "regular" | "full" | "raw";
  /** Quality preference */
  quality?: "low" | "high";
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
  /** Cache of photos by tag */
  photoCache: Map<string, UnsplashPhoto[]>;
}

/**
 * Action types for the reducer
 */
type UnsplashAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; photos: UnsplashPhoto[]; tag?: string }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "CLEAR_CACHE" };

/**
 * Initial state for the reducer
 */
const initialState: UnsplashState = {
  photos: [],
  loading: false,
  error: null,
  photoCache: new Map(),
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
      const newCache = new Map(state.photoCache);
      if (action.tag && action.photos.length > 0) {
        newCache.set(action.tag, action.photos);
      }
      return {
        ...state,
        loading: false,
        photos: action.photos,
        error: null,
        photoCache: newCache,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "CLEAR_CACHE":
      return {
        ...state,
        photoCache: new Map(),
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

  /**
   * Fetch a single photo by tag
   */
  const fetchPhotoByTag = useCallback(
    async (tag: string, options?: UnsplashFetchOptions): Promise<UnsplashPhoto | null> => {
      // Check cache first
      const cachedPhotos = state.photoCache.get(tag);
      if (cachedPhotos && cachedPhotos.length > 0) {
        return cachedPhotos[0];
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      dispatch({ type: "FETCH_START" });

      try {
        const response = await fetch(`/api/unsplash-photo-by-tag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag,
            count: options?.count || 1,
            orientation: options?.orientation || "landscape",
            size: options?.size || "regular",
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`Failed to fetch photo for tag "${tag}" (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Handle both single photo and array of photos
        let photos: UnsplashPhoto[];
        if (Array.isArray(data)) {
          photos = data;
        } else {
          photos = [data];
        }

        if (photos.length === 0) {
          throw new Error(`No photos found for tag "${tag}"`);
        }

        dispatch({ type: "FETCH_SUCCESS", photos, tag });
        return photos[0];
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return null;
        }

        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        dispatch({ type: "FETCH_ERROR", error: errorMessage });
        return null;
      }
    },
    [state.photoCache]
  );

  /**
   * Fetch multiple photos by tag
   */
  const fetchPhotosByTag = useCallback(
    async (tag: string, count: number = 5, options?: UnsplashFetchOptions): Promise<UnsplashPhoto[]> => {
      // Check cache first
      const cachedPhotos = state.photoCache.get(tag);
      if (cachedPhotos && cachedPhotos.length >= count) {
        return cachedPhotos.slice(0, count);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      dispatch({ type: "FETCH_START" });

      try {
        const response = await fetch(`/api/unsplash-photo-by-tag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag,
            count: Math.min(count, 30), // Unsplash API limit
            orientation: options?.orientation || "landscape",
            size: options?.size || "regular",
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`Failed to fetch photos for tag "${tag}" (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Handle both single photo and array of photos
        let photos: UnsplashPhoto[];
        if (Array.isArray(data)) {
          photos = data;
        } else {
          photos = [data];
        }

        dispatch({ type: "FETCH_SUCCESS", photos, tag });
        return photos;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return [];
        }

        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        dispatch({ type: "FETCH_ERROR", error: errorMessage });
        return [];
      }
    },
    [state.photoCache]
  );

  /**
   * Generate image URL for a post based on tags
   */
  const generateImageForPost = useCallback(
    async (tags: string[], fallbackTag?: string): Promise<string | null> => {
      // Try each tag until we find a suitable image
      for (const tag of tags) {
        try {
          console.log(`Trying to fetch image for tag: "${tag}"`);
          const photo = await fetchPhotoByTag(tag, {
            orientation: "landscape",
            size: "regular",
          });
          if (photo && photo.urls && photo.urls.regular) {
            console.log(`Successfully fetched image for tag: "${tag}"`);
            return photo.urls.regular;
          }
        } catch (error) {
          console.warn(`Failed to fetch image for tag "${tag}":`, error);
        }
      }

      // Try fallback tag if provided
      if (fallbackTag) {
        try {
          console.log(`Trying fallback tag: "${fallbackTag}"`);
          const photo = await fetchPhotoByTag(fallbackTag, {
            orientation: "landscape",
            size: "regular",
          });
          if (photo && photo.urls && photo.urls.regular) {
            console.log(`Successfully fetched fallback image for tag: "${fallbackTag}"`);
            return photo.urls.regular;
          }
        } catch (error) {
          console.warn(`Failed to fetch fallback image for tag "${fallbackTag}":`, error);
        }
      }

      console.warn("No images found for any tags");
      return null;
    },
    [fetchPhotoByTag]
  );

  /**
   * Clear the photo cache
   */
  const clearCache = useCallback(() => {
    dispatch({ type: "CLEAR_CACHE" });
  }, []);

  /**
   * Get cached photos for a tag
   */
  const getCachedPhotos = useCallback(
    (tag: string): UnsplashPhoto[] => {
      return state.photoCache.get(tag) || [];
    },
    [state.photoCache]
  );

  return {
    photos: state.photos,
    loading: state.loading,
    error: state.error,
    photoCache: state.photoCache,
    fetchPhotoByTag,
    fetchPhotosByTag,
    generateImageForPost,
    clearCache,
    getCachedPhotos,
  };
}
