import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/links/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/links/[id]]", err);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
