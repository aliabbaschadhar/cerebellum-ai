import { streamText, convertToModelMessages } from "ai";
import { digitalOceanGenAI, generateEmbedding } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

// Helper to extract text content from UIMessage parts
const getMessageText = (message: any) => {
  if (!message) return "";
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return "";
};

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const latestMessage = messages[messages.length - 1];

    if (!latestMessage || latestMessage.role !== "user") {
      return new Response("Invalid request structure", { status: 400 });
    }

    const query = getMessageText(latestMessage);
    console.log(`\n=== [Chat API] Received query: "${query}" ===`);

    // 1. Resolve or auto-create chat session
    let resolvedSessionId = sessionId;
    if (!resolvedSessionId || resolvedSessionId === "new") {
      console.log("[Chat API] No active sessionId. Auto-creating a new ChatSession...");
      const title = query.startsWith("[Internet Search Findings]")
        ? "Web Search Chat"
        : query.length > 40
          ? query.substring(0, 40) + "..."
          : query;
      
      try {
        const session = await prisma.chatSession.create({
          data: { title: title || "New Chat" },
        });
        resolvedSessionId = session.id;
        console.log(`[Chat API] Created ChatSession: "${session.title}" (ID: ${resolvedSessionId})`);
      } catch (err) {
        console.error("[Chat API] Failed to create ChatSession in database:", err);
        resolvedSessionId = `offline-${Date.now()}`;
        console.log(`[Chat API] Using offline fallback session ID: ${resolvedSessionId}`);
      }
    }

    const isSearchContext = query.startsWith("[Internet Search Findings]");

    // 2. Save user message to database (skip if it is search findings context)
    if (!isSearchContext) {
      try {
        await prisma.chatMessage.create({
          data: {
            sessionId: resolvedSessionId,
            role: "USER",
            content: query,
            referenceIds: [],
          },
        });
        console.log(`[Chat API] User message saved to session: ${resolvedSessionId}`);
      } catch (err) {
        console.error("[Chat API] Failed to save user message to database:", err);
      }
    }

    // 3. Generate embedding and perform similarity search (if not search context and memories not skipped)
    let vector: number[] = [];
    let matchedLinks: any[] = [];
    let noMemories = false;
    const skipMemories = process.env.SKIP_MEMORIES === "true";

    if (!isSearchContext) {
      if (skipMemories) {
        console.log("[Chat API] Skipping memories retrieval logic as configured via SKIP_MEMORIES=true.");
      } else {
        try {
          console.log("[Chat API] Generating embedding for query...");
          vector = await generateEmbedding(query);
          console.log(`[Chat API] Embedding generated successfully (dimensions: ${vector.length})`);
        } catch (err) {
          console.error("[Chat API] Embedding generation failed:", err);
        }

        if (vector.length > 0) {
          try {
            console.log("[Chat API] Querying pgvector database for similarity matches...");
            const queryVectorString = `[${vector.join(",")}]`;

            // Raw SQL query to fetch closest links by cosine distance
            matchedLinks = await prisma.$queryRawUnsafe(`
              SELECT l.id, l.url, l.platform, l.title, l.description, l.image, l.favicon, l."siteName", l."aiContext",
                     (le.vector <=> CAST($1 AS vector)) as distance
              FROM "Link" l
              JOIN "LinkEmbedding" le ON l.id = le."linkId"
              ORDER BY distance ASC
              LIMIT 5;
            `, queryVectorString);

            console.log(`[Chat API] similarity search completed. Retrieved ${matchedLinks.length} items.`);
            matchedLinks.forEach((m, idx) => {
              console.log(`  Match #${idx + 1}: "${m.title}" | Platform: ${m.platform} | Distance: ${m.distance}`);
            });
          } catch (err) {
            console.error("[Chat API] Similarity search failed:", err);
          }
        }

        try {
          const totalCount = await prisma.link.count();
          console.log(`[Chat API] Total links saved in DB: ${totalCount}`);
          
          noMemories = totalCount === 0;

          if (matchedLinks.length > 0) {
            const closestMatch = matchedLinks[0];
            if (closestMatch.distance > 0.85) {
              console.log(`[Chat API] Closest match distance ${closestMatch.distance} exceeds threshold of 0.85. Low relevance detected.`);
              noMemories = true;
            }
          } else {
            noMemories = true;
          }
        } catch (err) {
          console.error("[Chat API] Failed to count links or read relevance from DB:", err);
          noMemories = true;
        }
      }
    }

    // 4. Construct context text for the LLM
    const memoriesContext = matchedLinks.length > 0
      ? matchedLinks
          .map((link, idx) => {
            return `[Memory #${idx + 1}]
ID: ${link.id}
Platform: ${link.platform}
Title: ${link.title || "Untitled"}
URL: ${link.url}
Description: ${link.description || "No description"}
Site Name: ${link.siteName || ""}
User Context: ${link.aiContext || ""}`;
          })
          .join("\n\n")
      : "No matching memories found in the database.";

    // 5. Construct system prompt containing the user's saved links context
    const systemPrompt = skipMemories
      ? `You are Cerebellum AI, a highly advanced digital brain assistant.
Answer the user's questions professionally, insightfully, and clearly using your pre-trained knowledge.`
      : `You are Cerebellum AI, a highly advanced digital brain assistant. 
The user has saved various links/posts (from platforms like YouTube, Twitter/X, GitHub, Reddit, LinkedIn, and websites) to their Second Brain (Cerebellum).
Below is a list of the most relevant memories retrieved from their Second Brain database matching their query.

Retrieved memories context:
${memoriesContext}

Instructions:
1. Try to answer the user's question directly by referencing the retrieved memories context.
2. If the user is looking for a specific post (e.g. "sometime ago I saved a post about Elon Musk..."), point out the EXACT matched memories and explain why they match. Mention details like title, platform, siteName, or description.
3. Keep your response professional, insightful, and clear.
4. If none of the retrieved memories seem relevant to the query (or if the database is empty), answer the question normally using your pre-trained knowledge, BUT politely explain that you couldn't find a matching memory in their saved links, and let them know the UI will offer to perform a search from the internet if they wish.
5. IMPORTANT: At the very end of your response, if you matched or referenced any saved links/memories, you MUST append a line matching this exact format:
REFERENCES: [id1, id2, ...]
where id1, id2, etc. are the exact IDs of the matched memories from the context. Do not include this line if no memories were matched.`;

    const chatModel = process.env.DO_CHAT_MODEL || "deepseek-4-flash";
    // Preprocess messages to ensure convertToModelMessages doesn't crash on standard formats
    const uiMessages = messages.map((m: any) => {
      if (!m.parts && typeof m.content === "string") {
        return {
          ...m,
          id: m.id || `msg-${Date.now()}-${Math.random()}`,
          parts: [{ type: "text", text: m.content }]
        };
      }
      return m;
    });

    // 6. Stream text response
    const result = await streamText({
      model: digitalOceanGenAI.chat(chatModel),
      system: systemPrompt,
      messages: await convertToModelMessages(uiMessages),
      async onFinish({ text }) {
        console.log(`[Chat API] Stream completed. Saving assistant response to session: ${resolvedSessionId}`);
        try {
          // Parse reference IDs from the text response
          const refRegex = /REFERENCES:\s*\[(.*?)\]/;
          const match = text.match(refRegex);
          let referenceIds: string[] = [];
          if (match) {
            referenceIds = match[1]
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean);
          }

          await prisma.chatMessage.create({
            data: {
              sessionId: resolvedSessionId,
              role: "ASSISTANT",
              content: text,
              referenceIds: referenceIds,
            },
          });
          console.log("[Chat API] Assistant message saved successfully.");
        } catch (saveErr) {
          console.error("[Chat API] Failed to save assistant message to database:", saveErr);
        }
      },
    });

    // 7. Inject custom headers to notify UI
    const headers = new Headers();
    headers.set("X-Session-Id", resolvedSessionId);
    if (noMemories) {
      console.log(`[Chat API] Flagging 'X-No-Memories-Found' in response headers.`);
      headers.set("X-No-Memories-Found", "true");
      headers.set("X-Search-Query", query);
    }

    return result.toUIMessageStreamResponse({ headers });
  } catch (err) {
    console.error("[Chat API] Critical error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
