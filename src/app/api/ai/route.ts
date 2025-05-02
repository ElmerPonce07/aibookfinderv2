import { BookSuggestionSchema } from "@/lib/schemas/bookSuggestion"; // Zod schema to validate AI response
import OpenAI from "openai"; // Official OpenAI Node.js SDK
import { NextResponse } from "next/server"; // Next.js App Router response helper

// Initialize OpenAI using the secret key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API route that handles POST requests to /api/ai
export async function POST(req: Request) {
  const { topic } = await req.json(); // Get topic from the incoming request

  // Prompt OpenAI to return exactly structured JSON based on the topic
  const prompt = `Give me a list of 3 book suggestions about "${topic}". Respond ONLY in JSON in the following format:
{
  "suggestions": [
    { "title": "Book Title", "author": "Author Name" },
    { "title": "Another Title", "author": "Another Author" },
    { "title": "Third Title", "author": "Third Author" }
  ]
}`;

  try {
    // Ask OpenAI for suggestions without using streaming (so we can validate full response)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: false, // No streaming because we want a complete JSON object
      messages: [{ role: "user", content: prompt }],
    });

    // Grab the raw string response from GPT
    const raw = completion.choices[0].message?.content ?? "";

    let parsed;
    try {
      // Try parsing the raw response and validating against the schema
      parsed = BookSuggestionSchema.parse(JSON.parse(raw));
    } catch (err) {
      // If it fails, return a 400 error with a helpful message
      return NextResponse.json(
        { error: "OpenAI returned invalid JSON structure" },
        { status: 400 }
      );
    }

    // If everything is good, return the parsed and validated data to the frontend
    return NextResponse.json(parsed);
  } catch (err) {
    // Catch any unexpected errors and return a 500 error
    return NextResponse.json(
      { error: "Something went wrong generating suggestions." },
      { status: 500 }
    );
  }
}
