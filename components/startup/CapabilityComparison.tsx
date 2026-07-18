"use client";

import { CheckCircle, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Props ──────────────────────────────────────────────────────────────────
interface CapabilityComparisonProps {
  startupHas: string[];
  orgNeeds: string[];
  startupHasLabel: string;
  orgNeedsLabel: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export function CapabilityComparison({
  startupHas,
  orgNeeds,
  startupHasLabel,
  orgNeedsLabel,
}: CapabilityComparisonProps) {
  const maxLen = Math.max(startupHas.length, orgNeeds.length);
  const rows = Array.from({ length: maxLen }, (_, i) => ({
    has: startupHas[i] ?? null,
    needs: orgNeeds[i] ?? null,
    isMatch: !!(startupHas[i] && orgNeeds[i]),
  }));

  return (
    <div className="card overflow-hidden p-0">
      {/* Column headers */}
      <div className="grid grid-cols-2">
        <div className="flex items-center gap-2 px-5 py-3 bg-[var(--color-success-light)]">
          <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
          <span className="text-sm font-bold text-[var(--color-success)]">
            {startupHasLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary-light)] border-l border-border">
          <Crosshair className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">{orgNeedsLabel}</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-2 transition-colors duration-150",
              row.isMatch && "bg-[var(--color-primary-light)]/30"
            )}
          >
            {/* Startup has */}
            <div className="flex items-center gap-2.5 px-5 py-3 border-r border-border">
              {row.has ? (
                <>
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-[var(--color-success)]" />
                  <span className="text-sm text-foreground">{row.has}</span>
                </>
              ) : (
                <span className="text-sm text-[var(--color-text-subtle)] italic">—</span>
              )}
            </div>

            {/* Org needs */}
            <div className="flex items-center gap-2.5 px-5 py-3">
              {row.needs ? (
                <>
                  <Crosshair className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{row.needs}</span>
                </>
              ) : (
                <span className="text-sm text-[var(--color-text-subtle)] italic">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Match summary footer */}
      <div className="px-5 py-3 bg-surface border-t border-border flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
        <span className="text-xs text-[var(--color-text-muted)]">
          {rows.filter((r) => r.isMatch).length} of {maxLen} capabilities aligned
        </span>
      </div>
    </div>
  );
}
