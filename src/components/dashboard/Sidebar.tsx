"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  Sun,
  Moon,
  Settings,
  Trash2,
  PanelLeftClose,
  Plus,
  MessageSquare,
} from "lucide-react";
import type { SidebarProps, TabType } from "@/types";
import { SIDEBAR_NAV_ITEMS } from "@/lib/dashboardData";
export type { TabType, SidebarProps };

export default function Sidebar({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  activeSessionId,
  setActiveSessionId,
  sessions,
  setSessions,
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
      className={`transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 relative z-30 h-screen flex flex-col neu-card rounded-none border-y-0 border-l-0 overflow-hidden ${
        isCollapsed
          ? "w-0 opacity-0 border-r-0 pointer-events-none"
          : "w-66 opacity-100"
      }`}
    >
      <div className="w-66 h-full flex flex-col justify-between p-4 shrink-0">
        <div className="flex flex-col gap-4 overflow-hidden flex-1">
        {/* Top Branding & Control Actions */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 dark:border-white/10 pb-3">
          <Link href="/" className="flex items-center gap-2 pr-2 group">
            <div className="rounded-full p-0.5 neu-raised-sm group-hover:scale-105 transition-transform">
              <Image
                src="/newlogo.png"
                alt="Cerebellum AI Logo"
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover bg-white"
              />
            </div>
            <span className="font-bold text-sm text-text-rich dark:text-white tracking-tight">
              Cerebellum
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCollapsed(true)}
              className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full h-11 rounded-2xl neu-button-primary text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[40%] scrollbar-none">
          {SIDEBAR_NAV_ITEMS.map((tab) => {
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
                className={`w-full px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? "neu-sunken text-primary dark:text-[#ffb4b4] border border-primary/30"
                    : "text-on-surface-variant dark:text-white/80 hover:neu-raised-sm"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <IconComponent className="w-4 h-4 shrink-0" />
                  {tab.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Chats History Section */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden border-t border-outline-variant/20 dark:border-white/10 pt-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant dark:text-white/50 px-2">
            Chats
          </span>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-none">
            {isSessionsLoading ? (
              <div className="flex items-center justify-center py-6 text-[10px] text-on-surface-variant/60 font-bold animate-pulse">
                Loading chats...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-on-surface-variant/60 font-bold italic">
                No recent chats
              </div>
            ) : (
              sessions.map((session) => {
                const isActive = activeTab === "chat" && activeSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`group w-full p-2.5 rounded-2xl text-left cursor-pointer flex items-center justify-between transition-all ${
                      isActive
                        ? "neu-sunken text-primary dark:text-[#ffb4b4] border border-primary/30"
                        : "text-on-surface-variant dark:text-white/80 hover:neu-raised-sm"
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
                      className="p-1 rounded-md text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
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
      <div className="flex flex-col gap-3.5 border-t border-outline-variant/20 dark:border-white/10 pt-4">
        {/* Profile Card */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl neu-sunken">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Dynamic Profile Avatar */}
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={34}
                height={34}
                unoptimized
                className="w-8.5 h-8.5 rounded-full object-cover shrink-0 neu-raised-sm border border-white/20"
              />
            ) : (
              <div className="w-8.5 h-8.5 rounded-full neu-raised-sm bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                {initials}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-text-rich dark:text-white truncate">
                {profile.name}
              </span>
              <span className="text-[10px] font-semibold text-on-surface-variant dark:text-white/60 leading-none mt-0.5">
                Free Plan
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className="w-8 h-8 rounded-full neu-button flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="Configure settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* System Settings & Theme row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex-1 h-9 rounded-2xl neu-button flex items-center justify-center text-xs font-bold text-text-rich dark:text-white transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                Dark
              </>
            )}
          </button>

          <Link
            href="/"
            className="flex-1 h-9 rounded-2xl neu-button flex items-center justify-center text-xs font-bold text-text-rich dark:text-white gap-1 cursor-pointer"
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
