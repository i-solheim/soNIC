import { callAIJson } from "@/lib/ai-client";
import { z } from "zod";

// ============================================================
// Agent 1 — Extract Startup Profile from text
// ============================================================

const SYSTEM_PROMPT = `You are an expert startup analyst for the NIC (National Innovation Center) Vietnam.
Your job is to extract structured profile data from startup pitch decks and descriptions.

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no extra text.

Extract the following fields from the provided text. Use null for fields you cannot determine.

{
  "name": string,                    // company name
  "tagline": string | null,          // one-line value proposition
  "industry": string,                // e.g. "HealthTech", "FinTech", "EdTech", "AgriTech", "CleanTech"
  "location": string | null,         // city, country
  "stage": string,                   // one of: "bootstrapped" | "pre_seed" | "seed" | "series_a" | "series_b_plus"
  "employees": number | null,
  "foundedYear": number | null,
  "technologies": string[],          // e.g. ["AI", "IoT", "Blockchain", "SaaS"]
  "problemStatement": string,        // the problem the startup solves
  "solution": string,                // how they solve it
  "customerTypes": string[],         // e.g. ["b2b", "b2c", "government", "enterprise"]
  "targetMarkets": string[],         // e.g. ["Healthcare", "Finance", "Education"]
  "businessModels": string[],        // e.g. ["saas", "marketplace", "hardware", "licensing", "services"]
  "fundingNeed": number | null,      // amount in USD, as a number (e.g. 2000000)
  "users": number | null,            // current active users
  "monthlyRevenue": number | null,   // USD
  "monthlyGrowthRate": number | null, // percentage (e.g. 18 for 18%)
  "goals": string[],                 // one or more of: "investment" | "pilot" | "manufacturing" | "rd" | "distribution" | "talent"
  "capabilities": string[],          // key technical or business capabilities
  "aiSummary": string,               // 3-5 sentence executive summary of this startup for investors and partners
  "aiKeywords": string[]             // 5-8 searchable keywords that describe this startup
}`;

const ExtractProfileSchema = z.object({
  name: z.string(),
  tagline: z.string().nullable().optional(),
  industry: z.string(),
  location: z.string().nullable().optional(),
  stage: z.enum(["bootstrapped", "pre_seed", "seed", "series_a", "series_b_plus"]).default("seed"),
  employees: z.number().nullable().optional(),
  foundedYear: z.number().nullable().optional(),
  technologies: z.array(z.string()).default([]),
  problemStatement: z.string(),
  solution: z.string(),
  customerTypes: z.array(z.string()).default([]),
  targetMarkets: z.array(z.string()).default([]),
  businessModels: z.array(z.string()).default([]),
  fundingNeed: z.number().nullable().optional(),
  users: z.number().nullable().optional(),
  monthlyRevenue: z.number().nullable().optional(),
  monthlyGrowthRate: z.number().nullable().optional(),
  goals: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
  aiSummary: z.string(),
  aiKeywords: z.array(z.string()).default([]),
});

export type ExtractProfileResult = z.infer<typeof ExtractProfileSchema>;

export async function extractProfile(text: string): Promise<ExtractProfileResult> {
  const userPrompt = `Extract the startup profile from this pitch deck / description:\n\n${text}`;

  const raw = await callAIJson<ExtractProfileResult>(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.2,
    maxTokens: 2048,
  });

  return ExtractProfileSchema.parse(raw);
}
