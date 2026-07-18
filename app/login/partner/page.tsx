"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Building2, Users, TrendingUp, Loader2,
  Eye, EyeOff, AlertCircle, Globe, Handshake,
} from "lucide-react";

export default function PartnerLoginPage() {
  const { login, register } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regOrgName, setRegOrgName] = useState("");
  const [regOrgType, setRegOrgType] = useState("corporation");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/partner/dashboard");
      } else {
        setError(t("auth.error.invalid") || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    try {
      const result = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: "partner",
        orgName: regOrgName,
        orgType: regOrgType,
      });
      if (result.success) {
        router.push("/partner/profile");
      } else {
        setError(result.error || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — dark hero with accent color */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #1a0a00 0%, #2d0f00 50%, #1a0500 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--color-accent)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-primary)" }} />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--color-accent)" }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">soNIC</span>
          </Link>
        </div>

        <motion.div
          className="relative z-10 space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{
                borderColor: "rgba(227,53,0,0.4)",
                background: "rgba(227,53,0,0.15)",
                color: "#fca38a",
              }}
            >
              <Handshake className="w-3.5 h-3.5" />
              Partner Organization Portal
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Discover Vietnam's<br />
              <span style={{
                background: `linear-gradient(135deg, var(--color-accent) 0%, #ff8050 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                next breakout startup
              </span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              AI-powered scouting connects your organization with startups that match your innovation strategy, investment thesis, or research needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Building2, label: "Corporations" },
              { icon: TrendingUp, label: "VC / Funds" },
              { icon: Users, label: "Universities" },
              { icon: Globe, label: "Research Institutes" },
            ].map((item) => (
              <div key={item.label}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(227,53,0,0.25)", border: "1px solid rgba(227,53,0,0.3)" }}>
                  <item.icon className="w-4 h-4" style={{ color: "#fca38a" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-8">
            {[
              { label: "Startups", value: "98+" },
              { label: "Deals Closed", value: "53" },
              { label: "Success Rate", value: "37%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2024 NIC Vietnam · soNIC Platform
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col bg-card overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent"
            style={{ color: "var(--color-text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.backHome") || "Back to home"}
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-accent)" }}>
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground">soNIC</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 py-12">
          <motion.div
            className="w-full max-w-md space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: "var(--color-accent-light)",
                  color: "var(--color-accent)",
                }}>
                Partner Portal
              </div>
              <h2 className="text-3xl font-bold text-foreground">Welcome to soNIC</h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Sign in to your account or create a new one to get started.
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="flex p-1 bg-surface rounded-xl border border-border">
              <button
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === "signin" ? "bg-card text-foreground shadow-sm" : "text-[var(--color-text-muted)] hover:text-foreground"
                )}
                onClick={() => { setActiveTab("signin"); setError(""); }}
              >
                Sign In
              </button>
              <button
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === "signup" ? "bg-card text-foreground shadow-sm" : "text-[var(--color-text-muted)] hover:text-foreground"
                )}
                onClick={() => { setActiveTab("signup"); setError(""); }}
              >
                Sign Up
              </button>
            </div>

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

            <AnimatePresence mode="wait">
              {activeTab === "signin" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl text-sm border"
                    style={{
                      background: "var(--color-accent-light)",
                      borderColor: "rgba(227,53,0,0.2)",
                      color: "var(--color-accent)",
                    }}
                  >
                    <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">{t("auth.demo.hint") || "Demo Account:"}</span>
                      <code className="font-mono ml-2">corp@sonic.vn / partner123</code>
                    </div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                      <label className="label">{t("auth.email") || "Email"}</label>
                      <input
                        type="email"
                        className="input"
                        style={{ "--tw-ring-color": "var(--color-accent)" } as React.CSSProperties}
                        placeholder="corp@sonic.vn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div>
                      <label className="label">{t("auth.password") || "Password"}</label>
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
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl",
                        "font-semibold text-sm text-white transition-all duration-200",
                        "hover:-translate-y-0.5 active:translate-y-0 focus:outline-none",
                        "focus:ring-2 focus:ring-offset-2",
                        isLoading && "opacity-70 cursor-not-allowed"
                      )}
                      style={{
                        background: "var(--color-accent)",
                        boxShadow: "var(--shadow-md)",
                        ["--tw-ring-color" as string]: "var(--color-accent)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        t("auth.signin") || "Sign In"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div>
                      <label className="label">Full Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Jane Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="jane@org.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={cn("input pr-12", error && regPassword.length < 8 && regPassword.length > 0 ? "border-red-500" : "")}
                          placeholder="Min 8 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="label">Organization Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Global Ventures"
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Organization Type</label>
                      <select
                        className="input"
                        value={regOrgType}
                        onChange={(e) => setRegOrgType(e.target.value)}
                        required
                      >
                        <option value="corporation">Corporation</option>
                        <option value="vc_fund">VC Fund</option>
                        <option value="university">University</option>
                        <option value="research_institute">Research Institute</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl",
                        "font-semibold text-sm text-white transition-all duration-200",
                        "hover:-translate-y-0.5 active:translate-y-0 focus:outline-none",
                        "focus:ring-2 focus:ring-offset-2",
                        isLoading && "opacity-70 cursor-not-allowed"
                      )}
                      style={{
                        background: "var(--color-accent)",
                        boxShadow: "var(--shadow-md)",
                        ["--tw-ring-color" as string]: "var(--color-accent)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center space-y-3 pt-4 border-t border-border mt-8">
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Are you a startup?{" "}
                <Link href="/login/startup" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
                  Startup login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
