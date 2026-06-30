"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useScrollProgress } from "@/lib/useScrollProgress";

// Extracted Sub-sections
import Hero from "@/components/landing/Hero";
import Friction from "@/components/landing/Friction";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import AutoCategorization from "@/components/landing/AutoCategorization";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

export interface LinkData {
  id: string;
  url: string;
  platform: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  siteName: string | null;
  extras: Record<string, string | null> | null;
  aiContext: string | null;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();

  // Persistent Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Simulated typing state for the mock search bar
  const [typedText, setTypedText] = useState("");
  const targetText = "that dopamine video from YouTube...";

  // Initialize theme from localStorage, defaulting to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const timer = setTimeout(() => {
      setIsDarkMode(savedTheme === "dark");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(targetText.substring(0, index));
      index++;
      if (index > targetText.length) {
        setTimeout(() => {
          index = 0;
        }, 3000); // Pause before re-typing
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Mouse Parallax coordinates (normalized to range [-0.5, 0.5])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const elements = [
      { ref: frictionSectionRef, set: setShowFriction },
      { ref: howItWorksSectionRef, set: setShowHowItWorks },
      { ref: featuresSectionRef, set: setShowFeatures },
      { ref: autoCategorizationSectionRef, set: setShowAutoCategorization },
      { ref: faqSectionRef, set: setShowFAQ },
      { ref: ctaSectionRef, set: setShowCTA },
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
  const { progress: featuresProgress } = useScrollProgress(featuresSectionRef);
  const { progress: autoCatProgress } = useScrollProgress(
    autoCategorizationSectionRef,
  );
  const { progress: ctaProgress } = useScrollProgress(ctaSectionRef);

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
    <div className="min-h-screen bg-background text-[#1c1c16] dark:text-[#dddad0] relative overflow-x-hidden selection:bg-[#E36A6A]/20 selection:text-[#a0383b] transition-colors duration-300">
      
      {/* 1. Hero / Header Area */}
      <Hero
        typedText={typedText}
        mousePos={mousePos}
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

      {/* Premium Multi-column SaaS Footer */}
      <footer className="bg-[#f7f3e9] dark:bg-[#151512] text-[#564241] dark:text-[#c7c4ba] py-16 border-t border-[#ddc0be]/30 dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
            {/* Column 1: Brand details */}
            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.jpg"
                  alt="Cerebellum AI Logo"
                  className="w-8 h-8 rounded-full object-cover border border-[#ddc0be]/30 dark:border-white/10"
                />
                <span className="font-bold text-base text-text-rich dark:text-white tracking-tight">
                  Cerebellum AI
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E36A6A]/10 text-primary dark:text-[#ffb3b1] uppercase tracking-wider">
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
                  <button onClick={scrollToFeatures} className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors text-left cursor-pointer">
                    Features
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    Chrome Extension
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    Safari Extension
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
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
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <button onClick={scrollToFAQ} className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors text-left cursor-pointer">
                    FAQ Accordion
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
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
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                    Discord Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#ddc0be]/30 dark:border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-medium text-[#8a7170] dark:text-[#8a7170]/70">
              &copy; {new Date().getFullYear()} Cerebellum AI Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#8a7170] dark:text-[#8a7170]/70">
              <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-primary dark:hover:text-[#ffb3b1] transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
