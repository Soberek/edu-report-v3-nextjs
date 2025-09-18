import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { prompt, format } = await request.json();
  console.log("Received prompt:", prompt);
  console.log("Requested format:", format);
  if (!prompt) {
    return NextResponse.json(
      { error: "Proszę podać prompt." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: format || "text" },
    });

    return NextResponse.json({
      response: completion.choices[0].message?.content,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
