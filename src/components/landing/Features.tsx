"use client";

import React from "react";
import AIPulse from "@/components/AIPulse";

interface FeaturesProps {
  showFeatures: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function Features({ showFeatures, sectionRef }: FeaturesProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-20 text-center relative border-t border-outline-variant/30"
    >
      <div
        className={`flex flex-col items-center mb-20 transition-all duration-1000 transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase mb-4">
          Features
        </span>
        <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich tracking-tight max-w-2xl">
          From search queries to seamless recall in seconds
        </h2>
      </div>

      {/* Feature Row 1 */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 text-left transition-all duration-1000 delay-[200ms] transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="lg:col-span-5">
          <span className="text-sm font-bold text-primary tracking-wider font-mono">
            01 / RECALL ENGINE
          </span>
          <h3 className="font-display text-[28px] font-bold text-text-rich mt-2 mb-4">
            Search like you think
          </h3>
          <p className="text-base text-[#564241] font-medium leading-relaxed">
            Query your memory using conversational questions. Cerebellum parses
            natural language, semantic concepts, and keywords, completely
            bypassing rigid folder lookups.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className=" p-6 rounded-2xl border-white/60 shadow-lg">
            <div className="flex items-center gap-3 bg-[#FFF2D0]/40 px-4 py-3 rounded-full mb-4 border border-[#ddc0be]/20">
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
              <span className="text-xs font-bold text-text-rich">
                Who recommended the book on focus?
              </span>
            </div>
            <div className="bg-white/90 border border-white/60 p-4 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-primary mb-1 font-mono tracking-wider">
                FOUND IN TWITTER SAVED
              </p>
              <p className="text-xs font-bold text-text-rich mb-2">
                Marc Andreessen: productivity & focus resources
              </p>
              <p className="text-[11px] text-[#564241] leading-relaxed font-medium">
                &ldquo;Check out &apos;Deep Work&apos; by Cal Newport for the
                definitive guide on building focus stamina...&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Row 2 */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 text-left transition-all duration-1000 delay-[350ms] transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="lg:col-span-7 order-last lg:order-first">
          <div className=" p-6 rounded-2xl border-white/60 shadow-lg relative overflow-hidden aspect-video bg-[#dddad0]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB2B2]/20 to-[#FFF2D0]/30" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                  Video transcript synced
                </span>
              </div>
              <p className="text-xs font-bold text-text-rich">
                &ldquo;...dopamine spikes are followed by a proportional drop
                below baseline level...&rdquo;
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <span className="text-sm font-bold text-primary tracking-wider font-mono">
            02 / TRANSCRIPTION
          </span>
          <h3 className="font-display text-[28px] font-bold text-text-rich mt-2 mb-4">
            A listener for video and audio
          </h3>
          <p className="text-base text-[#564241] font-medium leading-relaxed">
            YouTube videos, podcast links, and voice notes are automatically
            transcribed, indexed, and summarized. You can search directly for
            spoken quotes inside the audio timeline.
          </p>
        </div>
      </div>

      {/* Feature Row 3 */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left transition-all duration-1000 delay-[500ms] transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="lg:col-span-5">
          <span className="text-sm font-bold text-primary tracking-wider font-mono">
            03 / HARVESTING
          </span>
          <h3 className="font-display text-[28px] font-bold text-text-rich mt-2 mb-4">
            Bookmarks on autopilot
          </h3>
          <p className="text-base text-[#564241] font-medium leading-relaxed">
            Save on any device via our Chrome extension, iOS Shortcut, or direct
            web app dashboard. All data syncs in real-time to your memory hub
            automatically.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className=" p-6 rounded-2xl border-white/60 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-xl border border-white shadow-sm">
              <span className="text-xs font-bold text-text-rich">
                Chrome Extension Sync
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-xl border border-white shadow-sm">
              <span className="text-xs font-bold text-text-rich">
                iOS Share Sheet Sync
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-xl border border-white shadow-sm">
              <span className="text-xs font-bold text-text-rich">
                Web App Compilation
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
