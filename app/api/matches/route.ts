import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser, checkRole } from "@/lib/auth-server";
import { matchStartupWithOrgs, matchOrgWithStartups } from "@/lib/agents/match";

export async function GET(request: Request) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "partner" or "startup"
  const refresh = searchParams.get("refresh") === "true";

  try {
    if (type === "partner") {
      const roleError = checkRole(user!.role, "partner", "nic");
      if (roleError) return NextResponse.json(roleError.body, { status: roleError.status });

      // Find the authenticated user's own Organization record
      const myOrg = await prisma.organization.findUnique({ where: { userId: user!.id } });
      if (!myOrg) {
        return NextResponse.json(
          { error: "No organization profile found. Complete your profile first." },
          { status: 400 }
        );
      }

      // If not forcing a refresh, check if we have cached matches
      if (!refresh) {
        const existingMatches = await prisma.match.findMany({
          where: { organizationId: myOrg.id },
          include: { startup: true },
          orderBy: { score: "desc" },
        });

        if (existingMatches.length > 0) {
          const results = existingMatches.map((m) => {
            const startup = m.startup;
            if (!startup) return null;
            const growth = safeParseJson(startup.growth, {});
            const tech = safeParseJson(startup.technology, []);

            return {
              id: startup.id,
              name: startup.name,
              logo: startup.name ? startup.name.charAt(0) : "S",
              sector: startup.industry || "Tech",
              tagline: startup.tagline || startup.problem || "",
              description: startup.solution || "",
              users: growth?.users || "0",
              budget: startup.fundingNeed ? `$${startup.fundingNeed}` : "$0",
              stage: startup.stage || "seed",
              keywords: tech,
              why: startup.problem || "",
              plan: ["Expand to new markets", "Develop version 2.0"],
              slides: ["Problem", "Solution", "Market", "Traction"],
              video: { title: "Demo Video", dur: "2:30" },
              score: startup.readinessScore || 80,
              matchScore: m.score,
              collabTypes: m.collaborationType ? [m.collaborationType] : [],
              shortReason: m.shortReason,
            };
          });
          // Only return matches above the 80 threshold if returning from DB
          return NextResponse.json(results.filter(Boolean).filter(r => (r?.matchScore || 0) >= 80));
        }
      }

      // Get all candidate startups
      const allStartups = await prisma.startup.findMany();
      if (allStartups.length === 0) {
        return NextResponse.json([]);
      }

      // Build lightweight snapshot of the organization
      const myAttrs = safeParseJson(myOrg.attrs, {});
      const orgSnapshot = {
        id: myOrg.id,
        name: myOrg.name,
        orgType: myOrg.orgType,
        industry: myOrg.industry,
        country: myOrg.country,
        preferredStartupStage: myOrg.preferredStartupStage,
        innovationPriorities: myAttrs.innovationPriorities || [],
        technologyInterests: myAttrs.technologyInterests || [],
        investmentStages: myAttrs.investmentStages || [],
        researchFields: myAttrs.researchFields || [],
        industries: myAttrs.industries || [],
      };

      // Build lightweight snapshots of all startups
      const startupSnapshots = allStartups.map((s) => ({
        startupId: s.id,
        name: s.name,
        industry: s.industry,
        stage: s.stage,
        technologies: safeParseJson(s.technology, []),
        goals: safeParseJson(s.goals, []),
        capabilities: safeParseJson(s.capabilities, []),
        fundingNeed: s.fundingNeed,
        customerTypes: safeParseJson(s.customerType, []),
        targetMarkets: safeParseJson(s.market, []),
      }));

      // Call Agent 3b
      const aiMatches = await matchOrgWithStartups(orgSnapshot, startupSnapshots);

      // Build enriched response and persist match scores to DB
      const results = await Promise.all(
        aiMatches.map(async (m) => {
          const startup = allStartups.find((s) => s.id === m.startupId);
          if (!startup) return null;

          const growth = safeParseJson(startup.growth, {});
          const tech = safeParseJson(startup.technology, []);

          // Upsert the Match row with AI score
          try {
            await prisma.match.upsert({
              where: {
                startupId_organizationId: {
                  startupId: startup.id,
                  organizationId: myOrg.id,
                },
              },
              create: {
                startupId: startup.id,
                organizationId: myOrg.id,
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
            id: startup.id,
            name: startup.name,
            logo: startup.name ? startup.name.charAt(0) : "S",
            sector: startup.industry || "Tech",
            tagline: startup.tagline || startup.problem || "",
            description: startup.solution || "",
            users: growth?.users || "0",
            budget: startup.fundingNeed ? `$${startup.fundingNeed}` : "$0",
            stage: startup.stage || "seed",
            keywords: tech,
            why: startup.problem || "",
            plan: ["Expand to new markets", "Develop version 2.0"],
            slides: ["Problem", "Solution", "Market", "Traction"],
            video: { title: "Demo Video", dur: "2:30" },
            score: startup.readinessScore || 80,
            matchScore: m.score,
            collabTypes: m.collabTypes,
            shortReason: m.shortReason,
          };
        })
      );

      return NextResponse.json(results.filter(Boolean));
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

      // If not forcing a refresh, check if we have cached matches
      if (!refresh) {
        const existingMatches = await prisma.match.findMany({
          where: { startupId: myStartup.id },
          include: { organization: true },
          orderBy: { score: "desc" },
        });

        if (existingMatches.length > 0) {
          const results = existingMatches.map((m) => {
            const org = m.organization;
            if (!org) return null;
            const attrs = safeParseJson(org.attrs, {});

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
              collabTypes: m.collaborationType ? [m.collaborationType] : [],
              shortReason: m.shortReason,
            };
          });
          // Only return matches above the 80 threshold if returning from DB
          return NextResponse.json(results.filter(Boolean).filter(r => (r?.matchScore || 0) >= 80));
        }
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
