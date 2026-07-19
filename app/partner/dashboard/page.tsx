"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Users, Heart, ArrowRight, Brain,
  AlertTriangle, Zap, Eye, MessageCircle, Sparkles
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useProfileStore } from "@/lib/profile-store";
import { MOCK_MATCHES, MOCK_PARTNER_PROFILES } from "@/lib/mock-data";
import { CollabType } from "@/lib/types";
import { cn } from "@/lib/utils";

const FEED_STARTUPS = [
  { id: 'sp1', name: 'MediAI Vietnam', sector: 'HealthTech', stage: 'Seed', score: 87, tagline: 'AI diagnostics for underserved communities', keywords: ['AI', 'HealthTech', 'SaaS', 'IoT'], description: 'Building AI-powered diagnostic tools accessible in rural Vietnam with 12,000 active users.' },
  { id: 'sp2', name: 'EduFlow', sector: 'EdTech', stage: 'Pre-Seed', score: 72, tagline: 'Personalized learning for every student', keywords: ['EdTech', 'AI', 'B2C', 'Mobile'], description: 'Adaptive learning platform helping students in underserved regions access quality education.' },
  { id: 'sp3', name: 'GreenGrid', sector: 'CleanTech', stage: 'Series A', score: 91, tagline: 'Smart energy for sustainable cities', keywords: ['CleanTech', 'IoT', 'Smart City', 'ESG'], description: 'AI-powered smart grid optimization reducing energy waste by 40% in Vietnamese cities.' },
  { id: 'sp4', name: 'FinSight', sector: 'FinTech', stage: 'Seed', score: 83, tagline: 'AI credit scoring for the unbanked', keywords: ['FinTech', 'AI', 'SaaS', 'B2C'], description: 'Alternative credit scoring platform helping 500K+ unbanked individuals access financial services.' },
  { id: 'sp5', name: 'FarmBot VN', sector: 'AgriTech', stage: 'Pre-Seed', score: 65, tagline: 'Precision farming for Vietnamese farmers', keywords: ['AgriTech', 'IoT', 'Hardware', 'B2C'], description: 'IoT sensor network providing real-time crop monitoring and automated irrigation for smallholder farms.' },
  { id: 'sp6', name: 'LogiAI', sector: 'Logistics', stage: 'Seed', score: 78, tagline: 'AI-optimized last-mile delivery', keywords: ['Logistics', 'AI', 'SaaS', 'B2B'], description: 'Route optimization and delivery management platform cutting logistics costs by 30% for e-commerce.' },
];

// ── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="card flex items-center gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: color ?? "var(--color-primary-light)" }}
      >
        <Icon className="w-6 h-6" color={color ? "white" : "var(--color-primary)"} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      </div>
    </motion.div>
  );
}

// ── Score circle ─────────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 85 ? "var(--color-success)" : score >= 70 ? "var(--color-primary)" : "var(--color-warning)";
  return (
    <div className="score-ring w-12 h-12">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
}

// ── Collab type chips ─────────────────────────────────────────────────────────

const COLLAB_LABELS: Record<CollabType, string> = {
  investment:   "Investment",
  pilot:        "Pilot",
  research:     "Research",
  distribution: "Distribution",
  talent:       "Talent",
  procurement:  "Procurement",
};

// ── Mini match card ───────────────────────────────────────────────────────────

