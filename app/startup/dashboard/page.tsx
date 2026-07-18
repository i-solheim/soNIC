"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  GitMerge,
  Calendar,
  Lightbulb,
  Video,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Heart
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/lib/i18n";
import { MOCK_STARTUP_PROFILE, MOCK_MATCHES, MOCK_MEETINGS, MOCK_PARTNER_PROFILES } from "@/lib/mock-data";
import { useProfileStore } from "@/lib/profile-store";

// ── Animation variants ─────────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── Stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <motion.div variants={fadeUp} className="card flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          accent
            ? "bg-[var(--color-primary-light)]"
            : "bg-surface"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--color-text-muted)] font-medium">{label}</p>
        <div className="text-xl font-bold text-foreground mt-0.5">{value}</div>
      </div>
    </motion.div>
  );
}

// ── Platform icon ──────────────────────────────────────────────────────────
function PlatformIcon({ platform }: { platform: "zoom" | "teams" | "in_person" }) {
  if (platform === "zoom") return <Video className="w-4 h-4 text-primary" />;
  if (platform === "teams") return <Users className="w-4 h-4 text-primary" />;
  return <MapPin className="w-4 h-4 text-primary" />;
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function StartupDashboardPage() {
  const { t } = useI18n();
  const { getMutualMatches } = useProfileStore();

  const profile = MOCK_STARTUP_PROFILE;
  const topMatch = [...MOCK_MATCHES].sort((a, b) => b.score - a.score)[0];
  const nextMeeting = MOCK_MEETINGS.filter((m) => m.status === "scheduled")[0];

  const activeMatches = MOCK_MATCHES.length;
  const scheduledMeetings = MOCK_MEETINGS.filter((m) => m.status === "scheduled").length;
  const aiInsight = (profile.aiSummary ?? "").slice(0, 150);

  // Mutual matches logic
  const mutualMatchIds = getMutualMatches();
  const mutualMatches = MOCK_PARTNER_PROFILES.filter(p => mutualMatchIds.includes(p.id));

  return (
    <DashboardLayout
      title={`${t("startup.dashboard.welcome")}, ${profile.companyName} 👋`}
      subtitle={t("startup.dashboard.subtitle")}
    >
      <div className="space-y-8">
        
        {/* 1. Top Match This Week (Top AI Recommendation) */}
        {topMatch && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-xl text-foreground">
                  Top AI Recommendation
                </h2>
              </div>
              <Link href="/startup/matches" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                {t("startup.dashboard.viewMatches")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="card"
            >
              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border">
                {/* Score badge */}
                <div className="w-16 h-16 rounded-full bg-[var(--color-success)] flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg font-bold text-white leading-none">{topMatch.score}%</span>
                  <span className="text-[10px] text-white/80 mt-0.5">match</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-lg truncate">
                    {topMatch.partner?.orgName ?? "—"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {topMatch.collabTypes.map((ct, i) => (
                      <span key={ct} className={i === 0 ? "badge-accent" : "badge-primary"}>
                        {ct.charAt(0).toUpperCase() + ct.slice(1)}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-3">
                    {topMatch.aiExplanation}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. Stat cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            label={t("startup.dashboard.readiness")}
            value={`${profile.readinessScore ?? 0}%`}
            accent
          />
          <StatCard
            icon={<GitMerge className="w-5 h-5 text-[var(--color-success)]" />}
            label={t("startup.dashboard.matches")}
            value={activeMatches}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-[var(--color-warning)]" />}
            label={t("startup.dashboard.meetings")}
            value={scheduledMeetings}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />}
            label={t("startup.dashboard.profileComplete")}
            value={<span className="badge-success text-sm">{t("startup.dashboard.profileComplete")}</span>}
          />
        </motion.div>

        {/* 3. Main content grid (AI Insight / CTA / Meetings) */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insight */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="card border-l-4 border-l-primary h-full"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {t("startup.dashboard.aiInsight")}
                </h2>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {aiInsight}
                {profile.aiSummary && profile.aiSummary.length > 150 && (
                  <span className="text-primary font-medium cursor-pointer"> …read more</span>
                )}
              </p>
            </motion.div>
          </div>

          {/* Right 1/3 */}
          <div className="space-y-6">
            {/* Upcoming Meeting */}
            {nextMeeting && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[var(--color-warning)]" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {t("startup.dashboard.upcomingMeeting")}
                  </h2>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                    <PlatformIcon platform={nextMeeting.platform} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {nextMeeting.partner?.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {new Date(nextMeeting.scheduledAt).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <span className="badge-primary mt-1.5">
                      {nextMeeting.platform === "in_person" ? "In Person" : nextMeeting.platform.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="card space-y-3"
            >
              <Link href="/startup/matches" className="btn-primary w-full">
                {t("startup.dashboard.viewMatches")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/startup/profile" className="btn-outline w-full">
                {t("startup.dashboard.editProfile")}
              </Link>
            </motion.div>
          </div>
        </div>
        {/* 4. Your Matches Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-bold text-xl text-foreground">Your Matches</h2>
          </div>
          
          {mutualMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mutualMatches.map((match) => (
                <motion.div 
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card p-4 flex items-center gap-4 hover:border-[var(--color-primary)] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center text-xl font-bold text-[var(--color-primary)] shrink-0">
                    {match.orgName?.[0] || "P"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{match.orgName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge-primary text-xs">{match.orgType?.replace("_", " ")}</span>
                      <span className="text-xs font-bold text-[var(--color-success)]">92%</span>
                    </div>
                  </div>
                  <Link href={`/startup/messages?partnerId=${match.id}`} className="btn-primary p-2 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card border-dashed bg-surface/50 py-12 flex flex-col items-center justify-center text-center">
              <Heart className="w-10 h-10 text-[var(--color-text-subtle)] mb-3" />
              <p className="text-foreground font-medium mb-1">No matches yet</p>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Express interest in partners to get matched</p>
              <Link href="/startup/matches" className="btn-outline text-sm py-2">
                Discover Partners
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
