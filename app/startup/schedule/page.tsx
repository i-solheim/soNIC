"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { Brain, Calendar as CalendarIcon, Clock, Video, CheckCircle, ArrowRight, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Define the steps for AI processing
const AI_STEPS = [
  "Confirming selected time...",
  "Syncing with NIC staff calendar...",
  "Generating Google Meet link...",
  "Finalizing meeting details..."
];

export default function StartupSchedulePage() {
  const { t } = useI18n();
  const router = useRouter();
  
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Generate current month calendar grid
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  
  // Available slots for Tuesdays (2) and Thursdays (4)
  const isAvailableDate = (date: number) => {
    const dayOfWeek = new Date(currentYear, currentMonth, date).getDay();
    // Tuesday or Thursday, and strictly in the future (for simplicity mock)
    return (dayOfWeek === 2 || dayOfWeek === 4) && date > today.getDate();
  };

  const handleDateSelect = (date: number) => {
    if (isAvailableDate(date)) {
      // Just pick 9:00 AM if selected for now, we'll let user choose time if we wanted to be more complex, 
      // but to keep it simple, we just select the date and default to 9:00 AM
      setSelectedSlot({ date: new Date(currentYear, currentMonth, date), time: "09:00 AM" });
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedSlot) {
      setSelectedSlot({ ...selectedSlot, time });
    }
  };

  const availableTimes = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"];

  const handleConfirm = () => {
    if (!selectedSlot) return;
    
    setIsProcessing(true);
    setCurrentStepIndex(0);
    
    // Animate through the steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < AI_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsSuccess(true);
      }
    }, 1000); // 4 steps, 1 second each = 4 seconds total
  };

  const formatSelectedSlot = () => {
    if (!selectedSlot) return "";
    return `${selectedSlot.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selectedSlot.time}`;
  };

  return (
    <DashboardLayout title="Schedule a Meeting with NIC" subtitle="Select your preferred time from the NIC staff calendar below, or submit your availability.">
      <div className="max-w-5xl mx-auto mt-6 px-4 pb-12">
        <AnimatePresence mode="wait">
          {!isProcessing && !isSuccess && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Calendar Area - 2/3 */}
              <div className="lg:col-span-2 card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    NIC Team Availability
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-surface px-3 py-1.5 rounded-lg border border-border">
                    {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {/* Google Calendar Widget Placeholder */}
                <div className="border border-border rounded-xl overflow-hidden bg-background mb-6">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 bg-surface border-b border-border text-center text-xs font-semibold text-[var(--color-text-muted)] py-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-border">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-background min-h-[80px] p-2 opacity-50"></div>
                    ))}
                    
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const date = i + 1;
                      const isAvailable = isAvailableDate(date);
                      const isSelected = selectedSlot?.date.getDate() === date;
                      const isPast = date < today.getDate();
                      const isToday = date === today.getDate();

                      return (
                        <div 
                          key={date} 
                          onClick={() => !isPast && handleDateSelect(date)}
                          className={cn(
                            "bg-background min-h-[80px] p-2 flex flex-col relative transition-colors",
                            isPast ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-surface",
                            isSelected ? "bg-primary/5 shadow-[inset_0_0_0_2px_var(--color-primary)]" : ""
                          )}
                        >
                          <span className={cn(
                            "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                            isToday ? "bg-primary text-white" : "text-foreground"
                          )}>
                            {date}
                          </span>
                          
                          {isAvailable && (
                            <div className="mt-1 flex flex-col gap-1">
                              <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate">
                                4 slots
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection (if date selected) */}
                <AnimatePresence>
                  {selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-3">Available Times for {selectedSlot.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableTimes.map(time => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={cn(
                              "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                              selectedSlot.time === time
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                                : "bg-surface border-border text-foreground hover:border-primary hover:text-primary"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] pt-4 border-t border-border">
                  <Info className="w-4 h-4" />
                  Powered by Google Calendar — <a href="#" className="text-primary hover:underline">connect your calendar in Settings</a>
                </div>
              </div>

              {/* Side Panel - 1/3 */}
              <div className="space-y-6">
                <div className="card p-6 bg-surface/50 border-dashed">
                  <h3 className="font-bold text-foreground mb-4">Meeting Details</h3>
                  
                  {selectedSlot ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-background rounded-xl border border-primary/20 shadow-sm shadow-primary/5">
                        <p className="text-xs text-[var(--color-text-muted)] font-medium mb-1">Selected Time</p>
                        <p className="text-sm font-bold text-foreground">{formatSelectedSlot()}</p>
                      </div>
                      
                      <div className="p-3 bg-background rounded-xl border border-border">
                        <p className="text-xs text-[var(--color-text-muted)] font-medium mb-1">Duration</p>
                        <p className="text-sm font-semibold text-foreground">45 Minutes</p>
                      </div>
                      
                      <div className="p-3 bg-background rounded-xl border border-border">
                        <p className="text-xs text-[var(--color-text-muted)] font-medium mb-1">Location</p>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <Video className="w-4 h-4 text-blue-500" />
                          Google Meet
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
                      Please select a date and time from the calendar to view details.
                    </div>
                  )}
                </div>

                <div className="card p-6">
                  <label className="text-sm font-semibold text-foreground mb-2 block">Meeting Notes (Optional)</label>
                  <textarea 
                    className="input min-h-[100px] resize-y w-full mb-4" 
                    placeholder="Share anything that will help prepare for our meeting..."
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                  />
                  
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedSlot}
                    className={cn(
                      "btn-primary w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all",
                      selectedSlot 
                        ? "shadow-lg shadow-primary/20 hover:shadow-primary/40" 
                        : "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Confirm Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="card shadow-lg border border-border bg-card rounded-2xl flex flex-col items-center justify-center py-24 min-h-[500px]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="mb-10 relative"
              >
                <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center border-4 border-primary/20 relative shadow-[0_0_30px_rgba(7,60,173,0.2)]">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Brain className="w-14 h-14 text-primary" />
                  </motion.div>
                  <motion.div 
                    className="absolute inset-[-4px] rounded-full border-t-4 border-[var(--color-primary)]"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute inset-[-12px] rounded-full border-r-4 border-[var(--color-accent)] opacity-50"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  />
                </div>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Scheduling your meeting...
              </h3>
              
              <div className="w-full max-w-md mt-6 space-y-4">
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStepIndex + 1) / AI_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentStepIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center font-medium text-[var(--color-text-muted)]"
                    >
                      {AI_STEPS[currentStepIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="card shadow-xl border border-border bg-card rounded-2xl relative overflow-hidden max-w-2xl mx-auto"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
              
              <div className="flex flex-col items-center py-10 px-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>
                
                <h2 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">Meeting Scheduled!</h2>
                <p className="text-[var(--color-text-muted)] text-center max-w-md mx-auto mb-10 text-lg">
                  We've successfully booked your meeting. A calendar invitation has been sent to your email.
                </p>
                
                <div className="w-full bg-surface rounded-2xl p-8 border border-border text-left mb-10 space-y-6 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Confirmed Time</p>
                      <p className="text-lg font-bold text-foreground">{formatSelectedSlot()}</p>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-border" />
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">NIC Officer</p>
                      <p className="text-lg font-bold text-foreground">Mr. Hoang - Investment Lead</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-border" />
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Video className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Location</p>
                      <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
                      >
                        <Video className="w-4 h-4" />
                        Join Google Meet
                      </a>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push('/startup/dashboard')}
                  className="btn-outline px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-surface transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
