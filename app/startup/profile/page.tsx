"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/lib/i18n";
import { MOCK_STARTUP_PROFILE } from "@/lib/mock-data";
import {
  FundingStage,
  CustomerType,
  BusinessModel,
  GoalType,
  StartupProfile,
  ReadinessCheck,
} from "@/lib/types";
import {
  ChevronRight,
  ChevronLeft,
  Brain,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  Plus,
  FileText,
  Upload,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  ExternalLink,
  Download,
} from "lucide-react";
import { useProfileStore } from "@/lib/profile-store";
import { ReadinessScore } from "@/components/startup/ReadinessScore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ── Types & Constants ─────────────────────────────────────────

const STEPS = [
  "startup.profile.step.basic",
  "startup.profile.step.technology",
  "startup.profile.step.product",
  "startup.profile.step.market",
  "startup.profile.step.funding",
  "startup.profile.step.goals",
  "startup.profile.step.upload",
] as const;

const TECH_SUGGESTIONS = [
  "AI",
  "IoT",
  "Robotics",
  "SaaS",
  "Blockchain",
  "Biotech",
];

const STAGE_OPTIONS: { value: FundingStage; label: string }[] = [
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b_plus", label: "Series B+" },
];

const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: "b2b", label: "B2B" },
  { value: "b2c", label: "B2C" },
  { value: "government", label: "Government" },
  { value: "enterprise", label: "Enterprise" },
];

const BUSINESS_MODELS: { value: BusinessModel; label: string }[] = [
  { value: "saas", label: "SaaS" },
  { value: "marketplace", label: "Marketplace" },
  { value: "hardware", label: "Hardware" },
  { value: "licensing", label: "Licensing" },
  { value: "services", label: "Services" },
];

const GOALS: { value: GoalType; label: string }[] = [
  { value: "investment", label: "Investment" },
  { value: "pilot", label: "Pilot" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "rd", label: "R&D" },
  { value: "distribution", label: "Distribution" },
  { value: "talent", label: "Talent" },
];

const AI_PROCESSING_STEPS = [
  "Analyzing company profile...",
  "Extracting key technologies...",
  "Scoring readiness metrics...",
  "Generating AI summary...",
  "Finding potential matches...",
];

type FormData = Omit<StartupProfile, "id" | "userId" | "phase" | "profileStatus"> & {
  pitchFileName?: string;
};

