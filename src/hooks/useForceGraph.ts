"use client";

import { useEffect, useRef } from "react";
import type { LinkData } from "@/app/page";

export interface PhysicsNode {
  id: string;
  label: string;
  type: string;
  tags: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;
  isDragging?: boolean;
}

export interface PhysicsLink {
  source: string;
  target: string;
}

interface GraphPhysicsOptions {
  links: LinkData[];
  isDarkMode: boolean;
  getLinkTags: (link: LinkData) => string[];
}

export function useForceGraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  { links, isDarkMode, getLinkTags }: GraphPhysicsOptions,
) {
  const graphNodesRef = useRef<PhysicsNode[]>([]);
  const graphLinksRef = useRef<PhysicsLink[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const draggedNodeRef = useRef<PhysicsNode | null>(null);

  // Initialize nodes and links when links data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nodes: PhysicsNode[] = [
      {
        id: "center",
        label: "Cerebellum AI Hub",
        type: "hub",
        tags: [],
        x: canvas.width / 2 || 400,
        y: canvas.height / 2 || 250,
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0,
      },
    ];

    const linksList: PhysicsLink[] = [];

    links.slice(0, 15).forEach((l) => {
      const labelText = l.title
        ? l.title.substring(0, 24) + "..."
        : l.url.substring(0, 24);
      nodes.push({
        id: l.id,
        label: labelText,
        type: l.platform,
        tags: getLinkTags(l),
        x: (canvas.width / 2 || 400) + (Math.random() - 0.5) * 300,
        y: (canvas.height / 2 || 250) + (Math.random() - 0.5) * 300,
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0,
      });
      linksList.push({ source: "center", target: l.id });
    });

    graphNodesRef.current = nodes;
    graphLinksRef.current = linksList;
  }, [links, canvasRef, getLinkTags]);

  // Main animation / physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      const currentNodes = graphNodesRef.current;
      const currentLinks = graphLinksRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Reset forces
      currentNodes.forEach((n) => {
        n.fx = 0;
        n.fy = 0;
      });

      // 1. Center gravity pull
      currentNodes.forEach((n) => {
        if (n.id === "center") {
          n.fx += (cx - n.x) * 0.05;
          n.fy += (cy - n.y) * 0.05;
          return;
        }
        const dx = cx - n.x;
        const dy = cy - n.y;
        n.fx += dx * 0.003;
        n.fy += dy * 0.003;
      });

      // 2. Collision avoidance
      const collisionDist = 90;
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const n1 = currentNodes[i];
          const n2 = currentNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < collisionDist) {
            const force = (collisionDist - dist) * 0.12;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (!n1.isDragging && n1.id !== "center") {
              n1.fx -= fx;
              n1.fy -= fy;
            }
            if (!n2.isDragging && n2.id !== "center") {
              n2.fx += fx;
              n2.fy += fy;
            }
          }
        }
      }

      // 3. Link spring tension
      currentLinks.forEach((l) => {
        const n1 = currentNodes.find((n) => n.id === l.source);
        const n2 = currentNodes.find((n) => n.id === l.target);
        if (!n1 || !n2) return;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetLen = 160;
        const springStrength = 0.04;
        const force = (targetLen - dist) * springStrength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!n1.isDragging && n1.id !== "center") {
          n1.fx -= fx;
          n1.fy -= fy;
        }
        if (!n2.isDragging && n2.id !== "center") {
          n2.fx += fx;
          n2.fy += fy;
        }
      });

      // 4. Verlet integration
      currentNodes.forEach((n) => {
        if (n.isDragging) return;
        n.vx = (n.vx + n.fx) * 0.82;
        n.vy = (n.vy + n.fy) * 0.82;
        n.x += n.vx;
        n.y += n.vy;

        // Boundaries checks
        n.x = Math.max(35, Math.min(w - 35, n.x));
        n.y = Math.max(35, Math.min(h - 35, n.y));
      });

      // ──────────────────────────────────────────
      // DRAW CANVAS
      // ──────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // Draw Connection Lines
      ctx.strokeStyle = isDarkMode
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(138, 113, 112, 0.25)";
      ctx.lineWidth = 1.5;
      currentLinks.forEach((l) => {
        const n1 = currentNodes.find((n) => n.id === l.source);
        const n2 = currentNodes.find((n) => n.id === l.target);
        if (n1 && n2) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      });

      // Draw Node circles
      currentNodes.forEach((n) => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 0, 0, 0.05)";

        // Pick color based on platform
        let nodeColor = "#E36A6A";
        let iconChar = "W";

        if (n.id === "center") {
          nodeColor = "#a0383b";
          iconChar = "C";
        } else if (n.type === "youtube") {
          nodeColor = "#a0383b";
          iconChar = "Y";
        } else if (n.type === "twitter") {
          nodeColor = isDarkMode ? "#31312a" : "#1c1c16";
          iconChar = "X";
        } else if (n.type === "instagram") {
          nodeColor = "#894d4e";
          iconChar = "I";
        } else if (n.type === "tiktok") {
          nodeColor = "#155e75";
          iconChar = "T";
        }

        // Draw central outer rings
        if (n.id === "center") {
          ctx.strokeStyle = "rgba(227, 106, 106, 0.25)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 38, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        const r = n.id === "center" ? 28 : 22;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // White border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node letter icon
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${n.id === "center" ? 16 : 13}px var(--font-plus-jakarta), sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 0; // reset
        ctx.fillText(iconChar, n.x, n.y + 0.5);

        // Text label
        ctx.fillStyle = isDarkMode ? "#dddad0" : "#1c1c16";
        ctx.font = "bold 10px var(--font-plus-jakarta), sans-serif";
        ctx.fillText(n.label, n.x, n.y + r + 16);
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();

    // Resize listener
    const resizeHandler = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 800;
      canvas.height = canvas.parentElement.clientHeight || 500;
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, isDarkMode]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const clicked = graphNodesRef.current.find((n) => {
      const dx = n.x - mx;
      const dy = n.y - my;
      const r = n.id === "center" ? 28 : 22;
      return Math.sqrt(dx * dx + dy * dy) < r;
    });

    if (clicked) {
      draggedNodeRef.current = clicked;
      clicked.isDragging = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!draggedNodeRef.current || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    draggedNodeRef.current.x = mx;
    draggedNodeRef.current.y = my;
  };

  const handleMouseUp = () => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.isDragging = false;
      draggedNodeRef.current = null;
    }
  };

  // Spawning manual custom nodes
  const addNode = (title: string, type: string, tags: string[]) => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 800;
    const h = canvas ? canvas.height : 500;
    const id = "custom_" + Date.now();

    const newNode: PhysicsNode = {
      id,
      label: title.substring(0, 24),
      type,
      tags,
      x: w / 2 + (Math.random() - 0.5) * 100,
      y: h / 2 + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
      fx: 0,
      fy: 0,
    };

    graphNodesRef.current.push(newNode);
    graphLinksRef.current.push({ source: "center", target: id });
  };

  // Adding manual connections
  const addLink = (source: string, target: string) => {
    if (!source || !target || source === target) return;
    const exists = graphLinksRef.current.some(
      (l) =>
        (l.source === source && l.target === target) ||
        (l.source === target && l.target === source),
    );

    if (!exists) {
      graphLinksRef.current.push({ source, target });
    }
  };

  // Expose current node list for selection dropdowns
  const getNodes = () => {
    return graphNodesRef.current;
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    addNode,
    addLink,
    getNodes,
  };
}
