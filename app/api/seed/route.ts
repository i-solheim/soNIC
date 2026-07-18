import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { MOCK_PARTNER_PROFILES, MOCK_STARTUP_PROFILE } from "@/lib/mock-data";
import { getAuthedUser, checkRole } from "@/lib/auth-server";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  const seedKey = request.headers.get("x-seed-key");
  if (!seedKey || seedKey !== process.env.SEED_SECRET) {
    const { user, error } = await getAuthedUser(request);
    if (error) return NextResponse.json(error.body, { status: error.status });

    const roleError = checkRole(user!.role, "nic");
    if (roleError) return NextResponse.json(roleError.body, { status: roleError.status });
  }

  try {
    // Clear existing data
    await prisma.email.deleteMany({});
    await prisma.meeting.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.startup.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.profile.deleteMany({});

    const hashedPw = await bcrypt.hash("password", 10);
    const hashedPwPartner = await bcrypt.hash("pw", 10);

    // Create a mock startup profile
    const startupProfile = await prisma.profile.create({
      data: {
        id: "mock_startup_user",
        email: "startup@sonic.vn",
        password: hashedPw,
        role: "startup",
        name: "Test Startup"
      }
    });

    // Create a mock partner profile
    const partnerProfile = await prisma.profile.create({
      data: {
        id: "mock_partner_user",
        email: "partner@sonic.vn",
        password: hashedPw,
        role: "partner",
        name: "Test Partner"
      }
    });

    // Load real dataset
    const datasetPath = process.cwd() + '/dataset-partners.json';
    const fs = require('fs');
    let realPartners: any[] = [];
    try {
      const data = fs.readFileSync(datasetPath, 'utf8');
      realPartners = JSON.parse(data);
    } catch (e) {
      console.warn("Could not read dataset-partners.json", e);
    }

    // Insert all real partners as separate profiles
    for (const p of realPartners) {
      const u = await prisma.profile.create({
        data: {
          id: p.organization_id,
          email: `${p.organization_id}@partner.com`,
          password: hashedPwPartner,
          role: "partner",
          name: p.name
        }
      });
      await prisma.organization.create({
        data: {
          id: p.organization_id,
          userId: u.id,
          orgType: p.org_type.toLowerCase() === "corporation" ? "corporation" : "investor",
          name: p.name,
          industry: p.industry?.[0] || "",
          country: p.country || "",
          preferredStartupStage: p.preferred_startup_stage?.[0]?.toLowerCase() || "seed",
          budget: p.funding?.annual_rnd_budget_usd ? Number(p.funding.annual_rnd_budget_usd) : null,
          attrs: JSON.stringify({
            investmentRange: p.investment?.check_size_usd ? `${p.investment.check_size_usd.min}-${p.investment.check_size_usd.max}` : null,
            matchScore: p.ai_profile?.readiness_score || 85,
            investmentStages: p.investment?.investment_stage || [],
            innovationPriorities: p.innovation_priorities || [],
            researchFields: p.research_fields || [],
            industries: p.industry || [],
            technologyInterests: p.technologies || []
          })
        }
      });
    }

    // Insert mock startup
    for (const s of [MOCK_STARTUP_PROFILE]) {
      const u = await prisma.profile.create({
        data: {
          id: s.id,
          email: `${s.id}@startup.com`,
          password: hashedPw,
          role: "startup",
          name: s.companyName
        }
      });
      await prisma.startup.create({
        data: {
          id: s.id,
          userId: u.id,
          name: s.companyName,
          industry: s.industry,
          location: s.location,
          stage: s.stage,
          employees: s.employees,
          technology: JSON.stringify(s.technologies || []),
          problem: s.problemStatement,
          solution: s.solution,
          customerType: JSON.stringify(s.customerTypes || []),
          market: JSON.stringify(s.targetMarkets || []),
          businessModel: JSON.stringify(s.businessModels || []),
          fundingNeed: s.fundingNeed,
          growth: JSON.stringify({ users: s.users, revenue: s.monthlyRevenue, monthlyGrowthRate: s.monthlyGrowthRate }),
          goals: JSON.stringify(s.goals || []),
          capabilities: JSON.stringify(s.capabilities || []),
          readinessScore: s.readinessScore,
          isProfileComplete: s.profileStatus === "complete",
          rawProfile: JSON.stringify(s)
        }
      });
    }

    return NextResponse.json({ message: "Seed successful!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
