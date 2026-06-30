"use client";

import { useState, useRef } from "react";
import type { LinkData } from "@/app/page";
import { useForceGraph } from "@/hooks/useForceGraph";
import { getLinkTags } from "@/lib/tagUtils";

interface GraphTabProps {
  links: LinkData[];
  isDarkMode: boolean;
}

export default function GraphTab({ links, isDarkMode }: GraphTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Local inputs states
  const [customNodeTitle, setCustomNodeTitle] = useState("");
  const [customNodeType, setCustomNodeType] = useState("youtube");
  const [customNodeTags, setCustomNodeTags] = useState("");
  const [customLinkA, setCustomLinkA] = useState("");
  const [customLinkB, setCustomLinkB] = useState("");

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    addNode,
    addLink,
    getNodes,
  } = useForceGraph(canvasRef, { links, isDarkMode, getLinkTags });

  // Spawn node manually
  function handleSpawnNode(e: React.FormEvent) {
    e.preventDefault();
    if (!customNodeTitle.trim()) return;

    const tags = customNodeTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addNode(customNodeTitle, customNodeType, tags);

    setCustomNodeTitle("");
    setCustomNodeTags("");
  }

  // Link nodes manually
  function handleAddSpringConnection(e: React.FormEvent) {
    e.preventDefault();
    if (!customLinkA || !customLinkB || customLinkA === customLinkB) return;

    addLink(customLinkA, customLinkB);

    setCustomLinkA("");
    setCustomLinkB("");
  }

  const currentNodes = getNodes();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Physics Canvas Graph Panel */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl font-bold font-display text-text-rich dark:text-white">
            Graph Navigator
          </h1>
          <p className="text-xs text-[#564241] dark:text-[#8a7170] font-medium">
            Interactive force-directed spring physics canvas. Drag nodes to
            reshape layout; hover to inspect names.
          </p>
        </div>

        <div className="border border-[#ddc0be]/30 dark:border-white/10 rounded-2xl overflow-hidden bg-[#f7f3e9]/20 dark:bg-black/20 aspect-video relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>

      {/* Right side form panels */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Spawn Node manually */}
        <div className=" p-5 rounded-2xl border-white/60 dark:border-white/10 dark:bg-[#1c1c16]/50 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">
            Spawn Node
          </h3>
          <form onSubmit={handleSpawnNode} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Node Title..."
              value={customNodeTitle}
              onChange={(e) => setCustomNodeTitle(e.target.value)}
              required
              className="w-full h-9.5 rounded-lg px-3 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-medium focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={customNodeType}
                onChange={(e) => setCustomNodeType(e.target.value)}
                className="h-9.5 rounded-lg px-2 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-bold focus:outline-none"
              >
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="generic">Web Link</option>
              </select>

              <input
                type="text"
                placeholder="Tags (tag1, tag2)..."
                value={customNodeTags}
                onChange={(e) => setCustomNodeTags(e.target.value)}
                className="h-9.5 rounded-lg px-3 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-9.5 rounded-lg bg-[#1c1c16] dark:bg-white dark:text-[#1c1c16] text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Spawn Node onto Canvas
            </button>
          </form>
        </div>

        {/* Add Spring Connections */}
        <div className=" p-5 rounded-2xl border-white/60 dark:border-white/10 dark:bg-[#1c1c16]/50 shadow-sm flex flex-col gap-4">
          <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">
            Link Nodes
          </h3>
          <form
            onSubmit={handleAddSpringConnection}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <select
                value={customLinkA}
                onChange={(e) => setCustomLinkA(e.target.value)}
                className="h-9.5 rounded-lg px-2 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-bold focus:outline-none"
              >
                <option value="">Select Node A...</option>
                {currentNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>

              <select
                value={customLinkB}
                onChange={(e) => setCustomLinkB(e.target.value)}
                className="h-9.5 rounded-lg px-2 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-bold focus:outline-none"
              >
                <option value="">Select Node B...</option>
                {currentNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-9.5 rounded-lg border border-[#1c1c16] dark:border-white text-text-rich dark:text-white text-xs font-bold hover:bg-[#f1eee4]/40 dark:hover:bg-white/10 transition-colors"
            >
              Add Spring Connection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
