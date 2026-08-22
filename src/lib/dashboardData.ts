import {
  Home,
  Database,
  Folder,
  Network,
  BookOpen,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { UserProfile, TabType } from "@/types/dashboard";

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Ali Abbas Chadhar",
  email: "ali@cerebellum.ai",
  cachePath: "/home/aliabbaschadhar/.config/cerebellum/cache/",
  avatarUrl: "",
};

export const SIDEBAR_NAV_ITEMS: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "chat", label: "Cerebellum AI", icon: Sparkles },
  { id: "vault", label: "Memory Vault", icon: Database },
  { id: "collections", label: "Collections", icon: Folder },
  { id: "graph", label: "Graph Navigator", icon: Network },
  { id: "reader", label: "Reader Mode", icon: BookOpen },
  { id: "sync", label: "Sync & Export", icon: RefreshCw },
];

export const COLLECTION_SOURCE_TABS = [
  { id: null, label: "All Sources" },
  { id: "youtube", label: "YouTube" },
  { id: "twitter", label: "Twitter / X" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "web", label: "Web / Article" },
] as const;

export const PRESET_CHAT_PROMPTS = [
  "Summarize my saved YouTube videos about AI agents",
  "Show me startup execution tips from Twitter threads",
  "Which articles mention deep work or focus strategies?",
  "Find GitHub repositories starred for fullstack web dev",
] as const;
