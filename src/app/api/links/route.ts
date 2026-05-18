import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchLinkMetadata } from "@/lib/metadata";

// GET /api/links — return all saved links, newest first
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(links);
  } catch (err) {
    console.error("[GET /api/links]", err);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

// POST /api/links — save a new link
export async function POST(req: Request) {
  try {
    const { url, aiContext } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Validate URL
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch rich metadata
    const meta = await fetchLinkMetadata(parsed.toString());

    const link = await prisma.link.create({
      data: {
        url: meta.url,
        platform: meta.platform,
        title: meta.title,
        description: meta.description,
        image: meta.image,
        favicon: meta.favicon,
        siteName: meta.siteName,
        extras: meta.extras ?? undefined,
        aiContext: aiContext && typeof aiContext === "string" ? aiContext : undefined,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    console.error("[POST /api/links]", err);
    return NextResponse.json(
      { error: "Failed to save link" },
      { status: 500 }
    );
  }
}