// ── Small reusable components ─────────────────────────────────

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
  suggestions,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState("");

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="badge-primary flex items-center gap-1 !py-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-1 hover:text-accent transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="input"
        placeholder={placeholder ?? "Type and press Enter…"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
      />
      {suggestions && (
        <div className="flex flex-wrap gap-2 mt-1">
          {suggestions
            .filter((s) => !tags.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onAdd(s)}
                className="px-2.5 py-1 text-xs rounded-lg border border-border text-[var(--color-text-muted)] hover:border-primary hover:text-primary hover:bg-[var(--color-primary-light)] transition-all"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function CheckboxGroup<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-150 text-sm font-medium select-none",
              checked
                ? "border-primary bg-[var(--color-primary-light)] text-primary"
                : "border-border text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-foreground"
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => onToggle(opt.value)}
            />
            <span
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                checked ? "border-primary bg-primary" : "border-border"
              )}
            >
              {checked && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 10 8"
                  fill="none"
                >
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

// ── Step Progress Bar ─────────────────────────────────────────

function StepBar({
  currentStep,
  totalSteps,
  stepKeys,
}: {
  currentStep: number;
  totalSteps: number;
  stepKeys: readonly string[];
}) {
  const { t } = useI18n();
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {stepKeys.map((key, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div key={key} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 transition-colors duration-300",
                      i <= currentStep ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all duration-300",
                    isDone
                      ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                      : isActive
                      ? "bg-primary border-primary text-white scale-110"
                      : "bg-surface border-border text-[var(--color-text-muted)]"
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 transition-colors duration-300",
                      i < currentStep ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 font-medium text-center hidden sm:block",
                  isActive
                    ? "text-primary"
                    : isDone
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-text-subtle)]"
                )}
              >
                {/* @ts-ignore */}
                {t(key)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Readiness Check component ─────────────────────────────────

function ReadinessCheckItem({ check }: { check: ReadinessCheck }) {
  const { lang } = useI18n();
  const label = lang === "vi" ? check.labelVi : check.label;
  return (
    <div className="flex items-center gap-2.5">
      {check.status === "pass" ? (
        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
      ) : check.status === "warning" ? (
        <AlertCircle className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-accent flex-shrink-0" />
      )}
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}

// ── AI Processing Screen ──────────────────────────────────────

function AIProcessing({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    // Show steps one by one
    AI_PROCESSING_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, 600 + i * 600);
    });

    // Transition to complete after 4 seconds
    const doneTimeout = setTimeout(onDone, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(doneTimeout);
    };
  }, [onDone]);

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="card flex flex-col items-center py-16 gap-8 max-w-xl mx-auto"
    >
      {/* Spinning Brain */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">
          {t("startup.profile.processing")}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          {t("startup.profile.processingDesc")}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
          {progress}%
        </p>
      </div>

      {/* Processing steps */}
      <div className="w-full max-w-xs space-y-2.5">
        {AI_PROCESSING_STEPS.map((step, i) => (
          <AnimatePresence key={i}>
            {visibleSteps.includes(i) && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)]"
              >
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                {step}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}

// ── Phase 2 — Completed Profile (LinkedIn-style) ───────────────────────────────

function CompletedProfile({
  onEditProfile,
}: {
  onEditProfile: () => void;
}) {
  const profile = MOCK_STARTUP_PROFILE;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Banner & Avatar */}
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
        <div className="h-40 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-90" />
        <div className="px-6 pb-6 pt-16 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl font-bold text-[var(--color-primary)]">
              {profile.companyName.substring(0, 2).toUpperCase()}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{profile.companyName}</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{profile.tagline}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onEditProfile} className="btn-outline !py-1.5 !px-3 text-sm">
                Edit Profile
              </button>
              <button className="btn-ghost !py-1.5 !px-3 text-sm">
                <Download className="w-4 h-4 mr-2" />
                Pitch Deck
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {profile.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Founded {profile.foundedYear}
            </div>
            <div className="badge-primary">{profile.stage.replace("_", " ")}</div>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                <ExternalLink className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          <div className="card-glass border border-primary/20 bg-[var(--color-primary-light)]/30">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">AI Summary</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              {profile.aiSummary}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.aiKeywords?.map(kw => (
                <span key={kw} className="badge-primary !bg-primary !text-white">{kw}</span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">About</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Problem Statement</h4>
                <p className="text-sm text-[var(--color-text-muted)]">{profile.problemStatement}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Solution</h4>
                <p className="text-sm text-[var(--color-text-muted)]">{profile.solution}</p>
              </div>
            </div>
          </div>

          {/* Tech & Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-foreground mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {profile.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full border border-border text-xs text-foreground bg-surface">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-foreground mb-4">Goals & Capabilities</h3>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase mb-2">Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.goals.map(g => (
                    <span key={g} className="badge-accent">{g}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase mb-2">Capabilities</h4>
                <ul className="space-y-1.5">
                  {profile.capabilities.map(c => (
                    <li key={c} className="text-sm flex items-start gap-2 text-[var(--color-text-muted)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Readiness Score */}
          <div className="card flex justify-center py-8">
            <ReadinessScore score={profile.readinessScore || 0} checks={profile.readinessChecks || []} size={180} />
          </div>

          {/* Funding */}
          <div className="card">
            <h3 className="font-semibold text-foreground mb-4">Funding & Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-[var(--color-text-muted)]">Current Stage</span>
                <span className="text-sm font-medium text-foreground">{profile.currentFunding?.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-[var(--color-text-muted)]">Funding Need</span>
                <span className="text-sm font-medium text-foreground">
                  {profile.fundingCurrency} {(profile.fundingNeed! / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-sm text-[var(--color-text-muted)]">Monthly Revenue</span>
                <span className="text-sm font-medium text-foreground">${profile.monthlyRevenue?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-text-muted)]">Growth Rate</span>
                <span className="text-sm font-medium text-[var(--color-success)]">+{profile.monthlyGrowthRate}% MoM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Drop Zone ─────────────────────────────────────────────────

function DropZone({
  fileName,
  onFile,
}: {
  fileName?: string;
  onFile: (name: string) => void;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file.name);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200",
        dragging
          ? "border-primary bg-[var(--color-primary-light)]"
          : "border-border hover:border-primary hover:bg-[var(--color-primary-light)]"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.pptx"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file.name);
        }}
      />
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
        <Upload className="w-7 h-7 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          {t("startup.profile.dragDrop")}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {t("startup.profile.uploadDeckDesc")}
        </p>
      </div>

      {fileName && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-success-light)] border border-[var(--color-success)] text-sm font-medium text-[var(--color-success)]">
          <FileText className="w-4 h-4" />
          {fileName}
        </div>
      )}
    </div>
  );
}

// ── Form field error ──────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-accent mt-1">{msg}</p>;
}

// ── Main Page ─────────────────────────────────────────────────

type Phase = "form" | "processing" | "complete";

