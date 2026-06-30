"use client";

import React from "react";

interface FrictionProps {
  showFriction: boolean;
  frictionProgress: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function Friction({
  showFriction,
  frictionProgress,
  sectionRef,
}: FrictionProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-20 text-center relative border-t border-outline-variant/30"
    >
      {/* Section Header */}
      <div
        className={`flex flex-col items-center mb-16 transition-all duration-1000 transform ${showFriction ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] w-12 bg-[#ddc0be]/60" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
            The Friction
          </span>
          <div className="h-[1px] w-12 bg-[#ddc0be]/60" />
        </div>
        <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich tracking-tight max-w-2xl mb-6">
          Everything you save online becomes lost.
        </h2>
        <p className="font-sans text-base md:text-lg text-[#564241] leading-[1.6] font-medium max-w-3xl">
          Bookmarks are a digital graveyard. We bookmark articles on Twitter,
          hit like on Instagram, and add YouTube videos to &apos;Watch
          Later&apos;—only to waste hours searching through platforms trying to
          recall where they went.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {/* Left: Traditional Bookmarks */}
        <div
          style={{
            transform: `translateX(${Math.max(0, 1 - frictionProgress * 2.2) * -90}px) rotate(${Math.max(0, 1 - frictionProgress * 2.2) * -4}deg)`,
            opacity: Math.min(1, frictionProgress * 2),
          }}
          className="bg-[#f7f3e9]/40 border border-[#ddc0be]/40 rounded-2xl p-6 md:p-8 flex flex-col gap-6 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[#ba1a1a] shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 9.75 10 9.75-4.48 9.75-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h3 className="text-[16px] md:text-[18px] font-bold text-text-rich font-sans">
              Traditional Bookmarks & Saves
            </h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Row 1 */}
            <div
              className={`flex items-center justify-between bg-[#f1eee4]/40 px-4 py-3.5 rounded-xl border border-[#ddc0be]/10 transition-all duration-500 delay-[300ms] transform ${showFriction ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            >
              <span className="text-[10px] font-bold text-outline tracking-wider uppercase">
                Twitter
              </span>
              <span className="text-xs font-semibold text-outline italic">
                &ldquo;Startup advice...&rdquo; (Liked 3 months ago)
              </span>
            </div>

            {/* Row 2 */}
            <div
              className={`flex items-center justify-between bg-[#f1eee4]/40 px-4 py-3.5 rounded-xl border border-[#ddc0be]/10 transition-all duration-500 delay-[450ms] transform ${showFriction ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            >
              <span className="text-[10px] font-bold text-outline tracking-wider uppercase">
                Safari
              </span>
              <span className="text-xs font-semibold text-outline italic">
                Bookmark #142 (Untitled page)
              </span>
            </div>

            {/* Row 3 */}
            <div
              className={`flex items-center justify-between bg-[#f1eee4]/40 px-4 py-3.5 rounded-xl border border-[#ddc0be]/10 transition-all duration-500 delay-[600ms] transform ${showFriction ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            >
              <span className="text-[10px] font-bold text-outline tracking-wider uppercase">
                YouTube
              </span>
              <span className="text-xs font-semibold text-outline italic">
                Watch Later List (412 unwatched items)
              </span>
            </div>

            {/* Row 4 */}
            <div
              className={`flex items-center justify-between bg-[#f1eee4]/40 px-4 py-3.5 rounded-xl border border-[#ddc0be]/10 transition-all duration-500 delay-[750ms] transform ${showFriction ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            >
              <span className="text-[10px] font-bold text-outline tracking-wider uppercase">
                Instagram
              </span>
              <span className="text-xs font-semibold text-outline italic">
                Saved Reels folder &gt; &ldquo;Inspiration...&rdquo;
              </span>
            </div>
          </div>
        </div>

        {/* Right: Cerebellum Central Memory Hub */}
        <div
          style={{
            transform: `translateX(${Math.max(0, 1 - frictionProgress * 2.2) * 90}px) rotate(${Math.max(0, 1 - frictionProgress * 2.2) * 4}deg)`,
            opacity: Math.min(1, frictionProgress * 2),
          }}
          className=" rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-[0_15px_30px_rgba(227,106,106,0.03)] border-white/60 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-emerald-600 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <h3 className="text-[16px] md:text-[18px] font-bold text-text-rich font-sans">
              Cerebellum Central Memory Hub
            </h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Row 1 */}
            <div
              className={`flex items-center gap-3.5 bg-white/80 border border-white/60 p-4 rounded-xl shadow-sm hover:border-[#E36A6A]/60 hover:shadow-[0_8px_20px_rgba(227,106,106,0.08)] transition-all duration-500 transform ${showFriction ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"} delay-[400ms]`}
            >
              <div className="w-9 h-9 rounded-full bg-platform-youtube-bg text-platform-youtube flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-text-rich truncate">
                  Dr. Andrew Huberman: Dopamine Control
                </p>
                <p className="text-[10px] text-outline font-semibold mt-0.5">
                  Saved via Chrome Extension &bull; 2 mins ago
                </p>
              </div>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-blue-100/50 text-blue-700 uppercase tracking-wider shrink-0 animate-pulse-soft">
                Productivity
              </span>
            </div>

            {/* Row 2 */}
            <div
              className={`flex items-center gap-3.5 bg-white/80 border border-white/60 p-4 rounded-xl shadow-sm hover:border-[#E36A6A]/60 hover:shadow-[0_8px_20px_rgba(227,106,106,0.08)] transition-all duration-500 transform ${showFriction ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"} delay-[550ms]`}
            >
              <div className="w-9 h-9 rounded-full bg-platform-twitter-bg text-platform-twitter flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-text-rich truncate">
                  Marc Andreessen: How to Execute Ideas
                </p>
                <p className="text-[10px] text-outline font-semibold mt-0.5">
                  Auto-indexed thread &bull; 1 day ago
                </p>
              </div>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#FFB2B2]/20 text-[#a0383b] uppercase tracking-wider shrink-0">
                Startups
              </span>
            </div>

            {/* Row 3 */}
            <div
              className={`flex items-center gap-3.5 bg-white/80 border border-white/60 p-4 rounded-xl shadow-sm hover:border-[#E36A6A]/60 hover:shadow-[0_8px_20px_rgba(227,106,106,0.08)] transition-all duration-500 transform ${showFriction ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"} delay-[700ms]`}
            >
              <div className="w-9 h-9 rounded-full bg-platform-instagram-bg text-platform-instagram flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.000 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-text-rich truncate">
                  Morning Routine Framework for Focus
                </p>
                <p className="text-[10px] text-outline font-semibold mt-0.5">
                  Audio transcribed &amp; logged &bull; 3 days ago
                </p>
              </div>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-indigo-100/50 text-indigo-700 uppercase tracking-wider shrink-0">
                Mindset
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
