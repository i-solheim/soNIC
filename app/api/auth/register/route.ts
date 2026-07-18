import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, orgType } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = await prisma.profile.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role,
      },
    });

    if (role === "startup") {
      await prisma.startup.create({
        data: {
          userId: profile.id,
          name: name || "",
        }
      });
    } else if (role === "partner") {
      await prisma.organization.create({
        data: {
          userId: profile.id,
          name: name || "",
          orgType: orgType || "corporation",
        }
      });
    }

    const token = jwt.sign({ sub: profile.id, role: profile.role }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return NextResponse.json({
      token,
      user: { id: profile.id, email: profile.email, name: profile.name, role: profile.role, orgType },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
