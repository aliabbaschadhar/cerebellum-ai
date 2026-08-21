"use client";

import { useState } from "react";
import type { LinkData } from "@/app/page";

interface ReaderTabProps {
  links: LinkData[];
}

export default function ReaderTab({ links }: ReaderTabProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );

  const activeId = selectedArticleId ?? (links.length > 0 ? links[0].id : null);
  const selectedArticle = links.find((l) => l.id === activeId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Articles list */}
      <div className="lg:col-span-4 neu-card rounded-3xl p-5 flex flex-col gap-4 text-left">
        <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider pl-1">
          Article Index
        </h3>
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
          {links.length === 0 ? (
            <p className="text-xs text-on-surface-variant/80 dark:text-white/50 pl-1 italic">
              No articles saved.
            </p>
          ) : (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => setSelectedArticleId(link.id)}
                className={`w-full px-4 py-3.5 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer ${
                  activeId === link.id
                    ? "neu-sunken text-primary dark:text-[#ffb4b4] border border-primary/30"
                    : "neu-raised-sm text-on-surface-variant dark:text-white/80 hover:neu-sunken"
                }`}
              >
                <p className="truncate">{link.title ?? link.url}</p>
                <span className="text-[9.5px] opacity-65 block mt-1 uppercase tracking-wide">
                  {link.platform} &bull;{" "}
                  {new Date(link.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Distraction Free Reader */}
      <div className="lg:col-span-8 neu-card rounded-3xl p-8 flex flex-col gap-6 text-left">
        {selectedArticle ? (
          <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
            <div className="border-b border-outline-variant/20 dark:border-white/10 pb-4">
              <span className="text-[10px] font-bold text-primary dark:text-[#ffb4b4] uppercase tracking-wider neu-raised-sm px-3 py-1 rounded-full inline-block mb-3">
                {selectedArticle.platform} Source &bull; 5 mins read
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight text-text-rich dark:text-white mt-1 mb-2">
                {selectedArticle.title ?? "Untitled Article"}
              </h1>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10.5px] font-bold text-primary hover:underline transition-all"
              >
                Open Original URL ↗
              </a>
            </div>

            <div className="flex flex-col gap-5 text-sm md:text-base leading-relaxed text-text-rich dark:text-white/90 font-medium font-serif">
              <div className="font-bold font-sans text-xs text-primary neu-sunken p-5 rounded-2xl">
                💡 **AI Abstract Insight:** &ldquo;
                {selectedArticle.aiContext ?? "No abstract summarized."}&rdquo;
              </div>

              <p>
                {selectedArticle.description ??
                  "Cerebellum AI has extracted the metadata. Below is the simplified segment indexed inside local caches for searching and retrieval loops."}
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                nec elementum risus, sit amet interdum elit. Pellentesque
                accumsan leo eget molestie tincidunt. Cras in tellus
                sollicitudin, luctus purus a, volutpat augue. Mauris rhoncus
                lorem ex, a vulputate lorem feugiat ut.
              </p>
              <p>
                Curabitur pretium, metus at convallis imperdiet, justo eros
                elementum nisl, non tempor turpis tellus vel felis. Proin porta
                est arcu, vitae accumsan turpis finibus a. Phasellus imperdiet
                ex eu nisl iaculis, eu gravida est luctus.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 italic text-on-surface-variant/80 dark:text-white/50 neu-sunken p-8 rounded-3xl">
            Select an article from the left column index to read in reader mode.
          </div>
        )}
      </div>
    </div>
  );
}
