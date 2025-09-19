import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Handles POST requests to the OpenAI API endpoint.
 *
 * Expects a JSON body containing a `prompt` string and an optional `format` string.
 * - If `prompt` is missing, responds with a 400 error and a message requesting the prompt.
 * - Sends the prompt to OpenAI's GPT-4o model and returns the generated response.
 * - The response format can be specified via the `format` parameter (defaults to "text").
 *
 * @param request - The incoming HTTP request containing the prompt and format.
 * @returns A JSON response with the generated content or an error message.
 */
export async function POST(request: Request) {
  try {
    const { prompt, format } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Proszę podać prompt." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: format || "text" },
    });

    return NextResponse.json({
      response: completion.choices[0].message?.content,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Nieznany błąd" }, { status: 500 });
  }
}
