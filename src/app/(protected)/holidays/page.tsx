"use client";
import React, { useReducer, useState } from "react";
import { useOpenAIChat } from "@/hooks/useOpenAi";
import * as XLSX from "xlsx";
import { ResponseDisplay } from "@/components/shared/response-display";
import { Button } from "@mui/material";

// Types
interface Holiday {
  date: string;
  name: string;
  link: string;
}

// Educational holiday with query so we can fetch image from Unsplash
interface EducationalHolidayWithQuery {
  id: number;
  title: string;
  description: string;
  query: string;
  literalDate: string;
  dateForThisYear: string;
}

interface Post {
  text: string;
  imageUrl: string;
  tags: string;
  postingTime: string;
}

interface HolidaysState {
  holidays: Holiday[];
  separatedHolidaysFromOpenAi: EducationalHolidayWithQuery[];
  posts: Post[];
  loading: boolean;
  error: string | null;
}

type HolidaysAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_HOLIDAYS"; payload: Holiday[] }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_POSTS"; payload: Post[] }
  | { type: "SET_SEPARATED_HOLIDAYS"; payload: EducationalHolidayWithQuery[] };

// Reducer
function holidaysReducer(state: HolidaysState, action: HolidaysAction): HolidaysState {
  console.log(action);
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_HOLIDAYS":
      return {
        ...state,
        holidays: action.payload,
        loading: false,
        error: null,
      };
    case "SET_POSTS":
      return { ...state, posts: action.payload, loading: false };
    case "SET_SEPARATED_HOLIDAYS":
      return {
        ...state,
        separatedHolidaysFromOpenAi: action.payload,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const UrlInput = ({ url, setUrl }: { url: string; setUrl: (url: string) => void }) => (
  <input
    className="w-full p-2 mb-4 border border-gray-300 rounded"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    placeholder="Wprowadź URL do scrapowania"
  />
);

// Main component
export default function Holidays() {
  // Step 1. Scrape holidays from kalbi.pl and save them to state
  // Step 2. Separate health-related holidays and save them to state
  // Step 3. Based on separated health-related holidays, generate social media posts using OpenAI API
  // Step 4 Buffer. Export posts to CSV file
  // Step 5 Canva. Export health-related holidays and generated posts to Excel file

  const [state, dispatch] = useReducer(holidaysReducer, {
    holidays: [],
    posts: [],
    separatedHolidaysFromOpenAi: [],

    loading: false,
    error: null,
  });

  // Hook for OpenAi separation
  const { loading, promptOpenAi } = useOpenAIChat();
  const [url, setUrl] = useState("https://www.kalbi.pl/kalendarz-swiat-nietypowych-pazdziernik");

  // Step 1. Scrape holidays from kalbi.pl and save them to state
  const fetchHolidays = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const res = await fetch("/api/scrape-holidays", {
        cache: "no-store",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: "SET_HOLIDAYS", payload: data.holidays });
      } else {
        dispatch({ type: "SET_ERROR", payload: data.error || "Unknown error" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Network error occurred" });
    }
  };

  // how json format looks like:

  // Step 2. Separate health-related holidays and save them to stat
  async function promptOpenAiForHealthHolidays() {
    const holidaysList = state.holidays.map((h) => `${h.date} - ${h.name}`).join("\n");
    const prompt = `Proszę wyodrębnić tylko tematy związane ze zdrowiem z poniższej listy nietypowych świąt.

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

    try {
      /* returns json string as:
      [
        {
          "id": 1,
          "title": "Światowy Dzień bez Tytoniu",
          "description": "Przykład fetchowania obrazów z Unsplash na podstawie tagów.",
          "query": "no tobacco day",
          "literalDate": "31 Maj",
          "dateForThisYear": "2025-05-31"

        },
      ]
      */
      const result = await promptOpenAi(prompt, { response_format: { type: "json_object" } });
      console.log("OpenAI Raw Result:", result);

      let parsed: EducationalHolidayWithQuery[] = [];

      parsed = JSON.parse(result || "[]");

      // If the response is wrapped in an object with a "holidays" key
      if (Array.isArray(result)) {
        parsed = result;
      } else if (parsed && typeof parsed === "object" && "holidays" in parsed) {
        parsed = parsed.holidays as EducationalHolidayWithQuery[];
      }

      // Validate parsed data
      if (!Array.isArray(parsed)) {
        throw new Error("Parsed data is not an array");
      }

      console.log("Parsed Holidays from OpenAI:", parsed);

      dispatch({ type: "SET_SEPARATED_HOLIDAYS", payload: parsed });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: "Error parsing holidays" });
    }
  }

  // Step 3. Based on separated health-related holidays, generate social media posts using OpenAI API
  const createPosts = async () => {
    const prompt = `Dla każdego wybranego święta wygeneruj krótki post na social media (max 280 znaków).

    Lista świąt:
    ${state.separatedHolidaysFromOpenAi.map((h) => `${h.title} - ${h.dateForThisYear}`).join("\n, ")}

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

    console.log("Sending prompt to OpenAI:", prompt);
    const result = await promptOpenAi(prompt, { response_format: { type: "json_object" } });

    console.log("Generated Posts from OpenAI:", result);

    // try to parse JSON and validate it
    let parsedPosts: Post[] = [];
    try {
      parsedPosts = JSON.parse(result || "[]");

      // If the response is wrapped in an object with a "holidays_posts" key
      if (parsedPosts && typeof parsedPosts === "object" && "holidays_posts" in parsedPosts) {
        parsedPosts = (parsedPosts as { holidays_posts: Post[] }).holidays_posts;
      }

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

      console.log("Validated Parsed Posts:", parsedPosts);
    } catch (err) {
      console.error("Error parsing posts JSON:", err);
      dispatch({ type: "SET_ERROR", payload: "Error parsing posts" });
      return;
    }

    dispatch({ type: "SET_POSTS", payload: parsedPosts });
  };
  // Step 4 Buffer. Export posts to CSV file
  const extractToCSVFileAndDownload = (posts: Post[]) => {
    try {
      const csvRows: string[][] = [];

      // Header
      csvRows.push(["Text", "Image URL", "Tags", "Posting Time"]);

      // Data rows
      for (const post of posts) {
        csvRows.push([post.text, post.imageUrl, post.tags, post.postingTime]);
      }

      // Convert to CSV string
      const csvOutput = csvRows.map((row) => row.map((item) => `"${item.replace(/"/g, '""')}"`).join(",")).join("\n");

      // Create a blob and trigger download

      const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `health_holidays_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return csvRows;
    } catch (error) {
      console.error("Error parsing CSV:", error);
      return [];
    }
  };

  interface CsvRow {
    id: number;
    title: string;
    description: string;
    query: string;
    date: string;
    name: string;
  }
  // Step 5 Canva. Export health-related holidays and generated posts to Excel file
  function exportHolidaysToExcel() {
    /*
    File structure from OpenAi:
    ```csv
    Data;Nazwa święta
    4 Wrzesień;Światowy Dzień Zdrowia Seksualnego
    8 Wrzesień;Światowy Dzień Wellbeingu
    */
    // Handle both parsed array (EducationalHolidayWithQuery[]) and fallback CSV string

    const csvRows: CsvRow[] = [];

    if (!Array.isArray(state.separatedHolidaysFromOpenAi) && typeof state.separatedHolidaysFromOpenAi === "string") {
      dispatch({ type: "SET_ERROR", payload: "No holidays to export" });
      return;
    }

    // Map the array returned by OpenAI into rows for Excel
    for (const h of state.separatedHolidaysFromOpenAi) {
      csvRows.push({
        id: h.id,
        title: h.title,
        description: h.description,
        query: h.query,
        date: h.dateForThisYear,
        name: h.title,
      });
    }

    // to xlsx
    const worksheet = XLSX.utils.json_to_sheet(csvRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Health Holidays Posts");
    XLSX.writeFile(workbook, "health_holidays_posts.xlsx");
  }

  // Error handling
  // Error handling
  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm flex items-center">
            <svg className="h-6 w-6 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414 0L7 9l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L10 7.586l-.293-.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700 font-medium">Błąd: {state.error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nietypowe Święta</h1>

      {/* Step 1: Scrape holidays */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Krok 1: Pobierz nietypowe święta</h2>
        <UrlInput url={url} setUrl={setUrl} />
        <Button onClick={fetchHolidays} disabled={state.loading}>
          {state.loading ? "Ładowanie..." : "Pobierz nietypowe święta"}
        </Button>

        {state.loading && <div className="mt-4 text-blue-600 font-medium">Ładowanie...</div>}

        {state.error && <div className="mt-4 text-red-600 font-medium">Błąd: {state.error}</div>}

        {state.holidays.length > 0 && !state.loading && (
          <>
            <div className="mt-4 text-blue-600 font-medium">
              Liczba świąt: <span className="font-semibold">{state.holidays.length}</span>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Pobrane święta:</h3>
              <ul className="list-disc list-inside max-h-64 overflow-y-auto">
                {state.holidays.map((holiday, index) => (
                  <li key={`${holiday.date}-${index}`} className="text-gray-600 mb-1">
                    <a href={holiday.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {holiday.date} - {holiday.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>

      {/* Step 2: AI Processing */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Krok 2: Wyodrębnij święta zdrowotne i wygeneruj posty</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={promptOpenAiForHealthHolidays} disabled={state.holidays.length === 0 || loading}>
            Wyodrębnij święta zdrowotne
          </Button>
          <Button onClick={createPosts} disabled={!state.separatedHolidaysFromOpenAi || loading}>
            Wygeneruj posty
          </Button>
        </div>
      </section>

      {/* Display separated holidays */}
      {state.separatedHolidaysFromOpenAi && (
        <section className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Wyodrębnione święta zdrowotne</h2>
          <ResponseDisplay response={state.separatedHolidaysFromOpenAi} />
        </section>
      )}

      {/* Display generated posts */}
      {state.posts && (
        <section className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Wygenerowane posty</h2>
          <ResponseDisplay response={state.posts} />
        </section>
      )}

      {/* Export sections */}
      {state.posts && (
        <>
          <section className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Krok 3: Eksportuj posty do pliku Excel</h2>
            <div className="text-center">
              <Button onClick={exportHolidaysToExcel}>Eksportuj posty do pliku Excel</Button>
            </div>
          </section>

          <section className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Krok 4: Eksportuj posty do pliku CSV</h2>
            <div className="text-center">
              <Button onClick={() => extractToCSVFileAndDownload(state.posts)}>Eksportuj posty do pliku CSV</Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
