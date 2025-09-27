import { NextResponse } from "next/server";

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashRequest {
  tag: string;
  count?: number;
  orientation?: "landscape" | "portrait" | "squarish";
  size?: "small" | "regular" | "full" | "raw";
}

// GET handler: simple health check
export function GET() {
  return NextResponse.json({ message: "Unsplash API route is working." });
}

// POST handler: fetch Unsplash photo(s) by tag
export async function POST(request: Request) {
  try {
    const { tag, count = 1, orientation = "landscape", size = "regular" }: UnsplashRequest = await request.json();
    
    if (!tag) {
      return NextResponse.json({ error: "Tag is required." }, { status: 400 });
    }

    if (!ACCESS_KEY) {
      return NextResponse.json({ error: "Unsplash API key not configured." }, { status: 500 });
    }

    // Build query parameters
    const params = new URLSearchParams({
      query: tag,
      client_id: ACCESS_KEY,
      orientation,
      count: Math.min(count, 30).toString(), // Unsplash API limit
    });

    const url = `${UNSPLASH_API_URL}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Failed to fetch photo from Unsplash: ${errorText}` }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Handle both single photo and array of photos
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return NextResponse.json(
          { error: `No photos found for tag "${tag}"` }, 
          { status: 404 }
        );
      }
      return NextResponse.json(data);
    } else {
      if (!data || !data.id) {
        return NextResponse.json(
          { error: `Invalid photo data for tag "${tag}"` }, 
          { status: 404 }
        );
      }
      return NextResponse.json([data]);
    }
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json(
      { error: "Internal server error." }, 
      { status: 500 }
    );
  }
}
