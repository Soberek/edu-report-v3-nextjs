const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export interface FetchPhotosOptions {
  count?: number;
  orientation?: "landscape" | "portrait" | "squarish";
  timeoutMs?: number;
}

export async function fetchUnsplashPhotos(tag: string, opts: FetchPhotosOptions = {}) {
  if (!ACCESS_KEY) {
    throw new Error("Unsplash access key not configured");
  }

  const { count = 1, orientation = "landscape", timeoutMs = 5000 } = opts;

  const params = new URLSearchParams({
    query: tag,
    client_id: ACCESS_KEY,
    orientation,
    count: String(Math.min(Math.max(1, Number(count) || 1), 10)),
  });

  const url = `${UNSPLASH_API_URL}?${params.toString()}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(`Unsplash fetch failed: ${res.status} ${text}`);
      // @ts-ignore
      (err as any).status = res.status;
      throw err;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export default fetchUnsplashPhotos;
