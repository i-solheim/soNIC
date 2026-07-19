import { callAIJson } from "@/lib/ai-client";
import { z } from "zod";

// ============================================================
// Agent 3 — Match Startup with Organizations
// ============================================================

const SYSTEM_PROMPT = `You are a senior matchmaking specialist at NIC (National Innovation Center) Vietnam.
Your job is to score the compatibility between one startup and a list of partner organizations.

You MUST respond with ONLY a valid JSON array. No markdown, no explanation, no extra text. ENSURE all quotes within string values are escaped.

For each organization provided, return a match object:

[
  {
    "organizationId": string,         // exactly as provided in the input
    "score": number,                  // 0-100 compatibility score
    "collabTypes": string[],          // from: "investment" | "pilot" | "research" | "distribution" | "talent" | "procurement"
    "shortReason": string             // 1-2 sentence reason for this score (in English)
  }
]

Scoring factors:
- Industry/sector alignment (how well the org's focus matches the startup's industry) — 30%
- Technology fit (does the org need what the startup builds?) — 25%
- Stage match (does the org invest in / partner with startups at this stage?) — 20%
- Geographic overlap (Vietnam / SEA presence) — 15%
- Goal alignment (does the startup's goals match what the org offers?) — 10%

Rules:
- Sort the array by score descending
- Only include organizations with score >= 40
- Be specific in shortReason — mention actual industry/technology alignment
- collabTypes should reflect the most natural collaboration mode for this pair
- CRITICAL: Do NOT use double quotes (") inside shortReason. Use single quotes (') instead if needed to avoid breaking JSON.`;

const MatchItemSchema = z.object({
  organizationId: z.string(),
  score: z.number().min(0).max(100),
  collabTypes: z.array(z.string()),
  shortReason: z.string(),
});

export type MatchItem = z.infer<typeof MatchItemSchema>;

export async function matchStartupWithOrgs(
  startup: object,
  organizations: object[]
): Promise<MatchItem[]> {
  if (organizations.length === 0) return [];

  const userPrompt = `Startup:\n${JSON.stringify(startup, null, 2)}\n\nOrganizations:\n${JSON.stringify(organizations, null, 2)}`;

  const raw = await callAIJson<MatchItem[]>(SYSTEM_PROMPT, userPrompt, {
    temperature: 0,
    maxTokens: 8192,
  });

  const result = z.array(MatchItemSchema).parse(raw);
  return result.sort((a: MatchItem, b: MatchItem) => b.score - a.score);
}

// ============================================================
// Agent 3b — Match Organization with Startups (Partner perspective)
// ============================================================

const ORG_SYSTEM_PROMPT = `You are a senior matchmaking specialist at NIC (National Innovation Center) Vietnam.
Your job is to score the compatibility between one partner organization and a list of candidate startups.

You MUST respond with ONLY a valid JSON array. No markdown, no explanation, no extra text. ENSURE all quotes within string values are escaped.

For each startup provided, return a match object:
[
  {
    "startupId": string,        // exactly as provided in the input
    "score": number,            // 0-100 compatibility score
    "collabTypes": string[],    // from: "investment" | "pilot" | "research" | "distribution" | "talent" | "procurement"
    "shortReason": string       // 1-2 sentence reason for this score (in English)
  }
]

Use the same scoring factors as startup-side matching: industry/sector alignment (30%), technology fit (25%),
stage match (20%), geographic overlap (15%), goal alignment (10%).

Rules:
- Sort the array by score descending
- Only include startups with score >= 40
- Be specific in shortReason
- CRITICAL: Do NOT use double quotes (") inside shortReason. Use single quotes (') instead if needed to avoid breaking JSON.`;

const OrgMatchItemSchema = z.object({
  startupId: z.string(),
  score: z.number().min(0).max(100),
  collabTypes: z.array(z.string()),
  shortReason: z.string(),
});

export type OrgMatchItem = z.infer<typeof OrgMatchItemSchema>;

export async function matchOrgWithStartups(
  organization: object,
  startups: object[]
): Promise<OrgMatchItem[]> {
  if (startups.length === 0) return [];

  const userPrompt = `Organization:\n${JSON.stringify(organization, null, 2)}\n\nCandidate startups:\n${JSON.stringify(startups, null, 2)}`;

  const raw = await callAIJson<OrgMatchItem[]>(ORG_SYSTEM_PROMPT, userPrompt, {
    temperature: 0,
    maxTokens: 8192,
  });

  const result = z.array(OrgMatchItemSchema).parse(raw);
  return result.sort((a, b) => b.score - a.score);
}

