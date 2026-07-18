import { NextResponse } from "next/server";
import { getAuthedUser, checkRole } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { extractProfile } from "@/lib/agents/extract-profile";

// ============================================================
// POST /api/extract-profile
// Accepts either:
//   - multipart/form-data with a "file" field (PDF)
//   - application/json with { text: string }
//
// Calls Agent 1 → upserts result into the Startup row for the authed user
// ============================================================

export async function POST(request: Request) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const roleError = checkRole(user!.role, "startup");
  if (roleError) return NextResponse.json(roleError.body, { status: roleError.status });

  let text = "";

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    // PDF upload path
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file in form data" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // pdf-parse is a CJS module — handle ESM/CJS interop
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParseModule = require("pdf-parse");
    const pdfParse = pdfParseModule.default ?? pdfParseModule;
    const parsed = await pdfParse(buffer);
    text = parsed.text;

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "PDF text extraction yielded too little content. Is this a scanned image PDF?" },
        { status: 422 }
      );
    }
  } else {
    // JSON text path
    const body = await request.json();
    text = body.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text field" }, { status: 400 });
    }
  }

  // Run Agent 1
  const profile = await extractProfile(text);

  // Find or verify the startup row for this user
  const startup = await prisma.startup.findUnique({ where: { userId: user!.id } });
  if (!startup) {
    return NextResponse.json(
      { error: "No startup profile found for this account. Please complete registration." },
      { status: 400 }
    );
  }

  // Upsert agent results into the Startup row
  const updated = await prisma.startup.update({
    where: { userId: user!.id },
    data: {
      name: profile.name,
      industry: profile.industry,
      location: profile.location ?? undefined,
      stage: profile.stage,
      employees: profile.employees ?? undefined,
      technology: JSON.stringify(profile.technologies),
      problem: profile.problemStatement,
      solution: profile.solution,
      customerType: JSON.stringify(profile.customerTypes),
      market: JSON.stringify(profile.targetMarkets),
      businessModel: JSON.stringify(profile.businessModels),
      fundingNeed: profile.fundingNeed ?? undefined,
      growth: JSON.stringify({
        users: profile.users,
        revenue: profile.monthlyRevenue,
        monthlyGrowthRate: profile.monthlyGrowthRate,
      }),
      goals: JSON.stringify(profile.goals),
      capabilities: JSON.stringify(profile.capabilities),
      recommendation: profile.aiSummary,
      rawProfile: JSON.stringify(profile),
    },
  });

  return NextResponse.json({ startup: updated, extractedProfile: profile });
}
