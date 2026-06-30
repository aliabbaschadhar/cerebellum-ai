"use client";

import { useState } from "react";
import type { LinkData } from "@/app/page";
import LinkCard from "@/components/LinkCard";
import { AVAILABLE_TAGS, getLinkTags, type FolderType } from "@/lib/tagUtils";

interface CollectionsTabProps {
  links: LinkData[];
  onDeleted: (id: string) => void;
  isPending: boolean;
}

export default function CollectionsTab({
  links,
  onDeleted,
  isPending,
}: CollectionsTabProps) {
  const [selectedFolder, setSelectedFolder] = useState<FolderType>("All");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string | null>(null);

  // Helper: folder metrics calculation
  const folderCounts = AVAILABLE_TAGS.reduce(
    (acc, tag) => {
      acc[tag] = links.filter((l) => getLinkTags(l).includes(tag)).length;
      return acc;
    },
    {
      All: links.length,
      Inbox: links.filter((l) => getLinkTags(l).includes("Inbox")).length,
    } as Record<FolderType, number>,
  );

  // Filtering collections
  const filteredLinks = links
    .filter((l) => {
      if (selectedFolder === "All") return true;
      if (selectedFolder === "Inbox") return getLinkTags(l).includes("Inbox");
      return getLinkTags(l).includes(selectedFolder);
    })
    .filter((l) => {
      if (!selectedPlatformFilter) return true;
      if (selectedPlatformFilter === "web") {
        return (
          l.platform === "article" ||
          l.platform === "generic" ||
          l.platform === "medium" ||
          l.platform === "hashnode"
        );
      }
      return l.platform === selectedPlatformFilter;
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Folder Directory List */}
      <div className="lg:col-span-4 bg-[#f7f3e9]/40 dark:bg-white/5 border border-[#ddc0be]/40 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-bold text-[#8a7170] uppercase tracking-wider pl-1">
            Directories
          </h3>
          <p className="text-[10px] text-[#8a7170]/80 pl-1 mt-0.5">
            Organize saved assets into namespaces.
          </p>
        </div>

        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-1">
          {(["All", "Inbox", ...AVAILABLE_TAGS] as const).map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                selectedFolder === folder
                  ? "bg-[#1c1c16] text-white dark:bg-white dark:text-[#1c1c16] border-transparent shadow-sm"
                  : "bg-transparent text-[#564241] dark:text-[#8a7170] border-transparent hover:bg-white/80 dark:hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      folder === "All"
                        ? "#a0383b"
                        : folder === "Inbox"
                          ? "#8a7170"
                          : folder === "Neuroscience"
                            ? "#E36A6A"
                            : folder === "Productivity"
                              ? "#ba1a1a"
                              : folder === "Startups"
                                ? "#645b41"
                                : "#894d4e",
                  }}
                />
                {folder}
              </span>
              <span className="text-[9.5px] opacity-65">
                {folderCounts[folder] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Cards View with category filters */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between border-b border-[#ddc0be]/25 dark:border-white/10 pb-4 gap-4">
          <div>
            <h2 className="text-lg font-bold font-display text-text-rich dark:text-white">
              Collection: {selectedFolder}
            </h2>
            <span className="text-[10.5px] font-bold text-[#8a7170]">
              {filteredLinks.length} filtered items
            </span>
          </div>

          {/* Source tabs filter */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: null, label: "All Sources" },
              { id: "youtube", label: "YouTube" },
              { id: "twitter", label: "Twitter / X" },
              { id: "instagram", label: "Instagram" },
              { id: "tiktok", label: "TikTok" },
              { id: "web", label: "Web / Article" },
            ].map((item) => (
              <button
                key={item.id ?? "all"}
                onClick={() => setSelectedPlatformFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all border ${
                  selectedPlatformFilter === item.id
                    ? "bg-[#1c1c16] text-white dark:bg-white dark:text-[#1c1c16] border-transparent shadow-sm"
                    : "bg-[#FFF2D0]/40 dark:bg-white/5 text-[#564241] dark:text-[#8a7170] border-[#ddc0be]/30 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Grid */}
        {filteredLinks.length === 0 ? (
          <div className="text-center py-20 italic text-[#8a7170]/80">
            No files located inside directory matching parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredLinks.map((link) => (
              <div key={link.id} className="scale-98">
                <LinkCard
                  link={link}
                  onDeleted={onDeleted}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
