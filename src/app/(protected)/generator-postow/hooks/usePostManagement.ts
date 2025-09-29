import { useState, useCallback } from "react";
import { EducationalPost } from "../types";
import { useUnsplashPhotos } from "@/hooks/useUnsplash";
import { useOpenAIChat } from "@/hooks/useOpenAi";
import { createNewPost, generateAIPrompt } from "../utils";

/**
 * Custom hook for managing posts and AI content generation
 */
export function usePostManagement() {
  const { generateImageForPost, fetchPhotosByTag } = useUnsplashPhotos();
  const { promptOpenAi, loading: aiLoading } = useOpenAIChat();
  const [posts, setPosts] = useState<EducationalPost[]>([]);

  /**
   * Generate AI content for a new post
   */
  const generateContent = useCallback(
    async (topic: string): Promise<string> => {
      if (!topic.trim()) return "";

      const prompt = generateAIPrompt(topic);
      try {
        const response = await promptOpenAi(prompt);
        return response;
      } catch (error) {
        console.error("Error generating content:", error);
        return "";
      }
    },
    [promptOpenAi]
  );

  /**
   * Create a new post with AI content and image
   */
  const createPost = useCallback(
    async (topic: string, generatedContent: string): Promise<EducationalPost> => {
      const newPost = createNewPost(topic, generatedContent);

      // Generate image for the new post using multiple tags
      try {
        const tags = [newPost.tag, topic, "education", "health", "awareness"];
        const imageUrl = await generateImageForPost(tags, "education");
        if (imageUrl) {
          newPost.imageUrl = imageUrl;
        }
      } catch (error) {
        console.error("Error generating image:", error);
      }

      setPosts((prev) => [...prev, newPost]);
      return newPost;
    },
    [generateImageForPost]
  );

  /**
   * Refetch image for a specific post
   */
  const refetchImage = useCallback(
    async (postId: string, tag: string): Promise<string | null> => {
      try {
        // Try multiple tags for better image selection
        const tags = [tag, "education", "health", "awareness"];
        const imageUrl = await generateImageForPost(tags, "education");
        if (imageUrl) {
          setPosts((prev) => prev.map((post) => (post.id.toString() === postId ? { ...post, imageUrl } : post)));
          return imageUrl;
        }
      } catch (error) {
        console.error("Error refetching image:", error);
      }
      return null;
    },
    [generateImageForPost]
  );

  /**
   * Toggle favorite status for a post
   */
  const toggleFavorite = useCallback((postId: number) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post)));
  }, []);

  /**
   * Update a post
   */
  const updatePost = useCallback((updatedPost: EducationalPost) => {
    setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  }, []);

  /**
   * Delete a post
   */
  const deletePost = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  }, []);

  /**
   * Get posts by favorite status
   */
  const getFavoritePosts = useCallback(() => {
    return posts.filter((post) => post.isFavorite);
  }, [posts]);

  /**
   * Get posts by platform
   */
  const getPostsByPlatform = useCallback(
    (platform: EducationalPost["platform"]) => {
      return posts.filter((post) => post.platform === platform);
    },
    [posts]
  );

  /**
   * Generate multiple image options for a post
   */
  const generateImageOptions = useCallback(
    async (tag: string, count: number = 5): Promise<string[]> => {
      try {
        const photos = await fetchPhotosByTag(tag, count, {
          orientation: "landscape",
          size: "regular",
        });
        return photos.map((photo) => photo.urls.regular);
      } catch (error) {
        console.error("Error generating image options:", error);
        return [];
      }
    },
    [fetchPhotosByTag]
  );

  return {
    posts,
    aiLoading,
    actions: {
      generateContent,
      createPost,
      refetchImage,
      toggleFavorite,
      updatePost,
      deletePost,
      getFavoritePosts,
      getPostsByPlatform,
      generateImageOptions,
    },
  };
}
