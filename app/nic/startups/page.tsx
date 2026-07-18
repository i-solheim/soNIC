"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/lib/i18n";
import { MOCK_NIC_STARTUPS } from "@/lib/mock-data";
import { Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "pending" | "review";

const STATUS_FILTERS: StatusFilter[] = ["all", "active", "pending", "review"];

function ReadinessBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-[var(--color-success)]"
      : score >= 60
      ? "bg-[var(--color-warning)]"
      : "bg-accent";

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground tabular-nums w-8 text-right">
        {score}
      </span>
    </div>
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

export default function NICStartupsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return MOCK_NIC_STARTUPS.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("nic.startups.title")}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {filtered.length} startups
            </p>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              className="input pl-9"
              placeholder={t("nic.startups.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 capitalize",
                  statusFilter === f
                    ? "bg-primary text-white shadow-[var(--shadow-sm)]"
                    : "bg-surface text-[var(--color-text-muted)] hover:bg-[var(--color-primary-light)] hover:text-primary border border-border"
                )}
              >
                {f === "all" ? t("common.all") : f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-border">
                  {["#", "Startup Name", "Sector", "Stage", "Readiness Score", "Status", "Matches", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-12 text-center text-sm text-[var(--color-text-muted)]"
                      >
                        {t("common.noData")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, i) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{
                          duration: 0.22,
                          delay: i * 0.04,
                          ease: "easeOut",
                        }}
                        className="border-b border-border last:border-0 hover:bg-surface transition-colors duration-150"
                      >
                        <td className="px-4 py-4 text-sm text-[var(--color-text-muted)] font-medium">
                          {i + 1}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-foreground">
                          {s.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">
                          {s.sector}
                        </td>
                        <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">
                          {s.stage}
                        </td>
                        <td className="px-4 py-4">
                          <ReadinessBar score={s.score} />
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground font-medium text-center">
                          {s.matches}
                        </td>
                        <td className="px-4 py-4">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border text-[var(--color-text-muted)] hover:bg-[var(--color-primary-light)] hover:text-primary hover:border-primary transition-all duration-150">
                            <Eye className="w-3.5 h-3.5" />
                            {t("common.view")}
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
