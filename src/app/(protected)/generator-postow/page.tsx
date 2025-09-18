"use client";

import React, { useReducer, useState, useEffect } from "react";
import { useUnsplashPhotos } from "@/hooks/useUnsplash";
import { Button } from "@mui/material";

/**
 * Interface for educational post data structure
 */
interface EducationalPost {
  id: number;
  title: string;
  description: string;
  query: string;
  tag: string;
  imageUrl: string;
}

/**
 * Initial posts data
 */
const educationalPosts: EducationalPost[] = [
  {
    id: 1,
    title: "Światowy Dzień bez Tytoniu",
    description: "Przykład fetchowania obrazów z Unsplash na podstawie tagów.",
    query: "no tobacco day, no smoking, smoke free, health",
    tag: "no tobacco day",
    imageUrl: "",
  },
  {
    id: 2,
    title: "Dzień Ziemi",
    description: "Przykład fetchowania obrazów z Unsplash na podstawie tagów.",
    query: "earth day, nature, environment, sustainability",
    tag: "earth day",
    imageUrl: "",
  },
];

/**
 * State type for the UI visibility reducer
 */
type State = {
  showCards: boolean;
};

/**
 * Action types for the UI reducer
 */
type Action = { type: "SHOW_CARDS" } | { type: "HIDE_CARDS" };

/**
 * Reducer function to handle UI visibility state
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SHOW_CARDS":
      return { ...state, showCards: true };
    case "HIDE_CARDS":
      return { ...state, showCards: false };
    default:
      return state;
  }
}

/**
 * Component for displaying an educational post with an image
 */
function EducationalPostCard({
  post,
  imageUrl,
  imageId,
  onRefetchImage,
}: {
  post: EducationalPost;
  imageUrl?: string;
  imageId: string;
  onRefetchImage: (postId: string, tag: string, updateImageUrl: (url: string) => void) => void;
}) {
  // Local state for the image URL to enable individual updates
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);

  // Handler for refetching a specific image
  const handleRefetch = () => {
    onRefetchImage(post.id.toString(), post.tag, (newUrl: string) => {
      setLocalImageUrl(newUrl);
    });
  };

  // Update local state when props change
  useEffect(() => {
    setLocalImageUrl(imageUrl);
  }, [imageUrl]);

  return (
    <div style={cardStyle}>
      <div>Tag: {post.tag}</div>
      {localImageUrl && <img src={`${localImageUrl}?w=400&h=200`} alt={post.title} style={imageStyle} />}
      <h2 style={titleStyle}>{post.title}</h2>
      <p style={descStyle}>{post.description}</p>
      <Button onClick={handleRefetch}>Refetch Image</Button>
    </div>
  );
}

/**
 * Main page component for Unsplash educational content
 */
export default function OpenAiTestingPage() {
  // Custom hook for fetching Unsplash photos
  const { photos, loading, fetchPhotoByTag } = useUnsplashPhotos();

  // UI state management with reducer
  const [state, dispatch] = useReducer(reducer, { showCards: false });

  // Posts data state
  const [educationalPostsState, setEducationalPostsState] = useState(educationalPosts);

  /**
   * Handles fetching images for all posts and displaying cards
   */
  const handleShowCards = async () => {
    // Fetch images for all posts in parallel
    const updatedPosts = await Promise.all(
      educationalPostsState.map(async (post) => {
        const photo = await fetchPhotoByTag(post.tag);
        return { ...post, imageUrl: photo ? photo.urls.small : "" };
      })
    );

    setEducationalPostsState(updatedPosts);
    dispatch({ type: "SHOW_CARDS" });
  };

  /**
   * Refetches a photo for a specific post
   * @param postId - ID of the post to update
   * @param tag - Search tag for Unsplash
   * @param updateImageUrl - Callback to update local component state
   */
  const refetchPhoto = async (postId: string, tag: string, updateImageUrl: (url: string) => void) => {
    const photo = await fetchPhotoByTag(tag);

    if (photo) {
      // Update local component state
      updateImageUrl(photo.urls.small);

      // Update global posts state
      setEducationalPostsState((prevPosts) =>
        prevPosts.map((post) => (post.id.toString() === postId ? { ...post, imageUrl: photo.urls.small } : post))
      );
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Unsplash Educational Posts</h1>

      <Button onClick={handleShowCards} disabled={loading}>
        {loading ? "Loading..." : "Show Cards"}
      </Button>

      {state.showCards &&
        educationalPostsState.map((post) => (
          <EducationalPostCard
            key={post.id}
            post={post}
            imageId={post.id.toString()}
            imageUrl={post.imageUrl}
            onRefetchImage={refetchPhoto}
          />
        ))}
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  maxWidth: 600,
  margin: "40px auto",
  padding: 24,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 24,
  fontSize: 28,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
};

const imageStyle: React.CSSProperties = {
  width: "400px",
  height: "400px",
  objectFit: "cover",
  borderRadius: 8,
  marginBottom: 12,
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
};

const descStyle: React.CSSProperties = {
  margin: 0,
  color: "#555",
};
