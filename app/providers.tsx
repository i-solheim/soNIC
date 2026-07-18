"use client";

import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ProfileStoreProvider } from "@/lib/profile-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <ProfileStoreProvider>
          {children}
          <LanguageToggle />
        </ProfileStoreProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
