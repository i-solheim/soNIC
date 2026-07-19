"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useSearchParams } from "next/navigation";

const PARTNER_MOCK_MATCHES = [
  {
    id: "m1",
    startupId: "sp1",
    partnerId: "pp1",
    score: 94,
    collabTypes: ["pilot"],
    status: "interested",
    startup: {
      companyName: "MediAI Vietnam",
      industry: "HealthTech",
    }
  },
  {
    id: "m2",
    startupId: "sp2",
    partnerId: "pp1",
    score: 88,
    collabTypes: ["investment"],
    status: "meeting_scheduled",
    startup: {
      companyName: "EduFlow",
      industry: "EdTech",
    }
  }
];

export default function PartnerMessagesPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const searchParams = useSearchParams();

  if (!user) return null;

  const startupId = searchParams.get('startupId');
  const initialMatch = startupId ? PARTNER_MOCK_MATCHES.find(m => m.startupId === startupId) : undefined;
  const initialActiveMatchId = initialMatch?.id || PARTNER_MOCK_MATCHES[0].id;

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("nav.messages" as any, "Messages")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("common.search" as any, "Communicate directly with your matched startups.")}
          </p>
        </div>

        <ChatInterface
          matches={PARTNER_MOCK_MATCHES}
          currentUserId={user.id}
          role="partner"
          initialActiveMatchId={initialActiveMatchId}
        />
      </div>
    </DashboardLayout>
  );
}
