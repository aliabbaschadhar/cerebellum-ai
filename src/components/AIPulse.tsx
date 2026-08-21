"use client";

import React from "react";

interface AIPulseProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AIPulse({ className = "", size = "md" }: AIPulseProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-16 h-16",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-[#ffb4b4] blur-md opacity-70 animate-pulse-soft" />
      
      {/* Inner Orb */}
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-primary via-[#a0383b] to-[#fdf0cc] border border-white/40 shadow-inner" />
      
      {/* Dynamic Specular Highlights */}
      <div className="absolute top-1 left-1 w-2/5 h-2/5 rounded-full bg-white/45 blur-[0.5px]" />
    </div>
  );
}
