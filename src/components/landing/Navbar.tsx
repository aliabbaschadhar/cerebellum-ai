"use client";

import React from "react";
import Image from "next/image";

interface NavbarProps {
  scrollToFriction: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToFAQ: () => void;
  navigateToApp: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Navbar({
  scrollToFriction,
  scrollToHowItWorks,
  scrollToFeatures,
  scrollToFAQ,
  navigateToApp,
  isDarkMode,
  setIsDarkMode,
}: NavbarProps) {
  return (
    <div className="w-full fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
      <header className="max-w-[1200px] mx-auto px-6 h-16 rounded-full flex items-center justify-between pointer-events-auto neu-raised transition-all duration-300">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="rounded-full p-0.5 neu-raised-sm group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.jpg"
              alt="Cerebellum AI Logo"
              width={34}
              height={34}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-text-rich dark:text-white tracking-tight">
              Cerebellum AI
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full neu-sunken-sm text-primary dark:text-[#ffb4b4] uppercase tracking-wider">
              Beta
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 neu-sunken px-2 py-1.5 rounded-full">
          <button
            onClick={scrollToFriction}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-on-surface-variant hover:text-text-rich dark:hover:text-white hover:neu-raised-sm active:neu-sunken-sm cursor-pointer"
          >
            Problem
          </button>
          <button
            onClick={scrollToHowItWorks}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-on-surface-variant hover:text-text-rich dark:hover:text-white hover:neu-raised-sm active:neu-sunken-sm cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={scrollToFeatures}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-on-surface-variant hover:text-text-rich dark:hover:text-white hover:neu-raised-sm active:neu-sunken-sm cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={scrollToFAQ}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all text-on-surface-variant hover:text-text-rich dark:hover:text-white hover:neu-raised-sm active:neu-sunken-sm cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 rounded-full neu-button flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="Toggle light / dark mode"
          >
            {isDarkMode ? (
              // Sun Icon
              <svg
                className="w-4 h-4 fill-none stroke-current"
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
                className="w-4 h-4 fill-none stroke-current"
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
            className="h-9 px-5 rounded-full neu-button-primary text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            Launch App
          </button>
        </div>
      </header>
    </div>
  );
}
