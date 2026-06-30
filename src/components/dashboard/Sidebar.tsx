"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Database,
  Folder,
  Network,
  BookOpen,
  RefreshCw,
  LogOut,
  Sun,
  Moon,
  Settings,
  Sparkles,
  Trash2,
  PanelLeftClose,
  Search,
  Plus,
  MessageSquare,
} from "lucide-react";
import type { ChatSession } from "@/app/app/page";

export type TabType =
  | "home"
  | "chat"
  | "vault"
  | "collections"
  | "graph"
  | "reader"
  | "sync"
  | "settings";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  fetchSessions: () => Promise<void>;
  isSessionsLoading: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  profile: { name: string; email: string; cachePath: string };
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  activeSessionId,
  setActiveSessionId,
  sessions,
  setSessions,
  fetchSessions,
  isSessionsLoading,
  isCollapsed,
  setIsCollapsed,
  profile,
}: SidebarProps) {
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "AC";
  
  const handleNewChat = () => {
    setActiveSessionId(null);
    setActiveTab("chat");
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setActiveTab("chat");
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSessions(sessions.filter((s) => s.id !== id));
        if (activeSessionId === id) {
          setActiveSessionId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete chat session:", err);
    }
  };

  return (
    <aside
      className={`transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 relative z-30 h-screen flex flex-col bg-white/70 dark:bg-[#1a1a15]/90 border-r border-[#ddc0be]/30 dark:border-white/10 overflow-hidden ${
        isCollapsed
          ? "w-0 opacity-0 border-r-0 pointer-events-none"
          : "w-66 opacity-100"
      }`}
    >
      <div className="w-66 h-full flex flex-col justify-between p-4 shrink-0">
        <div className="flex flex-col gap-5 overflow-hidden flex-1">
        {/* Top Branding & Control Actions */}
        <div className="flex items-center justify-between border-b border-[#ddc0be]/20 dark:border-white/5 pb-3">
          <Link href="/" className="flex items-center gap-2 pr-2">
            <img
              src="/logo.jpg"
              alt="Cerebellum AI Logo"
              className="w-7 h-7 rounded-full object-cover border border-[#ddc0be]/30 dark:border-white/10"
            />
            <span className="font-bold text-sm text-text-rich dark:text-white tracking-tight">
              Cerebellum
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-[#8a7170] hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg text-[#8a7170] hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full h-11 rounded-xl border border-dashed border-[#E36A6A]/60 hover:border-[#E36A6A] hover:bg-[#E36A6A]/10 text-xs font-bold text-[#E36A6A] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New chat
        </button>

        {/* Navigation Tabs (Features Required in Project) */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[40%] scrollbar-thin">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "chat", label: "Cerebellum AI", icon: Sparkles },
            { id: "vault", label: "Memory Vault", icon: Database },
            { id: "collections", label: "Collections", icon: Folder },
            { id: "graph", label: "Graph Navigator", icon: Network },
            { id: "reader", label: "Reader Mode", icon: BookOpen },
            { id: "sync", label: "Sync & Export", icon: RefreshCw },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id && (tab.id !== "chat" || !activeSessionId);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "chat") {
                    handleNewChat();
                  } else {
                    setActiveTab(tab.id as TabType);
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-3 border ${
                  isActive
                    ? "bg-[#1c1c16] text-white dark:bg-white dark:text-[#1c1c16] border-transparent shadow-sm"
                    : "bg-transparent text-[#564241] dark:text-[#8a7170] border-transparent hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5"
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Chats History Section */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden border-t border-[#ddc0be]/20 dark:border-white/5 pt-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8a7170] px-2">
            Chats
          </span>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin">
            {isSessionsLoading ? (
              <div className="flex items-center justify-center py-6 text-[10px] text-[#8a7170]/60 font-bold animate-pulse">
                Loading chats...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-[#8a7170]/60 font-bold italic">
                No recent chats
              </div>
            ) : (
              sessions.map((session) => {
                const isActive = activeTab === "chat" && activeSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`group w-full p-2.5 rounded-xl text-left cursor-pointer flex items-center justify-between transition-all border ${
                      isActive
                        ? "bg-[#FFF2D0]/40 dark:bg-white/5 border-[#E36A6A]/30 text-[#a0383b] dark:text-[#ffb3b1]"
                        : "border-transparent text-[#564241] dark:text-[#dddad0] hover:bg-white/50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      <span className="text-xs font-semibold truncate leading-none">
                        {session.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="p-1 rounded-md text-[#8a7170] hover:bg-[#E36A6A]/10 hover:text-[#E36A6A] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Actions Footer */}
      <div className="flex flex-col gap-3.5 border-t border-[#ddc0be]/20 dark:border-white/5 pt-4">
        {/* Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/50 dark:bg-white/5 border border-[#ddc0be]/25 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Dynamic Initial Avatar */}
            <div className="w-8.5 h-8.5 rounded-full bg-[#14b8a6] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-text-rich dark:text-white truncate">
                {profile.name}
              </span>
              <span className="text-[10px] font-semibold text-[#8a7170] leading-none mt-0.5">
                Free
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className="p-1.5 rounded-lg text-[#8a7170] hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Configure settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Upgrade to Plus Button (Golden Gradient effect) */}
        <button className="w-full h-10 rounded-xl bg-gradient-to-r from-[#eab308] via-[#eab308] to-[#ca8a04] hover:from-[#ca8a04] hover:to-[#a16207] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/10 cursor-pointer transition-all hover:scale-[1.01]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-100" />
          Upgrade to Plus
        </button>

        {/* System Settings & Theme row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex-1 h-9 rounded-xl border border-[#ddc0be]/30 dark:border-white/10 flex items-center justify-center text-xs font-bold text-[#564241] dark:text-[#dddad0] hover:bg-white/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 mr-1.5" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 mr-1.5" />
                Dark
              </>
            )}
          </button>

          <Link
            href="/"
            className="flex-1 h-9 border border-[#ddc0be]/30 dark:border-white/10 rounded-xl flex items-center justify-center text-xs font-bold text-[#564241] dark:text-[#dddad0] hover:bg-white/50 dark:hover:bg-white/5 transition-all gap-1 cursor-pointer"
            title="Exit to landing page"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit
          </Link>
        </div>
      </div>
      </div>
    </aside>
  );
}