const defaultForm: FormData = {
  companyName: MOCK_STARTUP_PROFILE.companyName,
  tagline: MOCK_STARTUP_PROFILE.tagline,
  website: MOCK_STARTUP_PROFILE.website,
  industry: MOCK_STARTUP_PROFILE.industry,
  location: MOCK_STARTUP_PROFILE.location,
  stage: MOCK_STARTUP_PROFILE.stage,
  employees: MOCK_STARTUP_PROFILE.employees,
  foundedYear: MOCK_STARTUP_PROFILE.foundedYear,
  technologies: [...MOCK_STARTUP_PROFILE.technologies],
  problemStatement: MOCK_STARTUP_PROFILE.problemStatement,
  solution: MOCK_STARTUP_PROFILE.solution,
  customerTypes: [...MOCK_STARTUP_PROFILE.customerTypes],
  targetMarkets: [...MOCK_STARTUP_PROFILE.targetMarkets],
  businessModels: [...MOCK_STARTUP_PROFILE.businessModels],
  currentFunding: MOCK_STARTUP_PROFILE.currentFunding,
  fundingNeed: MOCK_STARTUP_PROFILE.fundingNeed,
  fundingCurrency: MOCK_STARTUP_PROFILE.fundingCurrency,
  users: MOCK_STARTUP_PROFILE.users,
  monthlyRevenue: MOCK_STARTUP_PROFILE.monthlyRevenue,
  monthlyGrowthRate: MOCK_STARTUP_PROFILE.monthlyGrowthRate,
  goals: [...MOCK_STARTUP_PROFILE.goals],
  capabilities: [...MOCK_STARTUP_PROFILE.capabilities],
  aiSummary: MOCK_STARTUP_PROFILE.aiSummary,
  aiKeywords: MOCK_STARTUP_PROFILE.aiKeywords,
  readinessScore: MOCK_STARTUP_PROFILE.readinessScore,
  readinessChecks: MOCK_STARTUP_PROFILE.readinessChecks,
  pitchFileName: undefined,
};

