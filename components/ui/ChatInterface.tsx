"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Send, Paperclip, Search, ArrowLeft, MoreVertical, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export function ChatInterface({
  matches,
  currentUserId,
  role,
  initialActiveMatchId,
}: {
  matches: any[];
  currentUserId: string;
  role: "startup" | "partner";
  initialActiveMatchId?: string;
}) {
  const { t } = useI18n();
  const [activeMatchId, setActiveMatchId] = useState<string | null>(
    initialActiveMatchId || (matches.length > 0 ? matches[0].id : null)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages store, keyed by match ID
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const initialMsgs: Record<string, ChatMessage[]> = {};
    matches.forEach((match) => {
      const isStartup = role === "startup";
      const otherPartyName = isStartup
        ? match.partner?.orgName
        : match.startup?.companyName;
      
      initialMsgs[match.id] = [
        {
          id: "m1",
          senderId: "system",
          text: `You have matched with ${otherPartyName || "this organization"}! Say hello.`,
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: "m2",
          senderId: isStartup ? match.partnerId : match.startupId,
          text: `Hi there! We reviewed your profile and are very interested in exploring a potential collaboration.`,
          timestamp: new Date(Date.now() - 3600000),
        },
      ];
    });
    return initialMsgs;
  });

  const activeMatch = matches.find((m) => m.id === activeMatchId);
  const activeMessages = activeMatchId ? messages[activeMatchId] || [] : [];

  const otherParty = role === "startup" ? activeMatch?.partner : activeMatch?.startup;
  const otherPartyName = role === "startup" ? otherParty?.orgName : otherParty?.companyName;
  const otherPartySector = role === "startup" ? otherParty?.industry : otherParty?.industry;
  const otherPartyId = role === "startup" ? activeMatch?.partnerId : activeMatch?.startupId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeMatchId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeMatchId]: [...(prev[activeMatchId] || []), newMessage],
    }));
    setMessageText("");
    
    // Simulate reply after 1.5s
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: otherPartyId,
        text: "Thank you for the message! We will get back to you shortly.",
        timestamp: new Date(),
      };
      setMessages((prev) => ({
        ...prev,
        [activeMatchId]: [...(prev[activeMatchId] || []), replyMessage],
      }));
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMatches = matches.filter((match) => {
    const name = role === "startup" ? match.partner?.orgName : match.startup?.companyName;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[600px] w-full bg-surface border border-border/50 rounded-xl overflow-hidden shadow-sm">
      {/* Left Pane - Contact List */}
      <div className="w-1/3 min-w-[300px] border-r border-border/50 flex flex-col bg-surface/50">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">{t("nav.messages" as any, "Messages")}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("common.search" as any, "Search conversations...")}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {filteredMatches.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("common.noData" as any, "No conversations found.")}
            </div>
          ) : (
            filteredMatches.map((match) => {
              const partyName = role === "startup" ? match.partner?.orgName : match.startup?.companyName;
              const sector = role === "startup" ? match.partner?.industry : match.startup?.industry;
              const isActive = activeMatchId === match.id;
              const matchMessages = messages[match.id] || [];
              const lastMessage = matchMessages[matchMessages.length - 1];

              return (
                <button
                  key={match.id}
                  onClick={() => setActiveMatchId(match.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200 flex flex-col gap-1",
                    isActive
                      ? "bg-primary/5 border border-primary/20"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-foreground truncate pr-2">
                      {partyName || "Unknown"}
                    </span>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-muted-foreground truncate pr-2">
                      {lastMessage?.text || "No messages yet"}
                    </span>
                    {sector && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                        {sector}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane - Chat Area */}
      <div className="flex-1 flex flex-col bg-background/50 relative">
        {activeMatch ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {otherPartyName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{otherPartyName || "Unknown"}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">{t("common.status" as any, "Online")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-full">
                  <Shield className="w-5 h-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  const isSystem = msg.senderId === "system";

                  if (isSystem) {
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center my-4"
                      >
                        <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                          {msg.text}
                        </span>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex flex-col max-w-[75%]",
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-2 rounded-2xl",
                          isMe
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted/80 text-foreground rounded-tl-sm border border-border/50"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-border/50">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button
                  type="button"
                  className="p-3 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-full shrink-0"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={t("common.search" as any, "Type your message...")}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[44px] max-h-[120px] scrollbar-hide"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p>{t("common.search" as any, "Select a conversation to start messaging")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
