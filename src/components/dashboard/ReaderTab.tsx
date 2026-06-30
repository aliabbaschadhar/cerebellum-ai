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
      <div className="lg:col-span-4 bg-[#f7f3e9]/40 dark:bg-white/5 border border-[#ddc0be]/40 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-[#8a7170] uppercase tracking-wider pl-1">
          Article Index
        </h3>
        <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
          {links.length === 0 ? (
            <p className="text-xs text-[#8a7170] pl-1 it-italic">
              No articles saved.
            </p>
          ) : (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => setSelectedArticleId(link.id)}
                className={`w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all border ${
                  activeId === link.id
                    ? "bg-[#1c1c16] text-white dark:bg-white dark:text-[#1c1c16] border-transparent shadow-sm"
                    : "bg-[#f1eee4]/40 dark:bg-transparent text-[#564241] dark:text-[#8a7170] border-transparent hover:bg-white/80 dark:hover:bg-white/5"
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
      <div className="lg:col-span-8  rounded-2xl p-8 border-white/60 dark:border-white/10 dark:bg-[#1c1c16]/50 shadow-sm flex flex-col gap-6 text-left">
        {selectedArticle ? (
          <div className="flex flex-col gap-6 max-w-xl mx-auto">
            <div className="border-b border-[#ddc0be]/20 dark:border-white/10 pb-4">
              <span className="text-[10px] font-bold text-primary dark:text-[#ffb3b1] uppercase tracking-wider">
                {selectedArticle.platform} Source &bull; 5 mins read
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight text-text-rich dark:text-white mt-1 mb-2">
                {selectedArticle.title ?? "Untitled Article"}
              </h1>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10.5px] font-bold text-[#8a7170] hover:text-primary transition-colors"
              >
                Open Original URL ↗
              </a>
            </div>

            <div className="flex flex-col gap-5 text-sm md:text-base leading-relaxed text-[#564241] dark:text-[#dddad0] font-medium font-serif">
              <p className="font-bold font-sans text-xs text-primary bg-[#E36A6A]/5 dark:bg-[#E36A6A]/10 border border-[#E36A6A]/20 p-4 rounded-xl">
                💡 **AI Abstract Insight:** &ldquo;
                {selectedArticle.aiContext ?? "No abstract summarized."}&rdquo;
              </p>

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
          <div className="text-center py-20 italic text-[#8a7170]">
            Select an article from the left column index to read in reader mode.
          </div>
        )}
      </div>
    </div>
  );
}
