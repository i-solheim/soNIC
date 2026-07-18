"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Heart, Calendar, Eye, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { AppNotification } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { lang, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "mutual_match":
        return <Heart className="w-4 h-4 text-green-500" />;
      case "meeting_scheduled":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "interest_received":
        return <Eye className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center hover:bg-[var(--color-primary-light)] hover:border-primary transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[var(--color-text-muted)]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[500px] bg-card border border-border rounded-xl shadow-lg overflow-hidden flex flex-col z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
                    <Inbox className="w-6 h-6 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">No notifications</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n) => {
                    const title = lang === "vi" ? n.titleVi : n.title;
                    const body = lang === "vi" ? n.bodyVi : n.body;

                    const innerContent = (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0 border border-border">
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
                          <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-0.5">{body}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 opacity-70">
                            {n.timestamp}
                          </p>
                        </div>
                      </div>
                    );

                    const commonClasses = cn(
                      "block p-4 border-b border-border transition-colors hover:bg-surface",
                      !n.read && "bg-[var(--color-primary-light)] border-l-2 border-l-primary"
                    );

                    const handleClick = () => {
                      setNotifications(prev =>
                        prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif)
                      );
                    };

                    if (n.linkHref) {
                      return (
                        <Link
                          key={n.id}
                          href={n.linkHref}
                          className={commonClasses}
                          onClick={handleClick}
                        >
                          {innerContent}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={n.id}
                        className={commonClasses}
                        onClick={handleClick}
                      >
                        {innerContent}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
