"use client";

import React from "react";

interface HeroProps {
  scrollToFriction: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToFAQ: () => void;
  navigateToApp: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Hero({
  scrollToHowItWorks,
  navigateToApp,
}: HeroProps) {
  return (
    <>
      {/* Hero Content Overlay */}
      <section className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 min-h-screen flex items-center relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column: Typography & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6 animate-fade-up">
            {/* Neumorphic Badge */}
            <div className="neu-raised-sm px-4 py-1.5 rounded-full">
              <span className="text-[10px] font-bold text-primary dark:text-[#ffb4b4] tracking-[0.25em] uppercase">
                AI-Powered Memory Matrix
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-[44px] sm:text-[56px] md:text-[62px] font-bold leading-[1.1] text-white tracking-tight drop-shadow-sm">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#e55b5f] to-[#ffb4b4]">Second Brain</span> for Everything You Save
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-[15px] sm:text-[17px] text-white/90 leading-[1.6] font-medium max-w-xl">
              Cerebellum AI automatically compiles and indexes your saved links, articles, YouTube videos, and social posts. Query your global memory instantly using conversational natural language.
            </p>

            {/* Neumorphic Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={navigateToApp}
                className="h-12 px-7 rounded-full neu-button-primary text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                Try Interactive Demo
                <svg
                  className="w-4 h-4 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" x2="19" y1="12" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button 
                onClick={scrollToHowItWorks}
                className="h-12 px-7 rounded-full neu-button text-text-rich dark:text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Install Extension
              </button>
            </div>
          </div>

          {/* Right Column: Floating Neumorphic Dashboard Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
            {/* Neumorphic Dashboard Mockup Container */}
            <div className="w-full max-w-[420px] neu-card p-5 rounded-3xl relative animate-float-1 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full neu-sunken-sm bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full neu-sunken-sm bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full neu-sunken-sm bg-green-500/80" />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant dark:text-white/60 tracking-wider uppercase font-mono">
                  Cerebellum Hub
                </span>
              </div>

              {/* Mockup Sunken Search Bar */}
              <div className="flex items-center gap-2.5 neu-sunken px-3.5 py-2.5 rounded-2xl mb-4">
                <svg
                  className="w-3.5 h-3.5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="text-xs text-on-surface-variant dark:text-white/50 font-semibold select-none">
                  Search spoken quotes or concepts...
                </span>
              </div>

              {/* Saved Items List Mockup */}
              <div className="flex flex-col gap-3">
                {/* Mock Item 1 */}
                <div className="neu-raised-sm p-3.5 rounded-2xl flex items-center gap-3.5 hover:neu-sunken transition-all group">
                  <div className="w-9 h-9 rounded-xl neu-sunken flex items-center justify-center shrink-0 text-primary">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-text-rich dark:text-white truncate">
                      Huberman: Dopamine Baseline
                    </p>
                    <p className="text-[9.5px] text-on-surface-variant dark:text-white/50 font-semibold mt-0.5">
                      Transcribed &bull; 12 mins ago
                    </p>
                  </div>
                </div>

                {/* Mock Item 2 */}
                <div className="neu-raised-sm p-3.5 rounded-2xl flex items-center gap-3.5 hover:neu-sunken transition-all group">
                  <div className="w-9 h-9 rounded-xl neu-sunken flex items-center justify-center shrink-0 text-text-rich dark:text-white">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-text-rich dark:text-white truncate">
                      Marc Andreessen: Execution Leverage
                    </p>
                    <p className="text-[9.5px] text-on-surface-variant dark:text-white/50 font-semibold mt-0.5">
                      Indexed thread &bull; 2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting Neumorphic Tag Badges */}
            <div className="absolute top-10 left-2 sm:left-4 z-20 animate-float-2 neu-raised-sm px-3.5 py-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Startups
              </span>
            </div>

            <div className="absolute bottom-16 right-2 sm:right-4 z-20 animate-float-3 neu-raised-sm px-3.5 py-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer">
              <span className="text-[10px] font-bold text-primary dark:text-[#ffb4b4] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Productivity
              </span>
            </div>

            <div className="absolute -bottom-6 left-12 z-20 animate-float-1 neu-raised-sm px-3.5 py-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Design
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
