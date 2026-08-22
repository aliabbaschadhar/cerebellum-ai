"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  CornerDownLeft,
  Globe,
  X,
} from "lucide-react";
import LinkCard from "@/components/LinkCard";
import type { ChatTabProps } from "@/types";

export default function ChatTab({
  links,
  activeSessionId,
  setActiveSessionId,
  fetchSessions,
  pendingChatQuery,
  clearPendingChatQuery,
}: ChatTabProps) {
  const [pendingSearchQuery, setPendingSearchQuery] = useState<string | null>(null);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  // Guard ref to prevent race condition when active stream auto-creates a session ID
  const shouldSkipNextFetchRef = useRef(false);

  const transport = React.useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      new DefaultChatTransport({
        api: "/api/chat",
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          const response = await fetch(input, init);
          const noMemories = response.headers.get("X-No-Memories-Found");
          const searchQuery = response.headers.get("X-Search-Query");
          const newSessionId = response.headers.get("X-Session-Id");

          if (newSessionId && newSessionId !== activeSessionId) {
            console.log(
              `[Chat UI Middleware] Found new X-Session-Id: "${newSessionId}". Syncing state.`
            );
            shouldSkipNextFetchRef.current = true; // Raise the guard
            setActiveSessionId(newSessionId);
            fetchSessions();
          }

          if (noMemories === "true" && searchQuery) {
            console.log(
              `[Chat UI Middleware] Detected empty/low relevance. Query: "${searchQuery}"`
            );
            setPendingSearchQuery(searchQuery);
            setTimeout(() => {
              setShowSearchPopup(true);
            }, 1500);
          }
          return response;
        },
      }),
    [activeSessionId, setActiveSessionId, fetchSessions],
  );

  // useChat Hook utilizing DefaultChatTransport with our custom fetch middleware
  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport,
  });

  // Effect to load messages when activeSessionId changes (guarded against active stream updates)
  useEffect(() => {
    if (shouldSkipNextFetchRef.current) {
      console.log("[Chat UI] Skipping message fetch because change was triggered by current streaming response.");
      shouldSkipNextFetchRef.current = false;
      return;
    }

    if (activeSessionId) {
      const loadMessages = async () => {
        try {
          const res = await fetch(`/api/chats/${activeSessionId}`);
          if (res.ok) {
            const data = await res.json();
            const formatted = data.map(
              (msg: {
                id: string;
                role: string;
                referenceIds?: string[];
                content: string;
                createdAt: string;
              }) => {
              const referencesLine = msg.referenceIds && msg.referenceIds.length > 0
                ? `\n\nREFERENCES: [${msg.referenceIds.join(", ")}]`
                : "";
              return {
                id: msg.id,
                role: msg.role.toLowerCase() as "user" | "assistant",
                parts: [{ type: "text", text: msg.content + referencesLine }],
                createdAt: new Date(msg.createdAt),
              };
            });
            setMessages(formatted);
          }
        } catch (err) {
          console.error("Failed to load messages:", err);
        }
      };
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeSessionId, setMessages]);

  // Effect to handle search query passed from Home tab
  useEffect(() => {
    if (pendingChatQuery) {
      const query = pendingChatQuery;
      clearPendingChatQuery();

      console.log(`[Chat UI] Detected pending search query: "${query}". Submitting.`);
      const runQuery = async () => {
        try {
          await sendMessage(
            { text: query },
            { body: { sessionId: activeSessionId || "new" } }
          );
        } catch (err) {
          console.error("Failed to send message:", err);
        }
      };
      runQuery();
    }
  }, [pendingChatQuery, activeSessionId, sendMessage, clearPendingChatQuery]);

  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingStepRef = useRef(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let initTimer: NodeJS.Timeout;
    if (isLoading) {
      initTimer = setTimeout(() => {
        setLoadingStep(1);
        loadingStepRef.current = 1;
      }, 0);

      timer = setInterval(() => {
        if (loadingStepRef.current === 1) {
          setLoadingStep(2);
          loadingStepRef.current = 2;
        } else if (loadingStepRef.current === 2) {
          setLoadingStep(3);
          loadingStepRef.current = 3;
        }
      }, 900);
    } else {
      initTimer = setTimeout(() => {
        setLoadingStep(0);
        loadingStepRef.current = 0;
      }, 0);
    }

    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, [isLoading]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, loadingStep]);

  const suggestions = [
    {
      label: "Find posts about Elon Musk and cryptocurrency",
      query: "Did I save a post about Elon Musk talking about cryptocurrency?",
    },
    {
      label: "What GitHub repos did I save recently?",
      query: "Show me my recently saved GitHub repositories",
    },
    {
      label: "Find my neuroscience notes or articles",
      query: "Do I have any articles or videos saved about neuroscience or health?",
    },
  ];

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

  const parseMessage = (content: string) => {
    const fullRefRegex = /references:\s*\[(.*?)\]/i;
    const match = content.match(fullRefRegex);

    let cleanContent = content;
    let referenceIds: string[] = [];

    if (match) {
      referenceIds = match[1]
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      cleanContent = content.replace(fullRefRegex, "").trim();
    }

    const partialRefRegex = /(?:\n\s*|^)references:?\s*\[?[^\]]*$/i;
    cleanContent = cleanContent.replace(partialRefRegex, "").trim();

    return { cleanContent, referenceIds };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput("");

    try {
      await sendMessage(
        { text: currentInput },
        { body: { sessionId: activeSessionId || "new" } }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSuggestionClick = async (query: string) => {
    if (isLoading) return;
    try {
      await sendMessage(
        { text: query },
        { body: { sessionId: activeSessionId || "new" } }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const triggerWebSearch = async () => {
    if (!pendingSearchQuery) return;
    setIsSearchingWeb(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: pendingSearchQuery }),
      });

      if (res.ok) {
        const data = await res.json();
        const results = data.results as Array<{ title: string; snippet: string; url: string }>;

        if (results && results.length > 0) {
          const searchContext = `[Internet Search Findings] for "${pendingSearchQuery}":\n\n` + 
            results.map((r, i) => `Result #${i+1}\nTitle: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.url}`).join("\n\n") +
            `\n\nPlease answer my question using these web search results. Mention and reference the urls where relevant.`;

          stop();
          await new Promise((resolve) => setTimeout(resolve, 150));

          setShowSearchPopup(false);
          setIsSearchingWeb(false);
          setPendingSearchQuery(null);

          await sendMessage(
            { text: searchContext },
            { body: { sessionId: activeSessionId || "new" } }
          );
        } else {
          setShowSearchPopup(false);
          setIsSearchingWeb(false);
          setPendingSearchQuery(null);
        }
      } else {
        setShowSearchPopup(false);
        setIsSearchingWeb(false);
        setPendingSearchQuery(null);
      }
    } catch (err) {
      console.error("[Chat UI] Error executing web search fallback:", err);
      setShowSearchPopup(false);
      setIsSearchingWeb(false);
      setPendingSearchQuery(null);
    }
  };

  const renderReferences = (referenceIds: string[]) => {
    if (referenceIds.length === 0) return null;

    const matchedMemories = links.filter((link) => referenceIds.includes(link.id));
    if (matchedMemories.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-outline-variant/20 dark:border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Retrieved Memories ({matchedMemories.length})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matchedMemories.map((link) => (
            <div
              key={link.id}
            >
              <LinkCard link={link} onDeleted={() => {}} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto relative select-none">
      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 flex flex-col gap-6 scrollbar-thin select-text">
        {messages.length === 0 ? (
          // Empty State Suggestions
          <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center gap-8 py-6 -mt-10 animate-in fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full neu-raised flex items-center justify-center p-1 bg-white">
                <Image
                  src="/newlogo.png"
                  alt="Cerebellum AI Logo"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <h2 className="text-base font-bold text-text-rich dark:text-white">
                How can Cerebellum assist you today?
              </h2>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-white/70">
                Ask questions about your saved links, references, videos, or papers. The AI will
                perform semantic search and retrieve the exact matches.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s.query)}
                  className="w-full p-4 rounded-2xl text-left text-xs font-bold neu-card hover:neu-sunken transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="text-text-rich dark:text-white font-medium pr-4">
                    {s.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Active Messages List
          <div className="flex flex-col gap-5">
            {messages.map((message) => {
              const text = getMessageText(message);
              const { cleanContent, referenceIds } = parseMessage(text);
              
              if (message.role === "user" && cleanContent.startsWith("[Internet Search Findings]")) {
                return null;
              }

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 p-5 rounded-3xl transition-all ${
                    message.role === "user"
                      ? "neu-sunken"
                      : "neu-card"
                  }`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "neu-sunken-sm text-text-rich dark:text-white"
                        : "neu-raised-sm text-primary"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4.5 h-4.5" />
                    ) : (
                      <Bot className="w-4.5 h-4.5" />
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant dark:text-white/60">
                        {message.role === "user" ? "You" : "Cerebellum AI"}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-text-rich dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                      {cleanContent}
                    </div>

                    {/* Render linked cards if assistant message */}
                    {message.role === "assistant" && renderReferences(referenceIds)}
                  </div>
                </div>
              );
            })}

            {/* Loading / Writing Indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-4 p-5 rounded-3xl neu-card animate-pulse">
                <div className="w-9 h-9 rounded-2xl neu-raised-sm text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 flex flex-col gap-3 justify-center text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant dark:text-white/60 flex items-center gap-2">
                    {loadingStep === 1 && "Scanning memory vault..."}
                    {loadingStep === 2 && "Querying vector index..."}
                    {loadingStep === 3 && "Synthesizing response..."}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Textbox Form */}
      <div className="mt-auto border-t border-outline-variant/20 dark:border-white/10 pt-4 pb-6 mb-14 bg-background sticky bottom-10 z-20">
        <form onSubmit={handleSubmit} className="relative flex items-center neu-sunken rounded-2xl p-1">
          <input
            type="text"
            placeholder="Ask your second brain about saved posts, articles, or search memories..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full h-12 bg-transparent pl-4 pr-24 text-xs font-bold placeholder:text-on-surface-variant/60 dark:placeholder:text-white/40 text-text-rich dark:text-white outline-none"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md neu-sunken-sm text-[9px] font-extrabold text-on-surface-variant dark:text-white/60 select-none">
              <CornerDownLeft className="w-2.5 h-2.5" /> Enter
            </span>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-9.5 h-9.5 rounded-xl neu-button-primary text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Web Search Dialogue */}
      {showSearchPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="neu-card max-w-md w-full p-6 rounded-3xl flex flex-col gap-6 text-left">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-primary">
                <Globe className="w-5.5 h-5.5 animate-spin" />
                <h3 className="text-sm font-extrabold tracking-wider uppercase text-text-rich dark:text-white">
                  Dig Deeper
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowSearchPopup(false);
                  setPendingSearchQuery(null);
                }}
                disabled={isSearchingWeb}
                className="w-7 h-7 rounded-full neu-button flex items-center justify-center text-on-surface-variant hover:text-text-rich cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-on-surface-variant dark:text-white/70">
                I couldn&apos;t find any relevant saved posts in your memory index matching:
              </p>
              <p className="text-sm font-bold text-text-rich dark:text-white neu-sunken p-3 rounded-xl italic select-text">
                &ldquo;{pendingSearchQuery}&rdquo;
              </p>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-white/70 mt-1">
                Would you like me to query the internet to find information on this topic?
              </p>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowSearchPopup(false);
                  setPendingSearchQuery(null);
                }}
                disabled={isSearchingWeb}
                className="px-4.5 h-10 rounded-2xl text-xs font-bold neu-button text-text-rich dark:text-white cursor-pointer"
              >
                No, thanks
              </button>
              <button
                type="button"
                onClick={triggerWebSearch}
                disabled={isSearchingWeb}
                className="px-5 h-10 rounded-2xl text-xs font-bold neu-button-primary text-white flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {isSearchingWeb ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    Searching Web...
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    Yes, search web
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
