import { callAIJson } from "@/lib/ai-client";
import { z } from "zod";

// ============================================================
// Agent 2 — Assess Startup Readiness for NIC
// ============================================================

const SYSTEM_PROMPT = `You are a senior evaluator at NIC (National Innovation Center) Vietnam.
Your task is to assess how ready a startup is for NIC's innovation programs, partnerships, and investment facilitation.

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no extra text.

Evaluate the startup data provided and return:

{
  "score": number,                    // overall readiness score 0-100
  "isEligibleForNic": boolean,        // true if score >= 60 and has sufficient traction
  "eligibilityReason": string,        // brief explanation of why they are/aren't eligible
  "checks": [
    {
      "label": string,               // English label for this check
      "labelVi": string,             // Vietnamese label for this check
      "status": "pass" | "warning" | "fail"
    }
  ],
  "missingFields": string[],         // list of important fields that are empty or missing
  "suggestedImprovements": string[], // concrete actionable recommendations for the startup
  "recommendation": string           // 2-3 sentence overall recommendation for NIC staff
}

Evaluate these dimensions (each contributes to the score):
- Product completeness (problem, solution clarity) — 20 pts
- Traction (users, revenue, growth rate) — 20 pts
- Funding readiness (clear funding need, current stage) — 15 pts
- Team & capabilities (capabilities list, employees) — 15 pts
- Legal & business structure (business model, customer types) — 15 pts
- IP & innovation (technologies, unique capabilities) — 15 pts

Check labels to use (translate to Vietnamese):
"Product Ready", "Traction Metrics", "Funding Ready", "Team Completeness", "Business Model Defined", "Innovation Depth"`;

const ReadinessCheckSchema = z.object({
  label: z.string(),
  labelVi: z.string(),
  status: z.enum(["pass", "warning", "fail"]),
});

const AssessReadinessSchema = z.object({
  score: z.number().min(0).max(100),
  isEligibleForNic: z.boolean(),
  eligibilityReason: z.string(),
  checks: z.array(ReadinessCheckSchema),
  missingFields: z.array(z.string()).default([]),
  suggestedImprovements: z.array(z.string()).default([]),
  recommendation: z.string(),
});

export type AssessReadinessResult = z.infer<typeof AssessReadinessSchema>;

export async function assessReadiness(startupData: object): Promise<AssessReadinessResult> {
  const userPrompt = `Assess the readiness of this startup:\n\n${JSON.stringify(startupData, null, 2)}`;

  const raw = await callAIJson<AssessReadinessResult>(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.2,
    maxTokens: 1024,
  });

  return AssessReadinessSchema.parse(raw);
}
