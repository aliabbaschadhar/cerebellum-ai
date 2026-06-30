import { embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Initialize DigitalOcean OpenAI-compatible GenAI provider
export const digitalOceanGenAI = createOpenAI({
  apiKey: process.env.DO_MODEL_ACCESS_KEY || "",
  baseURL: process.env.DO_GENAI_BASE_URL || "https://api.digitalocean.com/v2/ai",
});

// Helper to generate embedding vector from text
export async function generateEmbedding(text: string): Promise<number[]> {
  const modelName = process.env.DO_EMBEDDING_MODEL || "all-mini-lm-l6-v2";
  const { embedding } = await embed({
    model: digitalOceanGenAI.embedding(modelName),
    value: text,
  });
  return embedding;
}
