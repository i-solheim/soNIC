"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { MOCK_MATCHES } from "@/lib/mock-data";

export default function PartnerMessagesPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user) return null;

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
          matches={MOCK_MATCHES}
          currentUserId={user.id}
          role="partner"
        />
      </div>
    </DashboardLayout>
  );
}
