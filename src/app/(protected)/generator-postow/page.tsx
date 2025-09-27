"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import {
  usePostGenerator,
  usePostManagement,
  PostTabs,
  NewPostForm,
  PostEditDialog,
  PostPreviewDialog,
  PostGrid,
  initialPosts,
  EducationalPost,
} from "./";

/**
 * Main page component for the enhanced post generator
 */
export default function PostGeneratorPage() {
  // Custom hooks for state management
  const { state, actions } = usePostGenerator();
  const { posts, aiLoading, actions: postActions } = usePostManagement();

  // Local state for posts
  const [educationalPostsState, setEducationalPostsState] = useState<EducationalPost[]>(initialPosts);

  /**
   * Handles fetching images for all posts and displaying cards
   */
  const handleShowCards = async () => {
    // Fetch images for all posts in parallel
    const updatedPosts = await Promise.all(
      educationalPostsState.map(async (post) => {
        const imageUrl = await postActions.refetchImage(post.id.toString(), post.tag);
        return { ...post, imageUrl: imageUrl || post.imageUrl };
      })
    );

    setEducationalPostsState(updatedPosts);
    actions.showCards();
  };

  /**
   * Refetches a photo for a specific post
   */
  const refetchPhoto = async (postId: string, tag: string, updateImageUrl: (url: string) => void) => {
    const imageUrl = await postActions.refetchImage(postId, tag);
    if (imageUrl) {
      updateImageUrl(imageUrl);
      setEducationalPostsState((prevPosts) =>
        prevPosts.map((post) =>
          post.id.toString() === postId ? { ...post, imageUrl } : post
        )
      );
    }
  };

  /**
   * Generates AI content for a new post
   */
  const handleGenerateContent = async () => {
    if (!state.newPostTopic.trim()) return;

    const content = await postActions.generateContent(state.newPostTopic);
    actions.setGeneratedContent(content);
  };

  /**
   * Creates a new post from generated content
   */
  const handleCreatePost = async () => {
    if (!state.generatedContent) return;

    const newPost = await postActions.createPost(state.newPostTopic, state.generatedContent);
    setEducationalPostsState((prev) => [...prev, newPost]);
    actions.addToHistory(newPost);
    actions.setNewPostTopic("");
    actions.setGeneratedContent("");
  };

  /**
   * Handles post editing
   */
  const handleEditPost = (post: EducationalPost) => {
    actions.selectPost(post);
    actions.toggleEditDialog();
  };

  /**
   * Handles post preview
   */
  const handlePreviewPost = (post: EducationalPost) => {
    actions.selectPost(post);
    actions.togglePreviewDialog();
  };

  /**
   * Handles favorite toggle
   */
  const handleToggleFavorite = (postId: number) => {
    actions.toggleFavorite(postId);
    setEducationalPostsState((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
      )
    );
  };

  /**
   * Handles post save
   */
  const handleSavePost = (updatedPost: EducationalPost) => {
    postActions.updatePost(updatedPost);
    setEducationalPostsState((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  /**
   * Handles post download
   */
  const handleDownloadPost = () => {
    // TODO: Implement download functionality
    console.log("Download post:", state.selectedPost);
  };

  // Get favorite posts
  const favoritePosts = educationalPostsState.filter((post) => post.isFavorite);

  const containerStyle = {
    maxWidth: 1200,
    margin: "40px auto",
    padding: 3,
    background: "#fff",
    borderRadius: 3,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  };

  const headerStyle = {
    textAlign: "center" as const,
    marginBottom: 3,
    fontSize: 32,
    fontWeight: "bold",
    color: "#1976d2",
  };

  return (
    <Box sx={containerStyle}>
      <Typography variant="h3" sx={headerStyle}>
        Generator Postów Edukacyjnych
      </Typography>

      <PostTabs activeTab={state.activeTab} onTabChange={actions.setActiveTab} />

      {/* Tab 0: Create New Post */}
      {state.activeTab === 0 && (
        <NewPostForm
          newPostTopic={state.newPostTopic}
          generatedContent={state.generatedContent}
          aiLoading={aiLoading}
          onTopicChange={actions.setNewPostTopic}
          onGenerateContent={handleGenerateContent}
          onCreatePost={handleCreatePost}
        />
      )}

      {/* Tab 1: My Posts */}
      {state.activeTab === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">Moje posty ({educationalPostsState.length})</Typography>
            <Button variant="contained" onClick={handleShowCards} startIcon={<ImageIcon />}>
              Pokaż posty
            </Button>
          </Box>

          {state.showCards && (
            <PostGrid
              posts={educationalPostsState}
              title="Moje posty"
              emptyMessage="Brak postów do wyświetlenia"
              onRefetchImage={refetchPhoto}
              onEdit={handleEditPost}
              onPreview={handlePreviewPost}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </Box>
      )}

      {/* Tab 2: History */}
      {state.activeTab === 2 && (
        <PostGrid
          posts={state.postHistory}
          title="Historia postów"
          emptyMessage="Brak postów w historii"
          onRefetchImage={refetchPhoto}
          onEdit={handleEditPost}
          onPreview={handlePreviewPost}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Tab 3: Favorites */}
      {state.activeTab === 3 && (
        <PostGrid
          posts={favoritePosts}
          title="Ulubione posty"
          emptyMessage="Brak ulubionych postów"
          onRefetchImage={refetchPhoto}
          onEdit={handleEditPost}
          onPreview={handlePreviewPost}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Edit Dialog */}
      <PostEditDialog
        open={state.showEditDialog}
        post={state.selectedPost}
        onClose={actions.toggleEditDialog}
        onSave={handleSavePost}
      />

      {/* Preview Dialog */}
      <PostPreviewDialog
        open={state.showPreviewDialog}
        post={state.selectedPost}
        onClose={actions.togglePreviewDialog}
        onDownload={handleDownloadPost}
      />
    </Box>
  );
}