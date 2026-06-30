"use client";

import React from "react";

interface CTAProps {
  showCTA: boolean;
  navigateToApp: () => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function CTA({ showCTA, navigateToApp, sectionRef }: CTAProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-20 text-center relative border-t border-outline-variant/30"
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1c16] via-[#31312a] to-[#1c1c16] px-8 py-20 max-w-4xl mx-auto shadow-2xl transition-all duration-1000 transform ${showCTA ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Internal emissive radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-radial from-[#E36A6A]/20 via-[#FFFBF1]/0 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <span className="text-[9px] font-bold tracking-[0.25em] text-[#ffb3b1] uppercase mb-4">
            Start Harvesting
          </span>
          <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-white tracking-tight mb-6">
            Stop losing what you save.
          </h2>
          <p className="font-sans text-sm md:text-base text-[#f4f0e7]/75 leading-[1.6] font-medium mb-10">
            Join thousands of researchers, designers, and builders using
            Cerebellum AI as their digital sanctuary and central memory hub.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={navigateToApp}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-[#E36A6A] to-[#FFB2B2] text-white text-sm font-bold shadow-lg shadow-[#E36A6A]/20 hover:shadow-xl hover:shadow-[#E36A6A]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Start Free Trial
            </button>
            <button className="h-12 px-8 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold shadow-sm hover:bg-white/20 transition-all duration-200">
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
