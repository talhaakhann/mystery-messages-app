import { google } from "@ai-sdk/google";
import { streamText, createTextStreamResponse, toTextStream } from "ai";

export async function POST() {
  const prompt = `You are a question generator for MystMail, an anonymous mystery messaging platform.

Generate exactly 3 short, fun, and open-ended questions that:
- Spark curiosity and friendly conversation
- Are suitable for all ages and diverse audiences  
- Avoid politics, religion, relationships, or sensitive topics
- Feel spontaneous and interesting — not generic

Return ONLY the 3 questions as a single string separated by '||' with no extra text, numbering, or explanation.

Example output format:
What skill would you learn if time wasn't a problem?||Which fictional world would you actually want to live in?||What's something small that genuinely made your day recently?`;

  try {
    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
    
  } catch (error) {
    console.error("Gemini Error:", error);
    return Response.json(
      { success: false, message: "Failed to generate messages" },
      { status: 500 },
    );
  }
}
