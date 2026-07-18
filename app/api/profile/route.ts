import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser, checkRole } from "@/lib/auth-server";

export async function GET(request: Request) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");

  if (!requestedUserId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  // A user should only be able to fetch their own profile unless role === "nic"
  if (user!.id !== requestedUserId && user!.role !== "nic") {
    return NextResponse.json(
      { error: "Forbidden", message: "You can only access your own profile." },
      { status: 403 }
    );
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: requestedUserId },
      include: { startup: true, organization: true }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
