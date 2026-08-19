import { jsPDF } from "jspdf";
import { htmlToBlocks } from "@/lib/html-to-blocks";

type Chapter = { title: string; content: string };
type DocInput = { title: string; chapters: Chapter[] };

const MARGIN = 56;
const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 16;

// Mixed inline bold/italic within a single line isn't worth the layout
// complexity for a first pass — Word export (buildDocxBuffer) is where rich
// formatting is preserved. The PDF gets clean, readable, paginated plain
// text, which is what most people actually want a PDF for.
export function buildPdfBuffer(doc: DocInput): Buffer {
  const pdf = new jsPDF({ unit: "pt", format: "letter" });
  let y = MARGIN;

  function ensureRoom(lines: number) {
    if (y + lines * LINE_HEIGHT > PAGE_HEIGHT - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
  }

  function writeParagraph(text: string, opts: { bold?: boolean; size?: number; spacingAfter?: number } = {}) {
    pdf.setFont("times", opts.bold ? "bold" : "normal");
    pdf.setFontSize(opts.size ?? 12);
    const lines: string[] = pdf.splitTextToSize(text, MAX_WIDTH);
    for (const line of lines) {
      ensureRoom(1);
      pdf.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    }
    y += opts.spacingAfter ?? 0;
  }

  writeParagraph(doc.title, { bold: true, size: 22, spacingAfter: 20 });

  for (const chapter of doc.chapters) {
    ensureRoom(2);
    writeParagraph(chapter.title, { bold: true, size: 15, spacingAfter: 10 });

    const blocks = htmlToBlocks(chapter.content);
    let orderedIndex = 0;
    for (const block of blocks) {
      const raw = block.runs.map((r) => r.text).join("");
      let prefix = "";
      if (block.listItem && block.ordered) {
        orderedIndex += 1;
        prefix = `${orderedIndex}. `;
      } else if (block.listItem) {
        orderedIndex = 0;
        prefix = "• ";
      } else {
        orderedIndex = 0;
      }
      writeParagraph(prefix + raw, { spacingAfter: 6 });
    }

    y += 12;
  }

  return Buffer.from(pdf.output("arraybuffer"));
}
