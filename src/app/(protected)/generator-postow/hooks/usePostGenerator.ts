import { useReducer } from "react";
import { PostGeneratorState, PostGeneratorAction, EducationalPost } from "../types";

/**
 * Initial state for the post generator
 */
const initialState: PostGeneratorState = {
  showCards: false,
  activeTab: 0,
  selectedPost: null,
  showEditDialog: false,
  showPreviewDialog: false,
  newPostTopic: "",
  generatedContent: "",
  postHistory: [],
};

/**
 * Reducer function to handle UI visibility state
 */
function postGeneratorReducer(state: PostGeneratorState, action: PostGeneratorAction): PostGeneratorState {
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
        postHistory: state.postHistory.map((post) =>
          post.id === action.postId ? { ...post, isFavorite: !post.isFavorite } : post
        ),
      };
    default:
      return state;
  }
}

/**
 * Custom hook for managing post generator state
 */
export function usePostGenerator() {
  const [state, dispatch] = useReducer(postGeneratorReducer, initialState);

  const showCards = () => dispatch({ type: "SHOW_CARDS" });
  const hideCards = () => dispatch({ type: "HIDE_CARDS" });
  const setActiveTab = (tab: number) => dispatch({ type: "SET_ACTIVE_TAB", tab });
  const selectPost = (post: EducationalPost | null) => dispatch({ type: "SELECT_POST", post });
  const toggleEditDialog = () => dispatch({ type: "TOGGLE_EDIT_DIALOG" });
  const togglePreviewDialog = () => dispatch({ type: "TOGGLE_PREVIEW_DIALOG" });
  const setNewPostTopic = (topic: string) => dispatch({ type: "SET_NEW_POST_TOPIC", topic });
  const setGeneratedContent = (content: string) => dispatch({ type: "SET_GENERATED_CONTENT", content });
  const addToHistory = (post: EducationalPost) => dispatch({ type: "ADD_TO_HISTORY", post });
  const toggleFavorite = (postId: number) => dispatch({ type: "TOGGLE_FAVORITE", postId });

  return {
    state,
    actions: {
      showCards,
      hideCards,
      setActiveTab,
      selectPost,
      toggleEditDialog,
      togglePreviewDialog,
      setNewPostTopic,
      setGeneratedContent,
      addToHistory,
      toggleFavorite,
    },
  };
}
