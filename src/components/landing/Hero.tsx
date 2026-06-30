"use client";

import React from "react";
import AIPulse from "@/components/AIPulse";

interface HeroProps {
  typedText: string;
  mousePos: { x: number; y: number };
  scrollToFriction: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToFAQ: () => void;
  navigateToApp: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Hero({
  typedText,
  mousePos,
  scrollToFriction,
  scrollToHowItWorks,
  scrollToFeatures,
  scrollToFAQ,
  navigateToApp,
  isDarkMode,
  setIsDarkMode,
}: HeroProps) {
  return (
    <>
      {/* Background soft ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-[#FFF2D0] dark:from-[#FFF2D0]/5 via-[#FFFBF1]/0 to-transparent opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-1/4 w-[700px] h-[700px] bg-gradient-radial from-[#FFB2B2]/20 dark:from-[#FFB2B2]/5 via-[#FFFBF1]/0 to-transparent opacity-40 pointer-events-none -z-10" />

      {/* Floating Pill Glassmorphic Header / Navbar */}
      <div className="w-full fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
        <header className="max-w-[1200px] mx-auto px-6 h-16 rounded-full flex items-center justify-between pointer-events-auto transition-all duration-300 backdrop-blur-sm">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="/logo.jpg"
              alt="Cerebellum AI Logo"
              className="w-9 h-9 rounded-full object-cover border border-[#ddc0be]/30 dark:border-white/10 shadow-sm"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-text-rich dark:text-white tracking-tight">
                Cerebellum AI
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E36A6A]/10 text-primary dark:text-[#ffb3b1] uppercase tracking-wider">
                Beta
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FFF2D0]/30 dark:bg-white/5 border border-[#ddc0be]/10 dark:border-white/5 px-1.5 py-1 rounded-full">
            <button
              onClick={scrollToFriction}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-[#564241] dark:text-[#c7c4ba] hover:text-[#2D2926] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
            >
              Problem
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-[#564241] dark:text-[#c7c4ba] hover:text-[#2D2926] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-[#564241] dark:text-[#c7c4ba] hover:text-[#2D2926] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={scrollToFAQ}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-[#564241] dark:text-[#c7c4ba] hover:text-[#2D2926] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-white/10 text-[#8a7170] dark:text-[#c7c4ba] transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? (
                // Sun Icon
                <svg
                  className="w-4.5 h-4.5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                // Moon Icon
                <svg
                  className="w-4.5 h-4.5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={navigateToApp}
              className="h-9 px-4 rounded-full bg-[#1c1c16] dark:bg-white text-white dark:text-[#1c1c16] text-xs font-bold hover:bg-[#31312a] dark:hover:bg-white/90 transition-all hover:shadow-[0_4px_12px_rgba(28,28,22,0.15)] dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.08)] cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 pt-28 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        {/* Left Side */}
        <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
          <h1 className="font-display text-[48px] font-bold leading-[1.1] text-text-rich tracking-tight mb-6">
            Your Second Brain for Everything You Save Online
          </h1>
          <p className="font-sans text-[18px] text-[#564241] leading-[1.6] mb-10 font-medium max-w-lg">
            Cerebellum AI automatically synthesizes your saved links, tweets,
            YouTube videos, and bookmarks, letting you recall anything instantly
            using conversational natural language.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={navigateToApp}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-[#E36A6A] to-[#FFB2B2] text-white text-sm font-bold shadow-lg shadow-[#E36A6A]/20 hover:shadow-xl hover:shadow-[#E36A6A]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
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
            <button className="h-12 px-8 rounded-full bg-white/60 border border-[#ddc0be]/40 text-[#1c1c16] text-sm font-bold shadow-sm hover:bg-white hover:border-[#E36A6A]/40 transition-all duration-200 flex items-center gap-2">
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

        {/* Right Side */}
        <div className="lg:col-span-7 relative flex items-center justify-center h-[540px] w-full min-w-[320px]">
          {/* Dashed Orbit circular track */}
          <div className="absolute w-[440px] h-[440px] rounded-full border-[1.5px] border-dashed border-[#ddc0be]/50 pointer-events-none -z-10 flex items-center justify-center animate-orbit-spin">
            <div className="w-[300px] h-[300px] rounded-full border border-dashed border-[#ddc0be]/30" />
          </div>

          {/* Core AIPulse Orb */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center pointer-events-none transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
            }}
          >
            <AIPulse size="lg" />
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mt-3 filter drop-shadow-sm animate-pulse-soft">
              AI Active
            </span>
          </div>

          {/* Search Input Box */}
          <div
            className="absolute z-30 top-[40%] right-[10%] px-5 py-3.5 rounded-full flex items-center gap-3 w-[310px] pointer-events-auto hover:border-[#E36A6A] hover:bg-white/90 transition-all duration-300 shadow-[0_12px_24px_rgba(160,56,59,0.08)]  ease-out"
            style={{
              transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
            }}
          >
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-xs text-[#2D2926] font-bold flex items-center gap-1 font-sans">
              {typedText}
              <span className="w-0.5 h-3.5 bg-[#E36A6A] animate-pulse" />
            </span>
          </div>

          {/* Card: Twitter/X */}
          <div
            className="absolute z-25 top-[14%] right-[8%] transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
            }}
          >
            <div
              className=" p-4 rounded-2xl w-[240px] shadow-md hover:border-[#E36A6A]/60 hover:shadow-[0_10px_25px_rgba(227,106,106,0.1)] transition-all duration-300 select-none animate-float-3"
              style={{ "--rotate-deg": "-3deg" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#1c1c16] flex items-center justify-center text-white font-bold text-[10px]">
                  X
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#2D2926] leading-none">
                    TWITTER / X
                  </p>
                  <p className="text-[9px] text-outline leading-none">
                    @growth_guy
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#564241] font-medium leading-normal line-clamp-2">
                Startup execution framework. On Focus & Dopamine
              </p>
              <div className="mt-2.5 w-full h-1 bg-[#E36A6A]/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-[#E36A6A] rounded-full" />
              </div>
            </div>
          </div>

          {/* Card: Instagram */}
          <div
            className="absolute z-25 bottom-[14%] left-[6%] transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
            }}
          >
            <div
              className=" p-4 rounded-2xl w-[200px] shadow-md select-none animate-float-2 hover:border-[#E36A6A]/60 hover:shadow-[0_10px_25px_rgba(227,106,106,0.1)] transition-all duration-300"
              style={{ "--rotate-deg": "5deg" } as React.CSSProperties}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-[9px] font-bold text-outline uppercase tracking-wider">
                  Instagram
                </span>
              </div>
              <p className="text-xs text-[#564241] font-medium leading-normal line-clamp-2">
                10x Morning routine checklist...
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E36A6A]/10 flex items-center justify-center text-[10px] text-primary">
                  ♥
                </div>
                <span className="text-[10px] text-outline font-bold">
                  12.8k likes
                </span>
              </div>
            </div>
          </div>

          {/* Card: TikTok */}
          <div
            className="absolute z-25 bottom-[12%] right-[12%] transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
            }}
          >
            <div
              className=" p-4 rounded-2xl w-[200px] shadow-md select-none animate-float-1 hover:border-[#E36A6A]/60 hover:shadow-[0_10px_25px_rgba(227,106,106,0.1)] transition-all duration-300"
              style={{ "--rotate-deg": "6deg" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-[8px] font-bold text-white">
                  ♬
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#2d2926] leading-none">
                    TIKTOK
                  </p>
                  <p className="text-[8px] text-outline leading-none">
                    @minimal_space
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#564241] font-medium line-clamp-1">
                Minimal Workspace setup inspo
              </p>
            </div>
          </div>
        </div>

        {/* Scattered Background Cards */}
        {/* 1. YouTube Card */}
        <div
          className="absolute z-0 top-[-30px] left-[-30px] xl:left-[-70px] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * -35}px, ${mousePos.y * -35}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[200px] opacity-[0.22] animate-float-1"
            style={{ "--rotate-deg": "-10deg" } as React.CSSProperties}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                YouTube • 14:22
              </span>
            </div>
            <div className="aspect-video w-full rounded bg-[#dddad0] relative overflow-hidden mb-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB2B2]/20 to-[#FFF2D0]/20" />
            </div>
            <p className="text-[11px] font-bold text-[#2D2926] line-clamp-1">
              Andrew Huberman: Focus stamina...
            </p>
            <p className="text-[9px] text-outline font-semibold mt-0.5">
              Huberman Lab
            </p>
          </div>
        </div>

        {/* 2. Facebook Post */}
        <div
          className="absolute z-0 top-[35%] left-[-40px] xl:left-[-90px] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[170px] opacity-[0.15] animate-float-3"
            style={{ "--rotate-deg": "8deg" } as React.CSSProperties}
          >
            <span className="text-[8px] font-bold text-outline block mb-1">
              FACEBOOK POST
            </span>
            <p className="text-[10px] font-bold text-[#2D2926] line-clamp-2 mb-1">
              10x B2B Growth Engine Framework...
            </p>
            <span className="text-[8px] text-outline/80">5 mins read</span>
          </div>
        </div>

        {/* 3. Instagram Saved */}
        <div
          className="absolute z-0 bottom-[5%] left-[-30px] xl:left-[-70px] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[180px] opacity-[0.22] animate-float-2"
            style={{ "--rotate-deg": "14deg" } as React.CSSProperties}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[9px] font-bold text-outline uppercase tracking-wider">
                Instagram Saved
              </span>
            </div>
            <div className="aspect-square w-full rounded-lg bg-[#dddad0] relative overflow-hidden mb-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB2B2]/30 to-[#FFF2D0]/30" />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[8px] font-bold">
                ♥ 4.2k
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#2D2926] line-clamp-1">
              Morning routine checklist...
            </p>
          </div>
        </div>

        {/* 4. Instagram Saved (Bottom-Center) */}
        <div
          className="absolute z-0 bottom-[-35px] left-[35%] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[185px] opacity-[0.22] animate-float-1"
            style={{ "--rotate-deg": "-6deg" } as React.CSSProperties}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[9px] font-bold text-outline uppercase tracking-wider">
                Instagram Saved
              </span>
            </div>
            <div className="aspect-square w-full rounded-lg bg-[#dddad0] relative overflow-hidden mb-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB2B2]/30 to-[#FFF2D0]/30" />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[8px] font-bold">
                ♥ 4.2k
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#2D2926] line-clamp-1">
              Morning routine checklist...
            </p>
          </div>
        </div>

        {/* 5. TikTok Clip */}
        <div
          className="absolute z-0 top-[0px] right-[-30px] xl:right-[-70px] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[160px] opacity-[0.25] animate-float-1"
            style={{ "--rotate-deg": "10deg" } as React.CSSProperties}
          >
            <span className="text-[8px] font-bold text-outline block mb-1">
              TIKTOK CLIP
            </span>
            <div className="aspect-square w-full rounded bg-[#dddad0] relative overflow-hidden mb-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB2B2]/20 to-[#FFF2D0]/20" />
            </div>
            <p className="text-[9px] font-bold text-[#2D2926] line-clamp-1">
              Minimal setup...
            </p>
          </div>
        </div>

        {/* 6. Twitter Thread */}
        <div
          className="absolute z-0 top-[40%] right-[-50px] xl:right-[-90px] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * 35}px, ${mousePos.y * 35}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[160px] opacity-[0.15] animate-float-3"
            style={{ "--rotate-deg": "-4deg" } as React.CSSProperties}
          >
            <span className="text-[8px] font-bold text-outline block mb-1">
              TWITTER THREAD
            </span>
            <p className="text-[10px] font-bold text-[#2D2926] line-clamp-2 mb-1">
              Minimal Workspace Setup inspo...
            </p>
            <span className="text-[8px] text-outline/80">3 mins read</span>
          </div>
        </div>

        {/* 7. YouTube Card (Bottom-Right) */}
        <div
          className="absolute z-0 bottom-[5%] right-[-30px] xl:right-[-70px] transition-transform duration-500 ease-out pointer-events-none select-none"
          style={{
            transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
          }}
        >
          <div
            className=" p-3.5 rounded-2xl w-[200px] opacity-[0.25] animate-float-2"
            style={{ "--rotate-deg": "8deg" } as React.CSSProperties}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                YouTube • 14:22
              </span>
            </div>
            <div className="aspect-video w-full rounded bg-[#dddad0] relative overflow-hidden mb-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB2B2]/20 to-[#FFF2D0]/20" />
            </div>
            <p className="text-[11px] font-bold text-[#2D2926] line-clamp-1">
              Andrew Huberman: Focus stamina...
            </p>
            <p className="text-[9px] text-outline font-semibold mt-0.5">
              Huberman Lab
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
