"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Sparkles,
  Send,
  Brain,
  Bot,
  User,
  ArrowRight,
  CornerDownLeft,
  Globe,
  X,
} from "lucide-react";
import LinkCard from "@/components/LinkCard";
import type { LinkData } from "@/app/page";

interface ChatTabProps {
  links: LinkData[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  fetchSessions: () => Promise<void>;
  pendingChatQuery: string | null;
  clearPendingChatQuery: () => void;
}

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

  // Ref to avoid closure stale state in customFetch
  const activeSessionIdRef = useRef(activeSessionId);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  // Custom fetch middleware to intercept response headers from the transport
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, init);
    const noMemories = response.headers.get("X-No-Memories-Found");
    const searchQuery = response.headers.get("X-Search-Query");
    const newSessionId = response.headers.get("X-Session-Id");
    
    if (newSessionId && newSessionId !== activeSessionIdRef.current) {
      console.log(`[Chat UI Middleware] Found new X-Session-Id: "${newSessionId}". Syncing state.`);
      shouldSkipNextFetchRef.current = true; // Raise the guard
      setActiveSessionId(newSessionId);
      fetchSessions();
    }

    if (noMemories === "true" && searchQuery) {
      console.log(`[Chat UI Middleware] Detected empty/low relevance. Query: "${searchQuery}"`);
      setPendingSearchQuery(searchQuery);
      setTimeout(() => {
        setShowSearchPopup(true);
      }, 1500);
    }
    return response;
  };

  // useChat Hook utilizing DefaultChatTransport with our custom fetch middleware
  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ 
      api: "/api/chat",
      fetch: customFetch
    }),
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
            const formatted = data.map((msg: any) => {
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
      // Clear the query immediately in parent state to prevent double execution loops
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

  // State to track loading steps
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingStepRef = useRef(0);

  // Effect to manage ChatGPT-style loading steps
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(1);
      loadingStepRef.current = 1;
      
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
      setLoadingStep(0);
      loadingStepRef.current = 0;
    }

    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, loadingStep]);

  // List of quick start suggestions
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

  // Helper to extract text content from UIMessage parts
  const getMessageText = (message: any) => {
    if (!message) return "";
    if (typeof message.content === "string" && message.content) return message.content;
    if (Array.isArray(message.parts)) {
      return message.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("");
    }
    return "";
  };

  // Helper to parse message and extract REFERENCES line
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

    // Strip any partial references line at the end during streaming
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
    console.log(`[Chat UI] Client sending query: "${currentInput}"`);

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
    console.log(`[Chat UI] Triggered quick suggestion: "${query}"`);
    try {
      await sendMessage(
        { text: query },
        { body: { sessionId: activeSessionId || "new" } }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Trigger web search when confirmed
  const triggerWebSearch = async () => {
    if (!pendingSearchQuery) return;
    setIsSearchingWeb(true);
    console.log(`[Chat UI] Running web search fallback for: "${pendingSearchQuery}"`);

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
          // Construct custom search context for AI
          const searchContext = `[Internet Search Findings] for "${pendingSearchQuery}":\n\n` + 
            results.map((r, i) => `Result #${i+1}\nTitle: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.url}`).join("\n\n") +
            `\n\nPlease answer my question using these web search results. Mention and reference the urls where relevant.`;

          console.log(`[Chat UI] Web search completed. Sending context back to LLM.`);
          
          // Stop the active stream response to unlock the chat transport
          stop();
          
          // Give a short delay to let the state settle
          await new Promise((resolve) => setTimeout(resolve, 150));

          setShowSearchPopup(false);
          setIsSearchingWeb(false);
          setPendingSearchQuery(null);

          // Submit the search context user message to LLM
          await sendMessage(
            { text: searchContext },
            { body: { sessionId: activeSessionId || "new" } }
          );
        } else {
          console.warn("[Chat UI] Web search yielded 0 results.");
          setShowSearchPopup(false);
          setIsSearchingWeb(false);
          setPendingSearchQuery(null);
        }
      } else {
        console.error("[Chat UI] Web search request failed.");
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

    // Filter parent's pre-loaded links list
    const matchedMemories = links.filter((link) => referenceIds.includes(link.id));

    if (matchedMemories.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-[#ddc0be]/20 dark:border-white/5 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[#a0383b] dark:text-[#ffb3b1]">
          <Brain className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Retrieved Memories ({matchedMemories.length})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matchedMemories.map((link) => (
            <div
              key={link.id}
              className="scale-95 hover:scale-[0.98] transition-transform duration-300"
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
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-[#ddc0be]/20 dark:border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E36A6A] to-[#a0383b] flex items-center justify-center text-white shadow-md shadow-[#E36A6A]/10">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-text-rich dark:text-white leading-tight">
              Cerebellum Neural Assistant
            </h1>
            <p className="text-xs font-medium text-[#8a7170]">
              Query your second brain index using conversational AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 flex flex-col gap-6 scrollbar-thin select-text">
        {messages.length === 0 ? (
          // Empty State Suggestions
          <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center gap-8 py-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#FFF2D0]/30 dark:bg-white/5 flex items-center justify-center text-[#E36A6A]">
                <Brain className="w-8 h-8" />
              </div>
              <h2 className="text-base font-bold text-text-rich dark:text-white">
                How can Cerebellum assist you today?
              </h2>
              <p className="text-xs font-semibold text-[#8a7170]">
                Ask questions about your saved links, references, videos, or papers. The AI will
                perform semantic vector search and retrieve the exact matches.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 w-full">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(s.query)}
                  className="w-full p-4 rounded-2xl text-left text-xs font-bold bg-white/70 dark:bg-[#1c1c16]/50 border border-[#ddc0be]/30 dark:border-white/5 hover:border-[#E36A6A]/40 dark:hover:border-[#E36A6A]/30 hover:bg-[#FFF2D0]/20 dark:hover:bg-white/5 hover:-translate-y-0.5 transition-all flex items-center justify-between group shadow-sm cursor-pointer"
                >
                  <span className="text-[#564241] dark:text-[#dddad0] font-medium pr-4">
                    {s.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8a7170] group-hover:text-[#E36A6A] group-hover:translate-x-0.5 transition-all shrink-0" />
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
              
              // Skip rendering internal search context query if it is purely backend context
              if (message.role === "user" && cleanContent.startsWith("[Internet Search Findings]")) {
                return null;
              }

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 p-5 rounded-3xl border transition-all ${
                    message.role === "user"
                      ? "bg-white/40 dark:bg-white/5 border-[#ddc0be]/20 dark:border-white/5"
                      : "glass-panel bg-white/80 dark:bg-[#1c1c16]/50 border-white/60 dark:border-white/10 shadow-sm"
                  }`}
                >
                  {/* Avatar Icon */}
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

                  {/* Message Body */}
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a7170]">
                        {message.role === "user" ? "You" : "Cerebellum AI"}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-[#564241] dark:text-[#dddad0] leading-relaxed whitespace-pre-wrap break-words">
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
              <div className="flex gap-4 p-5 rounded-3xl glass-panel bg-white/80 dark:bg-[#1c1c16]/50 border-white/60 dark:border-white/10 shadow-sm animate-pulse">
                <div className="w-9 h-9 rounded-2xl bg-[#E36A6A]/10 text-[#E36A6A] flex items-center justify-center shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a7170] flex items-center gap-2">
                    {loadingStep === 1 && "Scanning memory vault..."}
                    {loadingStep === 2 && "Querying vector index..."}
                    {loadingStep === 3 && "Synthesizing response..."}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full bg-[#E36A6A] animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#E36A6A] animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#E36A6A] animate-bounce"
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
      <div className="mt-auto border-t border-[#ddc0be]/20 dark:border-white/10 pt-5 pb-4 bg-background dark:bg-[#121210] sticky bottom-0 z-20">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask your second brain about saved posts, articles, or search memories..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full h-13 rounded-2xl pl-5 pr-28 border border-[#ddc0be]/30 dark:border-white/10 bg-white/70 dark:bg-white/5 focus:bg-white dark:focus:bg-[#121210] focus:outline-none focus:ring-1 focus:ring-[#E36A6A] text-xs font-bold placeholder-[#8a7170]/60 text-[#1c1c16] dark:text-[#dddad0] transition-all"
          />
          <div className="absolute right-2.5 flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#ddc0be]/40 dark:border-white/10 text-[9px] font-extrabold text-[#8a7170] select-none">
              <CornerDownLeft className="w-2.5 h-2.5" /> Enter
            </span>
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

      {/* Glassmorphic Web Search Confirmation Dialogue */}
      {showSearchPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl bg-white/95 dark:bg-[#1c1c16]/95 border-white dark:border-white/10 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-[#E36A6A]">
                <Globe className="w-5.5 h-5.5 animate-spin-slow" />
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
                className="p-1 rounded-full text-[#8a7170] hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5 hover:text-text-rich dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#8a7170]">
                I couldn&apos;t find any relevant saved posts in your memory index matching:
              </p>
              <p className="text-sm font-bold text-text-rich dark:text-white bg-[#FFF2D0]/30 dark:bg-white/5 p-3 rounded-xl border border-[#ddc0be]/25 dark:border-white/5 italic select-text">
                &ldquo;{pendingSearchQuery}&rdquo;
              </p>
              <p className="text-xs font-semibold text-[#8a7170] mt-1">
                Would you like me to query the internet to find information on this topic?
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowSearchPopup(false);
                  setPendingSearchQuery(null);
                }}
                disabled={isSearchingWeb}
                className="px-4.5 h-10 rounded-xl text-xs font-bold border border-[#ddc0be]/50 dark:border-white/10 text-[#564241] dark:text-[#dddad0] hover:bg-[#FFF2D0]/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                No, thanks
              </button>
              <button
                type="button"
                onClick={triggerWebSearch}
                disabled={isSearchingWeb}
                className="px-5 h-10 rounded-xl text-xs font-bold bg-[#E36A6A] hover:bg-[#a0383b] text-white flex items-center gap-1.5 transition-colors shadow-md shadow-[#E36A6A]/10 disabled:opacity-60 cursor-pointer"
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
