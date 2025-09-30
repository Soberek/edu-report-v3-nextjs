import { NextResponse } from "next/server";

interface GenerateGraphicsRequest {
  holidays: Array<{
    id: number;
    title: string;
    description: string;
    query: string;
    literalDate: string;
    dateForThisYear: string;
  }>;
}

interface GeneratedPost {
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

// POST handler: generate graphics for holiday posts
export async function POST(request: Request) {
  try {
    const { holidays }: GenerateGraphicsRequest = await request.json();

    if (!holidays || !Array.isArray(holidays) || holidays.length === 0) {
      return NextResponse.json({ error: "Holidays array is required." }, { status: 400 });
    }

    const generatedPosts: GeneratedPost[] = [];

    // Process each holiday
    for (const holiday of holidays) {
      try {
        // Fetch Unsplash image
        const unsplashResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/unsplash-photo-by-tag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag: holiday.query,
            count: 1,
            orientation: "landscape",
            size: "regular",
          }),
        });

        let imageUrl = "";
        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json();
          if (Array.isArray(unsplashData) && unsplashData.length > 0) {
            imageUrl = unsplashData[0].urls?.regular || "";
          }
        }

        // Generate social media post text
        const postText = generatePostText(holiday);
        
        // Generate tags
        const tags = generateTags(holiday);
        
        // Generate posting time (morning time for better engagement)
        const postingTime = generatePostingTime(holiday.dateForThisYear);

        // For now, use the original image URL as the generated image
        // Graphics generation will be handled on the client side
        const generatedImageUrl = imageUrl;

        generatedPosts.push({
          id: holiday.id,
          title: holiday.title,
          description: holiday.description,
          query: holiday.query,
          literalDate: holiday.literalDate,
          dateForThisYear: holiday.dateForThisYear,
          text: postText,
          imageUrl,
          generatedImageUrl,
          tags,
          postingTime,
        });
      } catch (error) {
        console.error(`Error processing holiday ${holiday.id}:`, error);
        // Continue with other holidays even if one fails
      }
    }

    return NextResponse.json({ posts: generatedPosts });
  } catch (error) {
    console.error("Graphics generation error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

function generatePostText(holiday: any): string {
  const emojis = ["🏥", "💊", "❤️", "🌟", "📢", "🎯", "💡", "🔬", "👩‍⚕️", "👨‍⚕️"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  const callToActions = [
    "Dowiedz się więcej!",
    "Zadbaj o swoje zdrowie!",
    "Podziel się wiedzą!",
    "Bądź świadomy!",
    "Działaj już dziś!",
    "Zainwestuj w zdrowie!",
    "Edukuj się!",
    "Pamiętaj o profilaktyce!"
  ];
  
  const randomCTA = callToActions[Math.floor(Math.random() * callToActions.length)];
  
  // Generate post text based on holiday
  let postText = `${randomEmoji} ${holiday.title}\n\n`;
  
  if (holiday.description) {
    postText += `${holiday.description}\n\n`;
  }
  
  postText += `${randomCTA}`;
  
  // Ensure it's under 280 characters
  if (postText.length > 280) {
    postText = postText.substring(0, 277) + "...";
  }
  
  return postText;
}

function generateTags(holiday: any): string {
  const baseTags = ["zdrowie", "edukacja", "profilaktyka", "medycyna"];
  const specificTags = holiday.query ? holiday.query.toLowerCase().split(" ") : [];
  
  // Combine base tags with specific tags, limit to 5 total
  const allTags = [...baseTags, ...specificTags].slice(0, 5);
  
  return allTags.join(", ");
}

function generatePostingTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Post at 9:00 AM for better engagement
  return `${year}-${month}-${day} 09:00`;
}

// Graphics generation is now handled on the client side
// This function is kept for potential future server-side implementation
async function generateGraphicsImage(holiday: any, backgroundImageUrl: string): Promise<string> {
  // For now, return the original image URL
  // Client-side graphics generation will be implemented in the component
  return backgroundImageUrl;
}
