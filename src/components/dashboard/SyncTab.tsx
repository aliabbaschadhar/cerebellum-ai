"use client";

import JSZip from "jszip";
import type { LinkData } from "@/app/page";
import { getLinkTags } from "@/lib/tagUtils";

interface SyncTabProps {
  links: LinkData[];
}

export default function SyncTab({ links }: SyncTabProps) {
  async function handleExportObsidian() {
    if (links.length === 0) return;
    const zip = new JSZip();

    links.forEach((link) => {
      const sanitizedTitle = (link.title ?? "untitled_link")
        .replace(/[^a-zA-Z0-9\s-_]/g, "")
        .trim()
        .substring(0, 50);
      const filename = `${sanitizedTitle || link.id}.md`;
      const tags = getLinkTags(link);

      const content = `---
title: "${link.title ?? "Untitled Link"}"
url: ${link.url}
saved_at: ${link.createdAt}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
platform: "${link.platform}"
---

# ${link.title ?? "Untitled Link"}

Source URL: [${link.siteName ?? link.platform}](${link.url})
Saved on: ${new Date(link.createdAt).toLocaleString()}

## AI Summary
${link.aiContext ?? "No AI summary parsed."}

## Description
${link.description ?? "No description available."}
`;
      zip.file(filename, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Cerebellum_Obsidian_Vault.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadDatabase() {
    const blob = new Blob([JSON.stringify(links, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cerebellum_database_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-rich dark:text-white">
          Sync & Export Settings
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-white/70 font-medium">
          Configure local-first backup vectors and backup export nodes.
        </p>
      </div>

      {/* Obsidian sync */}
      <div className="neu-card rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-text-rich dark:text-white">
            Obsidian Vault Integration
          </h3>
          <p className="text-xs text-on-surface-variant dark:text-white/70 mt-1 font-medium leading-relaxed">
            Export all saved links, summaries, and archived texts as formatted
            markdown documents inside an Obsidian vault structure.
          </p>
        </div>
        <button
          onClick={handleExportObsidian}
          disabled={links.length === 0}
          className="h-10.5 px-6 rounded-2xl neu-button-primary text-white text-xs font-bold shrink-0 disabled:opacity-40 cursor-pointer"
        >
          Export Vault as ZIP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sync Schedule */}
        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-text-rich dark:text-white">
              Sync Schedule
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-white/70 mt-1 font-medium leading-relaxed">
              Local data is auto-persisted. Cloud backup sync is run on request.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white pt-2">
            <span>Last Indexed Sync:</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 neu-raised-sm px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Just now
            </span>
          </div>
        </div>

        {/* Raw Data Export */}
        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-text-rich dark:text-white">
              Raw Data Export
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-white/70 mt-1 font-medium leading-relaxed">
              Export full database representations in common developer schemas.
            </p>
          </div>
          <button
            onClick={handleDownloadDatabase}
            disabled={links.length === 0}
            className="h-10.5 w-full rounded-2xl neu-button text-text-rich dark:text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            Download database.json
          </button>
        </div>
      </div>
    </div>
  );
}
