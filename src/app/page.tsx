"use client";

import { useState, useEffect, useTransition } from "react";
import AddLinkForm from "@/components/AddLinkForm";
import LinkCard from "@/components/LinkCard";

export interface LinkData {
  id: string;
  url: string;
  platform: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  siteName: string | null;
  extras: Record<string, string | null> | null;
  aiContext: string | null;
  createdAt: string;
}

export default function Home() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchLinks(showGlobalLoader = true) {
    if (showGlobalLoader) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  function handleAdded(link: LinkData) {
    startTransition(() => {
      setLinks((prev) => [link, ...prev]);
    });
  }

  function handleDeleted(id: string) {
    startTransition(() => {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    });
  }

  const platforms = Array.from(new Set(links.map((l) => l.platform)));
  const filteredLinks = selectedPlatform
    ? links.filter((l) => l.platform === selectedPlatform)
    : links;

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white relative selection:bg-indigo-500/30">
      {/* Decorative background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0c0c0f]/0 to-transparent -z-10" />

      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#0c0c0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold">
              C
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Cerebrum
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30 font-mono">
              {links.length} saved
            </span>
            <button
              onClick={() => fetchLinks(false)}
              disabled={isRefreshing || loading}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/50 hover:text-white disabled:opacity-50"
              title="Refresh links"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 3v5h5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero + URL Input */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            Save anything from the web
          </h1>
          <p className="text-white/40 text-lg mb-10">
            Paste a link — YouTube, X, GitHub, Reddit, or any article
          </p>
          <AddLinkForm onAdded={handleAdded} />
        </div>

        {/* Filters */}
        {!loading && links.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedPlatform(null)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                selectedPlatform === null
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-transparent text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
              }`}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all ${
                  selectedPlatform === platform
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-transparent text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
                }`}
              >
                {platform === "generic" ? "Web" : platform}
              </button>
            ))}
          </div>
        )}

        {/* Link Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white/[0.04] animate-pulse"
              />
            ))}
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-white/20">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                strokeLinecap="round"
              />
              <path
                d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-lg font-medium">No links found</p>
            {links.length > 0 && (
              <p className="text-sm">Try selecting a different filter</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDeleted={handleDeleted}
                disabled={isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
