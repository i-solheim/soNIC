"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, ArrowRight, Building2, MapPin, Briefcase, Zap, Target, Banknote } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useProfileStore } from "@/lib/profile-store";
import { MOCK_PARTNER_PROFILES } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTOR_COLORS: Record<string, string> = {
  INVESTOR: "from-indigo-900 to-purple-900",
  GOVERNMENT: "from-blue-900 to-slate-900",
  HealthTech: "from-[#0f766e] to-[#115e59]",
  EdTech: "from-[#6d28d9] to-[#4c1d95]",
  CleanTech: "from-[#059669] to-[#047857]",
  FinTech: "from-[#0369a1] to-[#075985]",
};

const getTypeGradient = (type: string, industry?: string) => {
  if (type === "INVESTOR") return SECTOR_COLORS.INVESTOR;
  if (type === "GOVERNMENT") return SECTOR_COLORS.GOVERNMENT;
  return industry && SECTOR_COLORS[industry] ? SECTOR_COLORS[industry] : "from-slate-800 to-slate-900";
};

function HeartAnimation({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 2, 3], opacity: [1, 1, 0], y: y - 100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50 text-[var(--color-accent)]"
      style={{ left: x - 40, top: y - 40 }}
    >
      <Heart className="w-20 h-20 fill-current" />
    </motion.div>
  );
}

const PANE_NAMES = ['Overview', 'Strategic Fit', 'Focus Areas', 'Intro Video'];

