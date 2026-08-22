"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { LinkData } from "@/app/page";
import { ExternalLink, Copy, Check, Trash2 } from "lucide-react";

const PLATFORM_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; gradient: string; icon: React.ReactNode }
> = {
  youtube: {
    label: "YouTube",
    bg: "bg-red-500/20 border-red-500/30",
    text: "text-red-600 dark:text-red-400",
    gradient: "from-red-600/20 to-red-900/40",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  twitter: {
    label: "X / Twitter",
    bg: "bg-neutral-500/20 border-neutral-500/30",
    text: "text-text-rich dark:text-white",
    gradient: "from-neutral-700/20 to-neutral-900/40",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    bg: "bg-neutral-500/20 border-neutral-500/30",
    text: "text-text-rich dark:text-white",
    gradient: "from-slate-700/20 to-slate-900/40",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  reddit: {
    label: "Reddit",
    bg: "bg-orange-500/20 border-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-600/20 to-orange-900/40",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    bg: "bg-pink-500/20 border-pink-500/30",
    text: "text-pink-600 dark:text-pink-400",
    gradient: "from-pink-600/20 to-purple-900/40",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  generic: {
    label: "Web Node",
    bg: "bg-rose-500/20 border-rose-500/30",
    text: "text-primary dark:text-[#ffb4b4]",
    gradient: "from-rose-600/20 to-red-900/40",
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
  isFeatured?: boolean;
}

export default function LinkCard({ link, onDeleted, disabled, isFeatured }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  const config = PLATFORM_CONFIG[link.platform] ?? PLATFORM_CONFIG.generic;

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

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
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

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const domain = link.siteName || new URL(link.url).hostname.replace(/^www\./, "");
  const cardTitle = link.title || domain || "Stored Memory Node";
  const cardDescription = link.description || link.aiContext || "Indexed in second brain matrix.";

  // 1. Featured Side-by-Side 2-Column Bento Card
  if (isFeatured) {
    return (
      <article
        onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
        className={`group relative flex flex-col md:flex-row h-[280px] w-full rounded-3xl neu-card overflow-hidden transition-all duration-300 cursor-pointer ${
          disabled && !deleting ? "opacity-60 pointer-events-none" : ""
        } ${deleting ? "opacity-0 scale-75 pointer-events-none duration-300" : ""}`}
      >
        {/* Left Side: Full-Height Media Preview Window */}
        <div className="w-full md:w-[42%] h-36 md:h-full relative overflow-hidden shrink-0 neu-sunken border-b md:border-b-0 md:border-r border-outline-variant/15 dark:border-white/10">
          {link.image ? (
            <Image
              src={link.image}
              alt={cardTitle}
              fill
              unoptimized
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center relative overflow-hidden p-6`}>
              <div className="absolute -right-4 -bottom-4 opacity-20 text-text-rich dark:text-white transform rotate-12 scale-150 pointer-events-none">
                {config.icon}
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center z-10">
                <div className="w-10 h-10 rounded-full neu-raised-sm flex items-center justify-center text-text-rich dark:text-white mb-1">
                  {config.icon}
                </div>
                <span className="text-xs font-bold font-mono tracking-wider text-text-rich dark:text-white uppercase">
                  {domain}
                </span>
              </div>
            </div>
          )}

          {/* Floating Top Badge on Media */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full neu-sunken-sm ${config.text} backdrop-blur-md`}>
              {config.icon}
              <span>{config.label}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Full Content & Controls */}
        <div className="flex-1 flex flex-col justify-between p-4 md:p-5 overflow-hidden">
          {/* Header Metadata */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[9.5px] font-bold font-mono px-2.5 py-0.5 rounded-full neu-sunken-sm text-primary dark:text-[#ffb4b4]">
                FEATURED BENTO NODE
              </span>
              <span className="text-[9.5px] font-bold font-mono text-on-surface-variant/70 dark:text-white/50">
                {domain}
              </span>
            </div>

            <h3 className="text-sm font-bold text-text-rich dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {cardTitle}
            </h3>
            <p className="text-[11px] font-medium text-on-surface-variant dark:text-white/70 line-clamp-2 mt-2 leading-relaxed">
              {cardDescription}
            </p>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-3 border-t border-outline-variant/15 dark:border-white/10 flex items-center justify-between gap-2 mt-2">
            <span className="text-[9.5px] font-bold text-on-surface-variant/60 dark:text-white/40 font-mono">
              {timeAgo}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
                title="Open in new tab"
              >
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={handleDelete}
                className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-error transition-colors cursor-pointer"
                title="Delete card"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. Standard 1-Column Bento Capsule Card
  return (
    <article
      onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
      className={`group relative flex flex-col h-[280px] w-full rounded-3xl neu-card overflow-hidden transition-all duration-300 cursor-pointer ${
        disabled && !deleting ? "opacity-60 pointer-events-none" : ""
      } ${deleting ? "opacity-0 scale-75 pointer-events-none duration-300" : ""}`}
    >
      {/* 1. Top Cyber-Medallion Header Bar */}
      <div className="h-11 px-3.5 flex items-center justify-between shrink-0 border-b border-outline-variant/15 dark:border-white/10 bg-background/60 backdrop-blur-md z-10">
        {/* Platform Medallion Badge */}
        <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full neu-sunken-sm ${config.text}`}>
          {config.icon}
          <span>{config.label}</span>
        </div>

        {/* Domain Code Pill */}
        <span className="text-[9.5px] font-bold font-mono px-2.5 py-0.5 rounded-full neu-sunken-sm text-on-surface-variant/80 dark:text-white/70 truncate max-w-[120px]">
          {domain}
        </span>
      </div>

      {/* 2. Recessed Sunken Media Window (130px) */}
      <div className="h-[130px] w-full relative overflow-hidden shrink-0 neu-sunken border-b border-outline-variant/15 dark:border-white/5">
        {link.image ? (
          <Image
            src={link.image}
            alt={cardTitle}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center relative overflow-hidden p-4`}>
            {/* Watermark platform icon */}
            <div className="absolute -right-3 -bottom-3 opacity-15 text-text-rich dark:text-white transform rotate-12 scale-150 pointer-events-none">
              {config.icon}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="w-8 h-8 rounded-full neu-raised-sm flex items-center justify-center text-text-rich dark:text-white mb-0.5">
                {config.icon}
              </div>
              <span className="text-[10px] font-bold font-mono tracking-wider text-text-rich/90 dark:text-white/90 uppercase">
                {domain}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Middle Content Area (Fixed layout with 2-line title & 1-line description) */}
      <div className="p-3.5 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <h3 className="text-xs font-bold text-text-rich dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {cardTitle}
          </h3>
          <p className="text-[10px] font-medium text-on-surface-variant dark:text-white/60 line-clamp-1 mt-1">
            {cardDescription}
          </p>
        </div>
      </div>

      {/* 4. Pinned Bottom Control Toolbar */}
      <div className="h-10 px-3.5 py-1.5 flex items-center justify-between gap-2 border-t border-outline-variant/15 dark:border-white/5 shrink-0 bg-background/50">
        {/* Time Ago Indicator */}
        <span className="text-[9.5px] font-bold text-on-surface-variant/60 dark:text-white/40 font-mono">
          {timeAgo}
        </span>

        {/* Quick Action Tool Chips */}
        <div className="flex items-center gap-1.5">
          {/* Copy URL */}
          <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
            title="Copy URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>

          {/* Open Link */}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Delete Link */}
          <button
            onClick={handleDelete}
            className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant dark:text-white/70 hover:text-error transition-colors cursor-pointer"
            title="Delete card"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
}
