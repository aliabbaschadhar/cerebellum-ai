"use client";

import { useState, useRef } from "react";
import type { LinkData } from "@/app/page";

interface Props {
  onAdded: (link: LinkData) => void;
}

export default function AddLinkForm({ onAdded }: Props) {
  const [url, setUrl] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmed,
          aiContext: aiContext.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      const link: LinkData = await res.json();
      onAdded(link);
      setUrl("");
      setAiContext("");
      setStatus("idle");
      inputRef.current?.focus();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to save link");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
        {/* Main URL Input Container */}
        <div
          className={`flex items-center gap-3 rounded-full px-5 py-3.5 transition-all duration-300 border ${
            status === "error"
              ? "border-error/50 bg-[#ffdad6]/20"
              : "border-transparent bg-[#FFF2D0]/40 focus-within:bg-white/80 focus-within:border-[#E36A6A] focus-within:shadow-[0_0_15px_rgba(227,106,106,0.25)] focus-within:backdrop-blur-md"
          }`}
        >
          {/* URL icon */}
          <svg
            className={`shrink-0 w-5 h-5 transition-colors duration-300 ${
              status === "error" ? "text-error" : "text-[#8a7170] focus-within:text-[#a0383b]"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
              strokeLinecap="round"
            />
            <path
              d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
              strokeLinecap="round"
            />
          </svg>

          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Paste any URL — youtube.com, x.com, github.com…"
            className="flex-1 bg-transparent text-sm text-text-rich placeholder:text-[#8a7170]/60 outline-none min-w-0 font-medium"
            disabled={isLoading}
            autoFocus
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="shrink-0 h-10 px-6 rounded-full bg-gradient-to-r from-[#E36A6A] to-[#FFB2B2] text-white text-sm font-semibold
              hover:shadow-[0_0_15px_rgba(227,106,106,0.4)] active:scale-95 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving…
              </>
            ) : (
              "Save Link"
            )}
          </button>
        </div>

        {/* Optional AI Context Field */}
        <div className="flex flex-col gap-1.5">
          <textarea
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
            placeholder="Add optional context/tags for your Second Brain..."
            rows={2}
            className="w-full rounded-2xl border border-transparent bg-[#FFF2D0]/40 px-5 py-3.5 text-sm text-text-rich placeholder:text-[#8a7170]/60 outline-none transition-all duration-300 focus:bg-white/80 focus:border-[#E36A6A] focus:shadow-[0_0_15px_rgba(227,106,106,0.25)] focus:backdrop-blur-md resize-none font-medium"
            disabled={isLoading}
          />
          <p className="text-xs text-[#8a7170] pl-1 font-medium">
            * This helps Cerebellum AI search and retrieve this link using natural language query.
          </p>
        </div>
      </form>

      {status === "error" && errorMsg && (
        <p className="mt-2 text-xs text-error font-semibold text-left pl-2">{errorMsg}</p>
      )}
    </div>
  );
}
