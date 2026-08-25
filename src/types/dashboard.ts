import type React from "react";
import type { LinkData } from "./link";
import type { ChatSession } from "./chat";

export type TabType =
  | "home"
  | "chat"
  | "vault"
  | "collections"
  | "graph"
  | "reader"
  | "sync"
  | "settings";

export interface UserProfile {
  name: string;
  email: string;
  cachePath: string;
  avatarUrl?: string;
}

export interface SidebarProps {
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
  profile: UserProfile;
}

export interface CollectionsTabProps {
  links: LinkData[];
  onDeleted: (id: string) => void;
  isPending: boolean;
}

export interface HomeTabProps {
  links: LinkData[];
  onLinkAdded: (newLink: LinkData) => void;
  onDeleted: (id: string) => void;
  isPending: boolean;
  profile: UserProfile;
  onSearchTriggered: (query: string) => void;
}

export interface VaultTabProps {
  links: LinkData[];
  onDeleted: (id: string) => void;
  isPending: boolean;
}

export interface GraphTabProps {
  links: LinkData[];
  isDarkMode: boolean;
}

export interface ReaderTabProps {
  links: LinkData[];
}

export interface SyncTabProps {
  links: LinkData[];
}

export interface SettingsTabProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export interface ChatTabProps {
  links: LinkData[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  fetchSessions: () => Promise<void>;
  pendingChatQuery: string | null;
  clearPendingChatQuery: () => void;
}
