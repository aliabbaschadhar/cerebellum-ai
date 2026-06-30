"use client";

import { useState, useTransition } from "react";
import type { LinkData } from "@/app/page";
import LinkCard from "@/components/LinkCard";

interface HomeTabProps {
  links: LinkData[];
  onLinkAdded: (link: LinkData) => void;
  onDeleted: (id: string) => void;
  isPending: boolean;
  profile: { name: string; email: string; cachePath: string };
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
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight text-text-rich dark:text-white">
          Good morning, {firstName}
        </h1>
        <p className="font-sans text-sm md:text-base text-[#564241] dark:text-[#8a7170] font-medium">
          Ready to accumulate more tabs you&apos;ll read &ldquo;later&rdquo;?
        </p>
      </div>

      {/* Form Link Submission */}
      <div className=" p-6 rounded-3xl max-w-2xl mx-auto w-full border-white/60 dark:border-white/10 shadow-lg dark:bg-[#1c1c16]/50">
        <form
          onSubmit={handleAddLink}
          className="relative flex items-center gap-3"
        >
          <input
            type="url"
            placeholder="Paste link to store in second brain..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            required
            className="w-full h-12.5 rounded-full pl-5 pr-14 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E36A6A] dark:focus:bg-[#121210] text-sm font-medium transition-all"
          />
          <button
            type="submit"
            disabled={saveStatus === "loading"}
            className="absolute right-1.5 w-9.5 h-9.5 rounded-full bg-[#E36A6A] hover:bg-[#a0383b] text-white flex items-center justify-center transition-colors shadow-md shadow-[#E36A6A]/20"
          >
            {saveStatus === "loading" ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "→"
            )}
          </button>
        </form>

        {saveStatus === "error" && (
          <p className="text-left text-xs font-bold text-red-500 mt-2 pl-3">
            Could not parse link metadata. Please verify layout.
          </p>
        )}
        {saveStatus === "success" && (
          <p className="text-left text-xs font-bold text-emerald-600 mt-2 pl-3">
            Link successfully compiled and indexed!
          </p>
        )}

        {/* Try search prompts */}
        <div className="flex flex-wrap items-center justify-start gap-2.5 mt-4 text-[10.5px] font-bold text-[#8a7170]">
          <span>Try prompts:</span>
          <button
            type="button"
            onClick={() => triggerSearchSuggestion("Andrew Huberman")}
            className="px-2.5 py-1 rounded bg-[#f1eee4]/60 dark:bg-white/5 hover:bg-[#FFF2D0]/40 transition-colors border border-transparent hover:border-[#ddc0be]/25"
          >
            Search &ldquo;Neuroscience&rdquo;
          </button>
          <button
            type="button"
            onClick={() => triggerSearchSuggestion("Marc Andreessen")}
            className="px-2.5 py-1 rounded bg-[#f1eee4]/60 dark:bg-white/5 hover:bg-[#FFF2D0]/40 transition-colors border border-transparent hover:border-[#ddc0be]/25"
          >
            Search &ldquo;Startup Strategy&rdquo;
          </button>
        </div>
      </div>

      {/* Simulated AI Search Output */}
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask your second brain anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearchQuery(searchQuery)
            }
            className="w-full h-11 rounded-full pl-5 pr-5 border border-[#ddc0be]/30 dark:border-white/10 bg-white/60 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-[#E36A6A] text-xs font-bold"
          />
          <button
            onClick={() => handleSearchQuery(searchQuery)}
            className="h-11 px-5 rounded-full bg-[#1c1c16] dark:bg-white dark:text-[#1c1c16] text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Ask AI
          </button>
        </div>

        {isSearching && (
          <div className="flex items-center justify-center py-6 gap-2 text-xs font-bold text-[#a0383b]">
            <span className="w-2 h-2 rounded-full bg-[#E36A6A] animate-ping" />
            Scanning semantic neural indexes...
          </div>
        )}

        {searchResult && (
          <div className=" p-6 rounded-2xl border-white/60 dark:border-white/10 text-left text-xs bg-white/80 dark:bg-[#121210]/50 shadow-inner">
            <p className="font-bold text-[10.5px] uppercase tracking-wider text-[#a0383b] mb-3 border-b border-[#ddc0be]/20 dark:border-white/10 pb-1.5">
              Neural Compiler Synthesis
            </p>
            <pre className="font-sans whitespace-pre-wrap leading-relaxed text-[#564241] dark:text-[#dddad0] font-medium">
              {searchResult}
            </pre>
          </div>
        )}
      </div>

      {/* Recently Saved Link Grid */}
      <div className="flex flex-col gap-6 text-left border-t border-[#ddc0be]/20 dark:border-white/10 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-rich dark:text-white">
            Recently Saved Links
          </h2>
          <span className="text-xs font-bold text-[#8a7170]">
            {links.length} total saves
          </span>
        </div>

        {links.length === 0 ? (
          <p className="text-xs text-[#8a7170]/80 italic">
            No links saved yet. Paste a URL above to index your first node.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {links.slice(0, 4).map((link) => (
              <div
                key={link.id}
                className="scale-95 hover:scale-100 transition-all duration-300"
              >
                <LinkCard
                  link={link}
                  onDeleted={onDeleted}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
