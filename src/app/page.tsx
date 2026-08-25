"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useScrollProgress } from "@/lib/useScrollProgress";

// Extracted Sub-sections
import ScrollFrameHero from "@/components/landing/ScrollFrameHero";
import Friction from "@/components/landing/Friction";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import AutoCategorization from "@/components/landing/AutoCategorization";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import SolarSystem from "@/components/landing/SolarSystem";

import type { LinkData } from "@/types";
export type { LinkData };

export default function Home() {
  const router = useRouter();

  // Persistent Dark Mode Theme State initialized lazily from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // Update theme classes on document changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Scroll Trigger Observers for each section
  const [showFriction, setShowFriction] = useState(false);
  const frictionSectionRef = useRef<HTMLDivElement>(null);

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);

  const [showFeatures, setShowFeatures] = useState(false);
  const featuresSectionRef = useRef<HTMLDivElement>(null);

  const [showAutoCategorization, setShowAutoCategorization] = useState(false);
  const autoCategorizationSectionRef = useRef<HTMLDivElement>(null);

  const [showFAQ, setShowFAQ] = useState(false);
  const faqSectionRef = useRef<HTMLDivElement>(null);

  const [showCTA, setShowCTA] = useState(false);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

  const [showSolarSystem, setShowSolarSystem] = useState(false);
  const solarSystemSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const elements = [
      { ref: frictionSectionRef, set: setShowFriction },
      { ref: howItWorksSectionRef, set: setShowHowItWorks },
      { ref: featuresSectionRef, set: setShowFeatures },
      { ref: autoCategorizationSectionRef, set: setShowAutoCategorization },
      { ref: faqSectionRef, set: setShowFAQ },
      { ref: ctaSectionRef, set: setShowCTA },
      { ref: solarSystemSectionRef, set: setShowSolarSystem },
    ];

    const activeObservers = elements.map(({ ref, set }) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          set(true);
        }
      }, observerOptions);

      const current = ref.current;
      if (current) observer.observe(current);

      return { observer, current };
    });

    return () => {
      activeObservers.forEach(({ observer, current }) => {
        if (current) observer.unobserve(current);
      });
    };
  }, []);

  // Interactive mockup states
  const [activeFolder, setActiveFolder] = useState<
    "Design" | "Research" | "Growth" | "Mindset"
  >("Growth");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Scroll Progress Hooks
  const { progress: frictionProgress } = useScrollProgress(frictionSectionRef);
  const { progress: howItWorksProgress, velocity: howItWorksVelocity } =
    useScrollProgress(howItWorksSectionRef);

  const scrollToFriction = () => {
    frictionSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToHowItWorks = () => {
    howItWorksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToFeatures = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToFAQ = () => {
    faqSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const navigateToApp = () => {
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-x-clip transition-colors duration-300">
      {/* 1. Hero / Header Area with Frame Scroll Animation */}
      <ScrollFrameHero
        scrollToFriction={scrollToFriction}
        scrollToHowItWorks={scrollToHowItWorks}
        scrollToFeatures={scrollToFeatures}
        scrollToFAQ={scrollToFAQ}
        navigateToApp={navigateToApp}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* 2. Friction Section */}
      <Friction
        showFriction={showFriction}
        frictionProgress={frictionProgress}
        sectionRef={frictionSectionRef}
      />

      {/* 3. How It Works Section */}
      <HowItWorks
        showHowItWorks={showHowItWorks}
        howItWorksProgress={howItWorksProgress}
        howItWorksVelocity={howItWorksVelocity}
        sectionRef={howItWorksSectionRef}
      />

      {/* 4. Features Section */}
      <Features
        showFeatures={showFeatures}
        sectionRef={featuresSectionRef}
      />

      {/* 5. Auto Categorization Section */}
      <AutoCategorization
        showAutoCategorization={showAutoCategorization}
        activeFolder={activeFolder}
        setActiveFolder={setActiveFolder}
        sectionRef={autoCategorizationSectionRef}
      />

      {/* 6. FAQ Section */}
      <FAQ
        showFAQ={showFAQ}
        expandedFaq={expandedFaq}
        setExpandedFaq={setExpandedFaq}
        sectionRef={faqSectionRef}
      />

      {/* 7. CTA Section */}
      <CTA
        showCTA={showCTA}
        navigateToApp={navigateToApp}
        sectionRef={ctaSectionRef}
      />

      {/* 8. Solar System Section */}
      <SolarSystem
        showSolarSystem={showSolarSystem}
        sectionRef={solarSystemSectionRef}
      />

      {/* Premium Multi-column Neumorphic SaaS Footer */}
      <footer className="bg-background text-on-surface-variant dark:text-white/70 py-16 border-t border-outline-variant/20 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
            {/* Column 1: Brand details */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-full p-0.5 neu-raised-sm">
                  <Image
                    src="/newlogo.png"
                    alt="Cerebellum AI Logo"
                    width={32}
                    height={32}
                    className="rounded-full object-cover bg-white"
                  />
                </div>
                <span className="font-bold text-base text-text-rich dark:text-white tracking-tight">
                  Cerebellum AI
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full neu-sunken-sm text-primary dark:text-[#ffb4b4] uppercase tracking-wider">
                  Second Brain
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed max-w-sm">
                Your personal second brain. Automatically collect, transcribe, summarize, 
                and search your saved bookmarks, articles, YouTube videos, and social posts 
                using natural language.
              </p>
            </div>

            {/* Column 2: Product */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">Product</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-semibold">
                <li>
                  <button onClick={scrollToFeatures} className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors text-left cursor-pointer">
                    Features
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Chrome Extension
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Safari Extension
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-semibold">
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <button onClick={scrollToFAQ} className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors text-left cursor-pointer">
                    FAQ Accordion
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">Company</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-semibold">
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                    Discord Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-outline-variant/20 dark:border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-medium text-on-surface-variant/70 dark:text-white/50">
              &copy; {new Date().getFullYear()} Cerebellum AI Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant/70 dark:text-white/50">
              <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-[#ffb4b4] transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

