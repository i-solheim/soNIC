import OpenAI from "openai";

// ============================================================
// Shared AI client — FPT Cloud / gpt-oss-120b
// ============================================================

if (!process.env.FPT_API_KEY) {
  console.warn("[ai-client] WARNING: FPT_API_KEY is not set. AI calls will fail.");
}

export const aiClient = new OpenAI({
  apiKey: process.env.FPT_API_KEY || "missing-key",
  baseURL: "https://mkp-api.fptcloud.com/",
});

export const AI_MODEL = "gpt-oss-120b";

export interface AICallOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Makes a single chat completion call and returns the text response.
 * Throws if the model returns an empty response.
 */
export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  options: AICallOptions = {}
): Promise<string> {
  const response = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 2048,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stream: false,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  return content;
}

/**
 * Calls the AI and parses the result as JSON.
 * Retries once if JSON parsing fails (model sometimes wraps in markdown).
 */
export async function callAIJson<T>(
  systemPrompt: string,
  userPrompt: string,
  options: AICallOptions = {}
): Promise<T> {
  const raw = await callAI(systemPrompt, userPrompt, options);

  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    // Second attempt: extract first JSON object/array from the response
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error(`AI response was not valid JSON.\n\nRaw response:\n${raw}`);
  }
}
