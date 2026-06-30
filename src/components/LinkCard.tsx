"use client";

import { useState, useEffect } from "react";
import type { LinkData } from "@/app/page";
import YouTubeCard from "./cards/YouTubeCard";
import TwitterCard from "./cards/TwitterCard";
import GitHubCard from "./cards/GitHubCard";
import InstagramCard from "./cards/InstagramCard";
import GenericCard from "./cards/GenericCard";

const PLATFORM_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  youtube: {
    label: "YouTube",
    color: "text-platform-youtube",
    bg: "bg-platform-youtube-bg border-platform-youtube-border shadow-[inset_0_1px_2px_rgba(160,56,59,0.1)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  twitter: {
    label: "X (Twitter)",
    color: "text-platform-twitter",
    bg: "bg-platform-twitter-bg border-platform-twitter-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    color: "text-platform-github",
    bg: "bg-platform-github-bg border-platform-github-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  reddit: {
    label: "Reddit",
    color: "text-platform-reddit",
    bg: "bg-platform-reddit-bg border-platform-reddit-border shadow-[inset_0_1px_2px_rgba(234,88,12,0.1)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    color: "text-platform-instagram",
    bg: "bg-platform-instagram-bg border-platform-instagram-border shadow-[inset_0_1px_2px_rgba(137,77,78,0.1)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    color: "text-platform-linkedin",
    bg: "bg-platform-linkedin-bg border-platform-linkedin-border shadow-[inset_0_1px_2px_rgba(30,64,175,0.1)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  tiktok: {
    label: "TikTok",
    color: "text-platform-tiktok",
    bg: "bg-platform-tiktok-bg border-platform-tiktok-border shadow-[inset_0_1px_2px_rgba(21,94,117,0.1)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.5-2.97 5.82-1.83 1.33-4.26 1.75-6.46 1.32-2.71-.53-4.94-2.6-5.83-5.21-.82-2.58-.3-5.6 1.58-7.53 1.08-1.12 2.5-1.85 4.04-2.12v4.06c-1.34.02-2.73.57-3.47 1.71-.97 1.44-.8 3.51.46 4.74 1.25 1.2 3.32 1.26 4.65.17 1.23-.97 1.72-2.59 1.7-4.11-.01-5.2-.01-10.4-.02-15.59z" />
      </svg>
    ),
  },
  hashnode: {
    label: "Hashnode",
    color: "text-platform-hashnode",
    bg: "bg-platform-hashnode-bg border-platform-hashnode-border shadow-[inset_0_1px_2px_rgba(29,78,216,0.1)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M22.35 11.41l-9.76-9.76a.85.85 0 0 0-1.18 0l-9.76 9.76a.85.85 0 0 0 0 1.18l9.76 9.76c.33.32.86.32 1.18 0l9.76-9.76a.85.85 0 0 0 0-1.18zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
      </svg>
    ),
  },
  medium: {
    label: "Medium",
    color: "text-platform-medium",
    bg: "bg-platform-medium-bg border-platform-medium-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  article: {
    label: "Article",
    color: "text-platform-article",
    bg: "bg-platform-article-bg border-platform-article-border shadow-[inset_0_1px_2px_rgba(6,95,70,0.1)]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5 fill-none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  generic: {
    label: "Web",
    color: "text-platform-generic",
    bg: "bg-platform-generic-bg border-platform-generic-border shadow-[inset_0_1px_2px_rgba(164,58,61,0.05)]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5 fill-none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
};

interface Props {
  link: LinkData;
  onDeleted: (id: string) => void;
  disabled?: boolean;
}

export default function LinkCard({ link, onDeleted, disabled }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const config = PLATFORM_CONFIG[link.platform] ?? PLATFORM_CONFIG.generic;

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await fetch(`/api/links/${link.id}`, { method: "DELETE" });
      setTimeout(() => {
        onDeleted(link.id);
      }, 300);
    } catch {
      setDeleting(false);
    }
  }

  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const diff = Date.now() - new Date(link.createdAt).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    };
    const timer = setTimeout(() => {
      setTimeAgo(calculateTimeAgo());
    }, 0);
    return () => clearTimeout(timer);
  }, [link.createdAt]);

  return (
    <article
      onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-[#1c1c16]/50 backdrop-blur-[20px] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer hover:-translate-y-1 hover:border-pulse-coral/60 hover:bg-white/95 dark:hover:bg-[#1c1c16]/85 hover:shadow-[0_12px_32px_rgba(227,106,106,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]
${disabled && !deleting ? "opacity-60 pointer-events-none" : ""}
${deleting ? "opacity-0 scale-75 pointer-events-none duration-300" : ""}
`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Light sweep effect on hover */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-pulse-coral/5 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Card body — platform-specific */}
        {link.platform === "youtube" && <YouTubeCard link={link} />}
        {link.platform === "twitter" && <TwitterCard link={link} />}
        {link.platform === "github" && <GitHubCard link={link} />}
        {link.platform === "instagram" && <InstagramCard link={link} />}
        {(link.platform === "article" ||
          link.platform === "reddit" ||
          link.platform === "linkedin" ||
          link.platform === "tiktok" ||
          link.platform === "hashnode" ||
          link.platform === "medium" ||
          link.platform === "generic") && <GenericCard link={link} />}

        {/* AI Context Summary */}
        {link.aiContext && (
          <div className="px-5 pb-4 mt-auto">
            <div className="relative overflow-hidden flex flex-col gap-2 p-3.5 rounded-xl bg-gradient-to-br from-pulse-coral/5 to-pulse-gold/10 border border-pulse-coral/10 group-hover:border-pulse-coral/20 transition-colors shadow-inner">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pulse-coral to-pulse-blush rounded-l-xl opacity-80" />
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 fill-none stroke-primary"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                  AI Summary
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 font-medium">
                {link.aiContext}
              </p>
            </div>
          </div>
        )}

        {/* Footer bar */}
        <div
          className={`px-5 py-4 flex items-center justify-between gap-3 border-t border-outline-variant/30 dark:border-white/5 bg-white/[0.1] dark:bg-white/5 ${!link.aiContext && "mt-auto"}`}
        >
          {/* Platform badge */}
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border border-transparent backdrop-blur-md ${config.color} ${config.bg}`}
          >
            {config.icon}
            {config.label}
          </span>
          
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-outline/60 mr-2">
              {timeAgo}
            </span>
            
            {/* Open link */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg text-outline/60 hover:text-primary hover:bg-white/80 border border-transparent hover:border-outline-variant/30 transition-all focus:outline-none"
              title="Open link"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            
            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none ${
                hovered
                  ? "text-error hover:text-error hover:bg-red-50"
                  : "text-outline/20"
              }`}
              title="Delete"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" />
                <path d="M10 11v6M14 11v6M9 6V4h6v2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
