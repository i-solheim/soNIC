import { callAIJson } from "@/lib/ai-client";
import { z } from "zod";

// ============================================================
// Agent 4 — Explain a specific Startup ↔ Organization match
// ============================================================

const SYSTEM_PROMPT = `You are an expert partnership analyst at NIC (National Innovation Center) Vietnam.
Given a startup and a partner organization that have been matched, provide a detailed explanation of their compatibility.

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no extra text.

{
  "explanation": string,              // 3-5 paragraph detailed explanation of why this is a strong match
  "explanationVi": string,            // Vietnamese translation of explanation
  "suggestedCollaboration": string,   // specific recommended collaboration format (1-2 sentences)
  "risks": string[],                  // 2-4 potential risks or challenges to be aware of
  "expectedRoi": "low" | "medium" | "high",  // expected return on investment/effort
  "nextBestAction": string,           // the single best immediate next step (1 sentence)
  "capabilityComparison": {
    "startupHas": string[],           // 4-6 key things the startup brings to the table
    "startupHasVi": string[],         // Vietnamese translation
    "orgNeeds": string[],             // 4-6 key things the organization is looking for
    "orgNeedsVi": string[]            // Vietnamese translation
  },
  "roadmap": [
    {
      "timeLabel": string,            // e.g. "Week 1", "Month 2", "Q3"
      "timeLabelVi": string,
      "milestone": string,            // what happens at this stage
      "milestoneVi": string,
      "type": string                  // one of: "meeting" | "pilot" | "investment" | "research" | "distribution"
    }
  ]
}

The roadmap should have 4-6 steps covering a realistic 3-6 month collaboration timeline.
Be specific — reference the actual startup name, organization name, technologies, and industries in your explanation.`;

const RoadmapStepSchema = z.object({
  timeLabel: z.string(),
  timeLabelVi: z.string(),
  milestone: z.string(),
  milestoneVi: z.string(),
  type: z.string(),
});

const CapabilityComparisonSchema = z.object({
  startupHas: z.array(z.string()),
  startupHasVi: z.array(z.string()),
  orgNeeds: z.array(z.string()),
  orgNeedsVi: z.array(z.string()),
});

const ExplainMatchSchema = z.object({
  explanation: z.string(),
  explanationVi: z.string(),
  suggestedCollaboration: z.string(),
  risks: z.array(z.string()).default([]),
  expectedRoi: z.enum(["low", "medium", "high"]),
  nextBestAction: z.string(),
  capabilityComparison: CapabilityComparisonSchema,
  roadmap: z.array(RoadmapStepSchema),
});

export type ExplainMatchResult = z.infer<typeof ExplainMatchSchema>;

export async function explainMatch(
  startup: object,
  organization: object
): Promise<ExplainMatchResult> {
  const userPrompt = `Startup:\n${JSON.stringify(startup, null, 2)}\n\nOrganization:\n${JSON.stringify(organization, null, 2)}`;

  const raw = await callAIJson<ExplainMatchResult>(SYSTEM_PROMPT, userPrompt, {
    temperature: 0.4,
    maxTokens: 3000,
  });

  return ExplainMatchSchema.parse(raw);
}
