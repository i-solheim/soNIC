"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Link2, Calendar, Users,
  BarChart3, LogOut, ChevronLeft, ChevronRight, Zap,
  MessageSquare, CalendarRange
} from "lucide-react";
import { useAuth, getDashboardPath } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useState } from "react";

const startupLinks = [
  { href: "/startup/dashboard", icon: LayoutDashboard, key: "nav.dashboard" as const },
  { href: "/startup/profile", icon: User, key: "nav.profile" as const },
  { href: "/startup/matches", icon: Link2, key: "nav.matches" as const },
  { href: "/startup/messages", icon: MessageSquare, key: "nav.messages" as const },
  { href: "/startup/schedule", icon: CalendarRange, key: "nav.schedule" as const },
];

const partnerLinks = [
  { href: "/partner/dashboard", icon: LayoutDashboard, key: "nav.dashboard" as const },
  { href: "/partner/profile", icon: User, key: "nav.profile" as const },
  { href: "/partner/matches", icon: Link2, key: "nav.matches" as const },
  { href: "/partner/messages", icon: MessageSquare, key: "nav.messages" as const },
];

const nicLinks = [
  { href: "/nic/dashboard", icon: BarChart3, key: "nav.analytics" as const },
  { href: "/nic/startups", icon: Users, key: "nav.startups" as const },
  { href: "/nic/meetings", icon: Calendar, key: "nav.meetings" as const },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const links =
    user.role === "startup" ? startupLinks :
    user.role === "partner" ? partnerLinks :
    nicLinks;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 border-r border-border bg-card transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-border",
        collapsed && "justify-center px-2"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-foreground">
            so<span className="text-primary">NIC</span>
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {links.map(({ href, icon: Icon, key }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? t(key) : undefined}
              className={cn(
                collapsed
                  ? "flex items-center justify-center w-full h-10 rounded-xl transition-all duration-200"
                  : isActive ? "sidebar-link-active" : "sidebar-link",
                collapsed && isActive
                  ? "bg-[var(--color-primary-light)] text-primary"
                  : collapsed
                  ? "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-light)] hover:text-primary"
                  : ""
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{t(key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-border p-2 space-y-1">
        {!collapsed && (
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? t("nav.logout") : undefined}
          className={cn(
            "sidebar-link w-full text-left",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t("nav.logout")}</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border
                   flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10
                   text-[var(--color-text-muted)] hover:text-primary"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
