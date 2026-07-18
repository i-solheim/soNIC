"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="flex items-center gap-1 p-1 rounded-full shadow-lg border border-border bg-card"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <button
          id="lang-toggle-en"
          onClick={() => setLang("en")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
            lang === "en"
              ? "bg-primary text-white shadow-sm"
              : "text-[var(--color-text-muted)] hover:text-foreground"
          )}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          id="lang-toggle-vi"
          onClick={() => setLang("vi")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
            lang === "vi"
              ? "bg-primary text-white shadow-sm"
              : "text-[var(--color-text-muted)] hover:text-foreground"
          )}
          aria-label="Switch to Vietnamese"
        >
          VI
        </button>
      </div>
    </div>
  );
}
