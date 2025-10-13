import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/api/rate-limit-helpers";

export interface PostImagesUploadResult {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: string;
  height: string;
  size: string;
  time: string;
  expiration: string;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
}

/**
 * POST /api/upload-to-postimages - Upload image to PostImages
 * Rate limited to 30 requests per minute per IP
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting for upload operations
  const rateLimitResult = checkRateLimit(request, "STANDARD");
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const formData = await request.formData();
    const imageData = formData.get("image") as File;
    const filename = formData.get("filename") as string;
    const description = formData.get("description") as string;

    if (!imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_POSTIMAGES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "PostImages API key not configured" }, { status: 500 });
    }

    // Convert image to base64 for PostImages API
    const imageBuffer = await imageData.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    // Create form data in the correct format for PostImages API
    const formObject = {
      key: apiKey,
      gallery: "", // Empty gallery
      o: "2b819584285c102318568238c7d4a4c7",
      m: "59c2ad4b46b0c1e12d5703302bff0120",
      version: "1.0.1",
      portable: "1",
      name: filename ? filename.split(".")[0] : "image",
      type: filename ? filename.split(".")[1] || "png" : "png",
      image: imageBase64,
    };

    const formBody = Object.keys(formObject)
      .map((property) => `${encodeURIComponent(property)}=${encodeURIComponent(formObject[property as keyof typeof formObject])}`)
      .join("&");

    // Upload to PostImages using the correct endpoint
    const response = await fetch("https://api.postimage.org/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "PostImage/1.0.1 (compatible; NextJS-App/1.0)",
      },
      body: formBody,
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("PostImages API error response:", responseText);
      return NextResponse.json({ error: `PostImages API error: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const responseText = await response.text();
    console.log("PostImages API response:", responseText);

    // Check if response is HTML (error page)
    if (responseText.startsWith("<!DOCTYPE") || responseText.startsWith("<html")) {
      console.error("PostImages returned HTML instead of JSON:", responseText.substring(0, 200));
      return NextResponse.json({ error: "PostImages API returned HTML error page" }, { status: 400 });
    }

    // Check if response is XML (PostImages API format)
    if (responseText.startsWith("<?xml")) {
      console.log("PostImages returned XML response:", responseText);

      // Enhanced XML parsing for PostImages response with multiple format support
      const errorMatch = responseText.match(/<error>(.*?)<\/error>/i);
      const successMatch = responseText.match(/success="1"/i);

      // Try multiple URL patterns to handle different XML formats
      const urlPatterns = [
        // PostImages specific patterns based on actual response
        /<hotlink>(.*?)<\/hotlink>/i,
        /<thumbnail>(.*?)<\/thumbnail>/i,
        /<page>(.*?)<\/page>/i,
        // Generic patterns
        /<url>(.*?)<\/url>/i,
        /<image_url>(.*?)<\/image_url>/i,
        /<link>(.*?)<\/link>/i,
        /<href>(.*?)<\/href>/i,
        /url="([^"]+)"/i,
        /image_url="([^"]+)"/i,
        /link="([^"]+)"/i,
        /href="([^"]+)"/i,
      ];

      let imageUrl = null;
      for (const pattern of urlPatterns) {
        const match = responseText.match(pattern);
        if (match && match[1] && match[1].trim()) {
          imageUrl = match[1].trim();
          console.log("Found image URL with pattern:", pattern, "URL:", imageUrl);
          break;
        }
      }

      // Try to extract other metadata from PostImages XML structure
      const thumbMatch =
        responseText.match(/<thumbnail>(.*?)<\/thumbnail>/i) ||
        responseText.match(/<thumb>(.*?)<\/thumb>/i) ||
        responseText.match(/thumb="([^"]+)"/i);
      const sizeMatch = responseText.match(/<size>(.*?)<\/size>/i) || responseText.match(/size="([^"]+)"/i);
      const widthMatch = responseText.match(/<width>(.*?)<\/width>/i) || responseText.match(/width="([^"]+)"/i);
      const heightMatch = responseText.match(/<height>(.*?)<\/height>/i) || responseText.match(/height="([^"]+)"/i);
      const nameMatch = responseText.match(/<name>(.*?)<\/name>/i) || responseText.match(/name="([^"]+)"/i);
      const typeMatch = responseText.match(/<type>(.*?)<\/type>/i) || responseText.match(/type="([^"]+)"/i);
      const timeMatch = responseText.match(/<time>(.*?)<\/time>/i) || responseText.match(/time="([^"]+)"/i);

      if (errorMatch) {
        const errorText = errorMatch[1]
          .replace(/&lt;br&gt;/g, " ")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        console.error("PostImages XML error:", errorText);
        return NextResponse.json({ error: `PostImages API error: ${errorText}` }, { status: 400 });
      }

      // If we have a URL, treat it as success
      if (imageUrl) {
        console.log("PostImages upload successful, URL:", imageUrl);
        return NextResponse.json({
          id: "uploaded_image",
          title: nameMatch?.[1] || filename || "uploaded_image",
          url_viewer: imageUrl,
          url: imageUrl,
          display_url: imageUrl,
          width: widthMatch?.[1] || "0",
          height: heightMatch?.[1] || "0",
          size: sizeMatch?.[1] || "0",
          time: timeMatch?.[1] || new Date().toISOString(),
          expiration: "never",
          image: {
            filename: nameMatch?.[1] || filename || "image.png",
            name: nameMatch?.[1] || filename || "image.png",
            mime: typeMatch?.[1] ? `image/${typeMatch[1]}` : "image/png",
            extension: typeMatch?.[1] || "png",
            url: imageUrl,
          },
          thumb: {
            filename: nameMatch?.[1] || filename || "image.png",
            name: nameMatch?.[1] || filename || "image.png",
            mime: typeMatch?.[1] ? `image/${typeMatch[1]}` : "image/png",
            extension: typeMatch?.[1] || "png",
            url: thumbMatch?.[1] || imageUrl,
          },
          medium: {
            filename: nameMatch?.[1] || filename || "image.png",
            name: nameMatch?.[1] || filename || "image.png",
            mime: typeMatch?.[1] ? `image/${typeMatch[1]}` : "image/png",
            extension: typeMatch?.[1] || "png",
            url: imageUrl,
          },
          delete_url: "",
        });
      }

      // If no URL found, check for other success indicators
      if (successMatch) {
        console.log('PostImages upload successful (success="1" found) but no URL extracted');
        console.log("Full XML response for debugging:", responseText);
        // Return a generic success response if we have success but no URL
        return NextResponse.json({
          id: "uploaded_image",
          title: nameMatch?.[1] || filename || "uploaded_image",
          url_viewer: "https://postimages.org/",
          url: "https://postimages.org/",
          display_url: "https://postimages.org/",
          width: widthMatch?.[1] || "0",
          height: heightMatch?.[1] || "0",
          size: sizeMatch?.[1] || "0",
          time: timeMatch?.[1] || new Date().toISOString(),
          expiration: "never",
          image: {
            filename: nameMatch?.[1] || filename || "image.png",
            name: nameMatch?.[1] || filename || "image.png",
            mime: typeMatch?.[1] ? `image/${typeMatch[1]}` : "image/png",
            extension: typeMatch?.[1] || "png",
            url: "https://postimages.org/",
          },
          thumb: {
            filename: nameMatch?.[1] || filename || "image.png",
            name: nameMatch?.[1] || filename || "image.png",
            mime: typeMatch?.[1] ? `image/${typeMatch[1]}` : "image/png",
            extension: typeMatch?.[1] || "png",
            url: "https://postimages.org/",
          },
          medium: {
            filename: nameMatch?.[1] || filename || "image.png",
            name: nameMatch?.[1] || filename || "image.png",
            mime: typeMatch?.[1] ? `image/${typeMatch[1]}` : "image/png",
            extension: typeMatch?.[1] || "png",
            url: "https://postimages.org/",
          },
          delete_url: "",
        });
      }

      console.error("PostImages XML response format not recognized. Full response:", responseText);
      return NextResponse.json({ error: "PostImages XML response format not recognized" }, { status: 400 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse PostImages response as JSON:", responseText);
      return NextResponse.json({ error: "Invalid JSON response from PostImages" }, { status: 400 });
    }

    // Handle different response formats
    if (data.success && data.image) {
      return NextResponse.json(data.image);
    } else if (data.status === 1 && data.url) {
      // Alternative response format
      return NextResponse.json({
        id: data.hash || "unknown",
        title: filename || "uploaded_image",
        url_viewer: data.url,
        url: data.url,
        display_url: data.url,
        width: data.width?.toString() || "0",
        height: data.height?.toString() || "0",
        size: data.size || "0",
        time: new Date().toISOString(),
        expiration: "never",
        image: {
          filename: filename || "image.png",
          name: filename || "image.png",
          mime: "image/png",
          extension: "png",
          url: data.url,
        },
        thumb: {
          filename: filename || "image.png",
          name: filename || "image.png",
          mime: "image/png",
          extension: "png",
          url: data.th_url || data.url,
        },
        medium: {
          filename: filename || "image.png",
          name: filename || "image.png",
          mime: "image/png",
          extension: "png",
          url: data.url,
        },
        delete_url: data.delete_url || "",
      });
    } else {
      console.error("PostImages upload failed:", data);
      return NextResponse.json({ error: data.message || "PostImages upload failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in PostImages upload API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
