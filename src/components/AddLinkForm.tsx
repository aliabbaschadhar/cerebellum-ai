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
          className={`flex items-center gap-3 rounded-full px-5 py-3.5 transition-all duration-300 ${
            status === "error"
              ? "border border-error/50 neu-sunken"
              : "neu-sunken focus-within:border-primary/40"
          }`}
        >
          {/* URL icon */}
          <svg
            className={`shrink-0 w-5 h-5 transition-colors duration-300 ${
              status === "error" ? "text-error" : "text-primary"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
            className="flex-1 bg-transparent text-sm text-text-rich dark:text-white placeholder:text-on-surface-variant/60 dark:placeholder:text-white/40 outline-none min-w-0 font-medium"
            disabled={isLoading}
            autoFocus
          />

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="shrink-0 h-10 px-6 rounded-full neu-button-primary text-white text-sm font-bold
              disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center gap-2 cursor-pointer"
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
            className="w-full rounded-2xl neu-sunken px-5 py-3.5 text-sm text-text-rich dark:text-white placeholder:text-on-surface-variant/60 dark:placeholder:text-white/40 outline-none transition-all duration-300 focus:border-primary/40 resize-none font-medium"
            disabled={isLoading}
          />
          <p className="text-xs text-on-surface-variant dark:text-white/60 pl-2 font-medium">
            * Helps Cerebellum AI search and retrieve this link using natural language.
          </p>
        </div>
      </form>

      {status === "error" && errorMsg && (
        <p className="mt-2 text-xs text-error font-semibold text-left pl-2">{errorMsg}</p>
      )}
    </div>
  );
}
