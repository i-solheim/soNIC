"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { MatchResult } from "@/lib/types";

// ── Helpers ────────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 85) return { bg: "bg-[var(--color-success)]", text: "text-white" };
  if (score >= 70) return { bg: "bg-[var(--color-warning)]", text: "text-white" };
  return { bg: "bg-accent", text: "text-white" };
}

function statusLabel(status: MatchResult["status"], t: (k: any) => string) {
  const map: Record<MatchResult["status"], string> = {
    pending: t("matches.status.pending"),
    interested: t("matches.status.interested"),
    meeting_scheduled: t("matches.status.meeting"),
    deal_closed: t("matches.status.closed"),
    declined: "Declined",
  };
  return map[status];
}

function statusBadgeClass(status: MatchResult["status"]) {
  if (status === "meeting_scheduled") return "badge-primary";
  if (status === "deal_closed") return "badge-success";
  if (status === "interested") return "badge-accent";
  if (status === "declined") return "badge-warning";
  return "badge-warning";
}

function orgTypeLabel(type: string) {
  const map: Record<string, string> = {
    corporation: "Corporation",
    vc_fund: "VC Fund",
    university: "University",
    research_institute: "Research Institute",
  };
  return map[type] ?? type;
}

// ── Props ──────────────────────────────────────────────────────────────────
interface MatchCardProps {
  match: MatchResult;
  onViewDetail: () => void;
  onExpressInterest: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────
export function MatchCard({ match, onViewDetail, onExpressInterest }: MatchCardProps) {
  const { t, lang } = useI18n();
  const partner = match.partner;
  const { bg, text } = scoreColor(match.score);
  const explanation = lang === "vi" ? match.aiExplanationVi : match.aiExplanation;

  return (
    <motion.div
      className="card-hover relative flex flex-col gap-4"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Score badge — top right */}
      <div
        className={cn(
          "absolute top-4 right-4 w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg",
          bg,
          text
        )}
      >
        <span className="text-sm font-bold leading-none">{match.score}%</span>
        <span className="text-[9px] font-medium opacity-80 mt-0.5">match</span>
      </div>

      {/* Header */}
      <div className="pr-16">
        <h3 className="text-base font-bold text-foreground leading-tight">
          {partner?.orgName ?? "—"}
        </h3>
        {partner?.orgType && (
          <div className="mt-2">
            <span className="badge-primary">{orgTypeLabel(partner.orgType)}</span>
          </div>
        )}
      </div>

      {/* Collab type tags */}
      {match.collabTypes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {match.collabTypes.map((type, i) => (
            <span key={type} className={i === 0 ? "badge-accent" : "badge-primary"}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      )}

      {/* AI Explanation — truncated */}
      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
        {explanation}
      </p>

      {/* Status + divider */}
      <div className="flex items-center gap-2 pt-1">
        <span className={statusBadgeClass(match.status)}>
          {statusLabel(match.status, t)}
        </span>
        <span className="text-xs text-[var(--color-text-subtle)]">
          {new Date(match.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-border">
        <button
          onClick={onViewDetail}
          className="btn-outline flex-1 py-2 text-xs px-3"
        >
          {t("matches.viewDetail")}
        </button>
        <button
          onClick={onExpressInterest}
          className="btn-primary flex-1 py-2 text-xs px-3"
        >
          {t("matches.express")}
        </button>
      </div>
    </motion.div>
  );
}
