import { NextResponse } from "next/server";
import { fetchUnsplashPhotos } from "@/services/unsplashService";

// Secret/API key expected in request header 'x-api-key'
// IMPORTANT: use a dedicated UNSPLASH_API_SECRET for this route. Do NOT fall back to
// NEXT_PUBLIC_POSTIMAGES_API_KEY (that's a client-exposed key for PostImages uploads and
// should not be treated as a server secret).
const API_SECRET = process.env.UNSPLASH_API_SECRET;

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
    // Create a request-scoped id for easier tracing in logs
    const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    // Check API secret header
    const providedKey = request.headers.get("x-api-key");
    if (!API_SECRET) {
      console.warn(`[${requestId}] API_SECRET is not configured on the server`);
    }
    const keyProvided = Boolean(providedKey);
    console.debug(`[${requestId}] Incoming unsplash-photo-by-tag request, x-api-key provided: ${keyProvided}`);

    if (API_SECRET && providedKey !== API_SECRET) {
      console.info(`[${requestId}] Unauthorized request (invalid x-api-key)`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { tag, count = 1, orientation = "landscape" }: UnsplashRequest = body;

    // Validate inputs
    if (!tag || typeof tag !== "string") {
      console.info(`[${requestId}] Bad request - missing or invalid tag`);
      return NextResponse.json({ error: "Tag is required and must be a string." }, { status: 400 });
    }
    const cleanedTag = tag.trim().slice(0, 100);
    if (!/^[\w\s,\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ!?()]+$/.test(cleanedTag)) {
      console.info(`[${requestId}] Bad request - tag contains invalid characters: ${cleanedTag}`);
      return NextResponse.json({ error: "Tag contains invalid characters." }, { status: 400 });
    }

    // sanitize and limit count
    const maxCount = 5;
    const requestedCount = Number(count) || 1;
    const finalCount = Math.min(Math.max(1, requestedCount), maxCount);

    const allowedOrientations = ["landscape", "portrait", "squarish"];
    const finalOrientation = allowedOrientations.includes(orientation) ? orientation : "landscape";

    // Build a sanitized URL for debug/logging (do not include client_id)
    const sanitizedUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
      cleanedTag
    )}&orientation=${finalOrientation}&count=${finalCount}`;
    console.debug(`[${requestId}] Requested Unsplash link for tag "${cleanedTag}": ${sanitizedUrl}`);

    // Lightweight connectivity check to Unsplash to fail fast if the API is unreachable
    try {
      const checkLabel = `unsplash-check-${requestId}`;
      console.time(checkLabel);
      // Use shared service for a short connectivity check so client_id is used internally
      await fetchUnsplashPhotos("health", { count: 1, timeoutMs: 1500 });
      console.timeEnd(checkLabel);
      console.debug(`[${requestId}] Unsplash connectivity check OK`);
    } catch (err) {
      const name = (err as any)?.name;
      if (name === "AbortError") {
        console.warn(`[${requestId}] Unsplash connectivity check aborted after ${1500}ms`);
        return NextResponse.json({ error: "Unsplash connectivity timeout" }, { status: 504 });
      }
      console.error(`[${requestId}] Unsplash connectivity check error:`, err);
      return NextResponse.json({ error: "Unsplash connectivity error" }, { status: 502 });
    }

    // Use shared service to fetch photos (same timeout behavior)
    let data: any = null;
    try {
      data = await fetchUnsplashPhotos(cleanedTag, { count: finalCount, orientation: finalOrientation, timeoutMs: 5000 });
      console.debug(`[${requestId}] fetchUnsplashPhotos returned type: ${Array.isArray(data) ? "array" : "object"}`);
    } catch (err) {
      const status = (err as any)?.status;
      if ((err as any)?.name === "AbortError") {
        console.warn(`[${requestId}] Unsplash fetch aborted after 5000ms for tag: ${cleanedTag}`);
        return NextResponse.json({ error: "Unsplash fetch timeout" }, { status: 504 });
      }
      console.error(`[${requestId}] fetchUnsplashPhotos error:`, err);
      return NextResponse.json({ error: "Failed to fetch from Unsplash" }, { status: status || 502 });
    }

    // Handle both single photo and array of photos
    if (Array.isArray(data)) {
      if (data.length === 0) {
        console.info(`[${requestId}] No photos found for tag "${cleanedTag}" (array empty)`);
        return NextResponse.json({ error: `No photos found for tag "${cleanedTag}"` }, { status: 404 });
      }
      // Randomly select one image from the array for variety
      const randomIndex = Math.floor(Math.random() * data.length);
      const selectedImage = data[randomIndex];
      console.debug(`[${requestId}] Returning one of ${data.length} images, selected index ${randomIndex}, id=${selectedImage?.id}`);
      return NextResponse.json([selectedImage]);
    } else {
      if (!data || !data.id) {
        console.info(`[${requestId}] Invalid photo data for tag "${cleanedTag}"`);
        return NextResponse.json({ error: `Invalid photo data for tag "${cleanedTag}"` }, { status: 404 });
      }
      console.debug(`[${requestId}] Returning single image id=${data.id}`);
      return NextResponse.json([data]);
    }
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
