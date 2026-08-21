"use client";

import { useState, useTransition } from "react";
import type { LinkData } from "@/app/page";
import LinkCard from "@/components/LinkCard";

interface HomeTabProps {
  links: LinkData[];
  onLinkAdded: (link: LinkData) => void;
  onDeleted: (id: string) => void;
  isPending: boolean;
  profile: { name: string; email: string; cachePath: string; avatarUrl?: string };
  onSearchTriggered: (query: string) => void;
}

export default function HomeTab({
  links,
  onLinkAdded,
  onDeleted,
  isPending,
  profile,
  onSearchTriggered,
}: HomeTabProps) {
  const [urlInput, setUrlInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [, startTransition] = useTransition();

  // Handle URL link saving
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setSaveStatus("loading");
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput,
          aiContext: "Automatically compiled second brain memory segment.",
        }),
      });

      if (res.ok) {
        const newLink = await res.json();
        onLinkAdded(newLink);
        setUrlInput("");
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  }

  // Trigger search to AI chatbot
  function triggerSearchSuggestion(query: string) {
    setSearchQuery(query);
    onSearchTriggered(query);
  }

  function handleSearchQuery(query: string) {
    if (!query.trim()) return;
    onSearchTriggered(query);
  }

  const firstName = profile.name ? profile.name.split(" ")[0] : "User";

  return (
    <div className="flex flex-col gap-10 w-full max-w-none py-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight text-text-rich dark:text-white">
          Good morning, {firstName}
        </h1>
        <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-white/70 font-medium">
          Ready to accumulate more tabs you&apos;ll read &ldquo;later&rdquo;?
        </p>
      </div>

      {/* Form Link Submission */}
      <div className="p-6 rounded-3xl max-w-2xl mx-auto w-full neu-card">
        <form
          onSubmit={handleAddLink}
          className="relative flex items-center gap-3"
        >
          <div className="flex-1 flex items-center neu-sunken rounded-full px-4 py-1">
            <input
              type="url"
              placeholder="Paste link to store in second brain..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              required
              className="w-full h-11 bg-transparent text-text-rich dark:text-white placeholder:text-on-surface-variant/60 dark:placeholder:text-white/40 text-sm font-medium outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saveStatus === "loading"}
            className="w-11 h-11 rounded-full neu-button-primary text-white flex items-center justify-center transition-all cursor-pointer font-bold shrink-0"
          >
            {saveStatus === "loading" ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "→"
            )}
          </button>
        </form>

        {saveStatus === "error" && (
          <p className="text-left text-xs font-bold text-error mt-2 pl-3">
            Could not parse link metadata. Please verify URL syntax.
          </p>
        )}
        {saveStatus === "success" && (
          <p className="text-left text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 pl-3">
            Link successfully compiled and indexed!
          </p>
        )}

        {/* Try search prompts */}
        <div className="flex flex-wrap items-center justify-start gap-2.5 mt-4 text-[10.5px] font-bold text-on-surface-variant dark:text-white/60">
          <span>Try prompts:</span>
          <button
            type="button"
            onClick={() => triggerSearchSuggestion("Andrew Huberman")}
            className="px-3 py-1 rounded-full neu-raised-sm hover:neu-sunken transition-all cursor-pointer"
          >
            Search &ldquo;Neuroscience&rdquo;
          </button>
          <button
            type="button"
            onClick={() => triggerSearchSuggestion("Marc Andreessen")}
            className="px-3 py-1 rounded-full neu-raised-sm hover:neu-sunken transition-all cursor-pointer"
          >
            Search &ldquo;Startup Strategy&rdquo;
          </button>
        </div>
      </div>

      {/* Simulated AI Search Output */}
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center neu-sunken rounded-full px-4 py-1">
            <input
              type="text"
              placeholder="Ask your second brain anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearchQuery(searchQuery)
              }
              className="w-full h-11 bg-transparent text-text-rich dark:text-white placeholder:text-on-surface-variant/60 dark:placeholder:text-white/40 text-xs font-bold outline-none"
            />
          </div>
          <button
            onClick={() => handleSearchQuery(searchQuery)}
            className="h-11 px-6 rounded-full neu-button-primary text-white text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Ask AI
          </button>
        </div>

        {isSearching && (
          <div className="flex items-center justify-center py-6 gap-2 text-xs font-bold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Scanning semantic neural indexes...
          </div>
        )}

        {searchResult && (
          <div className="p-6 rounded-3xl neu-sunken text-left text-xs">
            <p className="font-bold text-[10.5px] uppercase tracking-wider text-primary mb-3 border-b border-outline-variant/20 dark:border-white/10 pb-1.5">
              Neural Compiler Synthesis
            </p>
            <pre className="font-sans whitespace-pre-wrap leading-relaxed text-text-rich dark:text-white font-medium">
              {searchResult}
            </pre>
          </div>
        )}
      </div>

      {/* Recently Saved Link Grid */}
      <div className="w-full flex flex-col gap-6 text-left border-t border-outline-variant/20 dark:border-white/10 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-rich dark:text-white">
            Recently Saved Links
          </h2>
          <span className="text-xs font-bold text-on-surface-variant dark:text-white/60 neu-raised-sm px-3.5 py-1 rounded-full">
            {links.length} total saves
          </span>
        </div>

        {links.length === 0 ? (
          <p className="text-xs text-on-surface-variant/80 dark:text-white/50 italic">
            No links saved yet. Paste a URL above to index your first node.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {links.map((link, index) => (
              <div
                key={link.id}
                className={index % 5 === 0 ? "col-span-1 md:col-span-2 w-full" : "col-span-1 w-full"}
              >
                <LinkCard
                  link={link}
                  onDeleted={onDeleted}
                  disabled={isPending}
                  isFeatured={index % 5 === 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
