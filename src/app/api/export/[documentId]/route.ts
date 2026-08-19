import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/current-user";
import { buildDocxBuffer } from "@/lib/export/docx";
import { buildPdfBuffer } from "@/lib/export/pdf";

function safeFilename(title: string) {
  return title.replace(/[^\w\-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "document";
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ documentId: string }> }) {
  const user = await getUser();
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { documentId } = await params;
  const format = req.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "docx";

  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: user.id },
    include: { chapters: { orderBy: { orderIndex: "asc" } } },
  });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const filename = `${safeFilename(document.title)}.${format}`;

  if (format === "pdf") {
    const buffer = buildPdfBuffer(document);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const buffer = await buildDocxBuffer(document);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
