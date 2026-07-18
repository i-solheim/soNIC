import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser, checkRole } from "@/lib/auth-server";
import { matchStartupWithOrgs } from "@/lib/agents/match";

export async function GET(request: Request) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "partner" or "startup"

  try {
    if (type === "partner") {
      const roleError = checkRole(user!.role, "partner", "nic");
      if (roleError) return NextResponse.json(roleError.body, { status: roleError.status });

      // Return startups for a partner to view
      const startups = await prisma.startup.findMany();
      // Format them
      const formatted = startups.map(s => {
        let tech = [];
        try { tech = JSON.parse(s.technology); } catch(e){}
        let growth = {} as any;
        try { growth = JSON.parse(s.growth); } catch(e){}

        return {
          id: s.id,
          name: s.name,
          logo: s.name ? s.name.charAt(0) : "S",
          sector: s.industry || "Tech",
          tagline: s.problem || "",
          description: s.solution || "",
          users: growth?.users || "0",
          budget: s.fundingNeed ? `$${s.fundingNeed}` : "$0",
          stage: s.stage || "seed",
          keywords: tech,
          breakdown: { tech: 80, market: 85, funding: 90 }, // Mock
          why: s.problem || "",
          plan: ["Expand to new markets", "Develop version 2.0"],
          slides: ["Problem", "Solution", "Market", "Traction"],
          video: { title: "Demo Video", dur: "2:30" },
          score: s.readinessScore || 80
        };
      });
      return NextResponse.json(formatted);
    } else if (type === "startup") {
      const roleError = checkRole(user!.role, "startup", "nic");
      if (roleError) return NextResponse.json(roleError.body, { status: roleError.status });

      // Find the authenticated user's own Startup record
      const myStartup = await prisma.startup.findUnique({ where: { userId: user!.id } });
      if (!myStartup) {
        return NextResponse.json(
          { error: "No startup profile found. Complete your profile first." },
          { status: 400 }
        );
      }

      // Get all partner organizations
      const allOrgs = await prisma.organization.findMany();
      if (allOrgs.length === 0) {
        return NextResponse.json([]);
      }

      // Build lightweight snapshots to send to the AI (avoid sending huge rawProfile blobs)
      const startupSnapshot = {
        id: myStartup.id,
        name: myStartup.name,
        industry: myStartup.industry,
        stage: myStartup.stage,
        technologies: safeParseJson(myStartup.technology, []),
        goals: safeParseJson(myStartup.goals, []),
        capabilities: safeParseJson(myStartup.capabilities, []),
        fundingNeed: myStartup.fundingNeed,
        customerTypes: safeParseJson(myStartup.customerType, []),
        targetMarkets: safeParseJson(myStartup.market, []),
      };

      const orgSnapshots = allOrgs.map((o) => {
        const attrs = safeParseJson(o.attrs, {});
        return {
          organizationId: o.id,
          name: o.name,
          orgType: o.orgType,
          industry: o.industry,
          country: o.country,
          preferredStartupStage: o.preferredStartupStage,
          innovationPriorities: attrs.innovationPriorities || [],
          technologyInterests: attrs.technologyInterests || [],
          investmentStages: attrs.investmentStages || [],
          researchFields: attrs.researchFields || [],
          industries: attrs.industries || [],
        };
      });

      // Call Agent 3
      const aiMatches = await matchStartupWithOrgs(startupSnapshot, orgSnapshots);

      // Build enriched response and persist match scores to DB
      const results = await Promise.all(
        aiMatches.map(async (m) => {
          const org = allOrgs.find((o) => o.id === m.organizationId);
          if (!org) return null;

          const attrs = safeParseJson(org.attrs, {});

          // Upsert the Match row with AI score
          try {
            await prisma.match.upsert({
              where: {
                startupId_organizationId: {
                  startupId: myStartup.id,
                  organizationId: org.id,
                },
              },
              create: {
                startupId: myStartup.id,
                organizationId: org.id,
                score: Math.round(m.score),
                collaborationType: m.collabTypes[0] || null,
                shortReason: m.shortReason,
                status: "pending",
              },
              update: {
                score: Math.round(m.score),
                collaborationType: m.collabTypes[0] || null,
                shortReason: m.shortReason,
              },
            });
          } catch {
            // Non-fatal — match row may have a unique constraint violation in edge cases
          }

          return {
            id: org.id,
            orgName: org.name,
            orgType: org.orgType,
            description: attrs.description || org.industry,
            investmentRange: attrs.investmentRange,
            budget: org.budget ? `$${org.budget}` : null,
            matchScore: m.score,
            location: { city: "N/A", country: org.country },
            preferredStartupStage: org.preferredStartupStage ? [org.preferredStartupStage] : [],
            investmentStages: attrs.investmentStages || [],
            innovationPriorities: attrs.innovationPriorities || [],
            researchFields: attrs.researchFields || [],
            industries: attrs.industries || [],
            technologyInterests: attrs.technologyInterests || [],
            collabTypes: m.collabTypes,
            shortReason: m.shortReason,
          };
        })
      );

      return NextResponse.json(results.filter(Boolean));
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function safeParseJson(value: string | null | undefined, fallback: any): any {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
