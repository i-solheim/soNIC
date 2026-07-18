"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, TrendingUp, GraduationCap, Microscope,
  ChevronRight, Check, X, Plus, Save, CheckCircle2,
  MapPin, Globe, Share2, Edit3, Target, Briefcase, Network
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useProfileStore } from "@/lib/profile-store";
import { MOCK_PARTNER_PROFILES } from "@/lib/mock-data";
import { OrgType, FundingStage } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── helpers ─────────────────────────────────────────────────────────────────

type Phase = 1 | 2;

const ORG_TYPES: { type: OrgType; icon: React.ElementType; labelKey: string; descKey: string }[] = [
  { type: "corporation",        icon: Building2,     labelKey: "partner.profile.type.corporation", descKey: "partner.profile.type.corporation.desc" },
  { type: "vc_fund",            icon: TrendingUp,    labelKey: "partner.profile.type.vc",          descKey: "partner.profile.type.vc.desc" },
  { type: "university",         icon: GraduationCap, labelKey: "partner.profile.type.university",  descKey: "partner.profile.type.university.desc" },
  { type: "research_institute", icon: Microscope,    labelKey: "partner.profile.type.research",    descKey: "partner.profile.type.research.desc" },
];

const INNOVATION_TAGS = ["AI/ML", "IoT", "Blockchain", "HealthTech", "Smart City", "FinTech", "CleanTech"];
const GEO_MARKETS     = ["Vietnam", "SEA", "Global", "ASEAN"];
const STARTUP_STAGES: { value: FundingStage; label: string }[] = [
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed",     label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b_plus", label: "Series B+" },
];
const BUDGET_OPTIONS  = ["<$100K", "$100K–$500K", "$500K–$2M", "$2M+"];
const RISK_OPTIONS    = ["low", "medium", "high"] as const;

// ── Tag input ───────────────────────────────────────────────────────────────

