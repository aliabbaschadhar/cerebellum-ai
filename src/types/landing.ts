import type React from "react";

export interface NavbarProps {
  scrollToFriction: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToFAQ: () => void;
  navigateToApp: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export interface ScrollFrameHeroProps {
  scrollToFriction: () => void;
  scrollToHowItWorks: () => void;
  scrollToFeatures: () => void;
  scrollToFAQ: () => void;
  navigateToApp: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export interface FrictionProps {
  showFriction: boolean;
  frictionProgress: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface HowItWorksProps {
  showHowItWorks: boolean;
  howItWorksProgress: number;
  howItWorksVelocity: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface FeaturesProps {
  showFeatures: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface AutoCategorizationProps {
  showAutoCategorization: boolean;
  activeFolder: string;
  setActiveFolder: (folder: "Design" | "Research" | "Growth" | "Mindset") => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface FAQProps {
  showFAQ: boolean;
  expandedFaq: number | null;
  setExpandedFaq: (idx: number | null) => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface CTAProps {
  showCTA: boolean;
  navigateToApp: () => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface SolarSystemProps {
  showSolarSystem: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export interface PlatformItem {
  name: string;
  tagline: string;
  radius: number;
  duration: number;
  color: string;
  icon: React.ReactNode;
}
