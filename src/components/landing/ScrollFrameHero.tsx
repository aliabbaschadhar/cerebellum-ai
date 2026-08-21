"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Hero from "./Hero";
import Navbar from "./Navbar";

interface ScrollFrameHeroProps {
  scrollToFriction: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToFAQ: () => void;
  navigateToApp: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function ScrollFrameHero({
  scrollToFriction,
  scrollToHowItWorks,
  scrollToFeatures,
  scrollToFAQ,
  navigateToApp,
  isDarkMode,
  setIsDarkMode,
}: ScrollFrameHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollProgressRef = useRef(0);

  const TOTAL_FRAMES = 220;

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/frames/frame_${frameNum}.png`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // Draw current frame to canvas
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const progress = scrollProgressRef.current;
    let frameIndex = 0;
    if (progress < 0.95) {
      const p = progress / 0.95;
      frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(p * TOTAL_FRAMES));
    } else {
      frameIndex = TOTAL_FRAMES - 1;
    }

    let activeImg = images[frameIndex];
    if (!activeImg || !activeImg.complete) {
      let found = false;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frameIndex - offset;
        const next = frameIndex + offset;
        if (prev >= 0 && images[prev]?.complete) {
          activeImg = images[prev];
          found = true;
          break;
        }
        if (next < TOTAL_FRAMES && images[next]?.complete) {
          activeImg = images[next];
          found = true;
          break;
        }
      }
      if (!found && images[0]?.complete) {
        activeImg = images[0];
      }
    }

    if (!activeImg || !activeImg.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = activeImg.width;
    const imgHeight = activeImg.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(activeImg, offsetX, offsetY, drawWidth, drawHeight);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle scroll and resize
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.scrollHeight - window.innerHeight;

      const currentScroll = -rect.top;
      let progress = currentScroll / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));
      scrollProgressRef.current = progress;
      setScrollProgress(progress);
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      drawFrame();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame]);

  useEffect(() => {
    drawFrame();
  }, [scrollProgress, loadedCount]);

  const heroOpacity = Math.max(0, 1 - scrollProgress * 4.2);
  const heroTransform = `translateY(${scrollProgress * -50}px)`;

  return (
    <div ref={containerRef} className="relative h-[800vh] w-full bg-[#e0e5ec] dark:bg-[#1b1d22] transition-colors duration-300">
      {/* Always Persistent Navbar */}
      <Navbar
        scrollToFriction={scrollToFriction}
        scrollToHowItWorks={scrollToHowItWorks}
        scrollToFeatures={scrollToFeatures}
        scrollToFAQ={scrollToFAQ}
        navigateToApp={navigateToApp}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Sticky Frame Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        {/* Ambient background overlay */}
        <div className="absolute inset-0 bg-[#121317] pointer-events-none transition-opacity duration-300"
          style={{ opacity: scrollProgress > 0.05 ? 1 : 0 }} />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
          style={{
            opacity: loadedCount > 0 ? 1 : 0,
            filter: scrollProgress < 0.05 ? "none" : `brightness(${Math.max(0.65, 1 - (scrollProgress - 0.05) * 0.45)})`
          }}
        />

        {/* Readability overlay */}
        <div 
          className="absolute inset-0 bg-[#1b1d22]/40 dark:bg-black/50 pointer-events-none transition-opacity duration-100 z-[5]"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 8) }} 
        />

        {/* Neumorphic Preloader Indicator */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="absolute bottom-8 right-8 z-30 neu-raised px-4 py-2.5 rounded-full flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-bold text-text-rich dark:text-white uppercase tracking-wider">
              Syncing Memory Matrix ({Math.round((loadedCount / TOTAL_FRAMES) * 100)}%)
            </span>
          </div>
        )}

        {/* Scroll Indicator Hint */}
        {scrollProgress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-90 animate-float-1">
            <div className="neu-raised-sm px-3.5 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-[10px] font-bold text-text-rich dark:text-white uppercase tracking-[0.2em] pointer-events-none">
                Scroll to Sync
              </span>
              <svg
                className="w-3.5 h-3.5 text-primary animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Foreground Content Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="sticky top-0 h-screen w-full flex items-center justify-center transition-all duration-100 ease-out"
          style={{
            opacity: heroOpacity,
            transform: heroTransform,
            visibility: heroOpacity === 0 ? "hidden" : "visible"
          }}
        >
          <div className="w-full h-full pointer-events-auto">
            <Hero
              scrollToFriction={scrollToFriction}
              scrollToHowItWorks={scrollToHowItWorks}
              scrollToFeatures={scrollToFeatures}
              scrollToFAQ={scrollToFAQ}
              navigateToApp={navigateToApp}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
