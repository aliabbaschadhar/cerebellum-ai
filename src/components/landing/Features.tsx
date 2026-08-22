import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

import type { FeaturesProps } from "@/types";

export default function Features({ showFeatures, sectionRef }: FeaturesProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Time format helper (seconds -> mm:ss)
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percent * duration;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgress(percent * 100);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-24 text-center relative border-t border-outline-variant/20 dark:border-white/5"
    >
      <div
        className={`flex flex-col items-center mb-20 transition-all duration-1000 transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase neu-raised-sm px-3.5 py-1 rounded-full">
            Features
          </span>
          <div className="h-[2px] w-12 neu-sunken rounded-full" />
        </div>
        <h2 className="font-display text-[36px] md:text-[44px] font-bold leading-[1.2] text-text-rich dark:text-white tracking-tight max-w-2xl">
          From search queries to seamless recall in seconds
        </h2>
      </div>

      {/* Feature Row 1 */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 text-left transition-all duration-1000 delay-[200ms] transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="lg:col-span-5">
          <span className="text-xs font-bold text-primary tracking-wider font-mono neu-sunken-sm px-2.5 py-1 rounded-md">
            01 / RECALL ENGINE
          </span>
          <h3 className="font-display text-[28px] font-bold text-text-rich dark:text-white mt-3 mb-4">
            Search like you think
          </h3>
          <p className="text-base text-on-surface-variant dark:text-white/70 font-medium leading-relaxed">
            Query your memory using conversational questions. Cerebellum parses
            natural language, semantic concepts, and keywords, completely
            bypassing rigid folder lookups.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="neu-card p-6 rounded-3xl hover:scale-[1.01] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3 neu-sunken px-4 py-3 rounded-full mb-4 cursor-pointer">
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
              <span className="text-xs font-bold text-text-rich dark:text-white">
                Who recommended the book on focus?
              </span>
            </div>
            <div className="neu-raised-sm p-4 rounded-2xl cursor-pointer hover:neu-sunken transition-all">
              <p className="text-[10px] font-bold text-primary mb-1 font-mono tracking-wider">
                FOUND IN TWITTER SAVED
              </p>
              <p className="text-xs font-bold text-text-rich dark:text-white mb-2">
                Marc Andreessen: productivity & focus resources
              </p>
              <p className="text-[11px] text-on-surface-variant dark:text-white/70 leading-relaxed font-medium">
                &ldquo;Check out &apos;Deep Work&apos; by Cal Newport for the definitive guide on building focus stamina...&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Row 2: Dynamic Real Video Player */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28 text-left transition-all duration-1000 delay-[350ms] transform ${showFeatures ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="lg:col-span-7 order-last lg:order-first">
          <div className="neu-card p-2 rounded-[2rem] relative overflow-hidden aspect-video group hover:scale-[1.01] transition-all duration-300 shadow-2xl">
            {/* HTML5 Video Element */}
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden neu-sunken border border-outline-variant/20 dark:border-white/10 bg-black">
              <video
                ref={videoRef}
                src="/demo1.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
                onClick={handleTogglePlay}
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Right Waveform Visualizer */}
              <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  {[12, 20, 14, 26, 18, 24, 10, 22].map((h, idx) => (
                    <span
                      key={idx}
                      className={`w-0.5 rounded-full bg-primary transition-all duration-300 ${isPlaying ? "animate-pulse" : "opacity-40"
                        }`}
                      style={{
                        height: isPlaying ? `${(h * (idx % 2 === 0 ? 1.2 : 0.8)).toFixed(0)}px` : "6px",
                        animationDelay: `${idx * 150}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Central Play / Pause Floating Control */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto pointer-events-none">
                <button
                  onClick={handleTogglePlay}
                  className={`w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(227,106,106,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/30 backdrop-blur-md pointer-events-auto ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                    }`}
                  title={isPlaying ? "Pause Demonstration" : "Play Demonstration"}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-1" />
                  )}
                </button>
              </div>


              {/* Bottom Timeline Scrubber & Bar Controls (Visible on Hover Only) */}
              <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto">
                <span className="text-[9.5px] font-bold font-mono text-white/80 shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Progress Bar Container */}
                <div
                  onClick={handleSeek}
                  className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer relative group/scrubber"
                >
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-75 relative"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Controls */}
                <button
                  onClick={handleToggleMute}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? "Unmute Sound" : "Mute Sound"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  onClick={handleFullscreen}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <span className="text-xs font-bold text-primary tracking-wider font-mono neu-sunken-sm px-2.5 py-1 rounded-md">
            02 / TRANSCRIPTION
          </span>
          <h3 className="font-display text-[28px] font-bold text-text-rich dark:text-white mt-3 mb-4">
            A listener for video and audio
          </h3>
          <p className="text-base text-on-surface-variant dark:text-white/70 font-medium leading-relaxed">
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
          <span className="text-xs font-bold text-primary tracking-wider font-mono neu-sunken-sm px-2.5 py-1 rounded-md">
            03 / HARVESTING
          </span>
          <h3 className="font-display text-[28px] font-bold text-text-rich dark:text-white mt-3 mb-4">
            Bookmarks on autopilot
          </h3>
          <p className="text-base text-on-surface-variant dark:text-white/70 font-medium leading-relaxed">
            Save on any device via our Chrome extension, iOS Shortcut, or direct
            web app dashboard. All data syncs in real-time to your memory hub
            automatically.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="neu-card p-6 rounded-3xl flex flex-col gap-3.5 hover:scale-[1.01] transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between neu-sunken p-4 rounded-2xl hover:neu-raised-sm transition-all duration-300 cursor-pointer">
              <span className="text-xs font-bold text-text-rich dark:text-white">
                Chrome Extension Sync
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 neu-raised-sm px-2.5 py-1 rounded-full uppercase tracking-wide">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between neu-sunken p-4 rounded-2xl hover:neu-raised-sm transition-all duration-300 cursor-pointer">
              <span className="text-xs font-bold text-text-rich dark:text-white">
                iOS Share Sheet Sync
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 neu-raised-sm px-2.5 py-1 rounded-full uppercase tracking-wide">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between neu-sunken p-4 rounded-2xl hover:neu-raised-sm transition-all duration-300 cursor-pointer">
              <span className="text-xs font-bold text-text-rich dark:text-white">
                Web App Compilation
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 neu-raised-sm px-2.5 py-1 rounded-full uppercase tracking-wide">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
