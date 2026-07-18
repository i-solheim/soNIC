"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Shield, BarChart3, Users, Loader2,
  Eye, EyeOff, AlertCircle, Lock,
} from "lucide-react";

export default function NICLoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/nic/dashboard");
      } else {
        setError(t("auth.error.invalid"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — very dark, serious NIC hero */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, #03080f 0%, #050d1a 60%, #070f22 100%)`,
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-60"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-primary), transparent)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border"
              style={{ background: "rgba(7,60,173,0.3)", borderColor: "rgba(7,60,173,0.5)" }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">soNIC</span>
              <div className="text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                Staff Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase"
              style={{
                background: "rgba(7,60,173,0.25)",
                border: "1px solid rgba(7,60,173,0.4)",
                color: "#7ba3f5",
              }}
            >
              <Lock className="w-3 h-3" />
              Restricted Access
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              NIC Operations<br />
              <span style={{ color: "#7ba3f5" }}>Command Center</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Full visibility into Vietnam's innovation ecosystem. Monitor startups, manage matches, and track deal outcomes in real time.
            </p>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            {[
              { icon: BarChart3, text: "Real-time analytics across all startups & partners" },
              { icon: Users, text: "Monitor 142+ active ecosystem participants" },
              { icon: Shield, text: "Oversee AI match quality and compliance" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                  style={{
                    background: "rgba(7,60,173,0.2)",
                    borderColor: "rgba(7,60,173,0.35)",
                  }}
                >
                  <item.icon className="w-4 h-4" style={{ color: "#7ba3f5" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* KPIs */}
          <div
            className="p-5 rounded-xl border space-y-3"
            style={{
              background: "rgba(7,60,173,0.1)",
              borderColor: "rgba(7,60,173,0.25)",
            }}
          >
            <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
              Platform Overview
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Applications", value: "142" },
                { label: "AI Matches", value: "89" },
                { label: "Meetings", value: "53" },
                { label: "Success Rate", value: "37%" },
              ].map((kpi) => (
                <div key={kpi.label}>
                  <div className="text-xl font-bold text-white">{kpi.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            National Innovation Center · Authorized personnel only
          </p>
        </div>
      </div>

      {/* Right — form (dark tone) */}
      <div className="flex-1 flex flex-col" style={{ background: "#f8f9fb" }}>
        {/* Top nav */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.backHome")}
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{ background: "rgba(7,60,173,0.1)", borderColor: "rgba(7,60,173,0.3)" }}>
              <Shield className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
            </div>
            <span className="font-bold text-foreground">soNIC Staff</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            className="w-full max-w-md space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold tracking-wider uppercase mb-3"
                style={{
                  background: "rgba(7,60,173,0.08)",
                  border: "1px solid rgba(7,60,173,0.15)",
                  color: "var(--color-primary)",
                }}>
                <Lock className="w-3 h-3" />
                NIC Staff Only
              </div>
              <h2 className="text-3xl font-bold text-foreground">{t("auth.nic.title")}</h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {t("auth.nic.subtitle")}
              </p>
            </div>

            {/* Demo hint */}
            <div
              className="flex items-start gap-3 p-4 rounded-xl text-sm border"
              style={{
                background: "rgba(7,60,173,0.05)",
                borderColor: "rgba(7,60,173,0.15)",
                color: "var(--color-primary)",
              }}
            >
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">{t("auth.demo.hint")}</span>
                <code className="font-mono">nic@sonic.vn / nic123</code>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl text-sm border"
                style={{
                  background: "var(--color-accent-light)",
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">{t("auth.email")}</label>
                <input
                  type="email"
                  className="input"
                  placeholder="nic@sonic.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label">{t("auth.password")}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn("btn-primary w-full", isLoading && "opacity-70 cursor-not-allowed")}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("auth.signingIn")}
                  </>
                ) : (
                  t("auth.signin")
                )}
              </button>
            </form>

            {/* Warning note */}
            <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-muted)",
              }}>
              <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              This portal is restricted to authorized NIC staff only. Unauthorized access is prohibited.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
