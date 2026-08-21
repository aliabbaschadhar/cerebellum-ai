"use client";

import React from "react";
import AIPulse from "@/components/AIPulse";

interface HowItWorksProps {
  showHowItWorks: boolean;
  howItWorksProgress: number;
  howItWorksVelocity: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function HowItWorks({
  showHowItWorks,
  howItWorksProgress,
  howItWorksVelocity,
  sectionRef,
}: HowItWorksProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-24 text-center relative border-t border-outline-variant/20 dark:border-white/5"
    >
      <div
        className={`flex flex-col items-center mb-16 transition-all duration-1000 transform ${showHowItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase neu-raised-sm px-3.5 py-1 rounded-full">
            How It Works
          </span>
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
        </div>
        <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich dark:text-white tracking-tight max-w-2xl mb-4">
          One place for your unified global memory.
        </h2>
        <p className="font-sans text-base md:text-lg text-on-surface-variant dark:text-white/70 leading-[1.6] font-medium max-w-2xl">
          Connect your favorite platforms and let Cerebellum compile your
          central memory hub.
        </p>
      </div>

      {/* Diagram Visualization Flow */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto transition-all duration-1000 delay-[200ms] transform ${showHowItWorks ? "opacity-100 scale-100" : "opacity-0 scale-98"}`}
      >
        {/* Left Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="neu-card p-5 rounded-2xl text-left relative overflow-hidden group hover:neu-sunken hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase neu-sunken-sm px-2 py-0.5 rounded-md">
                Twitter / X Thread
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-text-rich dark:text-white">
              Auto-indexed thread saved via extension
            </p>
          </div>

          <div className="neu-card p-5 rounded-2xl text-left relative overflow-hidden group hover:neu-sunken hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase neu-sunken-sm px-2 py-0.5 rounded-md">
                Safari Bookmark
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-text-rich dark:text-white">
              Saved from active browser session
            </p>
          </div>
        </div>

        {/* Center Hub Orb */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-12">
          {/* Animating signals overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border border-dashed border-primary/30 animate-orbit-spin" />
          </div>

          {/* Central compiler node */}
          <div className="w-28 h-28 rounded-full neu-raised flex flex-col items-center justify-center relative shadow-lg hover:neu-sunken hover:scale-[1.05] transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full neu-sunken flex items-center justify-center">
              <AIPulse size="md" />
            </div>
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider mt-1.5 animate-pulse-soft">
              Indexing
            </span>
          </div>

          {/* Custom SVG flow lines with scroll-linked packets */}
          <svg
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            viewBox="0 0 380 300"
          >
            <path
              id="path-tl"
              d="M 50 120 Q 150 150 200 170"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="150"
              strokeDashoffset={Math.max(0, 1 - howItWorksProgress * 1.5) * 150}
              strokeOpacity="0.5"
            />
            <path
              id="path-bl"
              d="M 50 240 Q 150 210 200 180"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="150"
              strokeDashoffset={Math.max(0, 1 - howItWorksProgress * 1.5) * 150}
              strokeOpacity="0.5"
            />
            <path
              id="path-tr"
              d="M 200 170 Q 230 150 330 170"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="150"
              strokeDashoffset={Math.max(0, 1 - howItWorksProgress * 1.5) * 150}
              strokeOpacity="0.5"
            />
            <path
              id="path-br"
              d="M 200 180 Q 230 210 330 180"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="150"
              strokeDashoffset={Math.max(0, 1 - howItWorksProgress * 1.5) * 150}
              strokeOpacity="0.5"
            />

            {/* Animated flow packets */}
            {howItWorksProgress > 0.05 && (
              <>
                <circle r="4" fill="var(--color-pulse-coral)">
                  <animateMotion
                     dur={`${Math.max(0.6, 2.5 - howItWorksVelocity * 5)}s`}
                     repeatCount="indefinite"
                  >
                    <mpath href="#path-tl" />
                  </animateMotion>
                </circle>
                <circle r="4" fill="var(--color-primary)">
                  <animateMotion
                     dur={`${Math.max(0.6, 2.5 - howItWorksVelocity * 5)}s`}
                     repeatCount="indefinite"
                  >
                    <mpath href="#path-bl" />
                  </animateMotion>
                </circle>
                <circle r="4" fill="var(--color-pulse-blush)">
                  <animateMotion
                     dur={`${Math.max(0.6, 2.5 - howItWorksVelocity * 5)}s`}
                     repeatCount="indefinite"
                  >
                    <mpath href="#path-tr" />
                  </animateMotion>
                </circle>
                <circle r="4" fill="var(--color-tertiary)">
                  <animateMotion
                     dur={`${Math.max(0.6, 2.5 - howItWorksVelocity * 5)}s`}
                     repeatCount="indefinite"
                  >
                    <mpath href="#path-br" />
                  </animateMotion>
                </circle>
              </>
            )}
          </svg>
        </div>

        {/* Right Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="neu-card p-5 rounded-2xl text-left relative overflow-hidden group hover:neu-sunken hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase neu-sunken-sm px-2 py-0.5 rounded-md">
                YouTube Video
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-text-rich dark:text-white">
              Auto-indexed transcript synced to memory
            </p>
          </div>

          <div className="neu-card p-5 rounded-2xl text-left relative overflow-hidden group hover:neu-sunken hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase neu-sunken-sm px-2 py-0.5 rounded-md">
                Instagram Saved
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <p className="text-xs font-bold text-text-rich dark:text-white">
              AI synthesizes summary from reel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
