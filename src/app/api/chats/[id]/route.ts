import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (err) {
    console.error(`[GET /api/chats/${req.url}]`, err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.chatSession.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[DELETE /api/chats/${req.url}]`, err);
    return NextResponse.json({ error: "Failed to delete chat session" }, { status: 500 });
  }
}
