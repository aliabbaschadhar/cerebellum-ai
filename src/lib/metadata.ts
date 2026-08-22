import * as cheerio from "cheerio";

export type Platform =
  | "youtube"
  | "twitter"
  | "github"
  | "reddit"
  | "instagram"
  | "linkedin"
  | "article"
  | "generic";

export interface LinkMetadata {
  url: string;
  platform: Platform;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  siteName: string | null;
  extras: Record<string, string | null | undefined> | null;
}

// ──────────────────────────────────────────
// Platform detection
// ──────────────────────────────────────────
function detectPlatform(url: string): Platform {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
  if (u.includes("github.com")) return "github";
  if (u.includes("reddit.com")) return "reddit";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("linkedin.com")) return "linkedin";
  return "article";
}

// ──────────────────────────────────────────
// YouTube oEmbed (free, no API key needed)
// ──────────────────────────────────────────
async function fetchYouTube(url: string): Promise<LinkMetadata> {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("YouTube oEmbed failed");
  const data = await res.json();

  // Extract video ID for thumbnail
  const idMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const videoId = idMatch?.[1];

  return {
    url,
    platform: "youtube",
    title: data.title ?? null,
    description: null,
    image: videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : data.thumbnail_url ?? null,
    favicon: "https://www.youtube.com/favicon.ico",
    siteName: "YouTube",
    extras: {
      channelName: data.author_name ?? null,
      channelUrl: data.author_url ?? null,
      videoId: videoId ?? null,
    },
  };
}

// ──────────────────────────────────────────
// Twitter / X oEmbed + API fallback
// ──────────────────────────────────────────
async function fetchTwitter(url: string): Promise<LinkMetadata> {
  try {
    // Attempt to use vxtwitter API for rich media
    const parsed = new URL(url);
    const path = parsed.pathname; // /elonmusk/status/123456...
    const apiUrl = `https://api.vxtwitter.com${path}`;
    
    const apiRes = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (apiRes.ok) {
      const data = await apiRes.json();
      const text = data.text ? data.text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : null;
      return {
        url,
        platform: "twitter",
        title: text ? text.slice(0, 120) + (text.length > 120 ? "…" : "") : null,
        description: text,
        image: data.mediaURLs?.[0] ?? null, // Get actual tweet image/video
        favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
        siteName: "X (Twitter)",
        extras: {
          authorName: data.user_name ?? null,
          authorUrl: data.user_screen_name ? `https://twitter.com/${data.user_screen_name}` : null,
          embedHtml: null,
        },
      };
    }
  } catch {}

  // Fallback to oEmbed if vxtwitter fails
  const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
  try {
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Twitter oEmbed failed");
    const data = await res.json();

    // Strip HTML tags from html field to get plain text
    const text = data.html
      ? data.html
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : null;

    return {
      url,
      platform: "twitter",
      title: text ? text.slice(0, 120) + (text.length > 120 ? "…" : "") : null,
      description: text,
      image: null,
      favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
      siteName: "X (Twitter)",
      extras: {
        authorName: data.author_name ?? null,
        authorUrl: data.author_url ?? null,
        embedHtml: data.html ?? null,
      },
    };
  } catch {
    // Fallback to OG scraping
    return scrapeOpenGraph(url, "twitter");
  }
}

// ──────────────────────────────────────────
// Reddit API + OG Fallback
// ──────────────────────────────────────────
async function fetchReddit(url: string): Promise<LinkMetadata> {
  const base = await scrapeOpenGraph(url, "reddit");
  try {
    const jsonUrl = new URL(url);
    jsonUrl.search = ""; // clear query params
    const jsonUrlStr = jsonUrl.toString().replace(/\/$/, "") + ".json";
    
    const res = await fetch(jsonUrlStr, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CerebellumBot/1.0)" },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const data = await res.json();
      const post = data?.[0]?.data?.children?.[0]?.data;
      if (post) {
        base.title = post.title || base.title;
        base.description = post.selftext ? post.selftext.slice(0, 200) + "..." : base.description;
        
        // Prioritize actual post image/media over Reddit default logo
        if (post.url && post.url.match(/\.(jpeg|jpg|gif|png)$/i)) {
          base.image = post.url;
        } else if (post.thumbnail && post.thumbnail.startsWith("http")) {
          base.image = post.thumbnail;
        }
      }
    }
  } catch {}

  return {
    ...base,
    platform: "reddit",
    favicon: "https://www.reddit.com/favicon.ico",
    siteName: "Reddit",
  };
}

