"use client";

import { useState, useRef } from "react";
import type { LinkData } from "@/app/page";
import { useForceGraph } from "@/hooks/useForceGraph";
import { getLinkTags } from "@/lib/tagUtils";
import CustomSelect, { CustomSelectOption } from "@/components/ui/CustomSelect";

interface GraphTabProps {
  links: LinkData[];
  isDarkMode: boolean;
}

const NODE_TYPE_OPTIONS: CustomSelectOption[] = [
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "generic", label: "Web Link" },
];

export default function GraphTab({ links, isDarkMode }: GraphTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  function handleAddSpringConnection(e: React.FormEvent) {
    e.preventDefault();
    if (!customLinkA || !customLinkB || customLinkA === customLinkB) return;

    addLink(customLinkA, customLinkB);

    setCustomLinkA("");
    setCustomLinkB("");
  }

  const currentNodes = getNodes();

  const nodeAOptions: CustomSelectOption[] = [
    { value: "", label: "Node A..." },
    ...currentNodes.map((n) => ({ value: n.id, label: n.label })),
  ];

  const nodeBOptions: CustomSelectOption[] = [
    { value: "", label: "Node B..." },
    ...currentNodes.map((n) => ({ value: n.id, label: n.label })),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Physics Canvas Graph Panel */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl font-bold font-display text-text-rich dark:text-white">
            Graph Navigator
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-white/70 font-medium">
            Interactive force-directed spring physics canvas. Drag nodes to
            reshape layout; hover to inspect names.
          </p>
        </div>

        <div className="neu-sunken rounded-3xl overflow-hidden aspect-video relative p-1">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing rounded-2xl"
          />
        </div>
      </div>

      {/* Right side form panels */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Spawn Node manually */}
        <div className="neu-card p-6 rounded-3xl flex flex-col gap-4 text-left">
          <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">
            Spawn Node
          </h3>
          <form onSubmit={handleSpawnNode} className="flex flex-col gap-3.5">
            <div className="neu-sunken rounded-2xl px-3.5 py-1">
              <input
                type="text"
                placeholder="Node Title..."
                value={customNodeTitle}
                onChange={(e) => setCustomNodeTitle(e.target.value)}
                required
                className="w-full h-9 bg-transparent text-xs font-bold text-text-rich dark:text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <CustomSelect
                value={customNodeType}
                onChange={setCustomNodeType}
                options={NODE_TYPE_OPTIONS}
              />

              <div className="neu-sunken rounded-2xl px-3.5 py-1">
                <input
                  type="text"
                  placeholder="Tags (tag1, tag2)..."
                  value={customNodeTags}
                  onChange={(e) => setCustomNodeTags(e.target.value)}
                  className="w-full h-9 bg-transparent text-xs font-bold text-text-rich dark:text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-2xl neu-button-primary text-white text-xs font-bold transition-all cursor-pointer"
            >
              Spawn Node onto Canvas
            </button>
          </form>
        </div>

        {/* Add Spring Connections */}
        <div className="neu-card p-6 rounded-3xl flex flex-col gap-4 text-left">
          <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">
            Link Nodes
          </h3>
          <form
            onSubmit={handleAddSpringConnection}
            className="flex flex-col gap-3.5"
          >
            <div className="grid grid-cols-2 gap-2">
              <CustomSelect
                value={customLinkA}
                onChange={setCustomLinkA}
                options={nodeAOptions}
                placeholder="Node A..."
              />

              <CustomSelect
                value={customLinkB}
                onChange={setCustomLinkB}
                options={nodeBOptions}
                placeholder="Node B..."
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-2xl neu-button text-text-rich dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Add Spring Connection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
