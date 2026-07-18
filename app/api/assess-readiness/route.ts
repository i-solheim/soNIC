import { NextResponse } from "next/server";
import { getAuthedUser, checkRole } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { assessReadiness } from "@/lib/agents/assess-readiness";

// ============================================================
// POST /api/assess-readiness
// No body required — uses the authenticated user's own Startup row.
// Calls Agent 2 → writes readiness fields back to DB.
// ============================================================

export async function POST(request: Request) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const roleError = checkRole(user!.role, "startup");
  if (roleError) return NextResponse.json(roleError.body, { status: roleError.status });

  const startup = await prisma.startup.findUnique({ where: { userId: user!.id } });
  if (!startup) {
    return NextResponse.json(
      { error: "No startup profile found. Please complete your profile first." },
      { status: 400 }
    );
  }

  // Build a clean snapshot to send to the AI
  const startupSnapshot = {
    name: startup.name,
    industry: startup.industry,
    stage: startup.stage,
    employees: startup.employees,
    technologies: safeParseJson(startup.technology, []),
    problemStatement: startup.problem,
    solution: startup.solution,
    customerTypes: safeParseJson(startup.customerType, []),
    targetMarkets: safeParseJson(startup.market, []),
    businessModels: safeParseJson(startup.businessModel, []),
    fundingNeed: startup.fundingNeed,
    growth: safeParseJson(startup.growth, {}),
    goals: safeParseJson(startup.goals, []),
    capabilities: safeParseJson(startup.capabilities, []),
  };

  // Run Agent 2
  const result = await assessReadiness(startupSnapshot);

  // Write results back to the Startup row
  await prisma.startup.update({
    where: { userId: user!.id },
    data: {
      readinessScore: Math.round(result.score),
      isEligibleForNic: result.isEligibleForNic,
      eligibilityReason: result.eligibilityReason,
      missingFields: JSON.stringify(result.missingFields),
      suggestedImprovements: JSON.stringify(result.suggestedImprovements),
      recommendation: result.recommendation,
      rawReadiness: JSON.stringify(result),
    },
  });

  return NextResponse.json(result);
}

function safeParseJson(value: string | null | undefined, fallback: any): any {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
