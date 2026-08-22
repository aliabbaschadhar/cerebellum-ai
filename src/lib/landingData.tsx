import React from "react";
import type { PlatformItem } from "@/types/landing";

export const SOLAR_SYSTEM_PLATFORMS: PlatformItem[] = [
  {
    name: "Twitter / X",
    tagline: "Sync startup threads & execution tips",
    radius: 135,
    duration: 16,
    color: "neu-raised text-text-rich dark:text-white border-outline-variant/20 hover:neu-sunken",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    tagline: "Collect repository stars & documentation",
    radius: 180,
    duration: 22,
    color: "neu-raised text-text-rich dark:text-white border-outline-variant/20 hover:neu-sunken",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    name: "Discord",
    tagline: "Capture messages & community logs",
    radius: 225,
    duration: 28,
    color: "neu-raised text-[#5865F2] border-outline-variant/20 hover:neu-sunken",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.076.076 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    tagline: "Transcribe audio & summarize videos",
    radius: 270,
    duration: 34,
    color: "neu-raised text-[#FF0000] border-outline-variant/20 hover:neu-sunken",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    tagline: "Import saved reels & routine blueprints",
    radius: 315,
    duration: 40,
    color: "neu-raised text-[#ee2a7b] border-outline-variant/20 hover:neu-sunken",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.000 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    tagline: "Save professional insights & essays",
    radius: 360,
    duration: 46,
    color: "neu-raised text-[#0A66C2] border-outline-variant/20 hover:neu-sunken",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export const FAQ_ITEMS = [
  {
    q: "How does Cerebellum AI collect links from different platforms?",
    a: "Our browser extension and mobile share sheets automatically extract metadata, transcripts, and context directly from YouTube, X, GitHub, Reddit, and standard web pages, indexing them into your personal memory database.",
  },
  {
    q: "Is my saved content kept private?",
    a: "Yes. All saved links, embeddings, and chat histories are stored securely and associated strictly with your account credentials. We never sell or share your personal memory data.",
  },
  {
    q: "Can I search through video transcripts?",
    a: "Absolutely. Cerebellum automatically fetches and indexes full transcripts for YouTube videos and podcasts, allowing you to ask natural language questions about specific moments or spoken quotes.",
  },
  {
    q: "How does natural language search work?",
    a: "Instead of relying on exact keyword matching or rigid folder hierarchies, Cerebellum uses vector semantic search to match the intent and context of your questions to your saved items.",
  },
  {
    q: "What devices and browsers are supported?",
    a: "Cerebellum AI is accessible on any modern desktop browser (Chrome, Safari, Firefox, Edge) and mobile web browsers with full responsive optimization.",
  },
];

export const FRICTION_PAIN_POINTS = [
  {
    title: "100+ open browser tabs",
    desc: "Bookmarks accumulate into forgotten digital graveyards with zero context or searchability.",
  },
  {
    title: "Fragmented across 5 different apps",
    desc: "YouTube watch laters, Twitter bookmarks, and Reddit saves scattered with no unified search.",
  },
  {
    title: "Impossible to search by concept",
    desc: "Keyword search fails when you only remember the idea or author, but not the exact title.",
  },
];

export const FRICTION_SOLUTIONS = [
  {
    title: "Auto-indexed global memory matrix",
    desc: "Every saved link is processed with AI transcription, metadata tagging, and vector embedding.",
  },
  {
    title: "One central hub for all platforms",
    desc: "YouTube, X, GitHub, Reddit, Instagram, and web articles unified in a single searchable vault.",
  },
  {
    title: "Natural language semantic recall",
    desc: "Ask 'What was that thread about focus stamina?' and instantly locate the exact book recommendation.",
  },
];
