"use client";

import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Sidebar } from "./Sidebar";
import { Bell } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({ children, title, subtitle, actions }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading soNIC...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        {(title || actions) && (
          <header className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <NotificationBell />
            </div>
          </header>
        )}

        {/* Page content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
