"use client";

import { useState, useEffect, useTransition } from "react";
import type { LinkData, ChatSession, UserProfile, TabType } from "@/types";
import { PanelLeftOpen } from "lucide-react";

// Extracted Sub-sections & Panels
import Sidebar from "@/components/dashboard/Sidebar";
import HomeTab from "@/components/dashboard/HomeTab";
import VaultTab from "@/components/dashboard/VaultTab";
import CollectionsTab from "@/components/dashboard/CollectionsTab";
import GraphTab from "@/components/dashboard/GraphTab";
import ReaderTab from "@/components/dashboard/ReaderTab";
import SyncTab from "@/components/dashboard/SyncTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import ChatTab from "@/components/dashboard/ChatTab";

export type { ChatSession, UserProfile };

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Hoisted active panel tab state
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Persistent Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // Hoisted Chat Sessions and Collapse States
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Hoisted User Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window === "undefined") {
      return {
        name: "Ali Abbas Chadhar",
        email: "ali@cerebellum.ai",
        cachePath: "/home/aliabbaschadhar/.config/cerebellum/cache/",
        avatarUrl: "",
      };
    }
    return {
      name: localStorage.getItem("profile_name") || "Ali Abbas Chadhar",
      email: localStorage.getItem("profile_email") || "ali@cerebellum.ai",
      cachePath:
        localStorage.getItem("profile_cache") ||
        "/home/aliabbaschadhar/.config/cerebellum/cache/",
      avatarUrl: localStorage.getItem("profile_avatar") || "",
    };
  });

  // Pending Search Query to run in Chat Tab
  const [pendingChatQuery, setPendingChatQuery] = useState<string | null>(null);

  // Update theme classes on document changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Fetch saved links database
  async function fetchLinks() {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error("Failed to fetch links:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch chat sessions database
  async function fetchSessions() {
    try {
      setIsSessionsLoading(true);
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to fetch chat sessions:", err);
    } finally {
      setIsSessionsLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
      fetchSessions();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Mutator functions for links list
  function handleLinkAdded(newLink: LinkData) {
    startTransition(() => {
      setLinks((prev) => [newLink, ...prev]);
    });
  }

  function handleLinkDeleted(id: string) {
    startTransition(() => {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    });
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-background font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300 relative">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        sessions={sessions}
        setSessions={setSessions}
        fetchSessions={fetchSessions}
        isSessionsLoading={isSessionsLoading}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        profile={profile}
      />

      {/* Floating Toggle Button when Sidebar is Collapsed */}
      {isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed top-5 left-5 z-40 p-2.5 rounded-2xl neu-button text-primary shadow-md hover:scale-105 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="w-4.5 h-4.5" />
        </button>
      )}

      {/* 2. Main Tab Viewport */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto relative z-10 transition-all duration-300 scrollbar-none">

        {/* Global Loading Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-[#8a7170]/60">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#E36A6A] animate-spin" />
            <p className="text-xs font-bold animate-pulse">
              Synchronizing brain index database...
            </p>
          </div>
        )}

        {!loading && (
          <div key={activeTab} className="tab-fade-in">
            {activeTab === "home" && (
              <HomeTab
                links={links}
                onLinkAdded={handleLinkAdded}
                onDeleted={handleLinkDeleted}
                isPending={isPending}
                profile={profile}
                onSearchTriggered={(query) => {
                  setPendingChatQuery(query);
                  setActiveTab("chat");
                }}
              />
            )}

            {activeTab === "chat" && (
              <ChatTab
                links={links}
                activeSessionId={activeSessionId}
                setActiveSessionId={setActiveSessionId}
                fetchSessions={fetchSessions}
                pendingChatQuery={pendingChatQuery}
                clearPendingChatQuery={() => setPendingChatQuery(null)}
              />
            )}

            {activeTab === "vault" && (
              <VaultTab
                links={links}
                onDeleted={handleLinkDeleted}
                isPending={isPending}
              />
            )}

            {activeTab === "collections" && (
              <CollectionsTab
                links={links}
                onDeleted={handleLinkDeleted}
                isPending={isPending}
              />
            )}

            {activeTab === "graph" && (
              <GraphTab
                links={links}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "reader" && (
              <ReaderTab
                links={links}
              />
            )}

            {activeTab === "sync" && (
              <SyncTab
                links={links}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                profile={profile}
                setProfile={setProfile}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
