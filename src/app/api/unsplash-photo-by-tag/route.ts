import { NextResponse } from "next/server";

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// GET handler: simple health check
export function GET() {
  return NextResponse.json({ message: "Unsplash API route is working." });
}

// POST handler: fetch Unsplash photo by tag
export async function POST(request: Request) {
  try {
    const { tag } = await request.json();
    if (!tag) {
      return NextResponse.json({ error: "Tag is required." }, { status: 400 });
    }

    const url = `${UNSPLASH_API_URL}?query=${encodeURIComponent(tag)}&client_id=${ACCESS_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch photo from Unsplash." }, { status: res.status });
    }

    const photo = await res.json();
    return NextResponse.json(photo);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