function TagInput({ tags, setTags, placeholder }: { tags: string[]; setTags: (t: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setDraft("");
  };
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary">
      {tags.map((tag) => (
        <span key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
          {tag}
          <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}
            className="hover:opacity-70 transition-opacity">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] text-sm bg-transparent outline-none placeholder:text-[var(--color-text-subtle)]"
        placeholder={placeholder ?? "Type and press Enter…"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        onBlur={add}
      />
    </div>
  );
}

// ── Multi-select chips ───────────────────────────────────────────────────────

function MultiChips({ options, selected, setSelected }: { options: string[]; selected: string[]; setSelected: (v: string[]) => void }) {
  const toggle = (opt: string) =>
    selected.includes(opt) ? setSelected(selected.filter((s) => s !== opt)) : setSelected([...selected, opt]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150",
              active
                ? "text-white border-transparent"
                : "border-border text-[var(--color-text-muted)] hover:border-primary hover:text-primary bg-background"
            )}
            style={active ? { background: "var(--color-primary)", borderColor: "var(--color-primary)" } : {}}
          >
            {active && <Check className="w-3 h-3 inline mr-1" />}{opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Stage checkboxes ─────────────────────────────────────────────────────────

function StageCheckboxes({ stages, selected, setSelected }: {
  stages: { value: FundingStage; label: string }[];
  selected: FundingStage[];
  setSelected: (v: FundingStage[]) => void;
}) {
  const toggle = (v: FundingStage) =>
    selected.includes(v) ? setSelected(selected.filter((s) => s !== v)) : setSelected([...selected, v]);
  return (
    <div className="flex flex-wrap gap-3">
      {stages.map((s) => (
        <label key={s.value} className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => toggle(s.value)}
            className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 cursor-pointer",
              selected.includes(s.value) ? "border-transparent" : "border-border bg-background"
            )}
            style={selected.includes(s.value) ? { background: "var(--color-primary)", borderColor: "var(--color-primary)" } : {}}
          >
            {selected.includes(s.value) && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-foreground">{s.label}</span>
        </label>
      ))}
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none",
          checked ? "bg-primary" : "bg-[var(--color-border)]"
        )}
        style={checked ? { background: "var(--color-primary)" } : {}}
        aria-checked={checked}
        role="switch"
      >
        <span className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PartnerProfilePage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { partnerProfileCompleted, savePartnerProfile, clearPartnerProfile } = useProfileStore();

  const [phase, setPhase] = useState<Phase>(1);
  const [selectedOrgType, setSelectedOrgType] = useState<OrgType | null>(null);
  const [saved, setSaved] = useState(false);

  // Pre-fill from mock data if orgType matches
  const mockProfile = MOCK_PARTNER_PROFILES[0];

  // Corporation fields
  const [corpIndustry, setCorpIndustry] = useState(mockProfile.industry ?? "");
  const [corpInnovPriorities, setCorpInnovPriorities] = useState<string[]>(mockProfile.innovationPriorities ?? []);
  const [corpTechInterests, setCorpTechInterests] = useState<string[]>(mockProfile.technologyInterests ?? []);
  const [corpOpenInnovation, setCorpOpenInnovation] = useState(mockProfile.openInnovationPrograms?.join(", ") ?? "");
  const [corpProcurementNeeds, setCorpProcurementNeeds] = useState(mockProfile.procurementNeeds?.join("\n") ?? "");
  const [corpPilotOpp, setCorpPilotOpp] = useState(mockProfile.pilotOpportunities?.join("\n") ?? "");
  const [corpGeoMarkets, setCorpGeoMarkets] = useState<string[]>(mockProfile.geographicMarkets ?? []);
  const [corpEsg, setCorpEsg] = useState(mockProfile.esgGoals?.join("\n") ?? "");
  const [corpStages, setCorpStages] = useState<FundingStage[]>(mockProfile.preferredStartupStage ?? []);
  const [corpBudget, setCorpBudget] = useState(mockProfile.budget ?? "");
  const [corpStrategic, setCorpStrategic] = useState(mockProfile.strategicInitiatives?.join("\n") ?? "");

  // VC fields
  const [vcStages, setVcStages] = useState<FundingStage[]>([]);
  const [vcCheckMin, setVcCheckMin] = useState("500000");
  const [vcCheckMax, setVcCheckMax] = useState("3000000");
  const [vcIndustries, setVcIndustries] = useState<string[]>([]);
  const [vcGeoFocus, setVcGeoFocus] = useState<string[]>([]);
  const [vcRisk, setVcRisk] = useState<"low" | "medium" | "high">("medium");
  const [vcExit, setVcExit] = useState("");

  // University / Research fields
  const [uniResearchFields, setUniResearchFields] = useState<string[]>([]);
  const [uniLabs, setUniLabs] = useState<string[]>([]);
  const [uniEquipment, setUniEquipment] = useState("");
  const [uniPatents, setUniPatents] = useState("");
  const [uniTechTransfer, setUniTechTransfer] = useState(false);
  const [uniGrants, setUniGrants] = useState("");
  const [uniPartnerships, setUniPartnerships] = useState<string[]>([]);

  const handleSelectOrgType = (orgType: OrgType) => {
    setSelectedOrgType(orgType);
    setPhase(2);
    // Prefill VC fields from mock if vc_fund selected
    if (orgType === "vc_fund") {
      setVcStages(MOCK_PARTNER_PROFILES[1].investmentStages ?? []);
      setVcCheckMin(String(MOCK_PARTNER_PROFILES[1].checkSize?.min ?? 500000));
      setVcCheckMax(String(MOCK_PARTNER_PROFILES[1].checkSize?.max ?? 3000000));
      setVcIndustries(MOCK_PARTNER_PROFILES[1].industries ?? []);
      setVcGeoFocus(MOCK_PARTNER_PROFILES[1].geographicFocus ?? []);
      setVcRisk(MOCK_PARTNER_PROFILES[1].riskTolerance ?? "medium");
      setVcExit(MOCK_PARTNER_PROFILES[1].exitExpectations ?? "");
    }
    if (orgType === "university" || orgType === "research_institute") {
      setUniResearchFields(MOCK_PARTNER_PROFILES[2].researchFields ?? []);
      setUniLabs(MOCK_PARTNER_PROFILES[2].labs ?? []);
      setUniEquipment(MOCK_PARTNER_PROFILES[2].availableEquipment?.join("\n") ?? "");
      setUniPatents(MOCK_PARTNER_PROFILES[2].patents?.join("\n") ?? "");
      setUniTechTransfer(MOCK_PARTNER_PROFILES[2].techTransferOffice ?? false);
      setUniGrants(MOCK_PARTNER_PROFILES[2].governmentGrants?.join(", ") ?? "");
      setUniPartnerships(MOCK_PARTNER_PROFILES[2].desiredIndustryPartnerships ?? []);
    }
  };

  const handleSave = () => {
    if (!selectedOrgType) return;
    savePartnerProfile({
      id: `pp_${Date.now()}`,
      userId: user?.id ?? "unknown",
      orgName: corpIndustry || user?.name || "My Organization",
      orgType: selectedOrgType,
      description: corpOpenInnovation || "",
      profileStatus: "complete",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  // ── Render LinkedIn-style Profile ───────────────────────────────────────────
  if (partnerProfileCompleted) {
    // Generate a default initials
    const orgName = MOCK_PARTNER_PROFILES.find(p => p.orgType === selectedOrgType)?.orgName || user?.name || "Organization";
    
    return (
      <DashboardLayout
        title={t("partner.profile.title")}
        subtitle={t("partner.profile.subtitle")}
      >
        <div className="max-w-5xl mx-auto pb-12">
          {/* Banner */}
          <div className="relative w-full h-40 md:h-48 rounded-t-2xl overflow-hidden bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="card -mt-16 relative z-10 mx-4 md:mx-0 p-6 md:p-8 pt-0 border-t-0 rounded-t-none">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
              <div className="flex items-end gap-6 -mt-10 md:-mt-12">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background bg-white flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden shrink-0" style={{ color: "var(--color-primary)" }}>
                  {orgName.substring(0, 2).toUpperCase()}
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                    {orgName}
                    <CheckCircle2 className="w-6 h-6 text-[var(--color-primary)]" />
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[var(--color-text-muted)]">
                    <span className="badge-primary">{selectedOrgType?.replace("_", " ").toUpperCase() || "CORPORATION"}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Hanoi, Vietnam</span>
                    <a href="#" className="flex items-center gap-1 hover:text-[var(--color-primary)] hover:underline"><Globe className="w-4 h-4"/> website.com</a>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <button className="btn-outline flex items-center gap-2" onClick={() => {}}>
                  <Share2 className="w-4 h-4" /> Share Profile
                </button>
                <button className="btn-primary flex items-center gap-2" onClick={() => { setPhase(1); clearPartnerProfile(); }}>
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left Column - 2/3 */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
                  <p className="text-[var(--color-text-muted)] leading-relaxed text-sm md:text-base">
                    Leading organization committed to fostering innovation and driving digital transformation. 
                    We are actively seeking strategic partnerships and innovative solutions that align with our core objectives and enhance our operational capabilities. We prioritize sustainable and scalable technologies.
                  </p>
                </section>

                {/* Conditional Sections based on Org Type */}
                {selectedOrgType === "corporation" && (
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[var(--color-primary)]"/> Focus Areas
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Innovation Priorities</h3>
                        <div className="flex flex-wrap gap-2">
                          {corpInnovPriorities.length ? corpInnovPriorities.map(p => <span key={p} className="badge-primary">{p}</span>) : <span className="text-sm text-[var(--color-text-muted)]">Not specified</span>}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Technology Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {corpTechInterests.length ? corpTechInterests.map(t => <span key={t} className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-[var(--color-text-muted)]">{t}</span>) : <span className="text-sm text-[var(--color-text-muted)]">Not specified</span>}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {selectedOrgType === "vc_fund" && (
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[var(--color-primary)]"/> Investment Focus
                    </h2>
                    <div className="bg-surface rounded-xl p-5 border border-border grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Investment Stages</p>
                        <div className="flex flex-wrap gap-2">
                          {vcStages.length ? vcStages.map(s => <span key={s} className="badge-primary text-xs">{s.replace("_", " ").toUpperCase()}</span>) : <span className="text-sm text-foreground">Not specified</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Check Size</p>
                        <p className="font-semibold text-foreground">${Number(vcCheckMin).toLocaleString()} - ${Number(vcCheckMax).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Risk Tolerance</p>
                        <span className="capitalize font-semibold text-foreground">{vcRisk}</span>
                      </div>
                    </div>
                  </section>
                )}

                {(selectedOrgType === "university" || selectedOrgType === "research_institute") && (
                  <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Microscope className="w-5 h-5 text-[var(--color-primary)]"/> Research Areas
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">Research Fields</h3>
                        <div className="flex flex-wrap gap-2">
                          {uniResearchFields.length ? uniResearchFields.map(f => <span key={f} className="badge-primary">{f}</span>) : <span className="text-sm text-[var(--color-text-muted)]">Not specified</span>}
                        </div>
                      </div>
                      <div className="bg-surface rounded-xl p-5 border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-semibold text-foreground">Tech Transfer Office</p>
                          {uniTechTransfer ? <span className="badge-success">Active</span> : <span className="badge-warning">None</span>}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Labs</p>
                        <p className="font-medium text-foreground">{uniLabs.length ? uniLabs.join(", ") : "Not specified"}</p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column - 1/3 */}
              <div className="space-y-6">
                <div className="card bg-surface/50">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Network className="w-4 h-4 text-[var(--color-accent)]" />
                    Collaboration Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-1.5 uppercase font-semibold">Geographic Focus</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedOrgType === "vc_fund" ? vcGeoFocus : corpGeoMarkets).length ? 
                          (selectedOrgType === "vc_fund" ? vcGeoFocus : corpGeoMarkets).map(g => <span key={g} className="px-2 py-1 bg-background border border-border rounded-md text-xs font-medium">{g}</span>) : 
                          <span className="text-sm text-[var(--color-text-muted)]">Global</span>
                        }
                      </div>
                    </div>

                    {selectedOrgType === "corporation" && (
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1.5 uppercase font-semibold">Innovation Budget</p>
                        <p className="text-sm font-medium text-foreground">{corpBudget || "Not specified"}</p>
                      </div>
                    )}
                    
                    {selectedOrgType === "corporation" && (
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1.5 uppercase font-semibold">Preferred Startup Stage</p>
                        <div className="flex flex-wrap gap-1.5">
                          {corpStages.length ? corpStages.map(s => <span key={s} className="px-2 py-1 bg-background border border-border rounded-md text-xs font-medium">{s.replace("_", " ")}</span>) : <span className="text-sm text-[var(--color-text-muted)]">Any Stage</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Render Form View (Existing) ─────────────────────────────────────────────
  return (
    <DashboardLayout
      title={t("partner.profile.title")}
      subtitle={t("partner.profile.subtitle")}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* Phase 1 — org type selection */}
              <div className="card space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t("partner.profile.selectType")}</h2>
                  <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                    {t("partner.profile.selectTypeDesc")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ORG_TYPES.map(({ type, icon: Icon, labelKey, descKey }) => (
                    <motion.button
                      key={type}
                      type="button"
                      onClick={() => handleSelectOrgType(type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group text-left p-6 rounded-2xl border-2 border-border bg-card transition-all duration-200 hover:border-primary hover:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{ background: "var(--color-primary-light)" }}>
                          <Icon className="w-6 h-6" color="var(--color-primary)" />
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200"
                          style={{ color: "var(--color-primary)" }} />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-1">
                        {t(labelKey as Parameters<typeof t>[0])}
                      </h3>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        {t(descKey as Parameters<typeof t>[0])}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 2 && selectedOrgType && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
            >
              {/* Back button */}
              <button
                type="button"
                onClick={() => setPhase(1)}
                className="btn-ghost mb-4 -ml-2"
              >
                ← Back
              </button>

              {/* Selected type badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="badge-primary">
                  {ORG_TYPES.find((o) => o.type === selectedOrgType)?.type.replace("_", " ").toUpperCase()}
                </span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>profile form</span>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                className="space-y-6"
              >
                {/* ── Corporation form ── */}
                {selectedOrgType === "corporation" && (
                  <div className="card space-y-6">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <Building2 className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
                      Corporation Profile
                    </h3>

                    {/* Industry */}
                    <div>
                      <label className="label">Industry</label>
                      <input className="input" value={corpIndustry} onChange={(e) => setCorpIndustry(e.target.value)} placeholder="e.g. Conglomerate, Manufacturing…" />
                    </div>

                    {/* Innovation Priorities */}
                    <div>
                      <label className="label">Innovation Priorities</label>
                      <MultiChips options={INNOVATION_TAGS} selected={corpInnovPriorities} setSelected={setCorpInnovPriorities} />
                    </div>

                    {/* Technology Interests */}
                    <div>
                      <label className="label">Technology Interests</label>
                      <TagInput tags={corpTechInterests} setTags={setCorpTechInterests} placeholder="Add a technology and press Enter…" />
                    </div>

                    {/* Open Innovation Programs */}
                    <div>
                      <label className="label">Open Innovation Programs</label>
                      <input className="input" value={corpOpenInnovation} onChange={(e) => setCorpOpenInnovation(e.target.value)} placeholder="e.g. Vingroup Startup Accelerator" />
                    </div>

                    {/* Procurement Needs */}
                    <div>
                      <label className="label">Procurement Needs</label>
                      <textarea className="input min-h-[80px] resize-y" value={corpProcurementNeeds} onChange={(e) => setCorpProcurementNeeds(e.target.value)} placeholder="Describe procurement needs…" />
                    </div>

                    {/* Pilot Opportunities */}
                    <div>
                      <label className="label">Pilot Opportunities</label>
                      <textarea className="input min-h-[80px] resize-y" value={corpPilotOpp} onChange={(e) => setCorpPilotOpp(e.target.value)} placeholder="Describe pilot program opportunities…" />
                    </div>

                    {/* Geographic Markets */}
                    <div>
                      <label className="label">Geographic Markets</label>
                      <MultiChips options={GEO_MARKETS} selected={corpGeoMarkets} setSelected={setCorpGeoMarkets} />
                    </div>

                    {/* ESG Goals */}
                    <div>
                      <label className="label">ESG Goals</label>
                      <textarea className="input min-h-[80px] resize-y" value={corpEsg} onChange={(e) => setCorpEsg(e.target.value)} placeholder="e.g. Carbon neutral 2030, Digital health access…" />
                    </div>

                    {/* Preferred Startup Stage */}
                    <div>
                      <label className="label">Preferred Startup Stage</label>
                      <StageCheckboxes stages={STARTUP_STAGES} selected={corpStages} setSelected={setCorpStages} />
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="label">Innovation Budget</label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map((opt) => (
                          <button key={opt} type="button" onClick={() => setCorpBudget(opt)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150",
                              corpBudget === opt
                                ? "text-white border-transparent"
                                : "border-border text-[var(--color-text-muted)] bg-background hover:border-primary hover:text-primary"
                            )}
                            style={corpBudget === opt ? { background: "var(--color-primary)" } : {}}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Initiatives */}
                    <div>
                      <label className="label">Strategic Initiatives</label>
                      <textarea className="input min-h-[80px] resize-y" value={corpStrategic} onChange={(e) => setCorpStrategic(e.target.value)} placeholder="Describe strategic initiatives…" />
                    </div>
                  </div>
                )}

                {/* ── VC / Fund form ── */}
                {selectedOrgType === "vc_fund" && (
                  <div className="card space-y-6">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
                      VC / Investment Fund Profile
                    </h3>

                    {/* Investment stages */}
                    <div>
                      <label className="label">Investment Stage</label>
                      <StageCheckboxes stages={STARTUP_STAGES} selected={vcStages} setSelected={setVcStages} />
                    </div>

                    {/* Check size */}
                    <div>
                      <label className="label">Check Size (USD)</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs" style={{ color: "var(--color-text-muted)" }}>Min</label>
                          <input type="number" className="input mt-1" value={vcCheckMin} onChange={(e) => setVcCheckMin(e.target.value)} placeholder="500000" />
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: "var(--color-text-muted)" }}>Max</label>
                          <input type="number" className="input mt-1" value={vcCheckMax} onChange={(e) => setVcCheckMax(e.target.value)} placeholder="3000000" />
                        </div>
                      </div>
                    </div>

                    {/* Industries focus */}
                    <div>
                      <label className="label">Industries Focus</label>
                      <TagInput tags={vcIndustries} setTags={setVcIndustries} placeholder="e.g. HealthTech, EdTech…" />
                    </div>

                    {/* Geographic focus */}
                    <div>
                      <label className="label">Geographic Focus</label>
                      <TagInput tags={vcGeoFocus} setTags={setVcGeoFocus} placeholder="e.g. Vietnam, Indonesia…" />
                    </div>

                    {/* Risk Tolerance */}
                    <div>
                      <label className="label">Risk Tolerance</label>
                      <div className="flex gap-3">
                        {RISK_OPTIONS.map((r) => (
                          <button key={r} type="button" onClick={() => setVcRisk(r)}
                            className={cn(
                              "px-5 py-2 rounded-xl text-sm font-semibold border capitalize transition-all duration-150",
                              vcRisk === r
                                ? "text-white border-transparent"
                                : "border-border text-[var(--color-text-muted)] bg-background hover:border-primary hover:text-primary"
                            )}
                            style={vcRisk === r ? { background: "var(--color-primary)" } : {}}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exit expectations */}
                    <div>
                      <label className="label">Exit Expectations</label>
                      <textarea className="input min-h-[80px] resize-y" value={vcExit} onChange={(e) => setVcExit(e.target.value)} placeholder="e.g. 5-7 year IPO or strategic acquisition…" />
                    </div>
                  </div>
                )}

                {/* ── University / Research form ── */}
                {(selectedOrgType === "university" || selectedOrgType === "research_institute") && (
                  <div className="card space-y-6">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      {selectedOrgType === "university"
                        ? <GraduationCap className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
                        : <Microscope className="w-5 h-5" style={{ color: "var(--color-primary)" }} />}
                      {selectedOrgType === "university" ? "University" : "Research Institute"} Profile
                    </h3>

                    {/* Research Fields */}
                    <div>
                      <label className="label">Research Fields</label>
                      <TagInput tags={uniResearchFields} setTags={setUniResearchFields} placeholder="e.g. AI/ML, Biomedical Engineering…" />
                    </div>

                    {/* Labs */}
                    <div>
                      <label className="label">Labs & Centers</label>
                      <TagInput tags={uniLabs} setTags={setUniLabs} placeholder="e.g. AI Research Lab…" />
                    </div>

                    {/* Available equipment */}
                    <div>
                      <label className="label">Available Equipment</label>
                      <textarea className="input min-h-[80px] resize-y" value={uniEquipment} onChange={(e) => setUniEquipment(e.target.value)} placeholder="List equipment, one per line…" />
                    </div>

                    {/* Patents */}
                    <div>
                      <label className="label">Patents</label>
                      <textarea className="input min-h-[80px] resize-y" value={uniPatents} onChange={(e) => setUniPatents(e.target.value)} placeholder="List patents, one per line…" />
                    </div>

                    {/* Tech transfer office */}
                    <div>
                      <label className="label">Tech Transfer Office</label>
                      <Toggle checked={uniTechTransfer} onChange={setUniTechTransfer} label="We have an active Tech Transfer Office" />
                    </div>

                    {/* Government grants */}
                    <div>
                      <label className="label">Government Grants</label>
                      <input className="input" value={uniGrants} onChange={(e) => setUniGrants(e.target.value)} placeholder="e.g. MOST Grant 2024, NIC Innovation Fund…" />
                    </div>

                    {/* Desired partnerships */}
                    <div>
                      <label className="label">Desired Industry Partnerships</label>
                      <TagInput tags={uniPartnerships} setTags={setUniPartnerships} placeholder="e.g. HealthTech, Manufacturing…" />
                    </div>
                  </div>
                )}

                {/* Save button */}
                <div className="flex items-center gap-4">
                  <button type="submit" className="btn-primary">
                    <Save className="w-4 h-4" />
                    {t("partner.profile.submit")}
                  </button>

                  <AnimatePresence>
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: "var(--color-success)" }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Profile saved successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