function MiniMatchCard({ match, index }: { match: any; index: number }) {
  const name    = match.name ?? "MediAI Vietnam";
  const sector  = match.sector ?? "HealthTech";

  return (
    <motion.div
      className="card-hover flex items-center gap-4"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.3 + index * 0.08 }}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white flex-shrink-0"
        style={{ background: "var(--color-primary)" }}
      >
        {name[0]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="badge-primary text-xs">{sector}</span>
          {match.collabTypes?.slice(0, 1).map((ct: any) => (
            <span key={ct} className="badge-accent text-xs">{COLLAB_LABELS[ct as CollabType]}</span>
          ))}
        </div>
      </div>

      {/* Score */}
      <ScoreCircle score={match.matchScore} />
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PartnerDashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { getMutualMatches } = useProfileStore();

  const [matches, setMatches] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/matches?type=partner", {
      headers: { Authorization: `Bearer ${localStorage.getItem("sonic_token")}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMatches(data.sort((a, b) => b.matchScore - a.matchScore));
        }
      })
      .catch((err) => console.error("Failed to fetch matches:", err))
      .finally(() => setLoading(false));
  }, []);

  // Data
  const topMatches = matches.slice(0, 3);
  const matchCount    = matches.length;
  
  // Mutual matches logic
  const mutualMatchIds = getMutualMatches();
  const mutualMatches = FEED_STARTUPS.filter(s => mutualMatchIds.includes(s.id));
  const interestCount = mutualMatchIds.length; 

  // Check profile status
  const partnerProfile = MOCK_PARTNER_PROFILES.find((p) => p.userId === user?.id);
  const profileStatus  = partnerProfile?.profileStatus ?? "draft";
  const isProfileDraft = profileStatus === "draft";

  return (
    <DashboardLayout
      title={`${t("partner.dashboard.welcome")}, ${user?.name?.split(" ")[0] ?? "Partner"} 👋`}
      subtitle={t("partner.dashboard.subtitle")}
      actions={
        <Link href="/partner/matches" className="btn-primary text-sm py-2 px-4">
          <Brain className="w-4 h-4" />
          {t("startup.dashboard.viewMatches")}
        </Link>
      }
    >
      <div className="space-y-8">



        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            icon={TrendingUp}
            label={t("partner.dashboard.matches")}
            value={matchCount}
            delay={0.05}
          />
          <StatCard
            icon={Heart}
            label={t("partner.dashboard.interests")}
            value={interestCount}
            color="var(--color-accent)"
            delay={0.15}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top matches — 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-foreground">Top AI Recommendations</h2>
              <Link
                href="/partner/matches"
                className="text-sm font-medium flex items-center gap-1 hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                {t("startup.dashboard.viewMatches")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {topMatches.map((match, i) => (
                <MiniMatchCard key={match.id} match={match} index={i} />
              ))}
            </div>
          </div>

          {/* Right sidebar — 1/3 width */}
          <div className="space-y-4">
            {/* Quick actions */}
            <motion.div
              className="card space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <h3 className="font-bold text-base text-foreground">Quick Actions</h3>
              <Link href="/partner/matches" className="btn-primary w-full justify-start text-sm py-2.5">
                <Eye className="w-4 h-4" />
                {t("startup.dashboard.viewMatches")}
              </Link>
              <Link href="/partner/profile" className="btn-outline w-full justify-start text-sm py-2.5">
                <Users className="w-4 h-4" />
                {t("startup.dashboard.editProfile")}
              </Link>
            </motion.div>

            {/* AI tip */}
            <motion.div
              className="card space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              style={{ borderLeft: "4px solid var(--color-primary)" }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                <h3 className="font-bold text-sm text-foreground">{t("startup.dashboard.aiInsight")}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Your profile matches best with <strong>HealthTech</strong> startups at Seed and Series A stage. Completing your innovation budget field will improve match precision by ~20%.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Your Matches Section */}
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
                    {match.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{match.name}</p>
                    <span className="badge-primary text-xs mt-1">{match.sector}</span>
                  </div>
                  <Link href={`/partner/messages?startupId=${match.id}`} className="btn-primary p-2 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card border-dashed bg-surface/50 py-12 flex flex-col items-center justify-center text-center">
              <Heart className="w-10 h-10 text-[var(--color-text-subtle)] mb-3" />
              <p className="text-foreground font-medium mb-1">No matches yet</p>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Express interest in startups to get matched</p>
              <Link href="/partner/matches" className="btn-outline text-sm py-2">
                Discover Startups
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
