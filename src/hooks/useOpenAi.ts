"use client";
import { useState } from "react";

interface Options {
  response_format?: { type: "json_object" | "text" };
}

export function useOpenAIChat() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const promptOpenAi = async (
    prompt: string,
    options: Options = {
      response_format: { type: "text" },
    }
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          format: options.response_format?.type,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
        return data.response;
      } else {
        console.error("Error from OpenAI:", data.error);
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResponse(`Fetch error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    loading,
    promptOpenAi,
  };
}
