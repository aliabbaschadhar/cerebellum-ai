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
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-3 rounded-2xl border bg-white/[0.04] px-4 py-3 transition-all duration-200 ${
            status === "error"
              ? "border-red-500/50"
              : "border-white/[0.08] focus-within:border-indigo-500/60 focus-within:bg-white/[0.06]"
          }`}
        >
          {/* URL icon */}
          <svg
            className="shrink-0 text-white/30 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
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
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none min-w-0"
            disabled={isLoading}
            autoFocus
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="shrink-0 h-9 px-5 rounded-xl bg-indigo-600 text-white text-sm font-medium
              hover:bg-indigo-500 active:scale-95 transition-all duration-150
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
              "Save"
            )}
          </button>
        </div>
        {/* Optional AI Context Field */}
        <div className="mt-3 flex flex-col gap-1">
          <textarea
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
            placeholder="Add optional details..."
            rows={2}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/[0.06] resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-white/40 pl-1">
            * This helps the AI search and understand this link better later.
          </p>
        </div>
      </form>

      {status === "error" && errorMsg && (
        <p className="mt-2 text-xs text-red-400 text-left pl-1">{errorMsg}</p>
      )}
    </div>
  );
}
