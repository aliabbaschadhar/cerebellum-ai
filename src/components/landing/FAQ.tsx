"use client";

import React from "react";

interface FAQProps {
  showFAQ: boolean;
  expandedFaq: number | null;
  setExpandedFaq: (idx: number | null) => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function FAQ({
  showFAQ,
  expandedFaq,
  setExpandedFaq,
  sectionRef,
}: FAQProps) {
  const faqs = [
    {
      q: "How does the AI search work?",
      a: "Cerebellum processes your query semantically, meaning it searches for concepts, meanings, and ideas rather than exact keyword string matches. It reads through full articles and video transcripts to provide relevant answers.",
    },
    {
      q: "Does it support video and audio transcription?",
      a: "Yes. When you save a YouTube video link or a podcast URL, our backend compiler transcribes the audio tracks in real-time, allowing you to index and search quote timings directly.",
    },
    {
      q: "Is my personal data secure and private?",
      a: "Absolutely. All indexations and saved summaries are strictly encrypted and visible only to you. We do not sell user data or share personal summaries with external LLM models.",
    },
    {
      q: "Can I import bookmarks from Safari or Chrome?",
      a: "Yes, you can upload standard HTML bookmark sheets directly via the web dashboard workspace, importing your historical database in one click.",
    },
    {
      q: "What platforms does the extension support?",
      a: "We currently support Chrome, Brave, Safari (Mac & iOS), and Firefox browsers. You can also save links using Apple Shortcuts via the iOS share sheet.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6 py-24 relative border-t border-outline-variant/20 dark:border-white/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
        {/* FAQ Left Column */}
        <div
          className={`lg:col-span-5 text-left transition-all duration-1000 transform ${showFAQ ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 neu-sunken rounded-full" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase neu-raised-sm px-3.5 py-1 rounded-full">
              FAQ
            </span>
            <div className="h-[2px] w-12 neu-sunken rounded-full" />
          </div>
          <h2 className="font-display text-[36px] font-bold leading-[1.2] text-text-rich dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant dark:text-white/70 leading-[1.6] font-medium mb-6">
            Have questions about indexation, security, or sync options? Check
            our accordion answers or chat with our team on discord.
          </p>
          <button className="h-10 px-6 rounded-full neu-button-primary text-white text-xs font-bold cursor-pointer">
            Ask in Discord
          </button>
        </div>

        {/* FAQ Right Column (Interactive Neumorphic Accordions) */}
        <div
          className={`lg:col-span-7 flex flex-col gap-4 text-left transition-all duration-1000 delay-[250ms] transform ${showFAQ ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {faqs.map((faq, i) => {
            const isExpanded = expandedFaq === i;
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? "neu-sunken border border-primary/20" : "neu-raised-sm hover:neu-raised"
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : i)}
                  className="w-full px-5 py-4.5 flex items-center justify-between font-bold text-text-rich dark:text-white text-sm font-sans text-left focus:outline-none transition-colors cursor-pointer"
                >
                  {faq.q}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-primary font-mono font-bold text-base transition-transform duration-300 ${
                      isExpanded ? "rotate-45 neu-sunken-sm" : "neu-raised-sm"
                    }`}
                  >
                    ＋
                  </span>
                </button>

                {/* Expandable Panel */}
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isExpanded ? "180px" : "0px",
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <p className="px-5 pb-5 text-xs text-on-surface-variant dark:text-white/70 font-medium leading-relaxed border-t border-outline-variant/10 dark:border-white/5 pt-3.5">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
