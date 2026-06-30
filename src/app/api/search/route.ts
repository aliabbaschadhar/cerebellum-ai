import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log(`\n=== [Search API] Triggered for query: "${query}" ===`);

    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    console.log(`[Search API] Fetching from: ${searchUrl}`);

    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(`[Search API] DuckDuckGo returned status: ${res.status}`);
      throw new Error(`DuckDuckGo returned status ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const results: Array<{ title: string; snippet: string; url: string }> = [];

    $(".result").each((i, el) => {
      if (i >= 3) return; // Fetch top 3 results for context efficiency
      
      const title = $(el).find(".result__title").text().trim();
      const snippet = $(el).find(".result__snippet").text().trim();
      const rawUrl = $(el).find(".result__url").attr("href") || "";

      // Clean the DuckDuckGo outbound URL
      let url = rawUrl;
      if (rawUrl.includes("uddg=")) {
        try {
          const match = rawUrl.match(/uddg=([^&]+)/);
          if (match) url = decodeURIComponent(match[1]);
        } catch {}
      }

      if (title && snippet) {
        results.push({ title, snippet, url });
        console.log(`[Search API] Result #${i+1}: "${title}" -> ${url}`);
      }
    });

    console.log(`[Search API] Search completed. Extracted ${results.length} results.`);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("[Search API] Search execution failed:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
