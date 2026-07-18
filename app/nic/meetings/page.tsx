"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/lib/i18n";
import { MOCK_MEETINGS } from "@/lib/mock-data";
import { Meeting } from "@/lib/types";
import {
  Video,
  Monitor,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDate(meetings: Meeting[]): Record<string, Meeting[]> {
  return meetings.reduce<Record<string, Meeting[]>>((acc, m) => {
    const dateKey = new Date(m.scheduledAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(m);
    return acc;
  }, {});
}

function PlatformIcon({ platform }: { platform: Meeting["platform"] }) {
  const props = { className: "w-4 h-4" };
  if (platform === "zoom") return <Video {...props} />;
  if (platform === "teams") return <Monitor {...props} />;
  return <MapPin {...props} />;
}

function PlatformLabel({ platform }: { platform: Meeting["platform"] }) {
  const map: Record<string, string> = {
    zoom: "Zoom",
    teams: "MS Teams",
    in_person: "In Person",
  };
  return <>{map[platform] ?? platform}</>;
}

function StatusBadge({ status }: { status: Meeting["status"] }) {
  const cls =
    status === "scheduled"
      ? "badge-primary"
      : status === "completed"
      ? "badge-success"
      : "badge-warning";
  return <span className={cls}>{status}</span>;
}

// ── Meeting Card ──────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const isZoom = meeting.platform === "zoom";
  const isTeams = meeting.platform === "teams";

  return (
    <div className="card card-hover !rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Startup ↔ Partner */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {meeting.startup?.name ?? "—"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Startup
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {meeting.partner?.name ?? "—"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Partner
            </span>
          </div>
        </div>

        <StatusBadge status={meeting.status} />
      </div>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(meeting.scheduledAt)} · {meeting.duration} min
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 font-medium",
            isZoom
              ? "text-[var(--color-info)]"
              : isTeams
              ? "text-[#7547f5]"
              : "text-[var(--color-success)]"
          )}
        >
          <PlatformIcon platform={meeting.platform} />
          <PlatformLabel platform={meeting.platform} />
        </span>
        {meeting.notes && (
          <span className="italic text-[var(--color-text-subtle)]">
            {meeting.notes}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function NICMeetingsPage() {
  const { t } = useI18n();
  const meetings = MOCK_MEETINGS;
  const grouped = groupByDate(meetings);
  const dateKeys = Object.keys(grouped);

  // Stats
  const total = meetings.length;
  const thisWeek = 2; // mock
  const completed = meetings.filter((m) => m.status === "completed").length;
  const cancelled = meetings.filter((m) => m.status === "cancelled").length;

  const statsItems = [
    { label: "Total", value: total },
    { label: "This Week", value: thisWeek },
    { label: "Completed", value: completed },
    { label: "Cancelled", value: cancelled },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("nic.meetings.title")}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Manage and review all scheduled meetings.
            </p>
          </div>
          <button className="btn-primary self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsItems.map((item) => (
            <div key={item.label} className="card text-center !py-4">
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Meeting List Grouped by Date ── */}
        {dateKeys.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 gap-4">
            <Calendar className="w-12 h-12 text-[var(--color-text-subtle)]" />
            <p className="text-sm text-[var(--color-text-muted)]">
              {t("common.noData")}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {dateKeys.map((dateKey) => (
              <div key={dateKey}>
                {/* Date heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {formatDate(grouped[dateKey][0].scheduledAt)}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Cards */}
                <div className="space-y-4">
                  {grouped[dateKey].map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
