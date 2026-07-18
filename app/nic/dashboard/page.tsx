"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/nic/StatsCard";
import { SectorChart } from "@/components/nic/SectorChart";
import { FundingChart } from "@/components/nic/FundingChart";
import { useI18n } from "@/lib/i18n";
import {
  MOCK_NIC_STATS,
  MOCK_SECTOR_DATA,
  MOCK_FUNDING_DEMAND,
  MOCK_RECOMMENDATION_TRENDS,
  MOCK_NIC_STARTUPS,
} from "@/lib/mock-data";
import {
  FileText,
  Link2,
  Calendar,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
      : score >= 60
      ? "bg-[var(--color-warning-light)] text-[var(--color-warning)]"
      : "bg-[var(--color-accent-light)] text-accent";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
        color
      )}
    >
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "active"
      ? "badge-success"
      : status === "pending"
      ? "badge-warning"
      : "badge-primary";
  return <span className={cls}>{status}</span>;
}

export default function NICDashboardPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const stats = MOCK_NIC_STATS;
  const recentStartups = MOCK_NIC_STARTUPS.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("nic.dashboard.title")}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {t("nic.dashboard.subtitle")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-primary-light)] text-primary text-xs font-semibold self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5" />
            {todayLabel()}
          </span>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={t("nic.stats.applications")}
            value={stats.totalApplications}
            icon={FileText}
            color="primary"
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title={t("nic.stats.matches")}
            value={stats.totalMatches}
            icon={Link2}
            color="accent"
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title={t("nic.stats.meetings")}
            value={stats.totalMeetings}
            icon={Calendar}
            color="success"
            trend={{ value: 5, positive: true }}
          />
          <StatsCard
            title={t("nic.stats.success")}
            value={stats.successRate}
            icon={TrendingUp}
            color="warning"
            suffix="%"
            trend={{ value: 3, positive: true }}
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 min-h-[340px]">
            <SectorChart data={MOCK_SECTOR_DATA} lang={lang} />
          </div>
          <div className="lg:col-span-2 min-h-[340px]">
            <FundingChart
              data={MOCK_FUNDING_DEMAND}
              type="funding"
              lang={lang}
            />
          </div>
        </div>

        {/* ── Trend Chart ── */}
        <div className="min-h-[300px]">
          <FundingChart
            data={MOCK_RECOMMENDATION_TRENDS}
            type="trend"
            lang={lang}
          />
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Review Pending Startups */}
            <button
              onClick={() => router.push("/nic/startups")}
              className="card card-hover flex items-center justify-between group cursor-pointer text-left"
            >
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Review Pending Startups
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {stats.activeStartups} active
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-primary transition-colors" />
            </button>

            {/* View Meeting Schedule */}
            <button
              onClick={() => router.push("/nic/meetings")}
              className="card card-hover flex items-center justify-between group cursor-pointer text-left"
            >
              <div>
                <p className="font-semibold text-sm text-foreground">
                  View Meeting Schedule
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {stats.totalMeetings} meetings
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-primary transition-colors" />
            </button>

            {/* Export Report */}
            <button
              onClick={() => {}}
              className="card card-hover flex items-center justify-between group cursor-pointer text-left"
            >
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Export Report
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  PDF / CSV
                </p>
              </div>
              <Download className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* ── Recent Startups Table ── */}
        <div className="card !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              Recent Startups
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-border">
                  {["Name", "Sector", "Stage", "Score", "Status"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentStartups.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-surface transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {s.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      {s.sector}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      {s.stage}
                    </td>
                    <td className="px-6 py-4">
                      <ScoreBadge score={s.score} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
