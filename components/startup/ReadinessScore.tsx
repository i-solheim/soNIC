"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { ReadinessCheck } from "@/lib/types";

// ── Props ──────────────────────────────────────────────────────────────────
interface ReadinessScoreProps {
  score: number;
  checks: ReadinessCheck[];
  size?: number;
}

// ── Status icon map ────────────────────────────────────────────────────────
function StatusIcon({ status }: { status: ReadinessCheck["status"] }) {
  if (status === "pass")
    return <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[var(--color-success)]" />;
  if (status === "warning")
    return <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[var(--color-warning)]" />;
  return <XCircle className="w-4 h-4 flex-shrink-0 text-accent" />;
}

function statusBg(status: ReadinessCheck["status"]) {
  if (status === "pass") return "bg-[var(--color-success-light)]";
  if (status === "warning") return "bg-[var(--color-warning-light)]";
  return "bg-[var(--color-accent-light)]";
}

// ── Animated counter ───────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value, motionVal]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

// ── Main component ─────────────────────────────────────────────────────────
export function ReadinessScore({ score, checks, size = 200 }: ReadinessScoreProps) {
  const { lang } = useI18n();

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // animate dashoffset from circumference → target
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ── Donut Chart ── */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-label={`Readiness score: ${score}%`}
        >
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground leading-none">
            <AnimatedNumber value={score} />
            <span className="text-xl">%</span>
          </span>
          <span className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
            Readiness
          </span>
        </div>
      </div>

      {/* ── Checklist ── */}
      <ul className="w-full space-y-2">
        {checks.map((check, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              statusBg(check.status)
            )}
          >
            <StatusIcon status={check.status} />
            <span className="text-sm font-medium text-foreground">
              {lang === "vi" ? check.labelVi : check.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
