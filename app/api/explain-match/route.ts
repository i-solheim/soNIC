import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthedUser } from "@/lib/auth-server";
import {
  MOCK_CAPABILITY_COMPARISON,
  MOCK_ROADMAP,
} from "@/lib/mock-data";

const FALLBACK_COMPARISON = {
  startupHas: ["AI expertise", "Healthcare datasets", "Clinical partnerships"],
  startupHasVi: ["Chuyên môn AI", "Tập dữ liệu y tế", "Đối tác lâm sàng"],
  orgNeeds: ["AI-powered tool", "Clinical data access", "Proven results"],
  orgNeedsVi: ["Công cụ AI", "Truy cập dữ liệu lâm sàng", "Kết quả đã chứng minh"],
};

const FALLBACK_ROADMAP = [
  {
    timeLabel: "Week 1",
    timeLabelVi: "Tuần 1",
    milestone: "Intro Meeting",
    milestoneVi: "Cuộc họp giới thiệu",
    type: "meeting" as const,
  },
  {
    timeLabel: "Month 1",
    timeLabelVi: "Tháng 1",
    milestone: "Pilot Phase",
    milestoneVi: "Giai đoạn thí điểm",
    type: "pilot" as const,
  },
];

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthedUser(request);
  if (error) return NextResponse.json(error.body, { status: error.status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing match ID" }, { status: 400 });
  }

  const match = await prisma.match.findUnique({
    where: { id },
    include: { startup: true, organization: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Check auth authorization: only the startup or the organization involved (or nic) can see the explanation
  if (
    user!.role !== "nic" &&
    match.startup.userId !== user!.id &&
    match.organization.userId !== user!.id
  ) {
    return NextResponse.json(
      { error: "Forbidden", message: "You do not have permission to view this match." },
      { status: 403 }
    );
  }

  const capabilityComparison = (MOCK_CAPABILITY_COMPARISON as any)[id] || FALLBACK_COMPARISON;
  const roadmap = (MOCK_ROADMAP as any)[id] || FALLBACK_ROADMAP;

  return NextResponse.json({
    match,
    capabilityComparison,
    roadmap,
  });
}