export default function StartupProfilePage() {
  const { t } = useI18n();
  const { startupProfileCompleted, saveStartupProfile, clearStartupProfile } = useProfileStore();
  const [phase, setPhase] = useState<Phase>("form");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Field helpers
  const set = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
    },
    []
  );

  function toggleArray<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  // ── Validation per step
  function validate(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.companyName.trim()) e.companyName = "Company name is required.";
      if (!form.industry.trim()) e.industry = "Industry is required.";
      if (!form.location.trim()) e.location = "Location is required.";
    }
    if (s === 2) {
      if (!form.problemStatement.trim())
        e.problemStatement = "Problem statement is required.";
      if (!form.solution.trim()) e.solution = "Solution is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validate(step)) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleSubmit() {
    setPhase("processing");
  }

  function handleProcessingDone() {
    saveStartupProfile({
      ...form,
      id: `sp_${Date.now()}`,
      userId: "u1", // Default mock user ID, in a real app this comes from useAuth
      phase: 2,
      profileStatus: "complete"
    });
  }

  function handleEditProfile() {
    setPhase("form");
    setStep(0);
  }

  // ── Step content
  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="label">Company Name *</label>
              <input
                className={cn("input", errors.companyName && "border-accent ring-accent")}
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
              <FieldError msg={errors.companyName} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Tagline</label>
              <input
                className="input"
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Industry *</label>
              <input
                className={cn("input", errors.industry && "border-accent")}
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
              />
              <FieldError msg={errors.industry} />
            </div>
            <div>
              <label className="label">Location *</label>
              <input
                className={cn("input", errors.location && "border-accent")}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
              <FieldError msg={errors.location} />
            </div>
            <div>
              <label className="label">Stage</label>
              <select
                className="input"
                value={form.stage}
                onChange={(e) => set("stage", e.target.value as FundingStage)}
              >
                {STAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Employees</label>
              <input
                type="number"
                className="input"
                value={form.employees}
                onChange={(e) => set("employees", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Founded Year</label>
              <input
                type="number"
                className="input"
                value={form.foundedYear}
                onChange={(e) => set("foundedYear", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Website</label>
              <input
                className="input"
                value={form.website ?? ""}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Technologies</label>
              <TagInput
                tags={form.technologies}
                onAdd={(t) => set("technologies", [...form.technologies, t])}
                onRemove={(t) =>
                  set(
                    "technologies",
                    form.technologies.filter((x) => x !== t)
                  )
                }
                suggestions={TECH_SUGGESTIONS}
                placeholder="Type a technology and press Enter"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="label">Problem Statement *</label>
              <textarea
                rows={4}
                className={cn("input resize-none", errors.problemStatement && "border-accent")}
                value={form.problemStatement}
                onChange={(e) => set("problemStatement", e.target.value)}
              />
              <FieldError msg={errors.problemStatement} />
            </div>
            <div>
              <label className="label">Solution *</label>
              <textarea
                rows={4}
                className={cn("input resize-none", errors.solution && "border-accent")}
                value={form.solution}
                onChange={(e) => set("solution", e.target.value)}
              />
              <FieldError msg={errors.solution} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="label mb-3">Customer Types</label>
              <CheckboxGroup
                options={CUSTOMER_TYPES}
                selected={form.customerTypes}
                onToggle={(v) =>
                  set("customerTypes", toggleArray(form.customerTypes, v))
                }
              />
            </div>
            <div>
              <label className="label">Target Markets</label>
              <TagInput
                tags={form.targetMarkets}
                onAdd={(t) => set("targetMarkets", [...form.targetMarkets, t])}
                onRemove={(t) =>
                  set(
                    "targetMarkets",
                    form.targetMarkets.filter((x) => x !== t)
                  )
                }
                placeholder="E.g. Healthcare, Finance…"
              />
            </div>
            <div>
              <label className="label mb-3">Business Models</label>
              <CheckboxGroup
                options={BUSINESS_MODELS}
                selected={form.businessModels}
                onToggle={(v) =>
                  set("businessModels", toggleArray(form.businessModels, v))
                }
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Current Funding Stage</label>
              <select
                className="input"
                value={form.currentFunding}
                onChange={(e) =>
                  set("currentFunding", e.target.value as FundingStage)
                }
              >
                {STAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Funding Need (USD)</label>
              <input
                type="number"
                className="input"
                value={form.fundingNeed}
                onChange={(e) => set("fundingNeed", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Users</label>
              <input
                type="number"
                className="input"
                value={form.users}
                onChange={(e) => set("users", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Monthly Revenue (USD)</label>
              <input
                type="number"
                className="input"
                value={form.monthlyRevenue}
                onChange={(e) => set("monthlyRevenue", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Monthly Growth Rate (%)</label>
              <input
                type="number"
                className="input"
                value={form.monthlyGrowthRate}
                onChange={(e) =>
                  set("monthlyGrowthRate", Number(e.target.value))
                }
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="label mb-3">Goals</label>
              <CheckboxGroup
                options={GOALS}
                selected={form.goals}
                onToggle={(v) => set("goals", toggleArray(form.goals, v))}
              />
            </div>
            <div>
              <label className="label">Capabilities</label>
              <TagInput
                tags={form.capabilities}
                onAdd={(t) => set("capabilities", [...form.capabilities, t])}
                onRemove={(t) =>
                  set(
                    "capabilities",
                    form.capabilities.filter((x) => x !== t)
                  )
                }
                placeholder="E.g. AI expertise, Clinical data…"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">
                {t("startup.profile.uploadDeck")}
              </label>
              <DropZone
                fileName={form.pitchFileName}
                onFile={(name) => set("pitchFileName", name)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  const stepTitles: [string, string][] = [
    ["Basic Information", "Tell us about your company"],
    ["Technology Stack", "What technologies power your startup?"],
    ["Product", "Describe the problem you solve"],
    ["Market & Model", "Who are your customers?"],
    ["Funding & Traction", "Financial overview"],
    ["Goals & Capabilities", "What are you looking for?"],
    ["Pitch Deck", "Upload supporting materials"],
  ];

  if (startupProfileCompleted) {
    return (
      <DashboardLayout title={t("startup.profile.title")} subtitle="Your verified profile">
        <CompletedProfile onEditProfile={() => { clearStartupProfile(); setPhase("form"); setStep(0); }} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* Page header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                  {t("startup.profile.title")}
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {t("startup.profile.subtitle")}
                </p>
              </div>

              {/* Step bar */}
              <StepBar
                currentStep={step}
                totalSteps={STEPS.length}
                stepKeys={STEPS}
              />

              {/* Step card */}
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    {stepTitles[step][0]}
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                    {stepTitles[step][1]}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className={cn(
                      "btn-outline !px-4 !py-2 text-sm",
                      step === 0 && "opacity-40 cursor-not-allowed hover:translate-y-0"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t("startup.profile.back")}
                  </button>

                  <span className="text-xs text-[var(--color-text-muted)]">
                    {step + 1} / {STEPS.length}
                  </span>

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      {t("startup.profile.next")}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      {t("startup.profile.submit")}
                      <Brain className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {phase === "processing" && (
            <AIProcessing key="processing" onDone={handleProcessingDone} />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
