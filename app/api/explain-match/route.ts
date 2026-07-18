import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser } from "@/lib/auth-server";
import { explainMatch } from "@/lib/agents/explain-match";

// ============================================================
// GET /api/explain-match?id=<matchId>
// Returns a full AI explanation for a startup ↔ org match.
// Calls Agent 4 on first request; caches result in DB for subsequent loads.
// ============================================================

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing match ID" }, { status: 400 });
  }

  const match = await prisma.match.findUnique({
    where: { id },
    include: { startup: true, organization: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Auth check: only the involved startup, the involved org, or NIC staff can view
  if (
    user!.role !== "nic" &&
    match.startup.userId !== user!.id &&
    match.organization.userId !== user!.id
  ) {
    return NextResponse.json(
      { error: "Forbidden", message: "You do not have permission to view this match." },
      { status: 403 }
    );
  }

  // If the explanation is already cached in the DB, return it immediately
  if (match.explanation) {
    return NextResponse.json({
      match,
      explanation: match.explanation,
      explanationVi: match.explanationVi || match.explanation,
      suggestedCollaboration: match.suggestedCollaboration,
      risks: safeParseJson(match.risks, []),
      expectedRoi: match.expectedRoi,
      nextBestAction: match.nextBestAction,
      capabilityComparison: safeParseJson(match.capabilityComparison, null) || FALLBACK_COMPARISON,
      roadmap: safeParseJson(match.roadmap, null) || FALLBACK_ROADMAP,
    });
  }

  // Build snapshots for the AI
  const startupSnapshot = {
    name: match.startup.name,
    industry: match.startup.industry,
    stage: match.startup.stage,
    technologies: safeParseJson(match.startup.technology, []),
    problemStatement: match.startup.problem,
    solution: match.startup.solution,
    goals: safeParseJson(match.startup.goals, []),
    capabilities: safeParseJson(match.startup.capabilities, []),
    targetMarkets: safeParseJson(match.startup.market, []),
  };

  const orgAttrs = safeParseJson(match.organization.attrs, {});
  const orgSnapshot = {
    name: match.organization.name,
    orgType: match.organization.orgType,
    industry: match.organization.industry,
    country: match.organization.country,
    innovationPriorities: orgAttrs.innovationPriorities || [],
    technologyInterests: orgAttrs.technologyInterests || [],
    investmentStages: orgAttrs.investmentStages || [],
    researchFields: orgAttrs.researchFields || [],
    preferredStartupStage: match.organization.preferredStartupStage,
  };

  // Call Agent 4
  const result = await explainMatch(startupSnapshot, orgSnapshot);

  // Cache result in the DB
  await prisma.match.update({
    where: { id },
    data: {
      explanation: result.explanation,
      explanationVi: result.explanationVi,
      suggestedCollaboration: result.suggestedCollaboration,
      risks: JSON.stringify(result.risks),
      expectedRoi: result.expectedRoi,
      nextBestAction: result.nextBestAction,
      capabilityComparison: JSON.stringify(result.capabilityComparison),
      roadmap: JSON.stringify(result.roadmap),
    },
  });

  return NextResponse.json({
    match,
    explanation: result.explanation,
    explanationVi: result.explanationVi,
    suggestedCollaboration: result.suggestedCollaboration,
    risks: result.risks,
    expectedRoi: result.expectedRoi,
    nextBestAction: result.nextBestAction,
    capabilityComparison: result.capabilityComparison,
    roadmap: result.roadmap,
  });
}

function safeParseJson(value: string | null | undefined, fallback: any): any {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

const FALLBACK_COMPARISON = {
  startupHas: ["AI expertise", "Healthcare datasets", "Clinical partnerships"],
  startupHasVi: ["Chuyên môn AI", "Tập dữ liệu y tế", "Đối tác lâm sàng"],
  orgNeeds: ["AI-powered tool", "Clinical data access", "Proven results"],
  orgNeedsVi: ["Công cụ AI", "Truy cập dữ liệu lâm sàng", "Kết quả đã chứng minh"],
};

const FALLBACK_ROADMAP = [
  {
    timeLabel: "Week 1",
    timeLabelVi: "Tuần 1",
    milestone: "Intro Meeting",
    milestoneVi: "Cuộc họp giới thiệu",
    type: "meeting" as const,
  },
  {
    timeLabel: "Month 1",
    timeLabelVi: "Tháng 1",
    milestone: "Pilot Phase",
    milestoneVi: "Giai đoạn thí điểm",
    type: "pilot" as const,
  },
];
