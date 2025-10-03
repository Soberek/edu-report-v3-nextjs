import { useState, useCallback, useEffect } from "react";
import { graphicsGenerator } from "@/utils/graphicsGenerator";
import { TEMPLATE_CONFIG } from "../config/templateConfig";
import type { EducationalHolidayWithQuery, HolidayTemplateConfig, GeneratedPostWithGraphics, ApiGeneratedPost } from "../types";

interface GraphicsState {
  posts: GeneratedPostWithGraphics[];
  loading: boolean;
  error: string | null;
}

export const useHolidayGraphics = () => {
  const [state, setState] = useState<GraphicsState>({
    posts: [],
    loading: false,
    error: null,
  });

  const [templateConfig, setTemplateConfig] = useState(TEMPLATE_CONFIG);

  // Load saved template configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("holidayTemplateConfig");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setTemplateConfig(parsedConfig);
      } catch (error) {
        console.warn("Failed to parse saved template config:", error);
      }
    }
  }, []);

  const generatePostsWithGraphics = useCallback(
    async (holidays: EducationalHolidayWithQuery[]) => {
      if (holidays.length === 0) {
        setState((prev) => ({ ...prev, error: "No holidays available to generate posts" }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null, posts: [] }));

      try {
        console.time("generatePostsWithGraphics");
        const response = await fetch("/api/generate-holiday-graphics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ holidays }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate graphics");
        }

        const data = await response.json();
        const posts: ApiGeneratedPost[] = Array.isArray(data.posts) ? data.posts : [];

        // Process in small concurrent batches to avoid blocking the main thread
        const concurrency = 2; // keep low to avoid UI freeze; adjust if needed
        let idx = 0;

        while (idx < posts.length) {
          const batch = posts.slice(idx, idx + concurrency);

          const batchResults = await Promise.all(
            batch.map(async (post: ApiGeneratedPost) => {
              // include a short, sanitized version of the tag/query in the timing label
              const rawTag = String(post.query ?? "").trim();
              const tagPart =
                rawTag
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-_]/g, "")
                  .slice(0, 24) || "no-tag";
              const label = `generate-post-${post.id}-${tagPart}`;
              console.time(label);
              try {
                const generatedImageUrl = await graphicsGenerator.generateHolidayPost({
                  title: post.title,
                  date: post.literalDate,
                  backgroundImageUrl: post.imageUrl,
                  templateImageUrl: templateConfig.templateImageUrl,
                  datePosition: templateConfig.datePosition,
                  titlePosition: templateConfig.titlePosition,
                  imagePlaceholder: templateConfig.imagePlaceholder,
                });

                console.timeEnd(label);
                return { ...post, generatedImageUrl };
              } catch (error) {
                console.timeEnd(label);
                console.error(`Failed to generate graphics for ${post.title}:`, error);
                return { ...post, generatedImageUrl: post.imageUrl };
              }
            })
          );

          // Append batch results to state so UI sees progress incrementally
          setState((prev) => ({ ...prev, posts: [...prev.posts, ...batchResults] }));

          // yield to event loop briefly to keep UI responsive
           
          await new Promise((r) => setTimeout(r, 30));

          idx += concurrency;
        }

        setState((prev) => ({ ...prev, loading: false, error: null }));
        console.timeEnd("generatePostsWithGraphics");
      } catch (error) {
        console.error("Error generating posts with graphics:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }));
      }
    },
    [templateConfig]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      posts: [],
      loading: false,
      error: null,
    });
  }, []);

  const refreshGraphics = useCallback(async () => {
    if (state.posts.length === 0) {
      setState((prev) => ({ ...prev, error: "No posts available to refresh" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Regenerate graphics for existing posts using current template config
      const refreshedPosts = await Promise.all(
        state.posts.map(async (post) => {
          try {
            const generatedImageUrl = await graphicsGenerator.generateHolidayPost({
              title: post.title,
              date: post.literalDate,
              backgroundImageUrl: post.imageUrl, // Use existing Unsplash image
              templateImageUrl: templateConfig.templateImageUrl,
              datePosition: templateConfig.datePosition,
              titlePosition: templateConfig.titlePosition,
              imagePlaceholder: templateConfig.imagePlaceholder,
            });

            return {
              ...post,
              generatedImageUrl,
            };
          } catch (error) {
            console.error(`Failed to refresh graphics for ${post.title}:`, error);
            return {
              ...post,
              generatedImageUrl: post.imageUrl, // Fallback to original image
            };
          }
        })
      );

      setState((prev) => ({
        ...prev,
        posts: refreshedPosts,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error refreshing graphics:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [state.posts, templateConfig]);

  const updatePost = useCallback((updatedPost: GeneratedPostWithGraphics) => {
    console.log("updatePost called with:", updatedPost);
    setState((prev) => {
      const newPosts = prev.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post));
      console.log("Updated posts:", newPosts);
      return {
        ...prev,
        posts: newPosts,
      };
    });
  }, []);

  return {
    state,
    generatePostsWithGraphics,
    refreshGraphics,
    clearError,
    resetState,
    templateConfig,
    setTemplateConfig,
    updatePost,
  };
};
