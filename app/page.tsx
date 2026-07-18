"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, Brain, Calendar, ShieldCheck,
  ArrowRight, ChevronDown, Sparkles, TrendingUp, Globe
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth, getDashboardPath } from "@/lib/auth";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: Brain,
    key: "matchmaking" as const,
    color: "bg-[var(--color-primary-light)] text-primary",
  },
  {
    icon: Zap,
    key: "deal" as const,
    color: "bg-[var(--color-accent-light)] text-accent",
  },
  {
    icon: Calendar,
    key: "meeting" as const,
    color: "bg-[var(--color-success-light)] text-[var(--color-success)]",
  },
  {
    icon: ShieldCheck,
    key: "compliance" as const,
    color: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  },
];

const WORKFLOW_STEPS = [
  { key: "step1" as const, icon: "📄" },
  { key: "step2" as const, icon: "🤖" },
  { key: "step3" as const, icon: "🔗" },
  { key: "step4" as const, icon: "🤝" },
  { key: "step5" as const, icon: "✅" },
];

const STATS = [
  { value: "142+", label: "Active Startups", labelVi: "Startup Hoạt Động" },
  { value: "89%", label: "Match Accuracy", labelVi: "Độ Chính Xác Kết Nối" },
  { value: "3 days", label: "Avg. Time to Match", labelVi: "Thời Gian Kết Nối TB" },
  { value: "44", label: "Partner Organizations", labelVi: "Tổ Chức Đối Tác" },
];

export default function LandingPage() {
  const { t, lang } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getDashboardPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ---- Navbar ---- */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[var(--color-bg-dark)]/90 backdrop-blur-md">
        <div className="section-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              so<span className="text-[var(--color-accent)]">NIC</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login/startup" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
              {t("landing.hero.cta.startup")}
            </Link>
            <Link href="/login/partner" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
              {t("landing.hero.cta.partner")}
            </Link>

          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="hero-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="section-container text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-sm text-white/70 font-medium">
              {lang === "en" ? "Powered by AI · Built for Vietnam" : "Được hỗ trợ bởi AI · Xây dựng cho Việt Nam"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6 max-w-4xl mx-auto"
          >
            {t("landing.hero.tagline")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-10 text-balance"
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login/startup" id="cta-startup" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              {t("landing.hero.cta.startup")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login/partner" id="cta-partner" className="btn-outline text-base px-8 py-4 w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
              {t("landing.hero.cta.partner")}
            </Link>

          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.value} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">
                  {lang === "en" ? stat.label : stat.labelVi}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-1"
        >
          <span className="text-xs">{lang === "en" ? "Scroll to explore" : "Cuộn để khám phá"}</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </section>

      {/* ---- Feature Cards ---- */}
      <section className="py-24 bg-background" id="features">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 badge-primary mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              {lang === "en" ? "Platform Capabilities" : "Tính Năng Nền Tảng"}
            </div>
            <h2 className="section-title">{t("landing.features.title")}</h2>
            <p className="section-subtitle max-w-xl mx-auto">{t("landing.features.subtitle")}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, key, color }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-hover group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t(`landing.features.${key}.title` as any)}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {t(`landing.features.${key}.desc` as any)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Animated Workflow ---- */}
      <section className="py-24 bg-surface" id="workflow">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 badge-accent mb-4">
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "How It Works" : "Cách Thức Hoạt Động"}
            </div>
            <h2 className="section-title">{t("landing.workflow.title")}</h2>
            <p className="section-subtitle max-w-xl mx-auto">{t("landing.workflow.subtitle")}</p>
          </motion.div>

          {/* Vertical workflow */}
          <div className="max-w-sm mx-auto">
            {WORKFLOW_STEPS.map(({ key, icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="flex items-center gap-4">
                  {/* Step circle */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md"
                    style={{
                      background: i === 4
                        ? "var(--color-success)"
                        : i % 2 === 0
                        ? "var(--color-primary)"
                        : "var(--color-bg-dark)",
                    }}
                  >
                    {icon}
                  </div>
                  {/* Label */}
                  <div className="card flex-1 py-3 px-4">
                    <span className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
                      {lang === "en" ? `Step ${i + 1}` : `Bước ${i + 1}`}
                    </span>
                    <p className="font-semibold text-foreground">
                      {t(`landing.workflow.${key}` as any)}
                    </p>
                  </div>
                </div>
                {/* Connector */}
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="flex items-center justify-start ml-7 my-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-primary/60 to-primary/10 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="hero-dark py-20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {lang === "en" ? "Ready to Accelerate Your Growth?" : "Sẵn Sàng Tăng Tốc Tăng Trưởng?"}
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              {lang === "en"
                ? "Join the soNIC ecosystem and get matched with the right partners in days."
                : "Tham gia hệ sinh thái soNIC và kết nối với đối tác phù hợp chỉ trong vài ngày."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login/startup" className="btn-primary text-base px-8 py-4">
                {t("landing.hero.cta.startup")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login/partner" className="btn-outline text-base px-8 py-4 border-white/30 text-white hover:bg-white/10">
                {t("landing.hero.cta.partner")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="bg-[var(--color-bg-dark)] border-t border-white/5 py-10">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">so<span className="text-accent">NIC</span></span>
          </div>
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} soNIC · National Innovation Center Vietnam
          </p>
          <div className="flex items-center gap-4 text-sm text-white/30">
            <Link href="/login/startup" className="hover:text-white/60 transition-colors">
              {lang === "en" ? "Startups" : "Startup"}
            </Link>
            <Link href="/login/partner" className="hover:text-white/60 transition-colors">
              {lang === "en" ? "Partners" : "Đối Tác"}
            </Link>

          </div>
        </div>
      </footer>
    </div>
  );
}
