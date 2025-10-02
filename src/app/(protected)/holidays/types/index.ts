// Base holiday interface
export interface Holiday {
  date: string;
  name: string;
  link: string;
}

// Educational holiday with query for Unsplash image fetching
export interface EducationalHolidayWithQuery {
  id: number;
  title: string;
  description: string;
  query: string;
  literalDate: string;
  dateForThisYear: string;
}

// Social media post interface
export interface Post {
  text: string;
  imageUrl: string;
  tags: string;
  postingTime: string;
}

// CSV row interface for Excel export
export interface CsvRow {
  id: number;
  title: string;
  description: string;
  query: string;
  date: string;
  name: string;
}

// Holidays state interface
export interface HolidaysState {
  holidays: Holiday[];
  separatedHolidaysFromOpenAi: EducationalHolidayWithQuery[];
  posts: Post[];
  loading: boolean;
  error: string | null;
}

// Holidays action types
export type HolidaysAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_HOLIDAYS"; payload: Holiday[] }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_POSTS"; payload: Post[] }
  | { type: "SET_SEPARATED_HOLIDAYS"; payload: EducationalHolidayWithQuery[] }
  | { type: "RESET_STATE" };

// API response types
export interface ScrapeHolidaysResponse {
  holidays: Holiday[];
  error?: string;
}

export interface OpenAIPromptOptions {
  response_format?: {
    type: "json_object";
  };
}

// Export operation types
export interface ExportOptions {
  filename?: string;
  format: "csv" | "xlsx";
}

export type TemplateTextAlign = "left" | "center" | "right";

export interface TemplateTextPosition {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  textAlign: TemplateTextAlign;
  maxWidth?: number;
  lineHeight?: number;
}

export interface TemplateImagePlaceholder {
  x: number;
  y: number;
  radius: number;
}

export interface TemplateCanvasSize {
  width: number;
  height: number;
}

export interface HolidayTemplateConfig {
  templateImageUrl: string;
  datePosition: TemplateTextPosition;
  titlePosition: TemplateTextPosition & { maxWidth: number; lineHeight: number };
  canvasSize: TemplateCanvasSize;
  imagePlaceholder: TemplateImagePlaceholder;
  postImagesUrl?: string;
}

export type TemplatePresetKey = "default" | "centered" | "rightAligned";

export interface ApiGeneratedPost {
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

export interface GeneratedPostWithGraphics extends EducationalHolidayWithQuery {
  text: string;
  imageUrl: string;
  generatedImageUrl: string;
  tags: string;
  postingTime: string;
}
