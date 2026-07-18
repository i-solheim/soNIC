"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ArrowLeft, Zap, Brain, TrendingUp, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function StartupLoginPage() {
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
  const [regCompany, setRegCompany] = useState("");

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
        router.push("/startup/dashboard");
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
        role: "startup",
        companyName: regCompany,
      });
      if (result.success) {
        router.push("/startup/profile");
      } else {
        setError(result.error || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — dark hero */}
      <div className="hidden lg:flex lg:w-1/2 hero-dark relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-primary)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-accent)" }} />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--color-primary)" }}
            >
              <Zap className="w-5 h-5 text-white" />
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 text-white/80"
              style={{ background: "rgba(255,255,255,0.08)" }}>
              <Brain className="w-3.5 h-3.5" />
              AI-Powered Matchmaking
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your path to<br />
              <span className="gradient-text">partnership starts here</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-on-dark)", opacity: 0.7 }}>
              Connect with Vietnam's top corporations, investors, and research institutions through AI-curated matches.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Partners", value: "44+" },
              { label: "Match Rate", value: "94%" },
              { label: "Avg. Deal Time", value: "3 days" },
            ].map((stat) => (
              <div key={stat.label} className="card-glass text-center p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--color-text-on-dark)", opacity: 0.6 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              { icon: Brain, text: "AI analyzes 50+ data points for perfect matches" },
              { icon: TrendingUp, text: "Track deals and meetings in real time" },
              { icon: Zap, text: "Get matched in under 60 seconds" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(7,60,173,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm" style={{ color: "var(--color-text-on-dark)", opacity: 0.75 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: "var(--color-text-on-dark)", opacity: 0.4 }}>
            © 2024 NIC Vietnam · soNIC Platform
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col bg-card overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "var(--color-text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.backHome") || "Back to home"}
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-primary)" }}>
              <Zap className="w-3.5 h-3.5 text-white" />
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
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}>
                Startup Portal
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
                      background: "var(--color-primary-light)",
                      borderColor: "var(--color-card-border)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">{t("auth.demo.hint") || "Demo Account:"}</span>
                      <code className="font-mono ml-2">startup@sonic.vn / startup123</code>
                    </div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                      <label className="label">{t("auth.email") || "Email"}</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="startup@sonic.vn"
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
                      className={cn("btn-primary w-full", isLoading && "opacity-70 cursor-not-allowed")}
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
                        placeholder="John Doe"
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
                        placeholder="john@startup.com"
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
                      <label className="label">Company Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Acme Corp"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn("btn-primary w-full", isLoading && "opacity-70 cursor-not-allowed")}
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
                Looking to join as a partner?{" "}
                <Link href="/login/partner" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
                  Partner login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
