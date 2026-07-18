import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { fromUserId, toUserId } = await request.json();

    if (!fromUserId || !toUserId) {
      return NextResponse.json({ error: "Missing fromUserId or toUserId" }, { status: 400 });
    }

    // Try to find the startup and organization from the given user IDs
    let startupId = null;
    let organizationId = null;

    const startup1 = await prisma.startup.findUnique({ where: { userId: fromUserId } });
    if (startup1) startupId = startup1.id;
    const startup2 = await prisma.startup.findUnique({ where: { userId: toUserId } });
    if (startup2) startupId = startup2.id;

    const org1 = await prisma.organization.findUnique({ where: { userId: fromUserId } });
    if (org1) organizationId = org1.id;
    const org2 = await prisma.organization.findUnique({ where: { userId: toUserId } });
    if (org2) organizationId = org2.id;

    if (!startupId || !organizationId) {
      return NextResponse.json({ error: "Could not resolve Startup and Organization from given User IDs" }, { status: 400 });
    }

    const match = await prisma.match.create({
      data: {
        startupId,
        organizationId,
        status: "pending"
      }
    });

    return NextResponse.json(match);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Match already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
