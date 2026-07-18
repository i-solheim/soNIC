"use client";

import { useEffect, useRef, useState } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorVariant = "primary" | "accent" | "success" | "warning";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  color?: ColorVariant;
  suffix?: string;
}

const colorMap: Record<ColorVariant, { bg: string; text: string; iconBg: string }> = {
  primary: {
    bg: "bg-[var(--color-primary-light)]",
    text: "text-primary",
    iconBg: "bg-[var(--color-primary-light)]",
  },
  accent: {
    bg: "bg-[var(--color-accent-light)]",
    text: "text-accent",
    iconBg: "bg-[var(--color-accent-light)]",
  },
  success: {
    bg: "bg-[var(--color-success-light)]",
    text: "text-[var(--color-success)]",
    iconBg: "bg-[var(--color-success-light)]",
  },
  warning: {
    bg: "bg-[var(--color-warning-light)]",
    text: "text-[var(--color-warning)]",
    iconBg: "bg-[var(--color-warning-light)]",
  },
};

function useCountUp(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  suffix = "",
}: StatsCardProps) {
  const colors = colorMap[color];
  const isNumeric = typeof value === "number";
  const numericTarget = isNumeric ? (value as number) : 0;
  const counted = useCountUp(numericTarget);

  const displayValue = isNumeric ? `${counted}${suffix}` : `${value}${suffix}`;

  return (
    <div className="card flex flex-col gap-4 hover:shadow-[var(--shadow-md)] transition-all duration-300">
      {/* Icon + Trend row */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            colors.iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", colors.text)} />
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
              trend.positive
                ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
                : "bg-[var(--color-accent-light)] text-accent"
            )}
          >
            {trend.positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {displayValue}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 font-medium">
          {title}
        </p>
      </div>
    </div>
  );
}
