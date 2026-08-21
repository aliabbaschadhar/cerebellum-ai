"use client";

import React from "react";

interface AutoCategorizationProps {
  showAutoCategorization: boolean;
  activeFolder: "Design" | "Research" | "Growth" | "Mindset";
  setActiveFolder: (
    folder: "Design" | "Research" | "Growth" | "Mindset",
  ) => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function AutoCategorization({
  showAutoCategorization,
  activeFolder,
  setActiveFolder,
  sectionRef,
}: AutoCategorizationProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-24 text-center relative border-t border-outline-variant/20 dark:border-white/5"
    >
      <div
        className={`flex flex-col items-center mb-16 transition-all duration-1000 transform ${showAutoCategorization ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase neu-raised-sm px-3.5 py-1 rounded-full">
            Auto Categorization
          </span>
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
        </div>
        <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich dark:text-white tracking-tight max-w-2xl mb-4">
          Organize bookmarks in folders
        </h2>
        <p className="font-sans text-base md:text-lg text-on-surface-variant dark:text-white/70 leading-[1.6] font-medium max-w-2xl">
          Cerebellum automatically groups and tags your saves into smart
          directories.
        </p>
      </div>

      {/* Dashboard Preview Layout */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch transition-all duration-1000 delay-[250ms] transform ${showAutoCategorization ? "opacity-100 scale-100" : "opacity-0 scale-98"}`}
      >
        {/* Left: Folders Sidebar */}
        <div className="lg:col-span-4 neu-card rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300">
          <h3 className="text-[14px] font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-wider text-left pl-2">
            Directories
          </h3>

          <div className="flex flex-col gap-2.5">
            {(["Design", "Research", "Growth", "Mindset"] as const).map(
              (folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full px-4 py-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                    activeFolder === folder
                      ? "neu-sunken text-primary dark:text-[#ffb4b4] border border-primary/30"
                      : "neu-raised-sm text-on-surface-variant dark:text-white/80 hover:neu-sunken"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                           folder === "Design"
                            ? "var(--color-pulse-coral)"
                            : folder === "Research"
                              ? "var(--color-primary)"
                              : folder === "Growth"
                                ? "var(--color-tertiary)"
                                : "var(--color-secondary)",
                      }}
                    />
                    {folder}
                  </span>
                  <span className="text-[10px] opacity-60">
                    {folder === "Design"
                      ? "12 items"
                      : folder === "Research"
                        ? "8 items"
                        : folder === "Growth"
                          ? "16 items"
                          : "6 items"}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>

        {/* Right: Files Preview */}
        <div className="lg:col-span-8 neu-card rounded-3xl p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between border-b border-outline-variant/20 dark:border-white/10 pb-3">
            <span className="text-[11px] font-bold text-on-surface-variant dark:text-white/70 uppercase tracking-wider">
              PROJECT FILES / {activeFolder}
            </span>
            <span className="text-[10px] font-bold text-primary dark:text-[#ffb4b4] uppercase neu-raised-sm px-2.5 py-1 rounded-full">
              AI INDEXED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {activeFolder === "Design" && (
              <>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-pink-700 dark:text-pink-300 neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      Instagram
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      Minimalist setup ideas & aesthetics
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      Desk visual set pieces, warm cream setups, organic
                      lighting, and wood elements.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 1 hour ago
                  </span>
                </div>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      Article
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      Figma visual typography systems
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      Deep dive into Libre Caslon pairings and modern screen
                      scaling techniques.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 2 days ago
                  </span>
                </div>
              </>
            )}

            {activeFolder === "Research" && (
              <>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      ArXiv Paper
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      AI neural networks & semantic parsing
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      An investigation into multi-layered semantic embeddings
                      for semantic search engines.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 3 hours ago
                  </span>
                </div>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-primary dark:text-[#ffb4b4] neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      YouTube
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      Dopamine control pathways study
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      Huberman Labs lecture detailing focus cycles, dopamine
                      baselines, and light therapy.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 1 week ago
                  </span>
                </div>
              </>
            )}

            {activeFolder === "Growth" && (
              <>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-text-rich dark:text-white neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      X / Twitter
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      Marc Andreessen: execution ideas
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      Auto-indexed thread discussing tech cycles, startup
                      building, and software leverage.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 1 day ago
                  </span>
                </div>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      Web Page
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      10x Marketing strategies for B2B SaaS
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      Editorial detailing SEO best practices, organic growth
                      hubs, and search visibility loops.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 3 days ago
                  </span>
                </div>
              </>
            )}

            {activeFolder === "Mindset" && (
              <>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-pink-700 dark:text-pink-300 neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      Instagram
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      Morning routine framework for focus
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      Transcription of Reel discussing screen-free mornings,
                      cold water, and light indexing.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 3 days ago
                  </span>
                </div>
                <div className="neu-raised-sm p-5 rounded-2xl hover:neu-sunken transition-all duration-300 text-left flex flex-col justify-between cursor-pointer">
                  <div>
                    <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 neu-sunken-sm px-2 py-0.5 rounded uppercase tracking-wide mb-2.5 inline-block">
                      Medium Article
                    </span>
                    <h4 className="text-xs font-bold text-text-rich dark:text-white mb-2">
                      Sleep optimization biology guidelines
                    </h4>
                    <p className="text-[11px] text-on-surface-variant dark:text-white/70 line-clamp-3">
                      A summary of biological variables affecting REM sleep and
                      daily cognitive focus.
                    </p>
                  </div>
                  <span className="text-[9px] text-on-surface-variant dark:text-white/50 font-semibold mt-4">
                    Synced 2 weeks ago
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
