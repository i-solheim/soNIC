/**
 * profile-store.ts
 * 
 * localStorage-backed context that tracks whether a user has completed
 * their onboarding profile. Used to conditionally show the form (first-time)
 * vs. the LinkedIn-style profile view (returning users).
 */
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { StartupProfile, PartnerProfile } from "./types";

// ============================================================
// Store shape
// ============================================================
interface ProfileStore {
  // Startup
  startupProfile: StartupProfile | null;
  startupProfileCompleted: boolean;
  saveStartupProfile: (profile: StartupProfile) => void;
  clearStartupProfile: () => void;

  // Partner
  partnerProfile: PartnerProfile | null;
  partnerProfileCompleted: boolean;
  savePartnerProfile: (profile: PartnerProfile) => void;
  clearPartnerProfile: () => void;

  // Mutual interests (who the current user has liked)
  likedIds: string[];           // IDs of partners/startups this user has liked
  addLike: (id: string) => void;
  removeLike: (id: string) => void;
  hasLiked: (id: string) => boolean;

  // Ids of people who liked this user (simulated from mock data)
  likedByIds: string[];
  isMutualMatch: (id: string) => boolean;
  getMutualMatches: () => string[];
}

const ProfileStoreContext = createContext<ProfileStore>({
  startupProfile: null,
  startupProfileCompleted: false,
  saveStartupProfile: () => {},
  clearStartupProfile: () => {},
  partnerProfile: null,
  partnerProfileCompleted: false,
  savePartnerProfile: () => {},
  clearPartnerProfile: () => {},
  likedIds: [],
  addLike: () => {},
  removeLike: () => {},
  hasLiked: () => false,
  likedByIds: [],
  isMutualMatch: () => false,
  getMutualMatches: () => [],
});

// ============================================================
// Provider
// ============================================================
export function ProfileStoreProvider({ children }: { children: React.ReactNode }) {
  const [startupProfile, setStartupProfile] = useState<StartupProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Simulated: these are IDs that have "liked" the current user from the other side.
  // In production this would come from the backend.
  // We pre-seed pp1 and pp2 so that mutual matches work out of the box.
  const likedByIds = ["pp1", "pp2", "sp1", "sp2"];

  useEffect(() => {
    try {
      const sp = localStorage.getItem("sonic_startup_profile");
      if (sp) setStartupProfile(JSON.parse(sp));

      const pp = localStorage.getItem("sonic_partner_profile");
      if (pp) setPartnerProfile(JSON.parse(pp));

      const liked = localStorage.getItem("sonic_liked_ids");
      if (liked) setLikedIds(JSON.parse(liked));
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveStartupProfile = useCallback((profile: StartupProfile) => {
    setStartupProfile(profile);
    localStorage.setItem("sonic_startup_profile", JSON.stringify(profile));
  }, []);

  const clearStartupProfile = useCallback(() => {
    setStartupProfile(null);
    localStorage.removeItem("sonic_startup_profile");
  }, []);

  const savePartnerProfile = useCallback((profile: PartnerProfile) => {
    setPartnerProfile(profile);
    localStorage.setItem("sonic_partner_profile", JSON.stringify(profile));
  }, []);

  const clearPartnerProfile = useCallback(() => {
    setPartnerProfile(null);
    localStorage.removeItem("sonic_partner_profile");
  }, []);

  const addLike = useCallback((id: string) => {
    setLikedIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("sonic_liked_ids", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeLike = useCallback((id: string) => {
    setLikedIds(prev => {
      const next = prev.filter(x => x !== id);
      localStorage.setItem("sonic_liked_ids", JSON.stringify(next));
      return next;
    });
  }, []);

  const hasLiked = useCallback((id: string) => likedIds.includes(id), [likedIds]);

  const isMutualMatch = useCallback(
    (id: string) => likedIds.includes(id) && likedByIds.includes(id),
    [likedIds]
  );

  const getMutualMatches = useCallback(
    () => likedIds.filter(id => likedByIds.includes(id)),
    [likedIds]
  );

  return (
    <ProfileStoreContext.Provider
      value={{
        startupProfile,
        startupProfileCompleted: !!startupProfile && startupProfile.phase === 2,
        saveStartupProfile,
        clearStartupProfile,
        partnerProfile,
        partnerProfileCompleted: !!partnerProfile && partnerProfile.profileStatus === "complete",
        savePartnerProfile,
        clearPartnerProfile,
        likedIds,
        addLike,
        removeLike,
        hasLiked,
        likedByIds,
        isMutualMatch,
        getMutualMatches,
      }}
    >
      {children}
    </ProfileStoreContext.Provider>
  );
}

export function useProfileStore() {
  return useContext(ProfileStoreContext);
}