export default function StartupMatchesPage() {
  const router = useRouter();
  const { addLike, isMutualMatch, likedIds } = useProfileStore();

  const [feedPartners, setFeedPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches?type=startup", {
      headers: { Authorization: `Bearer ${localStorage.getItem("sonic_token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFeedPartners(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalPartnerIdx, setModalPartnerIdx] = useState<number | null>(null);
  const [paneIdx, setPaneIdx] = useState(0);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const goNext = useCallback(() => {
    if (currentIndex < feedPartners.length - 1) setCurrentIndex(c => c + 1);
  }, [currentIndex, feedPartners.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  }, [currentIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    if (modalPartnerIdx !== null) return;
    if (Math.abs(e.deltaY) < 12) return;
    if (e.deltaY > 0) goNext(); else goPrev();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalPartnerIdx !== null || showMatchAnimation) return;
      if (e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalPartnerIdx, showMatchAnimation, goNext, goPrev]);

  const toggleInterest = async (id: string, e?: React.MouseEvent) => {
    addLike(id);
    if (e) {
      setHearts(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
    }

    try {
      await fetch("/api/matches/like", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sonic_token")}`
        },
        body: JSON.stringify({ toUserId: id }) // fromUserId is no longer needed
      });
    } catch (err) {
      console.error(err);
    }

    if (isMutualMatch(id)) {
      setTimeout(() => setShowMatchAnimation(true), 800);
    }
  };

  const openModal = (idx: number) => {
    setModalPartnerIdx(idx);
    setPaneIdx(0);
  };

  const closeModal = () => setModalPartnerIdx(null);

  const activePartner = modalPartnerIdx !== null ? feedPartners[modalPartnerIdx] : null;

  return (
    <DashboardLayout>
      <div 
        className="-m-6 h-[calc(100vh)] bg-[#f8fafc] dark:bg-black overflow-hidden relative select-none flex flex-col items-center justify-center"
        onWheel={handleWheel}
      >
        {/* Right Nav */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-40">
          <button onClick={goPrev} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex flex-col gap-3">
            {feedPartners.map((p, i) => {
              const isLiked = likedIds.includes(p.id);
              return (
                <div 
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2.5 rounded-full cursor-pointer transition-all duration-300",
                    i === currentIndex ? "h-8 bg-[var(--color-primary)]" : isLiked ? "h-2.5 bg-[#35A17E]" : "h-2.5 bg-slate-300 dark:bg-white/30 hover:bg-slate-400 dark:hover:bg-white/50"
                  )}
                />
              )
            })}
          </div>
          <button onClick={goNext} className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Deck Wrap */}
        <div className="relative flex-1 w-full max-w-2xl flex items-center justify-center" style={{ perspective: 1400 }}>
          <AnimatePresence initial={false}>
            {feedPartners.map((partner, i) => {
              const rel = i - currentIndex;
              if (Math.abs(rel) > 2) return null;
              
              const isInterested = likedIds.includes(partner.id);
              const gradientClass = getTypeGradient(partner.orgType, partner.industry);
              const displayType = partner.industry || partner.orgType.replace("_", " ");
              
              return (
                <motion.div
                  key={partner.id}
                  initial={false}
                  animate={{
                    y: rel * 36,
                    scale: 1 - Math.abs(rel) * 0.06,
                    opacity: rel === 0 ? 1 : Math.abs(rel) === 1 ? 0.55 : 0.22,
                    zIndex: 10 - Math.abs(rel),
                    filter: rel === 0 ? 'blur(0px)' : Math.abs(rel) === 1 ? 'blur(1.5px)' : 'blur(3px)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={cn(
                    "absolute inset-x-6 mx-auto aspect-[4/3] max-h-[600px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col bg-gradient-to-br p-8 cursor-pointer",
                    gradientClass,
                    rel !== 0 && "pointer-events-none"
                  )}
                  onClick={() => openModal(i)}
                  onDoubleClick={(e) => { e.stopPropagation(); toggleInterest(partner.id, e); }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

                  {/* Interested Flag */}
                  <AnimatePresence>
                    {isInterested && (
                      <motion.div 
                        initial={{ opacity: 0, y: -4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute top-6 right-6 bg-[#35A17E]/20 text-[#35A17E] border border-[#35A17E]/40 text-xs font-bold tracking-wider px-4 py-2 rounded-full flex items-center gap-2 z-20 backdrop-blur-md"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        INTERESTED
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    {/* Logo and Brand (Top Left) */}
                    <div className="flex items-center gap-6 mb-auto">
                      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-xl rotate-[-5deg] border-4 border-white/20 shrink-0">
                         <span className="text-3xl font-black text-slate-800">{partner.orgName.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="text-white">
                        <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md m-0">{partner.orgName}</h2>
                        <p className="text-lg font-medium opacity-90 mt-1">{displayType}</p>
                      </div>
                    </div>

                    {/* Blurred Call to Action Box */}
                    <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex items-center justify-center group mt-auto transition-transform">
                      <p className="text-white text-xl font-bold tracking-wide flex items-center gap-2 shadow-sm m-0">
                        Click here for more details <ArrowRight className="w-5 h-5" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {hearts.map((h) => (
          <HeartAnimation 
            key={h.id} 
            x={h.x} 
            y={h.y} 
            onComplete={() => setHearts(prev => prev.filter(heart => heart.id !== h.id))} 
          />
        ))}

        {/* Modal Veil */}
        <AnimatePresence>
          {modalPartnerIdx !== null && activePartner && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-0 z-[100] bg-white dark:bg-[#0f172a] flex flex-col overflow-y-auto"
            >
              {/* Top Section (Gradient + Brand) */}
              <div className={cn("w-full pt-16 px-12 pb-24 relative text-white bg-gradient-to-br shrink-0", getTypeGradient(activePartner.orgType, activePartner.industry))}>
                {/* Score & Close button */}
                <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
                  <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md shadow-xl">
                    <span className="text-white font-extrabold text-lg">{activePartner.matchScore || 90}%</span>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-colors text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="max-w-4xl mx-auto flex items-start gap-8">
                  <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center shadow-2xl border-4 border-white/20 flex-shrink-0">
                    <span className="text-5xl font-black text-slate-800">{activePartner.orgName.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="pt-2">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">{activePartner.orgName}</h1>
                    <p className="text-2xl font-medium opacity-90 mb-4">{activePartner.industry || activePartner.orgType.replace("_", " ")}</p>
                    <p className="text-lg opacity-80 leading-relaxed max-w-2xl">{activePartner.description}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section (White Background + Carousel) */}
              <div className="flex-1 bg-white dark:bg-[#0f172a] relative -mt-10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] flex flex-col">
                
                {/* Tabs */}
                <div className="flex gap-8 px-12 pt-8 border-b border-slate-200 dark:border-slate-800 shrink-0 max-w-6xl mx-auto w-full">
                  {PANE_NAMES.map((n, i) => (
                    <button 
                      key={i}
                      onClick={() => setPaneIdx(i)}
                      className={cn(
                        "pb-4 text-lg font-bold border-b-[3px] transition-colors",
                        i === paneIdx 
                          ? "border-[var(--color-primary)] text-slate-900 dark:text-white" 
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <div className="flex-1 relative overflow-hidden flex flex-col max-w-6xl mx-auto w-full px-12 py-8">
                  <div 
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${paneIdx * 100}%)` }}
                  >
                    {/* Pane 0: Overview */}
                    <div className="w-full h-full shrink-0 overflow-y-auto px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><MapPin className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Location</p>
                            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{activePartner.location?.city ? `${activePartner.location.city}, ${activePartner.location.country}` : "Vietnam"}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><Banknote className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">{activePartner.orgType === "INVESTOR" ? "Investment Range" : "Budget"}</p>
                            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{activePartner.investmentRange || activePartner.budget || "Flexible"}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><Briefcase className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Target Stage</p>
                            <p className="text-xl font-extrabold text-slate-900 dark:text-white truncate">{(activePartner.preferredStartupStage || activePartner.investmentStages)?.[0]?.replace("_", " ") || "Agnostic"}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl"><Building2 className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Type</p>
                            <p className="text-xl font-extrabold text-slate-900 dark:text-white capitalize">{activePartner.orgType.toLowerCase()}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4 col-span-1 md:col-span-2">
                          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl"><Target className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Areas of Interest</p>
                            <div className="flex gap-2 flex-wrap mt-2">
                              {(activePartner.innovationPriorities || activePartner.researchFields || activePartner.industries || []).map((k: string) => (
                                <span key={k} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">{k}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Match Reasoning</h3>
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                          {activePartner.matchReason || `Your startup's trajectory aligns strongly with ${activePartner.orgName}'s current focus areas and target market.`}
                        </p>
                      </div>
                    </div>

                    {/* Pane 1: Strategic Fit */}
                    <div className="w-full h-full shrink-0 overflow-y-auto px-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Collaboration Priorities</h3>
                      <ul className="flex flex-col gap-4 m-0 p-0 list-none mb-8">
                        {(activePartner.innovationPriorities || activePartner.researchFields || ['Growth opportunities', 'Strategic integration']).map((line: string, i: number) => (
                          <li key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pane 2: Focus Areas */}
                    <div className="w-full h-full shrink-0 overflow-y-auto px-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Technologies & Industries of Interest</h3>
                      <div className="flex flex-wrap gap-4">
                        {(activePartner.technologyInterests || activePartner.industries || ['AI', 'SaaS']).map((s: string, i: number) => (
                          <div key={i} className="px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-base font-bold text-slate-700 dark:text-slate-300">
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pane 3: Demo Video */}
                    <div className="w-full h-full shrink-0 overflow-y-auto px-4">
                      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl mb-6 relative flex items-center justify-center shadow-inner overflow-hidden border border-slate-700">
                        <button className="w-20 h-20 rounded-full bg-white hover:scale-105 flex items-center justify-center transition-transform shadow-2xl">
                           <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-slate-900 border-b-[10px] border-b-transparent ml-2" />
                        </button>
                        <div className="absolute bottom-6 left-6 text-white text-lg font-bold">Inside {activePartner.orgName}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-6 text-blue-700 dark:text-blue-300">
                        <strong>Note:</strong> Video playback is mocked for this prototype.
                      </div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <button 
                    onClick={() => setPaneIdx(c => Math.max(0, c - 1))}
                    disabled={paneIdx === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-0 transition-opacity z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setPaneIdx(c => Math.min(PANE_NAMES.length - 1, c + 1))}
                    disabled={paneIdx === PANE_NAMES.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-0 transition-opacity z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Footer Action */}
                <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-6 pb-8 px-12 flex justify-center bg-white dark:bg-[#0f172a] shrink-0">
                  <button 
                    onClick={(e) => toggleInterest(activePartner.id, e as any)}
                    className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_var(--color-primary)] hover:scale-105 transition-transform flex items-center gap-3"
                  >
                    <Heart className="w-6 h-6 fill-current" />
                    Express Interest
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mutual Match Modal */}
        <AnimatePresence>
          {showMatchAnimation && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#060910]/80 backdrop-blur-md px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-full max-w-[420px] bg-slate-900 rounded-3xl p-8 shadow-2xl text-center border border-white/10"
              >
                <Heart className="w-16 h-16 mx-auto text-[var(--color-accent)] fill-[var(--color-accent)] mb-4" />
                <h2 className="font-serif text-3xl font-bold text-white mb-2">It's a Match!</h2>
                <p className="text-slate-400 mb-8 text-sm">
                  You have mutually expressed interest in each other.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push(`/startup/messages`)}
                    className="w-full bg-[var(--color-primary)] text-white rounded-xl py-3 font-bold hover:brightness-110 transition-all"
                  >
                    Start Conversation
                  </button>
                  <button 
                    onClick={() => setShowMatchAnimation(false)}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-xl py-3 font-bold hover:bg-white/10 transition-all"
                  >
                    Keep Browsing
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
