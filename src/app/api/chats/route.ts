import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("[GET /api/chats]", err);
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const session = await prisma.chatSession.create({
      data: {
        title: title || "New Chat",
      },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error("[POST /api/chats]", err);
    return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 });
  }
}
