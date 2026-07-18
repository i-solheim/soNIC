import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser } from "@/lib/auth-server";

export async function POST(request: Request) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  try {
    const { toUserId } = await request.json();
    if (!toUserId) {
      return NextResponse.json({ error: "Missing toUserId" }, { status: 400 });
    }

    let startupId: string | null = null;
    let organizationId: string | null = null;

    if (user!.role === "startup") {
      const myStartup = await prisma.startup.findUnique({ where: { userId: user!.id } });
      if (!myStartup) {
        return NextResponse.json({ error: "No startup profile found for current user" }, { status: 400 });
      }
      startupId = myStartup.id;

      // toUserId is the Organization's own primary key, as returned by /api/matches?type=startup
      const org = await prisma.organization.findUnique({ where: { id: toUserId } });
      if (!org) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }
      organizationId = org.id;
    } else if (user!.role === "partner") {
      const myOrg = await prisma.organization.findUnique({ where: { userId: user!.id } });
      if (!myOrg) {
        return NextResponse.json({ error: "No organization profile found for current user" }, { status: 400 });
      }
      organizationId = myOrg.id;

      // toUserId is the Startup's own primary key, as returned by /api/matches?type=partner
      const startup = await prisma.startup.findUnique({ where: { id: toUserId } });
      if (!startup) {
        return NextResponse.json({ error: "Startup not found" }, { status: 404 });
      }
      startupId = startup.id;
    } else {
      return NextResponse.json(
        { error: "Forbidden", message: "Only startup or partner roles can like a match." },
        { status: 403 }
      );
    }

    const match = await prisma.match.create({
      data: { startupId, organizationId, status: "pending" },
    });

    return NextResponse.json(match);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Match already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
