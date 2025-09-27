"use client";

import React, { useReducer, useState, useEffect } from "react";
import { useUnsplashPhotos } from "@/hooks/useUnsplash";
import { useOpenAIChat } from "@/hooks/useOpenAi";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from "@mui/material";
import { Refresh, Download, Share, Favorite, Edit, TextFields, Image as ImageIcon, Save, History } from "@mui/icons-material";

/**
 * Interface for educational post data structure
 */
interface EducationalPost {
  id: number;
  title: string;
  description: string;
  content: string;
  query: string;
  tag: string;
  imageUrl: string;
  template: string;
  textOverlay: {
    enabled: boolean;
    text: string;
    position: "top" | "center" | "bottom";
    color: string;
    fontSize: number;
    fontWeight: "normal" | "bold";
  };
  styling: {
    backgroundColor: string;
    borderRadius: number;
    padding: number;
  };
  platform: "instagram" | "facebook" | "twitter" | "linkedin";
  createdAt: Date;
  isFavorite: boolean;
}

/**
 * Post templates
 */
const postTemplates = [
  { id: "minimal", name: "Minimal", description: "Clean and simple design" },
  { id: "modern", name: "Modern", description: "Contemporary with gradients" },
  { id: "classic", name: "Classic", description: "Traditional educational style" },
  { id: "vibrant", name: "Vibrant", description: "Colorful and energetic" },
];

/**
 * Initial posts data
 */
const educationalPosts: EducationalPost[] = [
  {
    id: 1,
    title: "Światowy Dzień bez Tytoniu",
    description: "Edukacja na temat szkodliwości palenia tytoniu",
    content:
      "31 maja obchodzimy Światowy Dzień bez Tytoniu. To doskonała okazja, aby przypomnieć o szkodliwych skutkach palenia i zachęcić do zdrowego stylu życia.",
    query: "no tobacco day, no smoking, smoke free, health",
    tag: "no tobacco day",
    imageUrl: "",
    template: "modern",
    textOverlay: {
      enabled: true,
      text: "Światowy Dzień bez Tytoniu",
      position: "top",
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
    },
    styling: {
      backgroundColor: "#f8f9fa",
      borderRadius: 12,
      padding: 16,
    },
    platform: "instagram",
    createdAt: new Date(),
    isFavorite: false,
  },
  {
    id: 2,
    title: "Dzień Ziemi",
    description: "Świadomość ekologiczna i ochrona środowiska",
    content:
      "22 kwietnia to Dzień Ziemi - czas, w którym szczególnie myślimy o naszej planecie i tym, jak możemy ją chronić. Każdy z nas może przyczynić się do lepszej przyszłości.",
    query: "earth day, nature, environment, sustainability",
    tag: "earth day",
    imageUrl: "",
    template: "vibrant",
    textOverlay: {
      enabled: true,
      text: "Dzień Ziemi",
      position: "center",
      color: "#2e7d32",
      fontSize: 28,
      fontWeight: "bold",
    },
    styling: {
      backgroundColor: "#e8f5e8",
      borderRadius: 16,
      padding: 20,
    },
    platform: "facebook",
    createdAt: new Date(),
    isFavorite: false,
  },
];

/**
 * State type for the UI visibility reducer
 */
type State = {
  showCards: boolean;
  activeTab: number;
  selectedPost: EducationalPost | null;
  showEditDialog: boolean;
  showPreviewDialog: boolean;
  newPostTopic: string;
  generatedContent: string;
  postHistory: EducationalPost[];
};

/**
 * Action types for the UI reducer
 */
type Action =
  | { type: "SHOW_CARDS" }
  | { type: "HIDE_CARDS" }
  | { type: "SET_ACTIVE_TAB"; tab: number }
  | { type: "SELECT_POST"; post: EducationalPost | null }
  | { type: "TOGGLE_EDIT_DIALOG" }
  | { type: "TOGGLE_PREVIEW_DIALOG" }
  | { type: "SET_NEW_POST_TOPIC"; topic: string }
  | { type: "SET_GENERATED_CONTENT"; content: string }
  | { type: "ADD_TO_HISTORY"; post: EducationalPost }
  | { type: "TOGGLE_FAVORITE"; postId: number };

