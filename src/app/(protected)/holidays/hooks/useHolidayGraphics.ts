import { useState, useCallback, useEffect } from "react";
import { graphicsGenerator } from "@/utils/graphicsGenerator";
import { TEMPLATE_CONFIG } from "../config/templateConfig";
import type { EducationalHolidayWithQuery } from "../types";

interface GeneratedPostWithGraphics {
  id: number;
  title: string;
  description: string;
  query: string;
  literalDate: string;
  dateForThisYear: string;
  text: string;
  imageUrl: string;
  generatedImageUrl: string;
  tags: string;
  postingTime: string;
}

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
    const savedConfig = localStorage.getItem('holidayTemplateConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setTemplateConfig(parsedConfig);
      } catch (error) {
        console.warn('Failed to parse saved template config:', error);
      }
    }
  }, []);

  const generatePostsWithGraphics = useCallback(async (holidays: EducationalHolidayWithQuery[]) => {
    if (holidays.length === 0) {
      setState(prev => ({ ...prev, error: "No holidays available to generate posts" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
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
      
      // Generate graphics for each post on the client side
      const postsWithGraphics = await Promise.all(
        data.posts.map(async (post: any) => {
          try {
            const generatedImageUrl = await graphicsGenerator.generateHolidayPost({
              title: post.title,
              date: post.literalDate,
              backgroundImageUrl: templateConfig.templateImageUrl ? post.imageUrl : post.imageUrl, // Always use Unsplash for image placeholder
              templateImageUrl: templateConfig.templateImageUrl,
              datePosition: templateConfig.datePosition,
              titlePosition: templateConfig.titlePosition,
              imagePlaceholder: templateConfig.imagePlaceholder
            });
            
            return {
              ...post,
              generatedImageUrl
            };
          } catch (error) {
            console.error(`Failed to generate graphics for ${post.title}:`, error);
            return {
              ...post,
              generatedImageUrl: post.imageUrl // Fallback to original image
            };
          }
        })
      );
      
      setState(prev => ({
        ...prev,
        posts: postsWithGraphics,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error generating posts with graphics:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
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
      setState(prev => ({ ...prev, error: "No posts available to refresh" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

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
              imagePlaceholder: templateConfig.imagePlaceholder
            });
            
            return {
              ...post,
              generatedImageUrl
            };
          } catch (error) {
            console.error(`Failed to refresh graphics for ${post.title}:`, error);
            return {
              ...post,
              generatedImageUrl: post.imageUrl // Fallback to original image
            };
          }
        })
      );
      
      setState(prev => ({
        ...prev,
        posts: refreshedPosts,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error refreshing graphics:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [state.posts, templateConfig]);

  const updatePost = useCallback((updatedPost: any) => {
    console.log("updatePost called with:", updatedPost);
    setState(prev => {
      const newPosts = prev.posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      console.log("Updated posts:", newPosts);
      return {
        ...prev,
        posts: newPosts
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
