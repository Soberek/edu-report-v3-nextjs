/**
 * Interface for educational post data structure
 */
export interface EducationalPost {
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
 * Post template configuration
 */
export interface PostTemplate {
  id: string;
  name: string;
  description: string;
}

/**
 * State type for the UI visibility reducer
 */
export interface PostGeneratorState {
  showCards: boolean;
  activeTab: number;
  selectedPost: EducationalPost | null;
  showEditDialog: boolean;
  showPreviewDialog: boolean;
  newPostTopic: string;
  generatedContent: string;
  postHistory: EducationalPost[];
}

/**
 * Action types for the UI reducer
 */
export type PostGeneratorAction =
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
 * Props for EducationalPostCard component
 */
export interface EducationalPostCardProps {
  post: EducationalPost;
  imageUrl?: string;
  imageId: string;
  onRefetchImage: (postId: string, tag: string, updateImageUrl: (url: string) => void) => void;
  onEdit: (post: EducationalPost) => void;
  onPreview: (post: EducationalPost) => void;
  onToggleFavorite: (postId: number) => void;
}

/**
 * Props for PostTabs component
 */
export interface PostTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

/**
 * Props for NewPostForm component
 */
export interface NewPostFormProps {
  newPostTopic: string;
  generatedContent: string;
  aiLoading: boolean;
  onTopicChange: (topic: string) => void;
  onGenerateContent: () => void;
  onCreatePost: () => void;
}

/**
 * Props for PostEditDialog component
 */
export interface PostEditDialogProps {
  open: boolean;
  post: EducationalPost | null;
  onClose: () => void;
  onSave: (post: EducationalPost) => void;
}

/**
 * Props for PostPreviewDialog component
 */
export interface PostPreviewDialogProps {
  open: boolean;
  post: EducationalPost | null;
  onClose: () => void;
  onDownload: () => void;
}