/**
 * Reducer function to handle UI visibility state
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SHOW_CARDS":
      return { ...state, showCards: true };
    case "HIDE_CARDS":
      return { ...state, showCards: false };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.tab };
    case "SELECT_POST":
      return { ...state, selectedPost: action.post };
    case "TOGGLE_EDIT_DIALOG":
      return { ...state, showEditDialog: !state.showEditDialog };
    case "TOGGLE_PREVIEW_DIALOG":
      return { ...state, showPreviewDialog: !state.showPreviewDialog };
    case "SET_NEW_POST_TOPIC":
      return { ...state, newPostTopic: action.topic };
    case "SET_GENERATED_CONTENT":
      return { ...state, generatedContent: action.content };
    case "ADD_TO_HISTORY":
      return { ...state, postHistory: [action.post, ...state.postHistory] };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        postHistory: state.postHistory.map((post) => (post.id === action.postId ? { ...post, isFavorite: !post.isFavorite } : post)),
      };
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
  onEdit,
  onPreview,
  onToggleFavorite,
}: {
  post: EducationalPost;
  imageUrl?: string;
  imageId: string;
  onRefetchImage: (postId: string, tag: string, updateImageUrl: (url: string) => void) => void;
  onEdit: (post: EducationalPost) => void;
  onPreview: (post: EducationalPost) => void;
  onToggleFavorite: (postId: number) => void;
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

  const getTemplateStyle = (template: string) => {
    switch (template) {
      case "minimal":
        return { backgroundColor: "#ffffff", border: "1px solid #e0e0e0" };
      case "modern":
        return {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        };
      case "classic":
        return { backgroundColor: "#f5f5f5", border: "2px solid #333" };
      case "vibrant":
        return {
          background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
          color: "white",
        };
      default:
        return { backgroundColor: "#ffffff" };
    }
  };

  return (
    <Card
      sx={{
        ...cardStyle,
        ...getTemplateStyle(post.template),
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Chip label={post.platform} size="small" color="primary" variant="outlined" />
          <Box>
            <IconButton size="small" onClick={() => onToggleFavorite(post.id)} color={post.isFavorite ? "error" : "default"}>
              <Favorite />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(post)}>
              <Edit />
            </IconButton>
            <IconButton size="small" onClick={() => onPreview(post)}>
              <ImageIcon />
            </IconButton>
          </Box>
        </Box>

        {localImageUrl && (
          <Box sx={{ position: "relative", mb: 2 }}>
            <img
              src={`${localImageUrl}?w=400&h=200`}
              alt={post.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {post.textOverlay.enabled && (
              <Box
                sx={{
                  position: "absolute",
                  [post.textOverlay.position]: "16px",
                  left: "16px",
                  right: "16px",
                  textAlign: "center",
                  color: post.textOverlay.color,
                  fontSize: post.textOverlay.fontSize,
                  fontWeight: post.textOverlay.fontWeight,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {post.textOverlay.text}
              </Box>
            )}
          </Box>
        )}

        <Typography variant="h6" sx={titleStyle}>
          {post.title}
        </Typography>
        <Typography variant="body2" sx={descStyle} paragraph>
          {post.description}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
          {post.content}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button size="small" startIcon={<Refresh />} onClick={handleRefetch} variant="outlined">
            Nowe zdjęcie
          </Button>
          <Button size="small" startIcon={<Download />} variant="outlined">
            Pobierz
          </Button>
          <Button size="small" startIcon={<Share />} variant="outlined">
            Udostępnij
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Main page component for Unsplash educational content
 */
