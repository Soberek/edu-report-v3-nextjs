import { EducationalPost } from "../types";

/**
 * Get template-specific styling for posts
 */
export const getTemplateStyle = (template: string) => {
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

/**
 * Parse AI-generated content into structured format
 */
export const parseGeneratedContent = (content: string, fallbackTopic: string) => {
  const lines = content.split("\n");
  const title =
    lines
      .find((line) => line.startsWith("Tytuł:"))
      ?.replace("Tytuł:", "")
      .trim() || fallbackTopic;
  const description =
    lines
      .find((line) => line.startsWith("Opis:"))
      ?.replace("Opis:", "")
      .trim() || "";
  const parsedContent =
    lines
      .find((line) => line.startsWith("Treść:"))
      ?.replace("Treść:", "")
      .trim() || content;

  return { title, description, content: parsedContent };
};

/**
 * Create a new post from topic and generated content
 */
export const createNewPost = (
  topic: string,
  generatedContent: string,
  imageUrl: string = ""
): EducationalPost => {
  const { title, description, content } = parseGeneratedContent(generatedContent, topic);

  return {
    id: Date.now(),
    title,
    description,
    content,
    query: `${topic}, education, health, awareness`,
    tag: topic.toLowerCase().replace(/\s+/g, " "),
    imageUrl,
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
};

/**
 * Generate AI prompt for educational content
 */
export const generateAIPrompt = (topic: string): string => {
  return `Napisz edukacyjny post na temat: "${topic}". 
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
};

/**
 * Filter posts by favorite status
 */
export const filterFavoritePosts = (posts: EducationalPost[]): EducationalPost[] => {
  return posts.filter((post) => post.isFavorite);
};

/**
 * Sort posts by creation date (newest first)
 */
export const sortPostsByDate = (posts: EducationalPost[]): EducationalPost[] => {
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generate unique ID for posts
 */
export const generatePostId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};
