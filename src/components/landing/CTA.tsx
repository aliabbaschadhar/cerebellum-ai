"use client";

import React from "react";

import type { CTAProps } from "@/types";

export default function CTA({ showCTA, navigateToApp, sectionRef }: CTAProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-24 text-center relative border-t border-outline-variant/20 dark:border-white/5"
    >
      <div
        className={`relative overflow-hidden rounded-3xl neu-card px-8 py-20 max-w-4xl mx-auto transition-all duration-1000 transform ${showCTA ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 neu-sunken rounded-full" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase neu-raised-sm px-3.5 py-1 rounded-full">
              Start Harvesting
            </span>
            <div className="h-[2px] w-12 neu-sunken rounded-full" />
          </div>
          <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich dark:text-white tracking-tight mb-6">
            Stop losing what you save.
          </h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-white/80 leading-[1.6] font-medium mb-10">
            Join thousands of researchers, designers, and builders using
            Cerebellum AI as their digital sanctuary and central memory hub.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={navigateToApp}
              className="h-12 px-8 rounded-full neu-button-primary text-white text-sm font-bold cursor-pointer"
            >
              Start Free Trial
            </button>
            <button className="h-12 px-8 rounded-full neu-button text-text-rich dark:text-white text-sm font-bold cursor-pointer">
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
