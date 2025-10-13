import type { Holiday, EducationalHolidayWithQuery, Post } from "../types";

/**
 * Create prompt for extracting health-related holidays
 */
export const createHealthHolidaysPrompt = (holidays: Holiday[]): string => {
  const holidaysList = holidays.map((h) => `${h.date} - ${h.name}`).join("\n");

  return `Proszę wyodrębnić tylko tematy związane ze zdrowiem z poniższej listy nietypowych świąt.

Format JSON:

  holidays: [ 
  {
    "id": 1,
    "title": "Nazwa święta",
    "description": "Krótki opis święta",
    "query": "fraza do wyszukiwania obrazów w Unsplash"
    "literalDate": "data święta w formacie dd MMMM, np. 31 Maj",
    "dateForThisYear": "data święta w formacie RRRR-MM-DD, np. 2025-05-31"
  },
  ...
  ]

Każdy obiekt święta powinien zawierać:
- id: unikalny numer święta (liczba całkowita)
- title: nazwa święta (string)
- description: krótki opis święta (string)
- query: fraza do wyszukiwania obrazów w Unsplash (string) po angielsku
- literalDate: data święta w formacie dd MMMM, np. 31 Maj (string)
- dateForThisYear: data święta w formacie RRRR-MM-DD, np. 2025-05-31 (string)

Maksymalnie 10 świąt.

Lista świąt:
${holidaysList}`;
};

/**
 * Create prompt for generating social media posts
 */
export const createPostsPrompt = (holidays: EducationalHolidayWithQuery[]): string => {
  const holidaysList = holidays.map((h) => `${h.title} - ${h.dateForThisYear}`).join("\n, ");

  return `Dla każdego wybranego święta wygeneruj krótki post na social media (max 280 znaków).

Lista świąt:
${holidaysList}

Użyj emoji w poście.
Użyj języka polskiego.
Użyj przyjaznego, ale profesjonalnego tonu.
Unikaj powtarzania tych samych fraz w różnych postach.
Każdy post powinien być unikalny i dostosowany do tematu święta.
Każdy post powinien zawierać wezwanie do działania (call to action).

Format JSON:

  holidays_posts: [ 
  {
    "text": "Treść posta z emoji i wezwaniem do działania (max 280 znaków)",
    "imageUrl": "",
    "tags": "tagi do posta, oddzielone przecinkami, angielskie",
    "postingTime": "czas publikacji w formacie 2025-MM-DD HH:MM"
  },
  ...
  ]`;
};

/**
 * Parse OpenAI response for holidays
 */
export const parseHolidaysResponse = (result: string): EducationalHolidayWithQuery[] => {
  try {
    let parsed: EducationalHolidayWithQuery[] = [];

    // Try to parse as JSON
    const jsonResult = JSON.parse(result || "[]");

    // Handle different response formats
    if (Array.isArray(jsonResult)) {
      parsed = jsonResult;
    } else if (jsonResult && typeof jsonResult === "object" && "holidays" in jsonResult) {
      parsed = jsonResult.holidays as EducationalHolidayWithQuery[];
    } else {
      throw new Error("Invalid response format");
    }

    // Validate parsed data
    if (!Array.isArray(parsed)) {
      throw new Error("Parsed data is not an array");
    }

    // Validate each holiday object
    for (const holiday of parsed) {
      if (
        typeof holiday.id !== "number" ||
        typeof holiday.title !== "string" ||
        typeof holiday.description !== "string" ||
        typeof holiday.query !== "string" ||
        typeof holiday.literalDate !== "string" ||
        typeof holiday.dateForThisYear !== "string"
      ) {
        throw new Error("Invalid holiday format");
      }
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing holidays response:", error);
    throw new Error("Failed to parse holidays response");
  }
};

/**
 * Parse OpenAI response for posts
 */
export const parsePostsResponse = (result: string): Post[] => {
  try {
    let parsedPosts: Post[] = [];

    // Try to parse as JSON
    const jsonResult = JSON.parse(result || "[]");

    // Handle different response formats
    if (Array.isArray(jsonResult)) {
      parsedPosts = jsonResult;
    } else if (jsonResult && typeof jsonResult === "object" && "holidays_posts" in jsonResult) {
      parsedPosts = jsonResult.holidays_posts as Post[];
    } else {
      throw new Error("Invalid response format");
    }

    // Validate parsed data
    if (!Array.isArray(parsedPosts)) {
      throw new Error("Parsed posts is not an array");
    }

    // Validate each post object
    for (const post of parsedPosts) {
      if (
        typeof post.text !== "string" ||
        typeof post.imageUrl !== "string" ||
        typeof post.tags !== "string" ||
        typeof post.postingTime !== "string"
      ) {
        throw new Error("Invalid post format");
      }
    }

    return parsedPosts;
  } catch (error) {
    console.error("Error parsing posts response:", error);
    throw new Error("Failed to parse posts response");
  }
};