// ──────────────────────────────────────────
// GitHub — scrape OG + extras
// ──────────────────────────────────────────
async function fetchGitHub(url: string): Promise<LinkMetadata> {
  const base = await scrapeOpenGraph(url, "github");

  // Parse owner/repo from URL
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  const owner = match?.[1] ?? null;
  const repo = match?.[2] ?? null;

  // Try GitHub API for stars/lang (no auth needed for public repos)
  let stars: string | null = null;
  let language: string | null = null;
  if (owner && repo) {
    try {
      const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      });
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        stars = apiData.stargazers_count?.toString() ?? null;
        language = apiData.language ?? null;
      }
    } catch {
      // Ignore API errors
    }
  }

  return {
    ...base,
    platform: "github",
    favicon: "https://github.com/favicon.ico",
    siteName: "GitHub",
    extras: {
      owner,
      repo,
      stars,
      language,
    },
  };
}

// ──────────────────────────────────────────
// Generic Open Graph scraper (fallback)
// ──────────────────────────────────────────
async function scrapeOpenGraph(
  url: string,
  platform: Platform = "generic"
): Promise<LinkMetadata> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Twitterbot/1.0",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const og = (prop: string) =>
      $(`meta[property="og:${prop}"]`).attr("content") ??
      $(`meta[name="og:${prop}"]`).attr("content") ??
      null;

    const tw = (name: string) =>
      $(`meta[name="twitter:${name}"]`).attr("content") ?? null;

    let title =
      og("title") ??
      tw("title") ??
      $("title").text().trim() ??
      null;

    const description =
      og("description") ??
      tw("description") ??
      $('meta[name="description"]').attr("content") ??
      null;

    const image = og("image") ?? tw("image") ?? null;
    const siteName = og("site_name") ?? null;

    // Build absolute favicon URL
    let favicon: string | null = null;
    const faviconHref =
      $('link[rel="icon"]').attr("href") ??
      $('link[rel="shortcut icon"]').attr("href") ??
      "/favicon.ico";
    if (faviconHref) {
      try {
        const base = new URL(url);
        favicon = new URL(faviconHref, base.origin).toString();
      } catch {
        favicon = null;
      }
    }

    // Special fallback for LinkedIn profiles if title is missing or unhelpful
    if (platform === "linkedin" && (!title || title === "LinkedIn")) {
      const match = url.match(/linkedin\.com\/in\/([^/]+)/);
      if (match && match[1]) {
        title = `LinkedIn: ${match[1]}`;
      }
    }

    return {
      url,
      platform,
      title,
      description,
      image,
      favicon,
      siteName,
      extras: null,
    };
  } catch {
    // Return graceful fallback on fetch failure
    let fallbackTitle = null;
    if (platform === "linkedin") {
      const match = url.match(/linkedin\.com\/in\/([^/]+)/);
      if (match && match[1]) fallbackTitle = `LinkedIn: ${match[1]}`;
    }
    
    return {
      url,
      platform,
      title: fallbackTitle,
      description: null,
      image: null,
      favicon: null,
      siteName: null,
      extras: null,
    };
  }
}

// ──────────────────────────────────────────
// Main entry point
// ──────────────────────────────────────────
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const platform = detectPlatform(url);

  switch (platform) {
    case "youtube":
      return fetchYouTube(url);
    case "twitter":
      return fetchTwitter(url);
    case "github":
      return fetchGitHub(url);
    case "reddit":
      return fetchReddit(url);
    default:
      return scrapeOpenGraph(url, platform);
  }
}
