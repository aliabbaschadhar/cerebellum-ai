"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Bot,
  User,
  Moon,
  Sun,
  Brain,
  CornerDownLeft,
} from "lucide-react";
import Link from "next/link";
import { DefaultChatTransport } from "ai";

export default function TestPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    }
    return false;
  });

  // Update theme class on root element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Local state for chat input
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (input, init) => {
        const response = await fetch(input, init);
        console.log("[Test UI] Received response headers from API:", response.headers);
        return response;
      },
    }),
    onFinish(message) {
      console.log("[Test UI] Finished streaming message:", message);
    },
    onError(err) {
      console.error("[Test UI] Stream error:", err);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput("");
    console.log(`[Test UI] Client sending query: "${currentInput}"`);

    try {
      await sendMessage(
        { text: currentInput },
        { body: { sessionId: "new" } }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Helper to extract text content from UIMessage parts
  const getMessageText = (message: { content?: string; parts?: Array<{ type: string; text?: string }> } | null | undefined) => {
    if (!message) return "";
    if (typeof message.content === "string" && message.content) return message.content;
    if (Array.isArray(message.parts)) {
      return message.parts
        .filter((part: { type: string; text?: string }) => part.type === "text")
        .map((part: { type: string; text?: string }) => part.text || "")
        .join("");
    }
    return "";
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat list on new tokens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen w-screen bg-background text-[#1c1c16] dark:bg-[#121210] dark:text-[#dddad0] font-sans selection:bg-[#E36A6A]/20 selection:text-[#a0383b] transition-colors duration-300 relative flex flex-col overflow-x-hidden">
      {/* Soft Background glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-[#FFF2D0] dark:from-[#FFF2D0]/5 via-transparent to-transparent opacity-40 pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-gradient-radial from-[#E36A6A]/10 dark:from-[#E36A6A]/5 via-transparent to-transparent opacity-30 pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#ddc0be]/20 dark:border-white/10 bg-white/70 dark:bg-[#121210]/70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="p-2 rounded-xl text-[#8a7170] hover:text-[#E36A6A] hover:bg-[#FFF2D0]/30 dark:hover:bg-white/5 transition-all cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E36A6A] to-[#a0383b] flex items-center justify-center text-white shadow-md shadow-[#E36A6A]/10">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold text-text-rich dark:text-white leading-tight">
                  Cerebellum AI Stream Tester
                </h1>
                <p className="text-[10px] font-medium text-[#8a7170]">
                  Real-time response verification Sandbox
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-[#8a7170] hover:bg-[#FFF2D0]/30 dark:hover:bg-white/5 hover:text-text-rich dark:hover:text-white transition-all cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Main viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto min-h-[400px] flex flex-col gap-4 pr-1">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-20 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF2D0]/30 dark:bg-white/5 flex items-center justify-center text-[#E36A6A]">
                <Brain className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h2 className="text-sm font-bold text-text-rich dark:text-white mb-2">
                  Sandbox Active
                </h2>
                <p className="text-xs font-semibold text-[#8a7170] leading-relaxed">
                  Submit a query to test streaming outputs from the Cerebellum AI chat API.
                  This interface communicates directly with the endpoint and displays incoming chunks.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => {
                const text = getMessageText(message);
                return (
                  <div
                    key={message.id}
                    className={`flex gap-4 p-5 rounded-3xl border transition-all ${
                      message.role === "user"
                        ? "bg-white/40 dark:bg-white/5 border-[#ddc0be]/20 dark:border-white/5"
                        : "glass-panel bg-white/80 dark:bg-[#1c1c16]/50 border-white/60 dark:border-white/10 shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-[#FFF2D0] dark:bg-white/10 text-[#a0383b] dark:text-[#dddad0]"
                          : "bg-[#E36A6A]/10 text-[#E36A6A]"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4.5 h-4.5" />
                      ) : (
                        <Bot className="w-4.5 h-4.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a7170]">
                        {message.role === "user" ? "You" : "Cerebellum AI"}
                      </span>
                      <div className="text-xs font-medium text-[#564241] dark:text-[#dddad0] leading-relaxed whitespace-pre-wrap break-words">
                        {text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 p-5 rounded-3xl glass-panel bg-white/80 dark:bg-[#1c1c16]/50 border-white/60 dark:border-white/10 shadow-sm animate-pulse">
                  <div className="w-9 h-9 rounded-2xl bg-[#E36A6A]/10 text-[#E36A6A] flex items-center justify-center shrink-0">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a7170]">
                      Streaming response...
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E36A6A] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E36A6A] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E36A6A] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="sticky bottom-0 bg-background dark:bg-[#121210] pt-4 pb-6 border-t border-[#ddc0be]/20 dark:border-white/10 z-20">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask a test query (e.g., Write a haiku about a coffee cup)..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full h-13 rounded-2xl pl-5 pr-28 border border-[#ddc0be]/30 dark:border-white/10 bg-white/70 dark:bg-white/5 focus:bg-white dark:focus:bg-[#121210] focus:outline-none focus:ring-1 focus:ring-[#E36A6A] text-xs font-bold placeholder-[#8a7170]/60 text-[#1c1c16] dark:text-[#dddad0] transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="px-3 h-8 text-[10px] font-bold rounded-lg border border-[#ddc0be]/50 dark:border-white/10 text-[#8a7170] hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5 hover:text-text-rich dark:hover:text-white transition-colors cursor-pointer"
                >
                  Stop
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#ddc0be]/40 dark:border-white/10 text-[9px] font-extrabold text-[#8a7170] select-none">
                  <CornerDownLeft className="w-2.5 h-2.5" /> Enter
                </span>
              )}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9.5 h-9.5 rounded-xl bg-[#1c1c16] dark:bg-white dark:text-[#1c1c16] hover:bg-[#E36A6A] dark:hover:bg-[#E36A6A] hover:text-white text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#1c1c16] dark:disabled:hover:bg-white dark:disabled:hover:text-[#1c1c16] disabled:hover:text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
