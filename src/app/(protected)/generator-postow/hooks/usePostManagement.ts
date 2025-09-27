import { useState, useCallback } from "react";
import { EducationalPost } from "../types";
import { useUnsplashPhotos } from "@/hooks/useUnsplash";
import { useOpenAIChat } from "@/hooks/useOpenAi";
import { createNewPost, generateAIPrompt } from "../utils";

/**
 * Custom hook for managing posts and AI content generation
 */
export function usePostManagement() {
  const { fetchPhotoByTag } = useUnsplashPhotos();
  const { promptOpenAi, loading: aiLoading } = useOpenAIChat();
  const [posts, setPosts] = useState<EducationalPost[]>([]);

  /**
   * Generate AI content for a new post
   */
  const generateContent = useCallback(async (topic: string): Promise<string> => {
    if (!topic.trim()) return "";

    const prompt = generateAIPrompt(topic);
    try {
      const response = await promptOpenAi(prompt);
      return response;
    } catch (error) {
      console.error("Error generating content:", error);
      return "";
    }
  }, [promptOpenAi]);

  /**
   * Create a new post with AI content and image
   */
  const createPost = useCallback(async (topic: string, generatedContent: string): Promise<EducationalPost> => {
    const newPost = createNewPost(topic, generatedContent);

    // Fetch image for the new post
    try {
      const photo = await fetchPhotoByTag(newPost.tag);
      if (photo) {
        newPost.imageUrl = photo.urls.small;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    setPosts((prev) => [...prev, newPost]);
    return newPost;
  }, [fetchPhotoByTag]);

  /**
   * Refetch image for a specific post
   */
  const refetchImage = useCallback(async (postId: string, tag: string): Promise<string | null> => {
    try {
      const photo = await fetchPhotoByTag(tag);
      if (photo) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id.toString() === postId ? { ...post, imageUrl: photo.urls.small } : post
          )
        );
        return photo.urls.small;
      }
    } catch (error) {
      console.error("Error refetching image:", error);
    }
    return null;
  }, [fetchPhotoByTag]);

  /**
   * Toggle favorite status for a post
   */
  const toggleFavorite = useCallback((postId: number) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post))
    );
  }, []);

  /**
   * Update a post
   */
  const updatePost = useCallback((updatedPost: EducationalPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
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
  const getPostsByPlatform = useCallback((platform: EducationalPost["platform"]) => {
    return posts.filter((post) => post.platform === platform);
  }, [posts]);

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
    },
  };
}