export default function OpenAiTestingPage() {
  // Custom hooks
  const { photos, loading, fetchPhotoByTag } = useUnsplashPhotos();
  const { promptOpenAi, loading: aiLoading } = useOpenAIChat();

  // UI state management with reducer
  const [state, dispatch] = useReducer(reducer, {
    showCards: false,
    activeTab: 0,
    selectedPost: null,
    showEditDialog: false,
    showPreviewDialog: false,
    newPostTopic: "",
    generatedContent: "",
    postHistory: [],
  });

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

  /**
   * Generates AI content for a new post
   */
  const handleGenerateContent = async () => {
    if (!state.newPostTopic.trim()) return;

    const prompt = `Napisz edukacyjny post na temat: "${state.newPostTopic}". 
    Post powinien być:
    - Informacyjny i edukacyjny
    - Napisany w języku polskim
    - Mający 2-3 akapity
    - Zawierający praktyczne informacje
    - Zachęcający do dalszego poznawania tematu
    
    Format odpowiedzi:
    Tytuł: [tytuł posta]
    Opis: [krótki opis w 1-2 zdaniach]
    Treść: [główna treść posta]`;

    try {
      const response = await promptOpenAi(prompt);
      dispatch({ type: "SET_GENERATED_CONTENT", content: response });
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  /**
   * Creates a new post from generated content
   */
  const handleCreatePost = async () => {
    if (!state.generatedContent) return;

    // Parse the generated content
    const lines = state.generatedContent.split("\n");
    const title =
      lines
        .find((line) => line.startsWith("Tytuł:"))
        ?.replace("Tytuł:", "")
        .trim() || state.newPostTopic;
    const description =
      lines
        .find((line) => line.startsWith("Opis:"))
        ?.replace("Opis:", "")
        .trim() || "";
    const content =
      lines
        .find((line) => line.startsWith("Treść:"))
        ?.replace("Treść:", "")
        .trim() || state.generatedContent;

    const newPost: EducationalPost = {
      id: Date.now(),
      title,
      description,
      content,
      query: `${state.newPostTopic}, education, health, awareness`,
      tag: state.newPostTopic.toLowerCase().replace(/\s+/g, " "),
      imageUrl: "",
      template: "modern",
      textOverlay: {
        enabled: true,
        text: title,
        position: "top",
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
      },
      styling: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
      },
      platform: "instagram",
      createdAt: new Date(),
      isFavorite: false,
    };

    // Fetch image for the new post
    const photo = await fetchPhotoByTag(newPost.tag);
    if (photo) {
      newPost.imageUrl = photo.urls.small;
    }

    setEducationalPostsState((prev) => [...prev, newPost]);
    dispatch({ type: "ADD_TO_HISTORY", post: newPost });
    dispatch({ type: "SET_NEW_POST_TOPIC", topic: "" });
    dispatch({ type: "SET_GENERATED_CONTENT", content: "" });
  };

  /**
   * Handles post editing
   */
  const handleEditPost = (post: EducationalPost) => {
    dispatch({ type: "SELECT_POST", post });
    dispatch({ type: "TOGGLE_EDIT_DIALOG" });
  };

  /**
   * Handles post preview
   */
  const handlePreviewPost = (post: EducationalPost) => {
    dispatch({ type: "SELECT_POST", post });
    dispatch({ type: "TOGGLE_PREVIEW_DIALOG" });
  };

  /**
   * Handles favorite toggle
   */
  const handleToggleFavorite = (postId: number) => {
    dispatch({ type: "TOGGLE_FAVORITE", postId });
    setEducationalPostsState((prev) => prev.map((post) => (post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post)));
  };

  return (
    <Box sx={containerStyle}>
      <Typography variant="h3" sx={headerStyle}>
        Generator Postów Edukacyjnych
      </Typography>

      <Tabs value={state.activeTab} onChange={(_, newValue) => dispatch({ type: "SET_ACTIVE_TAB", tab: newValue })} sx={{ mb: 3 }}>
        <Tab label="Nowy Post" icon={<TextFields />} />
        <Tab label="Moje Posty" icon={<ImageIcon />} />
        <Tab label="Historia" icon={<History />} />
        <Tab label="Ulubione" icon={<Favorite />} />
      </Tabs>

      {/* Tab 0: Create New Post */}
      {state.activeTab === 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Stwórz nowy post edukacyjny
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Temat posta"
              value={state.newPostTopic}
              onChange={(e) => dispatch({ type: "SET_NEW_POST_TOPIC", topic: e.target.value })}
              placeholder="np. Zdrowy styl życia, Ekologia, Edukacja..."
            />
            <Button
              variant="contained"
              onClick={handleGenerateContent}
              disabled={!state.newPostTopic.trim() || aiLoading}
              startIcon={<TextFields />}
            >
              {aiLoading ? "Generuję..." : "Generuj treść"}
            </Button>
          </Box>

          {state.generatedContent && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Wygenerowana treść:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
                  {state.generatedContent}
                </Typography>
                <Button variant="contained" onClick={handleCreatePost} startIcon={<Save />}>
                  Stwórz post
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Tab 1: My Posts */}
      {state.activeTab === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">Moje posty ({educationalPostsState.length})</Typography>
            <Button variant="contained" onClick={handleShowCards} disabled={loading} startIcon={<ImageIcon />}>
              {loading ? "Ładuję..." : "Pokaż posty"}
            </Button>
          </Box>

          {state.showCards && (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
              {educationalPostsState.map((post) => (
                <Box key={post.id}>
                  <EducationalPostCard
                    post={post}
                    imageId={post.id.toString()}
                    imageUrl={post.imageUrl}
                    onRefetchImage={refetchPhoto}
                    onEdit={handleEditPost}
                    onPreview={handlePreviewPost}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Tab 2: History */}
      {state.activeTab === 2 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Historia postów ({state.postHistory.length})
          </Typography>
          {state.postHistory.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Brak postów w historii
            </Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
              {state.postHistory.map((post) => (
                <Box key={post.id}>
                  <EducationalPostCard
                    post={post}
                    imageId={post.id.toString()}
                    imageUrl={post.imageUrl}
                    onRefetchImage={refetchPhoto}
                    onEdit={handleEditPost}
                    onPreview={handlePreviewPost}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Tab 3: Favorites */}
      {state.activeTab === 3 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Ulubione posty ({educationalPostsState.filter((p) => p.isFavorite).length})
          </Typography>
          {educationalPostsState.filter((p) => p.isFavorite).length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Brak ulubionych postów
            </Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
              {educationalPostsState
                .filter((post) => post.isFavorite)
                .map((post) => (
                  <Box key={post.id}>
                    <EducationalPostCard
                      post={post}
                      imageId={post.id.toString()}
                      imageUrl={post.imageUrl}
                      onRefetchImage={refetchPhoto}
                      onEdit={handleEditPost}
                      onPreview={handlePreviewPost}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </Box>
                ))}
            </Box>
          )}
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={state.showEditDialog} onClose={() => dispatch({ type: "TOGGLE_EDIT_DIALOG" })} maxWidth="md" fullWidth>
        <DialogTitle>Edytuj post</DialogTitle>
        <DialogContent>
          {state.selectedPost && (
            <Box sx={{ mt: 2 }}>
              <TextField fullWidth label="Tytuł" value={state.selectedPost.title} sx={{ mb: 2 }} />
              <TextField fullWidth label="Opis" value={state.selectedPost.description} multiline rows={2} sx={{ mb: 2 }} />
              <TextField fullWidth label="Treść" value={state.selectedPost.content} multiline rows={4} sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Szablon</InputLabel>
                <Select value={state.selectedPost.template} label="Szablon">
                  {postTemplates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: "TOGGLE_EDIT_DIALOG" })}>Anuluj</Button>
          <Button variant="contained">Zapisz</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={state.showPreviewDialog} onClose={() => dispatch({ type: "TOGGLE_PREVIEW_DIALOG" })} maxWidth="sm" fullWidth>
        <DialogTitle>Podgląd posta</DialogTitle>
        <DialogContent>
          {state.selectedPost && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              {state.selectedPost.imageUrl && (
                <img
                  src={`${state.selectedPost.imageUrl}?w=400&h=400`}
                  alt={state.selectedPost.title}
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />
              )}
              <Typography variant="h5" sx={{ mb: 1 }}>
                {state.selectedPost.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {state.selectedPost.description}
              </Typography>
              <Typography variant="body2">{state.selectedPost.content}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: "TOGGLE_PREVIEW_DIALOG" })}>Zamknij</Button>
          <Button variant="contained" startIcon={<Download />}>
            Pobierz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Styles
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

const cardStyle = {
  borderRadius: 2,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
};

const titleStyle = {
  margin: "0 0 8px 0",
  fontWeight: "bold",
};

const descStyle = {
  margin: 0,
  color: "#666",
  lineHeight: 1.6,
};
