import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser, checkRole } from "@/lib/auth-server";

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

      // Return partners for a startup to view
      const partners = await prisma.organization.findMany();
      const formatted = partners.map(p => {
        let attrs = {} as any;
        try { attrs = JSON.parse(p.attrs); } catch(e){}
        return {
          id: p.id,
          orgName: p.name,
          orgType: p.orgType,
          description: attrs?.description || p.industry,
          investmentRange: attrs?.investmentRange,
          budget: p.budget ? `$${p.budget}` : null,
          matchScore: attrs?.matchScore || 80,
          location: { city: "N/A", country: p.country },
          preferredStartupStage: p.preferredStartupStage ? [p.preferredStartupStage] : [],
          investmentStages: attrs?.investmentStages || [],
          innovationPriorities: attrs?.innovationPriorities || [],
          researchFields: attrs?.researchFields || [],
          industries: attrs?.industries || [],
          technologyInterests: attrs?.technologyInterests || []
        };
      });
      return NextResponse.json(formatted);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
