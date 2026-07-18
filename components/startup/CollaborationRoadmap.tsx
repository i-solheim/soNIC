"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RoadmapStep, Language, CollabType } from "@/lib/types";

// ── Props ──────────────────────────────────────────────────────────────────
interface CollaborationRoadmapProps {
  steps: RoadmapStep[];
  lang: Language;
}

// ── Color coding by type ───────────────────────────────────────────────────
type StepType = CollabType | "meeting";

function typeStyle(type: StepType) {
  switch (type) {
    case "meeting":
      return {
        dot: "bg-primary border-primary",
        badge: "badge-primary",
        line: "bg-primary",
        card: "border-[var(--color-primary-light)]",
        glow: "shadow-[0_0_0_4px_var(--color-primary-light)]",
      };
    case "pilot":
      return {
        dot: "bg-accent border-accent",
        badge: "badge-accent",
        line: "bg-accent",
        card: "border-[var(--color-accent-light)]",
        glow: "shadow-[0_0_0_4px_var(--color-accent-light)]",
      };
    case "investment":
      return {
        dot: "bg-[var(--color-success)] border-[var(--color-success)]",
        badge: "badge-success",
        line: "bg-[var(--color-success)]",
        card: "border-[var(--color-success-light)]",
        glow: "shadow-[0_0_0_4px_var(--color-success-light)]",
      };
    case "research":
      return {
        dot: "bg-[var(--color-warning)] border-[var(--color-warning)]",
        badge: "badge-warning",
        line: "bg-[var(--color-warning)]",
        card: "border-[var(--color-warning-light)]",
        glow: "shadow-[0_0_0_4px_var(--color-warning-light)]",
      };
    default:
      return {
        dot: "bg-primary border-primary",
        badge: "badge-primary",
        line: "bg-primary",
        card: "border-[var(--color-primary-light)]",
        glow: "shadow-[0_0_0_4px_var(--color-primary-light)]",
      };
  }
}

// ── Single roadmap step ────────────────────────────────────────────────────
function RoadmapItem({
  step,
  index,
  lang,
  isLast,
}: {
  step: RoadmapStep;
  index: number;
  lang: Language;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const style = typeStyle(step.type);

  const timeLabel = lang === "vi" ? step.timeLabelVi : step.timeLabel;
  const milestone = lang === "vi" ? step.milestoneVi : step.milestone;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex gap-5"
    >
      {/* ── Left: time pill ── */}
      <div className="flex flex-col items-end pt-1 w-24 flex-shrink-0">
        <span className="badge-primary text-[10px] px-2 py-0.5 whitespace-nowrap">
          {timeLabel}
        </span>
      </div>

      {/* ── Center: dot + vertical line ── */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.15, type: "spring", stiffness: 300 }}
          className={cn(
            "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-300",
            style.dot,
            inView && style.glow
          )}
        />
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 min-h-[32px]" style={{ background: "var(--color-border)" }} />
        )}
      </div>

      {/* ── Right: milestone card ── */}
      <div
        className={cn(
          "mb-6 flex-1 bg-card rounded-xl border p-4 shadow-[var(--shadow-sm)]",
          style.card
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {milestone}
          </p>
          <span className={cn(style.badge, "text-[10px] px-2 py-0.5 flex-shrink-0 capitalize")}>
            {step.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function CollaborationRoadmap({ steps, lang }: CollaborationRoadmapProps) {
  return (
    <div className="w-full">
      {steps.map((step, i) => (
        <RoadmapItem
          key={i}
          step={step}
          index={i}
          lang={lang}
          isLast={i === steps.length - 1}
        />
      ))}
    </div>
  );
}
