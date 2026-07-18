import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_MATCHES,
  MOCK_CAPABILITY_COMPARISON,
  MOCK_ROADMAP,
  MOCK_STARTUP_PROFILE,
  MOCK_PARTNER_PROFILES,
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing match ID" }, { status: 400 });
  }

  const match = MOCK_MATCHES.find((m) => m.id === id);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Populate startup and partner info
  const populatedMatch = {
    ...match,
    startup: match.startup || (match.startupId === MOCK_STARTUP_PROFILE.id ? MOCK_STARTUP_PROFILE : undefined),
    partner: match.partner || MOCK_PARTNER_PROFILES.find((p) => p.id === match.partnerId),
  };

  const capabilityComparison = (MOCK_CAPABILITY_COMPARISON as any)[id] || FALLBACK_COMPARISON;
  const roadmap = (MOCK_ROADMAP as any)[id] || FALLBACK_ROADMAP;

  return NextResponse.json({
    match: populatedMatch,
    capabilityComparison,
    roadmap,
  });
}
