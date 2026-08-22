"use client";

import React from "react";
import Image from "next/image";

import type { SolarSystemProps } from "@/types";
import { SOLAR_SYSTEM_PLATFORMS } from "@/lib/landingData";

export default function SolarSystem({
  showSolarSystem,
  sectionRef,
}: SolarSystemProps) {
  const platforms = SOLAR_SYSTEM_PLATFORMS;

  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-24 text-center relative border-t border-outline-variant/20 dark:border-white/5 overflow-hidden"
    >
      {/* Section Header */}
      <div
        className={`flex flex-col items-center mb-16 transition-all duration-1000 transform ${showSolarSystem ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase neu-raised-sm px-3.5 py-1 rounded-full">
            Ecosystem
          </span>
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
        </div>
        <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich dark:text-white tracking-tight max-w-2xl mb-4">
          Connect your entire digital universe.
        </h2>
        <p className="font-sans text-base md:text-lg text-on-surface-variant dark:text-white/70 leading-[1.6] font-medium max-w-2xl">
          Cerebellum AI links seamlessly with all your favorite apps, drawing bookmarks, videos, and feeds into one unified neural memory matrix.
        </p>
      </div>

      {/* Solar System Orbit Visualization Area */}
      <div
        className={`solar-system-container relative w-full max-w-[760px] aspect-square mx-auto flex items-center justify-center transition-all duration-1000 delay-[250ms] transform ${showSolarSystem ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ transform: "scaleY(0.6)" }}
      >
        {/* Concentric Orbit Rings */}
        {platforms.map((platform, idx) => (
          <div
            key={`ring-${idx}`}
            className="absolute rounded-full border border-solid border-primary/20 dark:border-white/10 pointer-events-none"
            style={{
              width: `${platform.radius * 2}px`,
              height: `${platform.radius * 2}px`,
            }}
          />
        ))}

        {/* Central Sun: Brain Node */}
        <div className="relative z-30 group" style={{ transform: "scaleY(1.667)" }}>
          <div className="w-32 h-32 rounded-full p-1.5 neu-raised flex items-center justify-center animate-pulse-soft cursor-pointer hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-full neu-sunken p-2 flex items-center justify-center overflow-hidden">
              <Image
                src="/newlogo.png"
                width={200}
                height={200}
                alt="Cerebellum Center Brain Logo"
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
          </div>

          {/* Central tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-50">
            <div className="neu-card px-4 py-2.5 rounded-2xl text-center whitespace-nowrap">
              <p className="text-xs font-bold text-text-rich dark:text-white">Cerebellum AI Core</p>
              <p className="text-[10px] text-primary font-semibold mt-0.5">Central Memory Hub</p>
            </div>
          </div>
        </div>

        {/* Orbiting Planets (Social Icons) */}
        {platforms.map((platform, idx) => (
          <div
            key={`planet-${idx}`}
            className="absolute w-10 h-10 rounded-full flex items-center justify-center animate-orbit group hover:scale-110 transition-transform duration-300"
            style={
              {
                "--radius": platform.radius,
                "--duration": platform.duration,
              } as React.CSSProperties
            }
          >
            {/* Counter-scale wrapper to keep graphics round and upright */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ transform: "scaleY(1.667)" }}>
              {/* The Social Platform Circular Icon Wrapper */}
              <div className={`w-full h-full rounded-full flex items-center justify-center ${platform.color} transition-all duration-300`}>
                {platform.icon}
              </div>

              {/* Hover Tooltip Card */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="neu-card px-4 py-3 rounded-2xl text-left min-w-[200px]">
                  <p className="text-xs font-bold text-text-rich dark:text-white">{platform.name}</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-white/70 font-medium mt-1 leading-normal">
                    {platform.tagline}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                    <span>Connect Sync</span>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
