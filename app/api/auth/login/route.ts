import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { email: email.toLowerCase() } });

    if (!profile || !profile.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, profile.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ sub: profile.id, role: profile.role }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return NextResponse.json({
      token,
      user: { id: profile.id, email: profile.email, name: profile.name, role: profile.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
