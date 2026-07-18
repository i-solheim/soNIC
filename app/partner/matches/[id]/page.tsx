"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, AlertTriangle, Calendar, Heart } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CapabilityComparison } from "@/components/startup/CapabilityComparison";
import { CollaborationRoadmap } from "@/components/startup/CollaborationRoadmap";
import { useI18n } from "@/lib/i18n";
import { MatchResult } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? "var(--color-success)" : score >= 70 ? "var(--color-primary)" : "var(--color-warning)";

  return (
    <div className="score-ring relative w-20 h-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-foreground leading-none">{score}%</span>
        <span className="text-[9px] font-semibold text-[var(--color-text-subtle)] mt-0.5 uppercase tracking-wider">match</span>
      </div>
    </div>
  );
}

// ── Status Badge helper ──────────────────────────────────────────────────────
function statusBadge(status: string, t: (k: any) => string) {
  const map: Record<string, string> = {
    pending: "badge-warning",
    interested: "badge-accent",
    meeting_scheduled: "badge-primary",
    deal_closed: "badge-success",
    declined: "badge-warning",
  };
  const labelMap: Record<string, string> = {
    pending: t("matches.status.pending"),
    interested: t("matches.status.interested"),
    meeting_scheduled: t("matches.status.meeting"),
    deal_closed: t("matches.status.closed"),
    declined: "Declined",
  };
  return { cls: map[status] ?? "badge-primary", label: labelMap[status] ?? status };
}

// ── Skeleton Loader Component ──────────────────────────────────────────────
function MatchDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Back button */}
      <div className="h-9 w-24 bg-surface rounded-xl" />

      {/* Header card */}
      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-surface rounded-full" />
              <div className="h-5 w-24 bg-surface rounded-full" />
            </div>
            <div className="h-8 w-2/3 bg-surface rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-surface rounded-lg" />
              <div className="h-4 w-5/6 bg-surface rounded-lg" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-16 bg-surface rounded-full" />
              <div className="h-5 w-16 bg-surface rounded-full" />
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-surface flex-shrink-0" />
        </div>
      </div>

      {/* AI Explanation */}
      <div className="card space-y-3 border-l-4 border-l-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-surface rounded-full" />
          <div className="h-5 w-32 bg-surface rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-surface rounded-lg" />
          <div className="h-4 w-full bg-surface rounded-lg" />
          <div className="h-4 w-3/4 bg-surface rounded-lg" />
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-3">
        <div className="h-5 w-32 bg-surface rounded-lg" />
        <div className="card p-0 overflow-hidden divide-y divide-border">
          <div className="grid grid-cols-2 bg-surface h-10" />
          <div className="grid grid-cols-2 h-12 px-5 py-3" />
          <div className="grid grid-cols-2 h-12 px-5 py-3" />
          <div className="grid grid-cols-2 h-12 px-5 py-3" />
        </div>
      </div>

      {/* Roadmap */}
      <div className="space-y-4">
        <div className="h-5 w-24 bg-surface rounded-lg" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-5">
              <div className="w-24 flex justify-end">
                <div className="h-5 w-16 bg-surface rounded-full" />
              </div>
              <div className="w-4 h-4 rounded-full bg-surface mt-1" />
              <div className="flex-1 card p-4">
                <div className="h-4 w-1/2 bg-surface rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PartnerMatchDetailPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<{
    match: MatchResult;
    capabilityComparison: any;
    roadmap: any;
  } | null>(null);
  const [expressed, setExpressed] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`/api/explain-match?id=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("sonic_token")}` }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch match details");
        }
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setExpressed(json.match.status === "interested");
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title={t("match.detail.title")}>
        <MatchDetailSkeleton />
      </DashboardLayout>
    );
  }

  // 404 or Fetch Error fallback
  if (error || !data || !data.match) {
    return (
      <DashboardLayout title={t("match.detail.title")}>
        <div className="card flex flex-col items-center gap-4 py-20 text-center max-w-md mx-auto">
          <AlertTriangle className="w-14 h-14 text-[var(--color-warning)]" />
          <div>
            <p className="text-lg font-bold text-foreground">Match not found</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              The match you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
          <button
            onClick={() => router.push("/partner/matches")}
            className="btn-outline mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("match.detail.back")}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { match, capabilityComparison, roadmap } = data;
  const startup = match.startup;
  const explanation = lang === "vi" ? match.aiExplanationVi : match.aiExplanation;

  const capStartupHas = lang === "vi" ? capabilityComparison.startupHasVi : capabilityComparison.startupHas;
  const capOrgNeeds = lang === "vi" ? capabilityComparison.orgNeedsVi : capabilityComparison.orgNeeds;

  const { cls: statusCls, label: statusLabel } = statusBadge(match.status, t);

  return (
    <DashboardLayout title={t("match.detail.title")}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── Back button ── */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push("/partner/matches")}
          className="btn-ghost -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("match.detail.back")}
        </motion.button>

        {/* ── Header card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card"
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            {/* Left: startup info + tags */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {startup?.industry && (
                  <span className="badge-primary">{startup.industry}</span>
                )}
                <span className={statusCls}>{statusLabel}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {startup?.companyName ?? "—"}
              </h1>
              {startup?.tagline && (
                <p className="text-sm font-medium text-primary mt-1.5">
                  {startup.tagline}
                </p>
              )}
              {startup?.aiSummary && (
                <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
                  {startup.aiSummary}
                </p>
              )}

              {/* Collab type tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {match.collabTypes.map((ct, i) => (
                  <span key={ct} className={i === 0 ? "badge-accent" : "badge-primary"}>
                    {ct.charAt(0).toUpperCase() + ct.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: circular score circle */}
            <div className="flex-shrink-0">
              <ScoreCircle score={match.score} />
            </div>
          </div>
        </motion.div>

        {/* ── AI Explanation ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card border-l-4 border-l-primary"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              {t("match.detail.aiExplanation")}
            </h2>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
        </motion.div>

        {/* ── Capability Comparison ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h2 className="text-base font-bold text-foreground mb-4">
            {t("match.detail.capabilities")}
          </h2>
          <CapabilityComparison
            startupHas={capStartupHas}
            orgNeeds={capOrgNeeds}
            startupHasLabel={lang === "vi" ? "Startup Có" : "Startup Has"}
            orgNeedsLabel={lang === "vi" ? "Bạn Cần" : "You Need"}
          />
        </motion.div>

        {/* ── Collaboration Roadmap ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h2 className="text-base font-bold text-foreground mb-6">
            {t("match.detail.roadmap")}
          </h2>
          <CollaborationRoadmap steps={roadmap} lang={lang} />
        </motion.div>

        {/* ── Action bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="card flex flex-col sm:flex-row gap-3 sticky bottom-6"
        >
          <button className="btn-primary flex-1">
            <Calendar className="w-4 h-4" />
            {t("match.detail.scheduleMeeting")}
          </button>
          <button
            className={cn("flex-1 text-sm py-3 rounded-xl font-semibold border-2 transition-all duration-200 inline-flex items-center justify-center gap-2",
              expressed
                ? "border-transparent text-white"
                : "border-accent text-accent hover:bg-accent hover:text-white"
            )}
            style={expressed ? { background: "var(--color-accent)" } : {}}
            onClick={() => setExpressed((v) => !v)}
          >
            <Heart className={cn("w-4 h-4", expressed && "fill-current")} />
            {expressed ? "Interested!" : t("matches.express")}
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
